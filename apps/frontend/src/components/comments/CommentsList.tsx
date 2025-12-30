// components/comments/CommentsList.tsx
'use client';

import { useComments } from "@/hooks/useComments";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { MessageSquare, Loader2 } from "lucide-react";

interface CommentsListProps {
  cardId: string;
}

export default function CommentsList({ cardId }: CommentsListProps) {
  const { comments, loading, error, addComment, editComment, removeComment } = useComments(cardId);

  const handleAddComment = async (content: string) => {
    try {
      await addComment(content);
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleEditComment = async (id: string, content: string) => {
    try {
      await editComment(id, content);
    } catch (err) {
      console.error("Failed to edit comment:", err);
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await removeComment(id);
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        <span>Activity</span>
        {comments.length > 0 && (
          <span className="text-xs text-gray-400">({comments.length})</span>
        )}
      </h3>

      {/* Add Comment */}
      <CommentForm onSubmit={handleAddComment} />

      {/* Error state */}
      {error && (
        <div className="mt-3 p-2 bg-red-50 text-red-600 text-sm rounded">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-2 mt-4 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading comments...</span>
        </div>
      )}

      {/* List comments */}
      <div className="mt-2 divide-y">
        {comments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
          />
        ))}
        {comments.length === 0 && !loading && (
          <p className="text-gray-400 text-sm py-4 text-center">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}
