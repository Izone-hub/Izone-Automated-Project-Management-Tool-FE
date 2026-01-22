// src/stores/app.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Board {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  color: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AppStore {
  // Workspaces
  workspaces: Workspace[];
  boards: Board[];

  // Actions
  createWorkspace: (workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;
  getWorkspace: (id: string) => Workspace | undefined;

  // Boards
  createBoard: (board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  getBoardsByWorkspace: (workspaceId: string) => Board[];
  getBoard: (id: string) => Board | undefined;

  setWorkspaces: (workspaces: Workspace[]) => void;
  // User
  currentUser: { id: string; name: string; email: string } | null;
  setCurrentUser: (user: { id: string; name: string; email: string }) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      workspaces: [],
      boards: [],
      currentUser: null,

      // User actions
      setCurrentUser: (user) => set({ currentUser: user }),

      // Workspace actions
      setWorkspaces: (workspaces) => set({ workspaces }),

      createWorkspace: (workspaceData) => {
        const newWorkspace: Workspace = {
          ...workspaceData,
          id: `workspace-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          workspaces: [...state.workspaces, newWorkspace],
        }));
        return newWorkspace;
      },

      updateWorkspace: (id, updates) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === id
              ? { ...workspace, ...updates, updatedAt: new Date() }
              : workspace
          ),
        })),

      deleteWorkspace: (id) =>
        set((state) => ({
          workspaces: state.workspaces.filter((workspace) => workspace.id !== id),
          boards: state.boards.filter((board) => board.workspaceId !== id),
        })),

      getWorkspace: (id) => {
        return get().workspaces.find((workspace) => workspace.id === id);
      },

      // Board actions
      createBoard: (boardData) => {
        const newBoard: Board = {
          ...boardData,
          id: `board-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          boards: [...state.boards, newBoard],
        }));
        return newBoard;
      },

      updateBoard: (id, updates) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === id
              ? { ...board, ...updates, updatedAt: new Date() }
              : board
          ),
        })),

      deleteBoard: (id) =>
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== id),
        })),

      getBoardsByWorkspace: (workspaceId) => {
        return get().boards.filter((board) => board.workspaceId === workspaceId);
      },

      getBoard: (id) => {
        return get().boards.find((board) => board.id === id);
      },
    }),
    {
      name: 'app-storage',
    }
  )
);