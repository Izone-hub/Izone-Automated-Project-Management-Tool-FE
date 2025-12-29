'use client';

import { Card } from "@/lib/types";
import { useBoardStore } from "@/store/boardStore";
import { useState, useEffect } from "react";
import {
  X, Clock, Users, Paperclip, MessageSquare,
  CheckSquare, Tag, Eye, EyeOff, Calendar,
  Send, Image as ImageIcon, FileText, Link,
  AlignLeft, Activity, Archive, Share2, Copy, Trash2,
  AlertCircle
} from "lucide-react";

interface CardModalProps {
  boardId: string;
  listId: string;
  card: Card;
  onClose: () => void;
}

const priorityColors = {
  low: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  high: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  urgent: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
};

export default function CardModal({ boardId, listId, card, onClose }: CardModalProps) {
  // Add null check
  if (!card) {
    onClose();
    return null;
  }

  const updateCard = useBoardStore((state) => state.updateCard);
  const removeCard = useBoardStore((state) => state.removeCard);
  const board = useBoardStore((state) => state.boards.find(b => b.id === boardId));
  const list = board?.lists?.find(l => l.id === listId);

  const [title, setTitle] = useState(card.title || '');
  const [description, setDescription] = useState(card.description || '');
  const [newComment, setNewComment] = useState('');
  const [priority, setPriority] = useState(card.priority || 'medium');
  const [dueDate, setDueDate] = useState(card.due_date ? card.due_date.split('T')[0] : '');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Ensure arrays exist
  const comments = card.comments || [];
  const attachments = card.attachments || [];
  const checklists = card.checklists || [];
  const labels = card.labels || [];

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSaveTitle = () => {
    if (title.trim() && title !== card.title) {
      updateCard(boardId, listId, card.id, { title: title.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    if (description !== card.description) {
      updateCard(boardId, listId, card.id, { description: description || undefined });
    }
    setIsEditingDescription(false);
  };

  const handlePriorityChange = (newPriority: 'low' | 'medium' | 'high' | 'urgent') => {
    setPriority(newPriority);
    updateCard(boardId, listId, card.id, { priority: newPriority });
    setShowPriorityMenu(false);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDueDate(value);
    updateCard(boardId, listId, card.id, {
      due_date: value ? new Date(value).toISOString() : undefined
    });
  };

  const handleDelete = () => {
    removeCard(boardId, listId, card.id);
    onClose();
  };

  const toggleWatch = () => {
    updateCard(boardId, listId, card.id, {
      isWatched: !card.isWatched
    });
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: Date.now().toString(),
      text: newComment.trim(),
      userId: 'user1',
      userName: 'You',
      userAvatar: '',
      createdAt: new Date().toISOString()
    };

    updateCard(boardId, listId, card.id, {
      comments: [...comments, newCommentObj]
    });
    setNewComment('');
  };

  const formatDate = (dateString: string) => {
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
                <h2
                  className="text-xl font-semibold text-gray-900 cursor-pointer hover:bg-gray-200 px-2 py-1 rounded -mx-2"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {title}
                </h2>
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
              <label className="w-full flex items-center gap-3 px-3 py-2 text-left bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-700 cursor-pointer transition-colors">
                <Calendar className="w-4 h-4" />
                <span>Due Date</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={handleDueDateChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
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
              {showDeleteConfirm ? (
                <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700 mb-2">Delete this card?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left bg-red-100 hover:bg-red-200 rounded-lg text-sm font-medium text-red-700 transition-colors mt-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              )}
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
