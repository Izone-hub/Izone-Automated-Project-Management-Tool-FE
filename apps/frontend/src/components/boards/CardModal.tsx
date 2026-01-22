import { useState, useEffect } from "react";
import { X, FileText, Pencil, Clock, AlignLeft, Activity, Send, Users, Tag, CheckSquare, Calendar, AlertCircle, Paperclip, Eye, EyeOff, Copy, Trash2, Archive } from "lucide-react";
import { getComments, createComment, Comment } from "@/lib/api/comments";
import { type Card } from "@/lib/api/cards";
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
} from "@/components/ui/alert-dialog";

interface CardModalProps {
  card: Card;
  list?: { title: string };
  boardId: string;
  listId: string;
  onClose: () => void;
  updateCard: (boardId: string, listId: string, cardId: string, updates: any) => Promise<void>;
}

const priorityColors = {
  low: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  high: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  urgent: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
};

export default function CardModal({
  card,
  list,
  boardId,
  listId,
  onClose,
  updateCard
}: CardModalProps) {
  // State definitions that were missing or placeholder
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(card.description || "");
  const [newComment, setNewComment] = useState("");
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">(card.priority || "medium");
  const [dueDate, setDueDate] = useState(card.due_date ? new Date(card.due_date).toISOString().split('T')[0] : "");

  const handleSaveTitle = async () => {
    if (title !== card.title) {
      await updateCard(boardId, listId, card.id, { title });
    }
    setIsEditingTitle(false);
  };

  const handleSaveDescription = async () => {
    if (description !== card.description) {
      await updateCard(boardId, listId, card.id, { description });
    }
    setIsEditingDescription(false);
  };

  const handlePriorityChange = async (newPriority: "low" | "medium" | "high" | "urgent") => {
    setPriority(newPriority);
    setShowPriorityMenu(false);
    await updateCard(boardId, listId, card.id, { priority: newPriority });
  };

  const handleDueDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDueDate(val);
    await updateCard(boardId, listId, card.id, { due_date: val ? new Date(val).toISOString() : null });
  };

  const toggleWatch = async () => {
    // Implement watch toggle if API supports it
  };

  const handleDelete = async () => {
    // Implement delete logic
    await updateCard(boardId, listId, card.id, { _delete: true });
    onClose();
  };


  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // ... existing states ...

  // Ensure arrays exist (removed comments from here)
  const attachments = card.attachments || [];
  const checklists = card.checklists || [];
  const labels = card.labels || [];

  // Fetch comments on mount
  useEffect(() => {
    if (card?.id) {
      setLoadingComments(true);
      getComments(card.id)
        .then((data) => {
          setComments(data);
        })
        .catch((err) => console.error("Failed to load comments", err))
        .finally(() => setLoadingComments(false));
    }
  }, [card?.id]);

  // ...

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      const savedComment = await createComment(card.id, newComment.trim());
      setComments((prev) => [...prev, savedComment]);
      setNewComment('');
    } catch (error) {
      console.error("Failed to add comment:", error);
      // Optional: show user feedback
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const isDueSoon = () => {
    if (!card.due_date) return false;
    const dueDate = new Date(card.due_date);
    const today = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  };

  const isOverdue = () => {
    if (!card.due_date) return false;
    return new Date(card.due_date) < new Date();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-start justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-100 rounded-xl shadow-2xl max-w-3xl w-full my-12 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover Image Area (placeholder for future cover images) */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl" />

        {/* Modal Header */}
        <div className="p-4 pb-2">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl font-semibold w-full px-2 py-1 border-2 border-blue-500 rounded resize-none bg-white focus:outline-none"
                  rows={1}
                  autoFocus
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSaveTitle()}
                />
              ) : (
                <div
                  className="group/title flex items-center gap-2 cursor-pointer hover:bg-gray-200 px-2 py-1 rounded -mx-2 transition-colors"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <h2 className="text-xl font-semibold text-gray-900">
                    {title}
                  </h2>
                  <Pencil className="w-4 h-4 text-gray-400 opacity-0 group-hover/title:opacity-100 transition-opacity" />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1 px-2">
                in list <span className="font-medium text-gray-700 underline cursor-pointer hover:text-blue-600">{list?.title || 'Unknown'}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Labels & Priority Row */}
        {(labels.length > 0 || priority) && (
          <div className="px-6 py-2 flex items-center gap-2 flex-wrap">
            {labels.map((label, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
              >
                {label}
              </span>
            ))}
            {priority && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[priority].bg} ${priorityColors[priority].text}`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
              </span>
            )}
            {card.due_date && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${isOverdue()
                ? 'bg-red-100 text-red-700'
                : isDueSoon()
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-600'
                }`}>
                <Clock className="w-3 h-3" />
                {formatDate(card.due_date)}
              </span>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Column - Main Content (3/4) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Description */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <AlignLeft className="w-4 h-4" />
                Description
              </h3>
              {isEditingDescription ? (
                <div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a more detailed description..."
                    className="w-full p-3 border-2 border-blue-500 rounded-lg min-h-[120px] focus:outline-none resize-none"
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleSaveDescription}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setDescription(card.description || '');
                        setIsEditingDescription(false);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingDescription(true)}
                  className={`min-h-[60px] p-3 rounded-lg cursor-pointer transition-colors ${description
                    ? 'bg-gray-50 hover:bg-gray-100'
                    : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                  {description ? (
                    <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
                  ) : (
                    <p className="text-gray-400">Add a more detailed description...</p>
                  )}
                </div>
              )}
            </div>

            {/* Activity / Comments */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Activity
              </h3>

              {/* Comment Input */}
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  Y
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                  />
                  {newComment.trim() && (
                    <button
                      onClick={addComment}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Save
                    </button>
                  )}
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
                      {comment.userName?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{comment.userName}</span>
                        <span className="text-xs text-gray-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar Actions (1/4) */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">Add to card</p>

            {/* Members */}
            <button className="w-full flex items-center gap-3 px-3 py-2 text-left bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors">
              <Users className="w-4 h-4" />
              <span>Members</span>
            </button>

            {/* Labels */}
            <button className="w-full flex items-center gap-3 px-3 py-2 text-left bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors">
              <Tag className="w-4 h-4" />
              <span>Labels</span>
            </button>

            {/* Checklist */}
            <button className="w-full flex items-center gap-3 px-3 py-2 text-left bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors">
              <CheckSquare className="w-4 h-4" />
              <span>Checklist</span>
            </button>

            {/* Due Date */}
            <div className="relative">
              <div className="w-full bg-gray-200 hover:bg-gray-300 rounded-lg overflow-hidden transition-colors">
                <label className="flex items-center gap-3 px-3 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer">
                  <Calendar className="w-4 h-4" />
                  <span>Due Date</span>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={handleDueDateChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                </label>

                {/* Days Calculator */}
                <div className="px-3 pb-2 flex items-center gap-2 border-t border-gray-300 pt-1 pointer-events-auto relative z-20">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Or in</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="#"
                    className="w-10 px-1 py-0.5 text-xs border rounded bg-white text-center focus:ring-1 focus:ring-blue-500 outline-none"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      const days = parseInt(e.target.value);
                      if (!isNaN(days) && days > 0) {
                        const date = new Date();
                        date.setDate(date.getDate() + days); // Properly adds days, handling month rollovers

                        // Format to YYYY-MM-DD for input[type="date"]
                        const yyyy = date.getFullYear();
                        const mm = String(date.getMonth() + 1).padStart(2, '0');
                        const dd = String(date.getDate()).padStart(2, '0');
                        const dateStr = `${yyyy}-${mm}-${dd}`;

                        setDueDate(dateStr);
                        // Also trigger the update immediately
                        updateCard(boardId, listId, card.id, {
                          due_date: new Date(dateStr).toISOString()
                        });
                      }
                    }}
                  />
                  <span className="text-xs text-gray-500">days</span>
                </div>
              </div>
            </div>

            {/* Priority */}
            <div className="relative">
              <button
                onClick={() => setShowPriorityMenu(!showPriorityMenu)}
                className="w-full flex items-center gap-3 px-3 py-2 text-left bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Priority</span>
              </button>
              {showPriorityMenu && (
                <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border z-10 overflow-hidden">
                  {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePriorityChange(p)}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 ${priority === p ? 'bg-blue-50' : ''}`}
                    >
                      <span className={`w-3 h-3 rounded-full ${priorityColors[p].bg} ${priorityColors[p].border} border`} />
                      <span className="capitalize">{p}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Attachment */}
            <button className="w-full flex items-center gap-3 px-3 py-2 text-left bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors">
              <Paperclip className="w-4 h-4" />
              <span>Attachment</span>
            </button>

            <div className="border-t pt-3 mt-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1 mb-3">Actions</p>

              {/* Watch */}
              <button
                onClick={toggleWatch}
                className="w-full flex items-center gap-3 px-3 py-2 text-left bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                {card.isWatched ? (
                  <EyeOff className="w-4 h-4 text-blue-500" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span>{card.isWatched ? 'Watching' : 'Watch'}</span>
              </button>

              {/* Copy */}
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors mt-2">
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>

              {/* Archive */}
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors mt-2">
                <Archive className="w-4 h-4" />
                <span>Archive</span>
              </button>

              {/* Delete */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="w-full flex items-center gap-3 px-3 py-2 text-left bg-red-100 hover:bg-red-200 rounded-lg text-sm font-medium text-red-700 transition-colors mt-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this card
                      and remove its data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        {/* Footer with timestamps */}
        <div className="px-6 py-3 border-t bg-gray-50 rounded-b-xl text-xs text-gray-400 flex justify-between">
          <span>Created {card.created_at ? formatDate(card.created_at) : 'recently'}</span>
          <span>Updated {card.updated_at ? formatDate(card.updated_at) : 'recently'}</span>
        </div>
      </div>
    </div>
  );
}
