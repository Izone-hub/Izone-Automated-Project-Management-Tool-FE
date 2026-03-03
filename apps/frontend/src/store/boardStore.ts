// @ts-ignore - zustand is provided in workspace deps but types may be resolved at build time
import { create, type StateCreator, type SetState, type GetState } from "zustand";
import { boardsAPI, type Board, type CreateBoardData } from "@/lib/api/boards";
import { cardsAPI, type Card as ApiCard } from "@/lib/api/cards";
import { listsAPI, type List as ApiList } from "@/lib/api/lists";

// Minimal local types to avoid missing imports
type ListStatus = "todo" | "in-progress" | "review" | "done";

// Extended Card type for UI usage (compatibility)
// We ensure it has everything ApiCard has, plus legacy fields if needed
interface Card extends ApiCard {
  // UI might expect 'name' aliased to 'title'
  name: string;
  // UI might expect 'status' though it's list-based now
  status: ListStatus;
  // UI might expect project_id
  project_id: string;
}

interface List {
  id: string;
  title: string;
  position: number;
  board_id: string;
  status: ListStatus; // Kept for UI compatibility, default to 'todo'
  cards?: Card[];
  created_at: string;
  updated_at: string;
}

type BoardWithLists = Board & { lists?: List[] };

interface BoardStore {
  boards: BoardWithLists[];
  isLoading: boolean;
  error: string | null;

  fetchWorkspaceBoards: (workspaceId: string) => Promise<void>;
  fetchBoard: (boardId: string) => Promise<void>;
  fetchBoardCards: (boardId: string) => Promise<void>;

  addBoard: (boardData: CreateBoardData & { workspaceId?: string; background?: string; color?: string; privacy?: string }) => Promise<string>;
  addList: (boardId: string, title: string) => Promise<void>;
  updateList: (boardId: string, listId: string, updates: Partial<List>) => Promise<void>;
  deleteList: (boardId: string, listId: string) => Promise<void>;
  addCard: (boardId: string, listId: string, title: string) => Promise<void>;
  updateCard: (boardId: string, listId: string, cardId: string, updates: Partial<Card>) => Promise<void>;
  removeCard: (boardId: string, listId: string, cardId: string) => Promise<void>;
  duplicateCard: (boardId: string, listId: string, cardId: string) => Promise<void>;

  getWorkspaceBoards: (workspaceId: string) => BoardWithLists[];
  getWorkspaceBoardCount: (workspaceId: string) => number;
  updateBoard: (boardId: string, updates: Partial<Board>) => Promise<void>;
  deleteBoard: (boardId: string) => Promise<void>;
}

// Helper mappers
const mapApiCardToCard = (apiCard: ApiCard, projectId: string): Card => ({
  ...apiCard,
  name: apiCard.title, // Map title to name for UI
  status: 'todo', // Default, logic should rely on List ID
  project_id: projectId, // Passed from context
  list_id: apiCard.list_id,
});

const mapApiListToList = (apiList: ApiList): List => ({
  id: apiList.id,
  title: apiList.title,
  position: apiList.position,
  board_id: apiList.project_id,
  status: 'todo', // Default
  created_at: apiList.created_at,
  updated_at: apiList.updated_at,
  cards: [],
});

const store: StateCreator<BoardStore, [], [], BoardStore> = (
  set: SetState<BoardStore>,
  get: GetState<BoardStore>
) => ({
  boards: [],
  isLoading: false,
  error: null,

  fetchWorkspaceBoards: async (workspaceId: string) => {
    set({ isLoading: true, error: null });
    try {
      const backendBoards = await boardsAPI.getWorkspaceBoards(workspaceId);
      const boardsWithLists: BoardWithLists[] = backendBoards.map((board) => ({
        ...board,
        lists: [], // Start with empty lists
      }));
      set({ boards: boardsWithLists, isLoading: false });

      // Fetch details (lists & cards) for each board in the background
      // This populates the card/list counts on the dashboard
      backendBoards.forEach(board => {
        get().fetchBoardCards(board.id);
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch boards",
        isLoading: false,
      });
    }
  },

  fetchBoard: async (boardId: string) => {
    set({ isLoading: true, error: null });
    try {
      const board = await boardsAPI.getBoard(boardId);

      // Ensure local object matches expected structure
      const boardWithLists: BoardWithLists = {
        ...board,
        lists: (board as any).lists || [],
      };

      set((state: BoardStore) => ({
        boards: [
          ...state.boards.filter((b: BoardWithLists) => b.id !== boardId),
          boardWithLists
        ],
        isLoading: false
      }));
    } catch (error: any) {
      console.error("Error fetching board:", error);
      set({
        error: error?.message || "Failed to fetch board",
        isLoading: false
      });
    }
  },

  fetchBoardCards: async (boardId: string) => {
    try {
      // 1. Fetch Lists
      const apiLists = await listsAPI.getProjectLists(boardId);

      // 2. Fetch Cards for each list
      // We do this in parallel because we need to populate all lists
      const listsWithCards = await Promise.all(
        apiLists.map(async (apiList) => {
          const list = mapApiListToList(apiList);
          try {
            const apiCards = await cardsAPI.getListCards(list.id);
            const cards = apiCards.map(c => mapApiCardToCard(c, boardId));
            // Sort cards by position
            cards.sort((a, b) => a.position - b.position);
            return { ...list, cards };
          } catch (e) {
            console.error(`Failed to fetch cards for list ${list.id}`, e);
            return list;
          }
        })
      );

      // Sort lists by position
      listsWithCards.sort((a, b) => a.position - b.position);

      set((state: BoardStore) => ({
        boards: state.boards.map((board: BoardWithLists) => {
          if (board.id !== boardId) return board;
          return { ...board, lists: listsWithCards };
        }),
      }));
    } catch (error) {
      console.error("Error fetching board content:", error);
    }
  },

  addBoard: async (boardData: CreateBoardData & { workspaceId?: string; background?: string; color?: string; privacy?: string }) => {
    try {
      // Create board on backend first and wait for the real ID
      const realBoard = await boardsAPI.createBoard({
        name: boardData.name,
        description: boardData.description,
        background_color: boardData.background || boardData.color || "#0079bf",
        workspace_id: boardData.workspaceId || boardData.workspace_id || "default",
      });

      console.log("✅ Board created on backend:", realBoard.id);

      const newBoard: BoardWithLists = {
        id: realBoard.id, // Use the REAL ID from backend
        name: realBoard.name,
        title: realBoard.name,
        description: realBoard.description,
        background_color: realBoard.background_color,
        background: realBoard.background_color,
        color: realBoard.background_color,
        workspace_id: realBoard.workspace_id,
        privacy: (boardData as any).privacy || "workspace",
        archived: false,
        created_by: realBoard.created_by,
        created_at: realBoard.created_at,
        updated_at: realBoard.updated_at,
        lists: [],
      };

      set((state: BoardStore) => ({ boards: [newBoard, ...state.boards] }));
      return realBoard.id; // Return the REAL ID
    } catch (error) {
      console.error("❌ Backend create failed:", error);
      throw error; // Re-throw so the caller knows it failed
    }
  },

  addList: async (boardId: string, title: string) => {
    const board = get().boards.find((b: BoardWithLists) => b.id === boardId);
    const position = board?.lists?.length || 0;

    // Optimistic Update
    const tempListId = `temp-list-${Date.now()}`;
    const newList: List = {
      id: tempListId,
      title,
      position,
      board_id: boardId,
      status: "todo",
      cards: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    set((state: BoardStore) => ({
      boards: state.boards.map((b: BoardWithLists) =>
        b.id === boardId ? { ...b, lists: [...(b.lists || []), newList] } : b
      )
    }));

    try {
      const apiList = await listsAPI.createList(boardId, { title, position });
      const realList = mapApiListToList(apiList);

      set((state: BoardStore) => ({
        boards: state.boards.map((b: BoardWithLists) =>
          b.id === boardId ? {
            ...b,
            lists: b.lists?.map((l: List) => l.id === tempListId ? { ...realList, cards: [] } : l)
          } : b
        )
      }));
    } catch (error) {
      console.error("Failed to add list:", error);
      // Revert optimistic update
      set((state: BoardStore) => ({
        boards: state.boards.map((b: BoardWithLists) =>
          b.id === boardId ? { ...b, lists: b.lists?.filter((l: List) => l.id !== tempListId) } : b
        )
      }));
    }
  },

  updateList: async (boardId: string, listId: string, updates: Partial<List>) => {
    // Optimistic
    set((state: BoardStore) => ({
      boards: state.boards.map((b: BoardWithLists) =>
        b.id === boardId ? {
          ...b,
          lists: b.lists?.map((l: List) => l.id === listId ? { ...l, ...updates } : l)
        } : b
      )
    }));

    try {
      await listsAPI.updateList(boardId, listId, {
        title: updates.title,
        position: updates.position
      });
    } catch (error) {
      console.error("Failed to update list:", error);
      // Could revert here if needed
    }
  },

  deleteList: async (boardId: string, listId: string) => {
    // Optimistic
    const previousLists = get().boards.find(b => b.id === boardId)?.lists;
    set((state: BoardStore) => ({
      boards: state.boards.map((b: BoardWithLists) =>
        b.id === boardId ? { ...b, lists: b.lists?.filter((l: List) => l.id !== listId) } : b
      )
    }));

    try {
      await listsAPI.deleteList(boardId, listId);
    } catch (error) {
      console.error("Failed to delete list:", error);
      // Revert
      if (previousLists) {
        set((state) => ({
          boards: state.boards.map(b =>
            b.id === boardId ? { ...b, lists: previousLists } : b
          )
        }));
      }
    }
  },

  addCard: async (boardId: string, listId: string, title: string) => {
    const board = get().boards.find((b: BoardWithLists) => b.id === boardId);
    const list = board?.lists?.find((l: List) => l.id === listId);
    const position = list?.cards?.length || 0;

    // Optimistic
    const tempCardId = `temp-card-${Date.now()}`;
    const optimCard: Card = {
      id: tempCardId,
      title,
      name: title,
      status: 'todo',
      project_id: boardId,
      list_id: listId,
      position,
      created_by: "current_user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      priority: 'medium',
      description: "",
      due_date: undefined
    };

    set((state: BoardStore) => ({
      boards: state.boards.map((b: BoardWithLists) => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          lists: b.lists?.map((l: List) => (l.id === listId ? { ...l, cards: [...(l.cards || []), optimCard] } : l)),
        };
      }),
    }));

    try {
      const newApiCard = await cardsAPI.createCard(listId, {
        title,
        description: "",
        position,
        priority: "medium",
      });

      const newCard = mapApiCardToCard(newApiCard, boardId);

      set((state: BoardStore) => ({
        boards: state.boards.map((b: BoardWithLists) => {
          if (b.id !== boardId) return b;
          return {
            ...b,
            lists: b.lists?.map((l: List) => (l.id === listId ? {
              ...l,
              cards: l.cards?.map(c => c.id === tempCardId ? newCard : c)
            } : l)),
          };
        }),
      }));
    } catch (error) {
      console.error("Backend create card failed:", error);
      // Remove optimistic card
      set((state: BoardStore) => ({
        boards: state.boards.map((b: BoardWithLists) => {
          if (b.id !== boardId) return b;
          return {
            ...b,
            lists: b.lists?.map((l: List) => (l.id === listId ? { ...l, cards: l.cards?.filter(c => c.id !== tempCardId) } : l)),
          };
        }),
      }));
    }
  },

  updateCard: async (boardId: string, listId: string, cardId: string, updates: Partial<Card>) => {
    // Optimistic
    set((state: BoardStore) => ({
      boards: state.boards.map((board: BoardWithLists) => {
        if (board.id !== boardId) return board;
        return {
          ...board,
          lists: board.lists?.map((list: List) => {
            // If card moves list, we might need to handle that, but here we assume simple update
            // If listId changes, we need more complex logic (remove from old, add to new)
            // For now, assuming in-place update or handled by dnd separate logic
            if (list.id !== listId) return list;
            return {
              ...list,
              cards: list.cards?.map((card: Card) => (card.id === cardId ? { ...card, ...updates } : card)),
            };
          }),
        };
      }),
    }));

    try {
      const updateData: Record<string, any> = {};
      if (updates.title) updateData.title = updates.title;
      if (updates.name && !updates.title) updateData.title = updates.name; // Fallback
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.due_date !== undefined) updateData.due_date = updates.due_date;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.position !== undefined) updateData.position = updates.position;
      if (updates.list_id !== undefined) updateData.list_id = updates.list_id;

      await cardsAPI.updateCard(listId, cardId, updateData);
    } catch (error) {
      console.error("Backend update card failed:", error);
      // Revert if critical
    }
  },

  removeCard: async (boardId: string, listId: string, cardId: string) => {
    const previousBoard = get().boards.find(b => b.id === boardId);

    set((state: BoardStore) => ({
      boards: state.boards.map((board: BoardWithLists) => {
        if (board.id !== boardId) return board;
        return {
          ...board,
          lists: board.lists?.map((list: List) => {
            if (list.id !== listId) return list;
            return { ...list, cards: list.cards?.filter((card: Card) => card.id !== cardId) };
          }),
        };
      }),
    }));

    try {
      await cardsAPI.deleteCard(listId, cardId);
    } catch (error) {
      console.error("Backend delete card failed:", error);
      if (previousBoard) {
        set((state) => ({
          boards: state.boards.map(b => b.id === boardId ? previousBoard : b)
        }));
      }
    }
  },

  duplicateCard: async (boardId: string, listId: string, cardId: string) => {
    // We can't optimistically generate an ID reliably without backend sync first, 
    // but we can pessimistic update by fetching the new card right after duplication.
    try {
      const newApiCard = await cardsAPI.duplicateCard(listId, cardId);
      const newCard = mapApiCardToCard(newApiCard, boardId);

      set((state: BoardStore) => ({
        boards: state.boards.map((b: BoardWithLists) => {
          if (b.id !== boardId) return b;
          return {
            ...b,
            lists: b.lists?.map((l: List) => (l.id === listId ? {
              ...l,
              cards: [...(l.cards || []), newCard]
            } : l)),
          };
        }),
      }));
    } catch (error) {
      console.error("Backend duplicate card failed:", error);
      throw error;
    }
  },

  getWorkspaceBoards: (workspaceId: string) => get().boards.filter((board: BoardWithLists) => board.workspace_id === workspaceId),

  getWorkspaceBoardCount: (workspaceId: string) => get().boards.filter((board: BoardWithLists) => board.workspace_id === workspaceId).length,

  deleteBoard: async (boardId: string) => {
    const previousBoards = get().boards;
    // Optimistic removal
    set((state: BoardStore) => ({
      boards: state.boards.filter((b: BoardWithLists) => b.id !== boardId)
    }));
    try {
      await boardsAPI.deleteBoard(boardId);
    } catch (error) {
      console.error("Failed to delete board:", error);
      // Revert
      set({ boards: previousBoards });
      throw error;
    }
  },

  updateBoard: async (boardId: string, updates: Partial<Board>) => {
    // Optimistic Update
    set((state: BoardStore) => ({
      boards: state.boards.map((b: BoardWithLists) =>
        b.id === boardId ? { ...b, ...updates } : b
      )
    }));

    try {
      // Map 'title' back to 'name' for backend if needed
      const apiUpdates: any = { ...updates };
      if (updates.title) apiUpdates.name = updates.title;

      await boardsAPI.updateBoard(boardId, apiUpdates);
    } catch (error) {
      console.error("Failed to update board:", error);
      // We could revert here, but for simplicity we'll just log
    }
  },
});

export const useBoardStore = create<BoardStore>(store);

// Convenience helpers
export async function fetchBoard(boardId: string): Promise<Board> {
  return boardsAPI.getBoard(boardId);
}

export async function fetchWorkspaceBoards(workspaceId: string): Promise<Board[]> {
  return boardsAPI.getWorkspaceBoards(workspaceId);
}
