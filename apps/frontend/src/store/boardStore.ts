// // @ts-ignore - zustand is provided in workspace deps but types may be resolved at build time
// import { create, type StateCreator, type SetState, type GetState } from "zustand";
// import { boardsAPI, type Board, type CreateBoardData } from "@/lib/api/boards";
// import { cardsAPI, type Card as ApiCard } from "@/lib/api/cards";

// // Minimal local types to avoid missing imports
// type Card = ApiCard & { title: string; list_id?: string };
// type ListStatus = "todo" | "in-progress" | "review" | "done";
// interface List {
//   id: string;
//   title: string;
//   position: number;
//   board_id: string;
//   status: ListStatus;
//   cards?: Card[];
//   created_at: string;
//   updated_at: string;
// }
// type BoardWithLists = Board & { lists?: List[] };

// // Default lists scaffold
// const DEFAULT_LISTS: Omit<List, "board_id" | "cards">[] = [
//   { id: "todo", title: "To Do", status: "todo", position: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
//   { id: "in-progress", title: "In Progress", status: "in-progress", position: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
//   { id: "review", title: "Review", status: "review", position: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
//   { id: "done", title: "Done", status: "done", position: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
// ];

// interface BoardStore {
//   boards: BoardWithLists[];
//   isLoading: boolean;
//   error: string | null;

//   fetchWorkspaceBoards: (workspaceId: string) => Promise<void>;
//   fetchBoardCards: (boardId: string) => Promise<void>;

//   addBoard: (boardData: CreateBoardData & { workspaceId?: string; background?: string; color?: string; privacy?: string }) => string;
//   addList: (boardId: string, title: string) => void;
//   updateList: (boardId: string, listId: string, updates: Partial<List>) => void;
//   deleteList: (boardId: string, listId: string) => void;
//   addCard: (boardId: string, listId: string, title: string) => Promise<void>;
//   updateCard: (boardId: string, listId: string, cardId: string, updates: Partial<Card>) => Promise<void>;
//   removeCard: (boardId: string, listId: string, cardId: string) => Promise<void>;

//   getWorkspaceBoards: (workspaceId: string) => BoardWithLists[];
//   getWorkspaceBoardCount: (workspaceId: string) => number;
// }

// // Helper mappers
// const mapApiCardToCard = (apiCard: ApiCard): Card => ({
//   id: apiCard.id,
//   title: apiCard.name,
//   name: apiCard.name,
//   description: apiCard.description,
//   due_date: apiCard.due_date ?? null,
//   status: apiCard.status as ListStatus,
//   priority: apiCard.priority,
//   assignee_id: apiCard.assignee_id ?? null,
//   position: apiCard.position,
//   project_id: apiCard.project_id,
//   created_by: apiCard.created_by,
//   created_at: apiCard.created_at,
//   updated_at: apiCard.updated_at,
//   list_id: apiCard.status as ListStatus,
// });

// const store: StateCreator<BoardStore, [], [], BoardStore> = (
//   set: SetState<BoardStore>,
//   get: GetState<BoardStore>
// ) => ({
//   boards: [],
//   isLoading: false,
//   error: null,

//   fetchWorkspaceBoards: async (workspaceId: string) => {
//     set({ isLoading: true, error: null });
//     try {
//       const backendBoards = await boardsAPI.getWorkspaceBoards(workspaceId);
//       const boardsWithLists: BoardWithLists[] = backendBoards.map((board) => ({
//         ...board,
//         lists: DEFAULT_LISTS.map((list) => ({
//           ...list,
//           board_id: board.id,
//           cards: [],
//         })),
//       }));
//       set({ boards: boardsWithLists, isLoading: false });
//     } catch (error: any) {
//       set({
//         error: error?.message || "Failed to fetch boards",
//         isLoading: false,
//       });
//     }
//   },

//   fetchBoardCards: async (boardId: string) => {
//     try {
//       const apiCards = await cardsAPI.getBoardCards(boardId);
//       const cards = apiCards.map(mapApiCardToCard);

//       set((state: BoardStore) => ({
//         boards: state.boards.map((board: BoardWithLists) => {
//           if (board.id !== boardId) return board;
//           const listsWithCards = board.lists?.map((list: List) => {
//             const listCards = cards.filter((card: Card) => card.status === list.status);
//             const sortedCards = [...listCards].sort((a, b) => a.position - b.position);
//             return { ...list, cards: sortedCards };
//           });
//           return { ...board, lists: listsWithCards };
//         }),
//       }));
//     } catch (error) {
//       console.error("Error fetching board cards:", error);
//     }
//   },

//   addBoard: (boardData: CreateBoardData & { workspaceId?: string; background?: string; color?: string; privacy?: string }) => {
//     const newBoardId = Date.now().toString();
//     const newBoard: BoardWithLists = {
//       id: newBoardId,
//       name: boardData.name,
//       title: boardData.name,
//       description: boardData.description,
//       background_color: boardData.background || boardData.color || "#0079bf",
//       background: boardData.background || boardData.color || "#0079bf",
//       color: boardData.background || boardData.color || "#0079bf",
//       workspace_id: boardData.workspaceId || boardData.workspace_id || "default",
//       privacy: (boardData as any).privacy || "workspace",
//       archived: false,
//       created_by: "current_user",
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       lists: DEFAULT_LISTS.map((list) => ({
//         ...list,
//         board_id: newBoardId,
//         cards: [],
//       })),
//     };

//     boardsAPI
//       .createBoard({
//         name: boardData.name,
//         description: boardData.description,
//         background_color: boardData.background || boardData.color || "#0079bf",
//         workspace_id: boardData.workspaceId || boardData.workspace_id || "default",
//       })
//       .catch((error) => {
//         console.error("Backend create failed:", error);
//       });

//     set((state: BoardStore) => ({ boards: [newBoard, ...state.boards] }));
//     return newBoardId;
//   },

//   addList: (boardId: string, title: string) => {
//     set((state: BoardStore) => ({
//       boards: state.boards.map((board: BoardWithLists) => {
//         if (board.id !== boardId) return board;
//         const newList: List = {
//           id: Date.now().toString(),
//           title,
//           position: board.lists?.length || 0,
//           board_id: boardId,
//           status: "todo",
//           cards: [],
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString(),
//         };
//         return { ...board, lists: [...(board.lists || []), newList] };
//       }),
//     }));
//   },

//   updateList: (boardId: string, listId: string, updates: Partial<List>) => {
//     set((state: BoardStore) => ({
//       boards: state.boards.map((board: BoardWithLists) => {
//         if (board.id !== boardId) return board;
//         return {
//           ...board,
//           lists: board.lists?.map((list: List) => (list.id === listId ? { ...list, ...updates } : list)),
//         };
//       }),
//     }));
//   },

//   deleteList: (boardId: string, listId: string) => {
//     set((state: BoardStore) => ({
//       boards: state.boards.map((board: BoardWithLists) => {
//         if (board.id !== boardId) return board;
//         return {
//           ...board,
//           lists: board.lists?.filter((list: List) => list.id !== listId),
//         };
//       }),
//     }));
//   },

//   addCard: async (boardId: string, listId: string, title: string) => {
//     const board = get().boards.find((b: BoardWithLists) => b.id === boardId);
//     const list = board?.lists?.find((l: List) => l.id === listId);
//     const position = list?.cards?.length || 0;

//     try {
//       const newApiCard = await cardsAPI.createCard({
//         project_id: boardId,
//         name: title,
//         description: "",
//         status: list?.status || "todo",
//         priority: "medium",
//         position,
//       });

//       const newCard = mapApiCardToCard(newApiCard);

//       set((state: BoardStore) => ({
//         boards: state.boards.map((b: BoardWithLists) => {
//           if (b.id !== boardId) return b;
//           return {
//             ...b,
//             lists: b.lists?.map((l: List) => (l.id === listId ? { ...l, cards: [...(l.cards || []), newCard] } : l)),
//           };
//         }),
//       }));
//     } catch (error) {
//       console.error("Backend create card failed:", error);
//       const fallbackCard: Card = {
//         id: Date.now().toString(),
//         title,
//         name: title,
//         description: "",
//         status: list?.status || "todo",
//         due_date: null,
//         priority: "medium",
//         assignee_id: null,
//         position,
//         project_id: boardId,
//         created_by: "current_user",
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//         list_id: listId,
//       };
//       set((state: BoardStore) => ({
//         boards: state.boards.map((b: BoardWithLists) => {
//           if (b.id !== boardId) return b;
//           return {
//             ...b,
//             lists: b.lists?.map((l: List) => (l.id === listId ? { ...l, cards: [...(l.cards || []), fallbackCard] } : l)),
//           };
//         }),
//       }));
//     }
//   },

//   updateCard: async (boardId: string, listId: string, cardId: string, updates: Partial<Card>) => {
//     try {
//       const updateData: Record<string, unknown> = {};
//       if (updates.title !== undefined) updateData.name = updates.title;
//       if (updates.description !== undefined) updateData.description = updates.description;
//       if (updates.due_date !== undefined) updateData.due_date = updates.due_date;
//       if (updates.status !== undefined) updateData.status = updates.status;
//       if (updates.priority !== undefined) updateData.priority = updates.priority;
//       if (updates.assignee_id !== undefined) updateData.assignee_id = updates.assignee_id;
//       if (updates.position !== undefined) updateData.position = updates.position;

//       await cardsAPI.updateCard(cardId, updateData);
//     } catch (error) {
//       console.error("Backend update card failed:", error);
//     }

//     set((state: BoardStore) => ({
//       boards: state.boards.map((board: BoardWithLists) => {
//         if (board.id !== boardId) return board;
//         return {
//           ...board,
//           lists: board.lists?.map((list: List) => {
//             if (list.id !== listId) return list;
//             return {
//               ...list,
//               cards: list.cards?.map((card: Card) => (card.id === cardId ? { ...card, ...updates } : card)),
//             };
//           }),
//         };
//       }),
//     }));
//   },

//   removeCard: async (boardId: string, listId: string, cardId: string) => {
//     try {
//       await cardsAPI.deleteCard(cardId);
//     } catch (error) {
//       console.error("Backend delete card failed:", error);
//     }

//     set((state: BoardStore) => ({
//       boards: state.boards.map((board: BoardWithLists) => {
//         if (board.id !== boardId) return board;
//         return {
//           ...board,
//           lists: board.lists?.map((list: List) => {
//             if (list.id !== listId) return list;
//             return { ...list, cards: list.cards?.filter((card: Card) => card.id !== cardId) };
//           }),
//         };
//       }),
//     }));
//   },

//   getWorkspaceBoards: (workspaceId: string) => get().boards.filter((board: BoardWithLists) => board.workspace_id === workspaceId),

//   getWorkspaceBoardCount: (workspaceId: string) => get().boards.filter((board: BoardWithLists) => board.workspace_id === workspaceId).length,
// });

// export const useBoardStore = create<BoardStore>(store);

// // Convenience helpers (non-Zustand) for places that only need API calls
// export async function fetchBoard(boardId: string): Promise<Board> {
//   return boardsAPI.getBoard(boardId);
// }

// export async function fetchWorkspaceBoards(workspaceId: string): Promise<Board[]> {
//   return boardsAPI.getWorkspaceBoards(workspaceId);
// }

// export async function fetchBoardCards(boardId: string): Promise<ApiCard[]> {
//   return cardsAPI.getBoardCards(boardId);
// }





// @ts-ignore - zustand is provided in workspace deps but types may be resolved at build time
import { create, type StateCreator, type SetState, type GetState } from "zustand";
import { boardsAPI, type Board, type CreateBoardData } from "@/lib/api/boards";
import { cardsAPI, type Card as ApiCard } from "@/lib/api/cards";

// Minimal local types to avoid missing imports
type Card = ApiCard & { title: string; list_id?: string };
type ListStatus = "todo" | "in-progress" | "review" | "done";
interface List {
  id: string;
  title: string;
  position: number;
  board_id: string;
  status: ListStatus;
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
  fetchBoardCards: (boardId: string) => Promise<void>;

  addBoard: (boardData: CreateBoardData & { workspaceId?: string; background?: string; color?: string; privacy?: string }) => string;
  addList: (boardId: string, title: string) => void;
  updateList: (boardId: string, listId: string, updates: Partial<List>) => void;
  deleteList: (boardId: string, listId: string) => void;
  addCard: (boardId: string, listId: string, title: string) => Promise<void>;
  updateCard: (boardId: string, listId: string, cardId: string, updates: Partial<Card>) => Promise<void>;
  removeCard: (boardId: string, listId: string, cardId: string) => Promise<void>;

  getWorkspaceBoards: (workspaceId: string) => BoardWithLists[];
  getWorkspaceBoardCount: (workspaceId: string) => number;
}

// Helper mappers
const mapApiCardToCard = (apiCard: ApiCard): Card => ({
  id: apiCard.id,
  title: apiCard.name,
  name: apiCard.name,
  description: apiCard.description,
  due_date: apiCard.due_date ?? null,
  status: apiCard.status as ListStatus,
  priority: apiCard.priority,
  assignee_id: apiCard.assignee_id ?? null,
  position: apiCard.position,
  project_id: apiCard.project_id,
  created_by: apiCard.created_by,
  created_at: apiCard.created_at,
  updated_at: apiCard.updated_at,
  list_id: apiCard.status as ListStatus,
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
        lists: [],
      }));
      set({ boards: boardsWithLists, isLoading: false });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch boards",
        isLoading: false,
      });
    }
  },

  fetchBoardCards: async (boardId: string) => {
    try {
      const apiCards = await cardsAPI.getBoardCards(boardId);
      const cards = apiCards.map(mapApiCardToCard);

      set((state: BoardStore) => ({
        boards: state.boards.map((board: BoardWithLists) => {
          if (board.id !== boardId) return board;
          const listsWithCards = board.lists?.map((list: List) => {
            const listCards = cards.filter((card: Card) => card.status === list.status);
            const sortedCards = [...listCards].sort((a, b) => a.position - b.position);
            return { ...list, cards: sortedCards };
          });
          return { ...board, lists: listsWithCards };
        }),
      }));
    } catch (error) {
      console.error("Error fetching board cards:", error);
    }
  },

  addBoard: (boardData: CreateBoardData & { workspaceId?: string; background?: string; color?: string; privacy?: string }) => {
    const tempId = Date.now().toString();
    const newBoard: BoardWithLists = {
      id: tempId,
      name: boardData.name,
      title: boardData.name,
      description: boardData.description,
      background_color: boardData.background || boardData.color || "#0079bf",
      background: boardData.background || boardData.color || "#0079bf",
      color: boardData.background || boardData.color || "#0079bf",
      workspace_id: boardData.workspaceId || boardData.workspace_id || "default",
      privacy: (boardData as any).privacy || "workspace",
      archived: false,
      created_by: "current_user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      lists: [],
    };

    // 1. Optimistic Update
    set((state: BoardStore) => ({ boards: [newBoard, ...state.boards] }));

    // 2. Background API Call
    boardsAPI
      .createBoard({
        name: boardData.name,
        description: boardData.description,
        background_color: boardData.background || boardData.color || "#0079bf",
        workspace_id: boardData.workspaceId || boardData.workspace_id || "default",
      })
      .then((realBoard) => {
        console.log("✅ Board created on backend. Swapping ID:", tempId, "->", realBoard.id);

        // 3. Swap Temp ID with Real ID
        set((state: BoardStore) => ({
          boards: state.boards.map((b) => {
            if (b.id === tempId) {
              // Keep any lists or local changes, but swap ID
              return { ...b, ...realBoard, id: realBoard.id };
            }
            return b;
          })
        }));
      })
      .catch((error) => {
        console.error("❌ Backend create failed:", error);
        // Rollback on failure could be done here, 
        // but often better to keep optimistic state and show error toast
      });

    return tempId;
  },

  addList: (boardId: string, title: string) => {
    set((state: BoardStore) => ({
      boards: state.boards.map((board: BoardWithLists) => {
        if (board.id !== boardId) return board;
        const newList: List = {
          id: `list-${Date.now()}`,
          title,
          position: board.lists?.length || 0,
          board_id: boardId,
          status: "todo", // Default status for validation, but UI uses list ID
          cards: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return { ...board, lists: [...(board.lists || []), newList] };
      }),
    }));
  },

  updateList: (boardId: string, listId: string, updates: Partial<List>) => {
    set((state: BoardStore) => ({
      boards: state.boards.map((board: BoardWithLists) => {
        if (board.id !== boardId) return board;
        return {
          ...board,
          lists: board.lists?.map((list: List) => (list.id === listId ? { ...list, ...updates } : list)),
        };
      }),
    }));
  },

  deleteList: (boardId: string, listId: string) => {
    set((state: BoardStore) => ({
      boards: state.boards.map((board: BoardWithLists) => {
        if (board.id !== boardId) return board;
        return {
          ...board,
          lists: board.lists?.filter((list: List) => list.id !== listId),
        };
      }),
    }));
  },

  addCard: async (boardId: string, listId: string, title: string) => {
    const board = get().boards.find((b: BoardWithLists) => b.id === boardId);
    const list = board?.lists?.find((l: List) => l.id === listId);
    const position = list?.cards?.length || 0;

    try {
      const newApiCard = await cardsAPI.createCard({
        project_id: boardId,
        name: title,
        description: "",
        status: list?.status || "todo",
        priority: "medium",
        position,
      });

      const newCard = mapApiCardToCard(newApiCard);

      set((state: BoardStore) => ({
        boards: state.boards.map((b: BoardWithLists) => {
          if (b.id !== boardId) return b;
          return {
            ...b,
            lists: b.lists?.map((l: List) => (l.id === listId ? { ...l, cards: [...(l.cards || []), newCard] } : l)),
          };
        }),
      }));
    } catch (error) {
      console.error("Backend create card failed:", error);
      const fallbackCard: Card = {
        id: Date.now().toString(),
        title,
        name: title,
        description: "",
        status: list?.status || "todo",
        due_date: null,
        priority: "medium",
        assignee_id: null,
        position,
        project_id: boardId,
        created_by: "current_user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        list_id: listId,
      };
      set((state: BoardStore) => ({
        boards: state.boards.map((b: BoardWithLists) => {
          if (b.id !== boardId) return b;
          return {
            ...b,
            lists: b.lists?.map((l: List) => (l.id === listId ? { ...l, cards: [...(l.cards || []), fallbackCard] } : l)),
          };
        }),
      }));
    }
  },

  updateCard: async (boardId: string, listId: string, cardId: string, updates: Partial<Card>) => {
    try {
      const updateData: Record<string, unknown> = {};
      if (updates.title !== undefined) updateData.name = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.due_date !== undefined) updateData.due_date = updates.due_date;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.assignee_id !== undefined) updateData.assignee_id = updates.assignee_id;
      if (updates.position !== undefined) updateData.position = updates.position;

      await cardsAPI.updateCard(cardId, updateData);
    } catch (error) {
      console.error("Backend update card failed:", error);
    }

    set((state: BoardStore) => ({
      boards: state.boards.map((board: BoardWithLists) => {
        if (board.id !== boardId) return board;
        return {
          ...board,
          lists: board.lists?.map((list: List) => {
            if (list.id !== listId) return list;
            return {
              ...list,
              cards: list.cards?.map((card: Card) => (card.id === cardId ? { ...card, ...updates } : card)),
            };
          }),
        };
      }),
    }));
  },

  removeCard: async (boardId: string, listId: string, cardId: string) => {
    try {
      await cardsAPI.deleteCard(cardId);
    } catch (error) {
      console.error("Backend delete card failed:", error);
    }

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
  },

  getWorkspaceBoards: (workspaceId: string) => get().boards.filter((board: BoardWithLists) => board.workspace_id === workspaceId),

  getWorkspaceBoardCount: (workspaceId: string) => get().boards.filter((board: BoardWithLists) => board.workspace_id === workspaceId).length,
});

export const useBoardStore = create<BoardStore>(store);

// Convenience helpers (non-Zustand) for places that only need API calls
export async function fetchBoard(boardId: string): Promise<Board> {
  return boardsAPI.getBoard(boardId);
}

export async function fetchWorkspaceBoards(workspaceId: string): Promise<Board[]> {
  return boardsAPI.getWorkspaceBoards(workspaceId);
}

export async function fetchBoardCards(boardId: string): Promise<ApiCard[]> {
  return cardsAPI.getBoardCards(boardId);
}

