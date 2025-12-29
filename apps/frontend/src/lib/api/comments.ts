// lib/api/comments.ts
const API_BASE_URL = "http://localhost:3000/api/backend";

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

export interface Comment {
  id: string;
  card_id: string;
  content: string;
  author_id: string | null;
  created_at: string;
}

export interface CreateCommentData {
  content: string;
  card_id: string;
}

export interface UpdateCommentData {
  content: string;
}

export const commentsAPI = {
  // Get all comments for a card
  async getComments(cardId: string, skip = 0, limit = 100): Promise<Comment[]> {
    try {
      const res = await fetch(
        `${API_BASE_URL}/cards/${cardId}/comments/?skip=${skip}&limit=${limit}`,
        { headers: headers() }
      );

      if (res.status === 401) {
        console.warn("Unauthenticated comment access");
        return [];
      }

      if (!res.ok) {
        throw new Error(`Failed to load comments: ${res.statusText}`);
      }

      return res.json();
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },

  // Create a new comment
  async createComment(cardId: string, content: string): Promise<Comment> {
    try {
      const res = await fetch(
        `${API_BASE_URL}/cards/${cardId}/comments/`,
        {
          method: "POST",
          headers: headers(),
          body: JSON.stringify({ card_id: cardId, content }),
        }
      );

      if (res.status === 401) {
        throw new Error("You must be logged in to post a comment.");
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to create comment: ${res.statusText}`);
      }

      return res.json();
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  // Update a comment
  async updateComment(cardId: string, commentId: string, content: string): Promise<Comment> {
    try {
      const res = await fetch(
        `${API_BASE_URL}/cards/${cardId}/comments/${commentId}`,
        {
          method: "PATCH",
          headers: headers(),
          body: JSON.stringify({ content }),
        }
      );

      if (res.status === 401) {
        throw new Error("You must be logged in to edit this comment.");
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to update comment: ${res.statusText}`);
      }

      return res.json();
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  },

  // Delete a comment
  async deleteComment(cardId: string, commentId: string): Promise<void> {
    try {
      const res = await fetch(
        `${API_BASE_URL}/cards/${cardId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: headers(),
        }
      );

      if (res.status === 401) {
        throw new Error("You must be logged in to delete this comment.");
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to delete comment: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },
};

// Named exports for backward compatibility
export const getComments = commentsAPI.getComments.bind(commentsAPI);
export const createComment = commentsAPI.createComment.bind(commentsAPI);
export const updateComment = commentsAPI.updateComment.bind(commentsAPI);
export const deleteComment = commentsAPI.deleteComment.bind(commentsAPI);
