// lib/api/workspaces.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Safe token getter
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

function headers(): HeadersInit {
  const token = getToken();
  
  // Don't throw here, let the API call handle it
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
  created_at: string;
  updated_at: string;
}

export const workspaceAPI = {
  async getAll(): Promise<Workspace[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/workspaces`, {
        headers: headers(),
        credentials: 'include', // Add this if using cookies
      });

      if (res.status === 401) {
        // Clear invalid token
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
        }
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

  async create(payload: { name: string; description?: string }): Promise<Workspace> {
    try {
      const res = await fetch(`${API_BASE_URL}/workspaces`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (res.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
        }
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
};


















