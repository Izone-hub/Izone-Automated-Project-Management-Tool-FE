// components/card/CardModal.tsx
'use client';

import { Card } from "@/lib/types";
import { useBoardStore } from "@/store/boardStore";
import { useState } from "react";
import { 
  X, Users, Paperclip, MessageSquare, 
  CheckSquare, Tag, Eye, EyeOff, Calendar,
  Send, Image as ImageIcon, FileText, Link
} from "lucide-react";

interface CardModalProps {
  boardId: string;
  listId: string;
  card: Card;
  onClose: () => void;
}

export default function CardModal({ boardId, listId, card, onClose }: CardModalProps) {
  if (!card) {
    onClose();
    return null;
  }

  const updateCard = useBoardStore((state) => state.updateCard);
  const [title, setTitle] = useState(card.title || '');
  const [description, setDescription] = useState(card.description || '');
  const [newComment, setNewComment] = useState('');
  const [newChecklistTitle, setNewChecklistTitle] = useState('');

  const comments = card.comments || [];
  const attachments = card.attachments || [];
  const checklists = card.checklists || [];

  const handleSave = () => {
    updateCard(boardId, listId, card.id, {
      title,
      description: description || undefined
    });
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

  const addChecklist = () => {
    if (!newChecklistTitle.trim()) return;
    
    const newChecklist = {
      id: Date.now().toString(),
      title: newChecklistTitle.trim(),
      items: [],
      position: checklists.length
    };
    
    updateCard(boardId, listId, card.id, {
      checklists: [...checklists, newChecklist]
    });
    setNewChecklistTitle('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold w-full border-none focus:outline-none resize-none bg-transparent"
                rows={1}
                onBlur={handleSave}
              />
              <p className="text-sm text-gray-500 mt-1">
                in list <span className="font-medium">List Name</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description
              </h3>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a more detailed description..."
                className="w-full p-3 border rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                onBlur={handleSave}
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Attachments
              </h3>
              <div className="space-y-2">
                {attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center gap-3 p-2 border rounded">
                    {attachment.type === 'image' ? (
                      <ImageIcon className="w-5 h-5 text-blue-500" />
                    ) : attachment.type === 'link' ? (
                      <Link className="w-5 h-5 text-green-500" />
                    ) : (
                      <FileText className="w-5 h-5 text-gray-500" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{attachment.name}</p>
                      <p className="text-xs text-gray-500">
                        Added {new Date(attachment.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                  + Add an attachment
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Comments
              </h3>
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {comment.userName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.userName}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1">{comment.text}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    Y
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                    <button
                      onClick={addComment}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Add to card</h3>
            
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg">
              <Users className="w-5 h-5 text-gray-500" />
              <span>Members</span>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg">
              <Tag className="w-5 h-5 text-gray-500" />
              <span>Labels</span>
            </button>
            
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Checklist
              </h4>
              <input
                type="text"
                value={newChecklistTitle}
                onChange={(e) => setNewChecklistTitle(e.target.value)}
                placeholder="Add checklist..."
                className="w-full p-2 border rounded mb-2"
                onKeyDown={(e) => e.key === 'Enter' && addChecklist()}
              />
              <button
                onClick={addChecklist}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
              >
                Add
              </button>
              
              {checklists.map(checklist => (
                <div key={checklist.id} className="mt-3 p-2 border rounded">
                  <p className="font-medium">{checklist.title}</p>
                  <p className="text-sm text-gray-500">
                    {checklist.items.filter(i => i.completed).length}/{checklist.items.length}
                  </p>
                </div>
              ))}
            </div>
            
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span>Due Date</span>
            </button>
            
            <button
              onClick={toggleWatch}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg"
            >
              {card.isWatched ? (
                <EyeOff className="w-5 h-5 text-red-500" />
              ) : (
                <Eye className="w-5 h-5 text-gray-500" />
              )}
              <span>{card.isWatched ? 'Unwatch' : 'Watch'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}