import { API_BASE_URL, getHeaders, getToken } from '@/lib/api/config';

// Helper function to fetch user UUID from server
async function fetchUserUuidFromServer(): Promise<string | null> {
  try {
    console.log("Fetching user UUID from server...");

    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.error("No auth token found");
      return null;
    }

    // Try different endpoints
    const endpoints = [
      `${API_BASE_URL}/users/me`,
      `${API_BASE_URL}/auth/me`,
      `${API_BASE_URL}/profile`,
      `${API_BASE_URL}/user`,
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: getHeaders(),
        });

        if (response.ok) {
          const userData = await response.json();
          console.log(`User data from ${endpoint}:`, userData);

          // Try different field names for UUID
          const uuid = userData?.id || userData?.uuid || userData?.user_id || userData?.sub;

          if (uuid && typeof uuid === 'string' && uuid.includes('-')) {
            console.log("Got UUID from API:", uuid);
            localStorage.setItem("user_uuid", uuid);
            return uuid;
          }

          // If we got user data but no UUID, check for email
          if (userData?.email) {
            console.log("Got user email, but no UUID. Email:", userData.email);
            // We'll handle this case in the main function
          }
        }
      } catch (endpointError) {
        console.log(`Endpoint ${endpoint} failed:`, endpointError);
        continue;
      }
    }

    console.error("All endpoints failed to return UUID");
    return null;
  } catch (error) {
    console.error("Error fetching user UUID:", error);
    return null;
  }
}

// UPDATED getUserId function with better error handling and server fallback
async function getUserId(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  console.log("=== DEBUG: getUserId() called ===");

  const token = localStorage.getItem("auth_token");

  // PRIORITY 1: If we have a token, always try to fetch from server first
  // This ensures we get the most up-to-date and valid user ID
  if (token) {
    console.log("Token found, attempting to fetch user ID from server...");
    const serverUuid = await fetchUserUuidFromServer();
    if (serverUuid) {
      console.log("✅ Got UUID from server:", serverUuid);
      return serverUuid;
    }
  }

  // PRIORITY 2: Check for cached UUID (but validate it's not the hardcoded dev UUID)
  const cachedUuid = localStorage.getItem("user_uuid");
  const hardcodedDevUuid = "fb1ef640-2cc3-48a8-af5c-502e57bd6c0c";

  if (cachedUuid && cachedUuid.includes('-') && cachedUuid !== hardcodedDevUuid) {
    console.log("Using cached UUID:", cachedUuid);
    // Still try to verify it's valid by checking if we have a token
    if (token) {
      // If we have a token but server fetch failed, the cached UUID might be invalid
      // But we'll use it as a fallback
      console.warn("Using cached UUID, but server fetch failed. This might be invalid.");
    }
    return cachedUuid;
  }

  // PRIORITY 3: Check user object in localStorage
  const userStr = localStorage.getItem("user");
  let userEmail: string | null = null;

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log("User object from localStorage:", user);

      // Check for UUID in various field names
      const possibleUuidFields = ['id', 'uuid', 'user_id', 'sub'];
      for (const field of possibleUuidFields) {
        const uuid = user?.[field];
        if (uuid && typeof uuid === 'string' && uuid.includes('-') && uuid !== hardcodedDevUuid) {
          console.log(`Found UUID in ${field}:`, uuid);
          localStorage.setItem("user_uuid", uuid);
          return uuid;
        }
      }

      // Save email for later use
      userEmail = user?.email || user?.id || null;
      if (userEmail && userEmail.includes('@')) {
        console.log("Found email in user object:", userEmail);
      }
    } catch (error) {
      console.error("Failed to parse user object:", error);
    }
  }

  // PRIORITY 4: Decode JWT token (if server fetch didn't work)
  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        console.log("JWT payload:", payload);

        // Check for UUID in JWT
        const jwtUuid = payload?.sub || payload?.user_id || payload?.id;
        if (jwtUuid && typeof jwtUuid === 'string' && jwtUuid.includes('-') && jwtUuid !== hardcodedDevUuid) {
          console.log("Found UUID in JWT:", jwtUuid);
          localStorage.setItem("user_uuid", jwtUuid);
          return jwtUuid;
        }

        // If no UUID in JWT, get email from JWT
        if (!userEmail) {
          userEmail = payload?.email;
          if (userEmail && userEmail.includes('@')) {
            console.log("Found email in JWT:", userEmail);
          }
        }
      }
    } catch (error) {
      console.error("Failed to decode JWT:", error);
    }
  }

  // PRIORITY 5: If we have an email but no UUID, try server fetch again
  if (userEmail && userEmail.includes('@') && token) {
    console.log("No UUID found locally. Email present:", userEmail);
    console.log("Attempting to fetch UUID from server again...");

    const serverUuid = await fetchUserUuidFromServer();
    if (serverUuid) {
      return serverUuid;
    }
  }

  // LAST RESORT: Only use hardcoded UUID if explicitly set in env and no token exists
  // This prevents using invalid UUIDs when we have authentication
  if (!token) {
    console.warn("No auth token found. Cannot fetch user ID from server.");
    const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
    if (isDevelopment && process.env.NEXT_PUBLIC_DEV_USER_ID) {
      const devUuid = process.env.NEXT_PUBLIC_DEV_USER_ID;
      if (devUuid && devUuid.includes('-')) {
        console.warn("DEVELOPMENT: Using env UUID:", devUuid);
        localStorage.setItem("user_uuid", devUuid);
        return devUuid;
      }
    }
  }

  console.error("No user UUID available. User might not be logged in or user ID not found in database.");
  return null;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  background_color: string;
  workspace_id: string;
  created_by: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
  comment_count: number;
  title?: string;
  color?: string;
  background?: string;
  privacy?: "private" | "workspace" | "public";
  lists?: any[];
}

export interface CreateBoardData {
  name: string;
  description?: string;
  background_color?: string;
  workspace_id: string;
}

export interface UpdateBoardData {
  name?: string;
  description?: string;
  background_color?: string;
}

export const boardsAPI = {
  async getWorkspaceBoards(workspaceId: string): Promise<Board[]> {
    try {
      const res = await fetch(
        `${API_BASE_URL}/projects/?workspace_id=${workspaceId}`,
        { headers: getHeaders() }
      );

      if (res.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_uuid");
        throw new Error("Session expired. Please login again.");
      }

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to load boards");
      }

      const boards = await res.json();
      return boards.map((board: any) => ({
        ...board,
        title: board.name,
        color: board.background_color,
        background: board.background_color,
        privacy: "workspace",
        lists: [],
      }));
    } catch (error) {
      console.error("Error fetching boards:", error);
      throw error;
    }
  },

  async getBoard(boardId: string): Promise<Board> {
    try {
      const res = await fetch(`${API_BASE_URL}/projects/${boardId}`, {
        headers: getHeaders(),
      });

      if (res.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_uuid");
        throw new Error("Session expired");
      }

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to load board");
      }

      const board = await res.json();
      return {
        ...board,
        title: board.name,
        color: board.background_color,
        background: board.background_color,
        privacy: "workspace",
        lists: [],
      };
    } catch (error) {
      console.error("Error fetching board:", error);
      throw error;
    }
  },

  async createBoard(data: CreateBoardData): Promise<Board> {
    try {
      // Get user ID - now async
      const userId = await getUserId();

      if (!userId) {
        // Debug what's available
        console.error("Authentication Error Details:");
        console.log("user in localStorage:", localStorage.getItem("user"));
        console.log("auth_token exists:", !!localStorage.getItem("auth_token"));
        console.log("user_uuid exists:", !!localStorage.getItem("user_uuid"));

        throw new Error("Please login to create a board. No user ID found.");
      }

      console.log("Creating board with User ID:", userId);
      console.log("Board data:", data);
      console.log("Full request URL:", `${API_BASE_URL}/projects/?user_id=${userId}`);

      const res = await fetch(
        `${API_BASE_URL}/projects/?user_id=${userId}`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            name: data.name,
            description: data.description || "",
            background_color: data.background_color || "#0079bf",
            workspace_id: data.workspace_id,
          }),
        }
      );

      console.log("Response status:", res.status);

      if (res.status === 401) {
        // Clear auth data on 401
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_uuid");
        localStorage.removeItem("user");
        throw new Error("Session expired. Please login again.");
      }

      if (!res.ok) {
        let errorText = "Failed to create board";
        try {
          errorText = await res.text();
          console.error("API error response body:", errorText);

          // Handle specific error messages
          if (errorText.includes("User not found") || errorText.includes('"detail":"User not found"')) {
            // Clear cached UUID if it's invalid
            console.error("❌ Invalid user UUID detected. Clearing cache...");
            localStorage.removeItem("user_uuid");
            localStorage.removeItem("user");
            // Try to get fresh user ID from server
            const freshUserId = await fetchUserUuidFromServer();
            if (freshUserId) {
              console.log("✅ Got fresh user ID, retrying request...");
              // Retry the request with fresh user ID
              const retryRes = await fetch(
                `${API_BASE_URL}/projects/?user_id=${freshUserId}`,
                {
                  method: "POST",
                  headers: getHeaders(),
                  body: JSON.stringify({
                    name: data.name,
                    description: data.description || "",
                    background_color: data.background_color || "#0079bf",
                    workspace_id: data.workspace_id,
                  }),
                }
              );

              if (retryRes.ok) {
                const board = await retryRes.json();
                console.log("✅ Board created successfully after retry:", board);
                return {
                  ...board,
                  title: board.name,
                  color: board.background_color,
                  background: board.background_color,
                  privacy: "workspace",
                  lists: [],
                };
              }
            }
            errorText = "User not found in database. Please logout and login again to refresh your session.";
          } else if (errorText.includes("workspace_id")) {
            errorText = "Invalid workspace. Please refresh the page.";
          }
        } catch (e) {
          console.error("Could not read error response:", e);
          errorText = `HTTP ${res.status}: ${res.statusText}`;
        }
        throw new Error(errorText);
      }

      const board = await res.json();
      console.log("✅ Board created successfully:", board);

      return {
        ...board,
        title: board.name,
        color: board.background_color,
        background: board.background_color,
        privacy: "workspace",
        lists: [],
      };
    } catch (error: any) {
      console.error("❌ Error creating board:", error);

      // Enhanced error messages
      if (error.message.includes("Failed to fetch")) {
        throw new Error(
          `Cannot connect to server at ${API_BASE_URL}. Make sure backend is running.`
        );
      }

      if (error.message.includes("NetworkError")) {
        throw new Error(
          "Network error. Check your internet connection and make sure CORS is configured on the backend."
        );
      }

      // Re-throw the error with the original message
      throw error;
    }
  },

  async updateBoard(boardId: string, data: UpdateBoardData): Promise<Board> {
    try {
      const userId = await getUserId();
      if (!userId) {
        throw new Error("User not authenticated. Please login.");
      }

      const res = await fetch(
        `${API_BASE_URL}/projects/${boardId}?user_id=${userId}`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify(data),
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_uuid");
        throw new Error("Session expired");
      }

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to update board");
      }

      const board = await res.json();
      return {
        ...board,
        title: board.name,
        color: board.background_color,
        background: board.background_color,
        privacy: "workspace",
        lists: [],
      };
    } catch (error) {
      console.error("Error updating board:", error);
      throw error;
    }
  },

  async deleteBoard(boardId: string): Promise<void> {
    try {
      const userId = await getUserId();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const res = await fetch(
        `${API_BASE_URL}/projects/${boardId}?user_id=${userId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_uuid");
        throw new Error("Session expired");
      }

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to delete board");
      }
    } catch (error) {
      console.error("Error deleting board:", error);
      throw error;
    }
  },

  async archiveBoard(boardId: string): Promise<Board> {
    try {
      const userId = await getUserId();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const res = await fetch(
        `${API_BASE_URL}/projects/${boardId}/archive?user_id=${userId}`,
        {
          method: "PUT",
          headers: getHeaders(),
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_uuid");
        throw new Error("Session expired");
      }

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to archive board");
      }

      const board = await res.json();
      return {
        ...board,
        title: board.name,
        color: board.background_color,
        background: board.background_color,
        privacy: "workspace",
        lists: [],
      };
    } catch (error) {
      console.error("Error archiving board:", error);
      throw error;
    }
  },

  // Clear cached user UUID (useful on logout)
  clearCachedUserUuid(): void {
    localStorage.removeItem("user_uuid");
  },

  // Manually set user UUID (useful after login)
  setCachedUserUuid(uuid: string): void {
    if (uuid && uuid.includes('-')) {
      localStorage.setItem("user_uuid", uuid);
    }
  }
};
