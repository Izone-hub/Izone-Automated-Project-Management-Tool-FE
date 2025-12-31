// hooks/useWorkspace.ts
import { useState, useEffect, useCallback } from "react";
import { workspaceAPI, Workspace as ApiWorkspace } from "@/lib/api/workspaces";
import { useAppStore, Workspace as StoreWorkspace } from "@/store/app.store";

interface UseWorkspacesReturn {
  workspaces: StoreWorkspace[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
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

  const checkAuth = useCallback(() => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("auth_token");
    return !!token;
  }, []);

  const load = useCallback(async () => {
    // Return early if we already have workspaces and are just re-verifying auth ?? 
    // No, we should probably fetch fresh data, but we can avoid flickering.

    // Only set loading if we don't have data yet to avoid UI flashing
    if (workspaces.length === 0) setLoading(true);
    setError(null);

    const isAuth = checkAuth();
    setIsAuthenticated(isAuth);

    if (!isAuth) {
      if (workspaces.length === 0) setLoading(false);
      return;
    }

    try {
      const data = await workspaceAPI.getAll();
      const storeData = data.map(mapApiToStore);
      setWorkspaces(storeData);
    } catch (err: any) {
      console.error("Failed to load workspaces", err);
      // Only set error if we really failed and have no stale data to show?
      // Or just log it.
      // setError(err.message || "Failed to load workspaces");

      if (err.message.includes("Session expired") || err.message.includes("Unauthorized")) {
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  }, [checkAuth, setWorkspaces, workspaces.length]);

  // Initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      // If store is empty, load. If not, maybe load in background?
      load();
    }
  }, [load]);

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
    createWorkspace,
    reload: load,
    getWorkspaceById,
    // Removed loadWorkspaceById as it was just duplicate logic with local state
  };
};





