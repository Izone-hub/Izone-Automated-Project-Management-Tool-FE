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
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-blue-600" />
        <span>Comments and activity</span>
        {comments.length > 0 && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{comments.length}</span>
        )}
      </h3>

      {/* Add Comment Form */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <CommentForm onSubmit={handleAddComment} isSubmitting={isSubmitting} />
      </div>

      {/* Error state */}
      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">{error}</div>}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-2 py-8 justify-center text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading comments...</span>
        </div>
      )}

      {/* Comments List */}
      {!loading && (
        <div className="divide-y divide-gray-200">
          {comments.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">No comments yet. Be the first to comment!</p>
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

