"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CommentFormProps {
  onSubmit: (content: string) => void
  initialContent?: string
  onCancel?: () => void
  isSubmitting?: boolean
}

export default function CommentForm({
  onSubmit,
  initialContent = "",
  onCancel,
  isSubmitting = false,
}: CommentFormProps) {
  const [content, setContent] = useState(initialContent)

  useEffect(() => {
    setContent(initialContent)
  }, [initialContent])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isSubmitting) return

    try {
      await onSubmit(content.trim())
      if (!initialContent) {
        setContent("")
      }
    } catch (error) {
      console.error("[v0] Error submitting comment:", error)
    }
  }

  const isEditing = !!initialContent

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-3">
        {!isEditing && (
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
            U
          </div>
        )}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm bg-white text-gray-900"
            rows={isEditing ? 2 : 2}
            disabled={isSubmitting}
          />
          {(content.trim() || isEditing) && (
            <div className="flex gap-2 mt-2">
              <Button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm transition-colors"
                  variant="ghost"
                >
                  Cancel
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
