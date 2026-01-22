"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MoreVertical, Trash2, Edit2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: Date
}

interface Activity {
  id: string
  author: string
  avatar: string
  action: string
  timestamp: Date
}

export function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Mahder Mekdes",
      avatar: "MM",
      content: "good",
      timestamp: new Date(Date.now() - 5 * 60000),
    },
  ])

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      author: "Mahder Mekdes",
      avatar: "MM",
      action: "added this card to To Do",
      timestamp: new Date(Date.now() - 60 * 60000),
    },
  ])

  const [newComment, setNewComment] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now().toString(),
          author: "You",
          avatar: "Y",
          content: newComment,
          timestamp: new Date(),
        },
      ])
      setNewComment("")
    }
  }

  const handleDeleteComment = (id: string) => {
    setComments(comments.filter((c) => c.id !== id))
  }

  const handleEditComment = (id: string, content: string) => {
    setEditingId(id)
    setEditContent(content)
  }

  const handleSaveEdit = (id: string) => {
    setComments(comments.map((c) => (c.id === id ? { ...c, content: editContent } : c)))
    setEditingId(null)
    setEditContent("")
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded text-sm flex items-center justify-center bg-primary text-primary-foreground">
          💬
        </div>
        <h2 className="text-lg font-semibold text-foreground">Comments and activity</h2>
      </div>

      {/* Comment Input */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 mt-1">
            <AvatarFallback className="bg-primary text-primary-foreground">Y</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-20 resize-none"
            />
            {newComment.trim() && (
              <Button
                onClick={handleAddComment}
                className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Save
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-sm">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
                  {comment.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                {editingId === comment.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-16"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSaveEdit(comment.id)}
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Save
                      </Button>
                      <Button onClick={() => setEditingId(null)} size="sm" variant="outline">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm text-foreground">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{formatTime(comment.timestamp)}</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditComment(comment.id, comment.content)}
                            className="cursor-pointer"
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteComment(comment.id)}
                            className="cursor-pointer text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm text-card-foreground mt-1 break-words">{comment.content}</p>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Divider */}
      {activities.length > 0 && <div className="border-t border-border" />}

      {/* Activity Feed */}
      {activities.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Activity</h3>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0 mt-0.5">
                  <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
                    {activity.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-card-foreground">
                    <span className="font-semibold">{activity.author}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                  <span className="text-xs text-muted-foreground">{formatTime(activity.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
