// lib/api/lists.ts
const API_BASE_URL = "/api/backend";

// Get token from localStorage
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

// Build headers for requests
function buildHeaders(): HeadersInit {
  const token = getToken();
  console.log('Building headers, token exists:', !!token);
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Interfaces
export interface List {
  id: string;
  title: string;        // Backend returns 'title'
  position: number;
  project_id: string;
  created_at: string;
  updated_at: string;
  description?: string;
  color?: string;
  cards?: any[];
}

export interface CreateListData {
  title: string;        // Backend REQUIRES 'title'
  position?: number;
  description?: string;
  color?: string;
  // NO project_id here - it comes from URL
}

export interface UpdateListData {
  title?: string;       // Optional for updates
  position?: number;
  description?: string;
  color?: string;
}

// Helper function to ensure string IDs
function ensureStringId(id: any): string {
  if (id === null || id === undefined) return '';
  return String(id);
}

// API functions
export const listsAPI = {
  async getProjectLists(projectId: string, forceRefresh = false): Promise<List[]> {
    const projectIdStr = ensureStringId(projectId);

    console.log('Fetching lists for project:', {
      projectId: projectIdStr,
      url: `${API_BASE_URL}/projects/${projectIdStr}/lists/`,
      apiBaseUrl: API_BASE_URL,
      token: getToken() ? 'Yes' : 'No'
    });

    try {
      // Add timeout to fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const res = await fetch(`${API_BASE_URL}/projects/${projectIdStr}/lists/`, {
        headers: buildHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', res.status, res.statusText);

      if (res.status === 401) {
        localStorage.removeItem("auth_token");
        throw new Error("Session expired. Please login again.");
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to load lists: ${res.status} ${res.statusText}`);
      }

      const data: List[] = await res.json();
      console.log('Received lists data:', data);

      // Ensure all IDs are strings
      const transformedData = data.map(list => ({
        ...list,
        id: ensureStringId(list.id),
        project_id: ensureStringId(list.project_id),
        created_at: list.created_at || new Date().toISOString(),
        updated_at: list.updated_at || new Date().toISOString(),
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching lists:", {
        error,
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        isAbortError: error instanceof DOMException && error.name === 'AbortError'
      });

      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Network error. Check if backend is running at ${API_BASE_URL}`);
      }
      throw error;
    }
  },

  async createList(projectId: string, data: CreateListData): Promise<List> {
    const projectIdStr = ensureStringId(projectId);

    const requestData = {
      title: data.title,
      position: data.position || 0,
      description: data.description || "",
      color: data.color || "#CCCCCC",
      project_id: projectIdStr,
    };

    console.log('Creating list:', {
      projectId: projectIdStr,
      url: `${API_BASE_URL}/projects/${projectIdStr}/lists/`,
      requestData,
      headers: buildHeaders()
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const res = await fetch(`${API_BASE_URL}/projects/${projectIdStr}/lists/`, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(requestData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Create list response:', {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok
      });

      if (res.status === 401) {
        localStorage.removeItem("auth_token");
        throw new Error("Session expired. Please login again.");
      }

      if (!res.ok) {
        let errorText = 'No error details';
        try {
          errorText = await res.text();
        } catch (e) {
          console.warn('Could not read error response:', e);
        }
        console.error('Backend error:', {
          status: res.status,
          statusText: res.statusText,
          body: errorText
        });
        throw new Error(`Failed to create list: ${res.status} ${res.statusText}`);
      }

      const rawResponse = await res.json();
      console.log('Raw response from backend:', rawResponse);

      const transformedResponse: List = {
        id: ensureStringId(rawResponse.id),
        title: rawResponse.title,
        position: rawResponse.position || 0,
        project_id: ensureStringId(rawResponse.project_id),
        created_at: rawResponse.created_at || new Date().toISOString(),
        updated_at: rawResponse.updated_at || new Date().toISOString(),
        description: rawResponse.description || "",
        color: rawResponse.color || "#CCCCCC",
        cards: rawResponse.cards || [],
      };

      return transformedResponse;
    } catch (error) {
      console.error('Error in createList:', {
        error,
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error'
      });

      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Network error. Check if backend is running at ${API_BASE_URL}`);
      }
      throw error;
    }
  },

  async updateList(
    projectId: string,
    listId: string,
    data: UpdateListData
  ): Promise<List> {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/lists/${listId}`, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(data),
    });

    if (res.status === 401) {
      localStorage.removeItem("auth_token");
      throw new Error("Session expired. Please login again.");
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Failed to update list: ${res.statusText}`);
    }

    // cache.delete(`lists_${projectId}`);
    return res.json();
  },

  async deleteList(projectId: string, listId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/lists/${listId}`, {
      method: "DELETE",
      headers: buildHeaders(),
    });

    if (res.status === 401) {
      localStorage.removeItem("auth_token");
      throw new Error("Session expired. Please login again.");
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Failed to delete list: ${res.statusText}`);
    }

    // cache.delete(`lists_${projectId}`);
  },

  clearCache(projectId?: string): void {
    // Cache removed for now to simplify debugging
  },
};