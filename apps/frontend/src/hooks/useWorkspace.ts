// hooks/useWorkspace.ts
import { useState, useEffect, useCallback } from "react";
import { workspaceAPI, Workspace } from "@/lib/api/workspaces";

interface UseWorkspacesReturn {
  workspaces: Workspace[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  currentWorkspace: Workspace | null;
  createWorkspace: (payload: { name: string; description?: string }) => Promise<Workspace>;
  reload: () => Promise<void>;
  getWorkspaceById: (workspaceId: string) => Workspace | null;
  loadWorkspaceById: (workspaceId: string) => Promise<void>;
}

export const useWorkspaces = (): UseWorkspacesReturn => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkAuth = useCallback(() => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("auth_token");
    return !!token;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const isAuth = checkAuth();
    setIsAuthenticated(isAuth);
    
    if (!isAuth) {
      setError("Please login to view workspaces");
      setLoading(false);
      return;
    }

    try {
      const data = await workspaceAPI.getAll();
      setWorkspaces(data);
    } catch (err: any) {
      setError(err.message || "Failed to load workspaces");
      
      // Update auth state if unauthorized
      if (err.message.includes("Session expired") || err.message.includes("Unauthorized")) {
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  }, [checkAuth]);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      load();
    }
  }, [load]);

  const createWorkspace = async (payload: { name: string; description?: string }) => {
    if (!checkAuth()) {
      throw new Error("Please login to create a workspace");
    }

    try {
      const created = await workspaceAPI.create(payload);
      setWorkspaces(prev => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err.message || "Failed to create workspace");
      
      // Update auth state if unauthorized
      if (err.message.includes("Session expired") || err.message.includes("Unauthorized")) {
        setIsAuthenticated(false);
      }
      throw err;
    }
  };

  // Get workspace from already loaded list
  const getWorkspaceById = useCallback((workspaceId: string): Workspace | null => {
    return workspaces.find(ws => ws.id === workspaceId) || null;
  }, [workspaces]);

  // Load a specific workspace
  const loadWorkspaceById = useCallback(async (workspaceId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // First try to find in already loaded workspaces
      const existingWorkspace = workspaces.find(ws => ws.id === workspaceId);
      if (existingWorkspace) {
        setCurrentWorkspace(existingWorkspace);
        setLoading(false);
        return;
      }
      
      // If not found, reload all workspaces
      await load();
      
      // Try again after reloading
      const workspaceAfterReload = workspaces.find(ws => ws.id === workspaceId);
      if (workspaceAfterReload) {
        setCurrentWorkspace(workspaceAfterReload);
      } else {
        setError(`Workspace with ID ${workspaceId} not found`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load workspace");
    } finally {
      setLoading(false);
    }
  }, [workspaces, load]);

  return { 
    workspaces, 
    loading, 
    error, 
    isAuthenticated,
    currentWorkspace,
    createWorkspace, 
    reload: load,
    getWorkspaceById,
    loadWorkspaceById
  };
};





