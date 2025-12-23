

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
console.log("🎯 Cards API - API_BASE_URL:", API_BASE_URL);


function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

function headers(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}


async function fetchUserUuidFromServer(): Promise<string | null> {
  try {
    const token = getToken();
    if (!token) return null;

    const res = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      headers: headers(),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const uuid = data?.id || data?.uuid || data?.user_id || data?.sub;
    if (uuid) localStorage.setItem("user_uuid", uuid);
    return uuid || null;
  } catch {
    return null;
  }
}

async function getUserId(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const cached = localStorage.getItem("user_uuid");
  if (cached) return cached;

  const token = getToken();
  if (token) {
    const uuidFromServer = await fetchUserUuidFromServer();
    if (uuidFromServer) return uuidFromServer;

    // Try decoding JWT
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const jwtUuid = payload?.sub || payload?.user_id || payload?.id;
      if (jwtUuid) {
        localStorage.setItem("user_uuid", jwtUuid);
        return jwtUuid;
      }
    } catch { }
  }

  // Development fallback
  if (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") {
    const devUuid = process.env.NEXT_PUBLIC_DEV_USER_ID || "test-user-id";
    localStorage.setItem("user_uuid", devUuid);
    return devUuid;
  }

  return null;
}




// Re-export types that were deleted in the chunk above
export interface Card {
  id: string;
  project_id: string;
  name: string;
  description: string;
  due_date: string | null;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id: string | null;
  position: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  title?: string;
  list_id?: string;
}

export interface CreateCardData {
  project_id: string;
  name: string;
  description?: string;
  due_date?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id?: string;
  position: number;
}

export interface UpdateCardData {
  name?: string;
  description?: string;
  due_date?: string | null;
  status?: 'todo' | 'in-progress' | 'review' | 'done';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id?: string | null;
  position?: number;
}

export const cardsAPI = {
  async getBoardCards(boardId: string): Promise<Card[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/?project_id=${boardId}`, { headers: headers() });
      if (!res.ok) {
        throw new Error(`Failed to load cards, status: ${res.status}`);
      }
      const cards = await res.json();
      return Array.isArray(cards) ? cards.map(c => ({ ...c, title: c.name })) : [];
    } catch (err) {
      console.error("Error fetching cards:", err);
      // Return empty array instead of mock if fetch fails
      return [];
    }
  },

  async getCard(cardId: string): Promise<Card> {
    const res = await fetch(`${API_BASE_URL}/tasks/${cardId}`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to get card: ${res.status}`);
    const card = await res.json();
    return { ...card, title: card.name };
  },

  async createCard(data: CreateCardData): Promise<Card> {
    const userId = await getUserId();
    if (!userId) throw new Error("User not logged in");

    // Explicitly confirm keys match API schema
    const payload = {
      project_id: data.project_id,
      name: data.name,
      description: data.description || "",
      due_date: data.due_date || null,
      status: data.status,
      priority: data.priority || 'medium',
      assignee_id: data.assignee_id || null,
      position: data.position || 0
    };

    try {
      const res = await fetch(`${API_BASE_URL}/tasks/?user_id=${userId}`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to create card: ${res.status} ${errorText}`);
      }
      const card = await res.json();
      return { ...card, title: card.name };
    } catch (error: any) {
      console.error("❌ Link failure in createCard:", error);
      throw error;
    }
  },

  async updateCard(cardId: string, data: UpdateCardData): Promise<Card> {
    const userId = await getUserId();
    if (!userId) throw new Error("User not logged in");

    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${cardId}?user_id=${userId}`, {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Failed to update card: ${res.status}`);
      }
      const card = await res.json();
      return { ...card, title: card.name };
    } catch (error) {
      console.error("❌ Link failure in updateCard:", error);
      throw error;
    }
  },

  async deleteCard(cardId: string): Promise<void> {
    const userId = await getUserId();
    if (!userId) throw new Error("User not logged in");

    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${cardId}?user_id=${userId}`, {
        method: "DELETE",
        headers: headers(),
      });
      if (!res.ok) {
        throw new Error(`Failed to delete card: ${res.status}`);
      }
    } catch (error) {
      console.error("❌ Link failure in deleteCard:", error);
      throw error;
    }
  },

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      await fetch(`${API_BASE_URL}/`, { method: 'GET', mode: 'no-cors' });
      return { success: true, message: `Backend reachable at ${API_BASE_URL}` };
    } catch {
      return { success: false, message: `Cannot connect to backend at ${API_BASE_URL}` };
    }
  },

  clearCache(): void {
    localStorage.removeItem("user_uuid");
  },
};
