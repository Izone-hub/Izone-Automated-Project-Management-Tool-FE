import { useState } from "react";
import { Comment } from "@/types/comment";
import CommentForm from "./CommentForm";
import { Edit2, Trash2, User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CommentItemProps {
  comment: Comment;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export default function CommentItem({ comment, onEdit, onDelete }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex gap-3 py-3">
      {/* Avatar */}
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
        {comment.author_id ? comment.author_id.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <CommentForm
            initialContent={comment.content}
            onSubmit={(content) => {
              onEdit(comment.id, content);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-800 text-sm">
                {comment.author_id || "Anonymous"}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(comment.created_at)}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 group relative">
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>

              {/* Action buttons - appear on hover */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-blue-600"
                  title="Edit"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete comment?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your comment.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(comment.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
