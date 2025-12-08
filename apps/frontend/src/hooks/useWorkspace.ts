// hooks/useWorkspace.ts
import { useState, useEffect, useCallback } from "react";
import { workspaceAPI, Workspace } from "@/lib/api/workspaces";

interface UseWorkspacesReturn {
  workspaces: Workspace[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  createWorkspace: (payload: { name: string; description?: string }) => Promise<Workspace>;
  reload: () => Promise<void>;
}

export const useWorkspaces = (): UseWorkspacesReturn => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
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

  return { 
    workspaces, 
    loading, 
    error, 
    isAuthenticated,
    createWorkspace, 
    reload: load 
  };
};