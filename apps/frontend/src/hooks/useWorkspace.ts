// hooks/useWorkspace.ts
import { useState, useEffect, useCallback } from "react";
import { workspaceAPI, Workspace as ApiWorkspace } from "@/lib/api/workspaces";
import { useAppStore, Workspace as StoreWorkspace } from "@/store/app.store";
import { boardsAPI } from "@/lib/api/boards";

interface UseWorkspacesReturn {
  workspaces: StoreWorkspace[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  boardCounts: Record<string, number>;
  createWorkspace: (payload: { name: string; description?: string }) => Promise<StoreWorkspace>;
  reload: () => Promise<void>;
  getWorkspaceById: (workspaceId: string) => StoreWorkspace | null;
}

// Mapper to convert API response to Store format
const mapApiToStore = (apiWs: ApiWorkspace): StoreWorkspace => ({
  id: apiWs.id,
  name: apiWs.name,
  description: apiWs.description,
  color: "#000000", // Default or map if available
  userId: apiWs.owner_id,
  createdAt: new Date(apiWs.created_at),
  updatedAt: new Date(apiWs.updated_at),
});

export const useWorkspaces = (): UseWorkspacesReturn => {
  // Use Global Store
  const workspaces = useAppStore((state) => state.workspaces);
  const setWorkspaces = useAppStore((state) => state.setWorkspaces);
  const addWorkspaceToStore = useAppStore((state) => state.createWorkspace);

  // Local UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [boardCounts, setBoardCounts] = useState<Record<string, number>>({});

  const checkAuth = useCallback(() => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("auth_token");
    return !!token;
  }, []);

  // Initial load - only runs once on mount
  const initialLoad = useCallback(async () => {
    setLoading(true);
    setError(null);

    const isAuth = checkAuth();
    setIsAuthenticated(isAuth);

    if (!isAuth) {
      setLoading(false);
      return;
    }

    try {
      const data = await workspaceAPI.getAll();
      const storeData = data.map(mapApiToStore);
      setWorkspaces(storeData);

      // Fetch board counts for each workspace
      const counts: Record<string, number> = {};
      await Promise.all(
        storeData.map(async (ws) => {
          try {
            const boards = await boardsAPI.getWorkspaceBoards(ws.id);
            counts[ws.id] = boards.length;
          } catch {
            counts[ws.id] = 0;
          }
        })
      );
      setBoardCounts(counts);
    } catch (err: any) {
      console.error("Failed to load workspaces", err);
      if (err.message.includes("Session expired") || err.message.includes("Unauthorized")) {
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  }, [checkAuth, setWorkspaces]);

  // Reload function - can be called on demand (e.g., refresh button)
  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    const isAuth = checkAuth();
    setIsAuthenticated(isAuth);

    if (!isAuth) {
      setLoading(false);
      return;
    }

    try {
      const data = await workspaceAPI.getAll();
      const storeData = data.map(mapApiToStore);
      setWorkspaces(storeData);

      // Fetch board counts for each workspace
      const counts: Record<string, number> = {};
      await Promise.all(
        storeData.map(async (ws) => {
          try {
            const boards = await boardsAPI.getWorkspaceBoards(ws.id);
            counts[ws.id] = boards.length;
          } catch {
            counts[ws.id] = 0;
          }
        })
      );
      setBoardCounts(counts);
    } catch (err: any) {
      console.error("Failed to load workspaces", err);
      setError(err.message || "Failed to refresh workspaces");
      if (err.message.includes("Session expired") || err.message.includes("Unauthorized")) {
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  }, [checkAuth, setWorkspaces]);

  // Initial load on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      initialLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createWorkspace = async (payload: { name: string; description?: string }) => {
    if (!checkAuth()) {
      throw new Error("Please login to create a workspace");
    }

    try {
      const createdApi = await workspaceAPI.create(payload);
      const createdStore = mapApiToStore(createdApi);

      // Store's createWorkspace might generate its own ID/Date if we passed raw data.
      // But here we want to enforce the API's ID.
      // The store's createWorkspace method (as seen in app.store.ts) generates a fake ID.
      // WE SHOULD NOT USE store.createWorkspace if it generates fake IDs.
      // We should manually append to the list using setWorkspaces or update the store action.
      // For now, let's just re-fetch or append manually.
      // Since I added setWorkspaces, I can append manually.

      setWorkspaces([createdStore, ...workspaces]);

      return createdStore;
    } catch (err: any) {
      setError(err.message || "Failed to create workspace");
      if (err.message.includes("Session expired") || err.message.includes("Unauthorized")) {
        setIsAuthenticated(false);
      }
      throw err;
    }
  };

  const getWorkspaceById = useCallback((workspaceId: string): StoreWorkspace | null => {
    return workspaces.find(ws => ws.id === workspaceId) || null;
  }, [workspaces]);

  return {
    workspaces,
    loading,
    error,
    isAuthenticated,
    boardCounts,
    createWorkspace,
    reload,
    getWorkspaceById,
  };
};





