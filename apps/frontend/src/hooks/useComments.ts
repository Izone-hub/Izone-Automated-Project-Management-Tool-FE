// hooks/useComments.ts
import { useState, useEffect, useCallback } from "react";
import { Comment } from "@/types/comment";
import { commentsAPI } from "@/lib/api/comments";

export function useComments(cardId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!cardId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await commentsAPI.getComments(cardId);
      setComments(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch comments";
      setError(errorMessage);
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  }, [cardId]);

  const addComment = async (content: string) => {
    try {
      setError(null);
      const newComment = await commentsAPI.createComment(cardId, content);
      setComments((prev) => [...prev, newComment]);
      return newComment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create comment";
      setError(errorMessage);
      throw err;
    }
  };

  const editComment = async (commentId: string, content: string) => {
    try {
      setError(null);
      const updated = await commentsAPI.updateComment(cardId, commentId, content);
      setComments((prev) => prev.map(c => c.id === commentId ? updated : c));
      return updated;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update comment";
      setError(errorMessage);
      throw err;
    }
  };

  const removeComment = async (commentId: string) => {
    try {
      setError(null);
      await commentsAPI.deleteComment(cardId, commentId);
      setComments((prev) => prev.filter(c => c.id !== commentId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete comment";
      setError(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    error,
    fetchComments,
    addComment,
    editComment,
    removeComment
  };
}
