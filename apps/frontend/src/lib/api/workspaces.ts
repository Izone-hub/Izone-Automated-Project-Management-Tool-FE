
// lib/api/workspaces.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Safe token getter
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

function headers(): HeadersInit {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWorkspacePayload {
  name: string;
  description?: string;
}

export const workspaceAPI = {
  // Get all workspaces (list endpoint)
  async getAll(): Promise<Workspace[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/workspaces`, {
        headers: headers(),
      });

      if (res.status === 401) {
        localStorage.removeItem("auth_token");
        throw new Error("Session expired. Please login again.");
      }

      if (!res.ok) {
        throw new Error(`Failed to load workspaces: ${res.statusText}`);
      }

      return res.json();
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      throw error;
    }
  },

  // Create workspace
  async create(payload: CreateWorkspacePayload): Promise<Workspace> {
    try {
      const res = await fetch(`${API_BASE_URL}/workspaces`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        localStorage.removeItem("auth_token");
        throw new Error("Session expired. Please login again.");
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to create workspace: ${res.statusText}`);
      }

      return res.json();
    } catch (error) {
      console.error("Error creating workspace:", error);
      throw error;
    }
  },

  // Since you don't have a GET workspace by ID endpoint,
  // we'll handle it client-side by filtering from the list
  async getById(workspaceId: string): Promise<Workspace | null> {
    try {
      // First get all workspaces
      const workspaces = await this.getAll();

      // Then find the specific workspace
      const workspace = workspaces.find(ws => ws.id === workspaceId);

      if (!workspace) {
        throw new Error(`Workspace with ID ${workspaceId} not found`);
      }

      return workspace;
    } catch (error) {
      console.error("Error fetching workspace by ID:", error);
      throw error;
    }
  }
};
















