"use client"

import React from "react"

import { useComments } from "@/hooks/useComments"
import CommentForm from "./CommentForm"
import CommentItem from "./CommentItem"
import { MessageSquare, Loader2 } from "lucide-react"

interface CommentsListProps {
  cardId: string
}

export default function CommentsList({ cardId }: CommentsListProps) {
  const { comments, loading, error, addComment, editComment, removeComment } = useComments(cardId)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleAddComment = async (content: string) => {
    setIsSubmitting(true)
    try {
      await addComment(content)
    } catch (err) {
      console.error("[v0] Failed to add comment:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditComment = async (id: string, content: string) => {
    try {
      await editComment(id, content)
    } catch (err) {
      console.error("[v0] Failed to edit comment:", err)
    }
  }

  const handleDeleteComment = async (id: string) => {
    try {
      await removeComment(id)
    } catch (err) {
      console.error("[v0] Failed to delete comment:", err)
    }
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      {/* Header */}
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-blue-500" />
        <span>Comments and activity</span>
        {comments.length > 0 && (
          <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full border border-blue-500/20">{comments.length}</span>
        )}
      </h3>

      {/* Add Comment Form */}
      <div className="mb-4 pb-4 border-b border-border">
        <CommentForm onSubmit={handleAddComment} isSubmitting={isSubmitting} />
      </div>

      {/* Error state */}
      {error && <div className="mb-4 p-3 bg-red-500/10 text-red-500 text-sm rounded-lg border border-red-500/20">{error}</div>}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading comments...</span>
        </div>
      )}

      {/* Comments List */}
      {!loading && (
        <div className="divide-y divide-border">
          {comments.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

