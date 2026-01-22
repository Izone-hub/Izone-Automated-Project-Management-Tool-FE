// lib/api/cards.ts
const API_BASE_URL = "/api/backend";

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

export interface Card {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  position: number;
  list_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCardData {
  title: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  position?: number;
}

export interface UpdateCardData {
  title?: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  position?: number;
}

const ensureStringId = (id: any): string => {
  if (!id) return '';
  return typeof id === 'object' ? id.id : String(id);
};

export const cardsAPI = {
  // Get all cards for a list
  async getListCards(listId: string): Promise<Card[]> {
    console.log('Fetching cards for list:', listId);
    try {
      const res = await fetch(
        `${API_BASE_URL}/lists/${listId}/cards/`,
        { headers: headers() }
      );

      if (res.status === 401) {
        localStorage.removeItem("auth_token");
        throw new Error("Session expired. Please login again.");
      }

      if (!res.ok) {
        throw new Error(`Failed to load cards: ${res.statusText}`);
      }

      const cards = await res.json();
      return cards.map((c: any) => ({
        ...c,
        id: ensureStringId(c.id),
        list_id: ensureStringId(c.list_id),
        created_by: ensureStringId(c.created_by)
      }));
    } catch (error) {
      console.error("Error fetching cards:", error);
      throw error;
    }
  },

  // Create a new card
  async createCard(listId: string, data: CreateCardData): Promise<Card> {
    try {
      const res = await fetch(
        `${API_BASE_URL}/lists/${listId}/cards/`,
        {
          method: "POST",
          headers: headers(),
          body: JSON.stringify(data),
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("auth_token");
        throw new Error("Session expired. Please login again.");
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to create card: ${res.statusText}`);
      }

      const c = await res.json();
      return {
        ...c,
        id: ensureStringId(c.id),
        list_id: ensureStringId(c.list_id),
        created_by: ensureStringId(c.created_by)
      };
    } catch (error) {
      console.error("Error creating card:", error);
      throw error;
    }
  },

  // Update a card
  async updateCard(listId: string, cardId: string, data: UpdateCardData): Promise<Card> {
    try {
      console.log('Updating card:', cardId, 'in list:', listId, 'with data:', data);

      const updateData = { ...data };
      if (updateData.due_date === "") {
        delete updateData.due_date;
      }

      const res = await fetch(
        `${API_BASE_URL}/lists/${listId}/cards/${cardId}`,
        {
          method: "PUT",
          headers: headers(),
          body: JSON.stringify(updateData),
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("auth_token");
        throw new Error("Session expired. Please login again.");
      }

      if (!res.ok) {
        const text = await res.text();
        console.error('Update card error response:', text);
        try {
          const errorDetail = JSON.parse(text);
          if (errorDetail.detail && Array.isArray(errorDetail.detail)) {
            const messages = errorDetail.detail.map((d: any) => d.msg).join(', ');
            throw new Error(messages);
          }
        } catch (e) {
          // not json or other parse error
        }
        throw new Error(text || `Failed to update card: ${res.statusText}`);
      }

      const c = await res.json();
      return {
        ...c,
        id: ensureStringId(c.id),
        list_id: ensureStringId(c.list_id),
        created_by: ensureStringId(c.created_by)
      };
    } catch (error) {
      console.error("Error updating card:", error);
      throw error;
    }
  },

  // Delete a card
  async deleteCard(listId: string, cardId: string): Promise<void> {
    try {
      const res = await fetch(
        `${API_BASE_URL}/lists/${listId}/cards/${cardId}`,
        {
          method: "DELETE",
          headers: headers(),
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("auth_token");
        throw new Error("Session expired. Please login again.");
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to delete card: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting card:", error);
      throw error;
    }
  },
};