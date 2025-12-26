// components/board/Card/CardModal.tsx
'use client';

import { useState } from 'react';
import { Card as CardType } from '@/types';
import { X, Calendar, Tag, Users, Paperclip, MessageSquare, Save, Clock } from 'lucide-react';

interface CardModalProps {
  card: CardType;
  onUpdate: (data: any) => Promise<void>;
  onClose: () => void;
}

export const CardModal: React.FC<CardModalProps> = ({
  card,
  onUpdate,
  onClose,
}) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState(card.due_date || '');
  const [priority, setPriority] = useState(card.priority);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates: any = {};
      if (title !== card.title) updates.title = title;
      if (description !== card.description) updates.description = description;
      if (dueDate !== card.due_date) updates.due_date = dueDate;
      if (priority !== card.priority) updates.priority = priority;
      
      if (Object.keys(updates).length > 0) {
        await onUpdate(updates);
      }
    } catch (error) {
      console.error('Failed to save card:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this card?')) {
      try {
        await onUpdate({ _delete: true }); // Special flag for delete
        onClose();
      } catch (error) {
        console.error('Failed to delete card:', error);
      }
    }
  };

  const priorityOptions: { value: CardType['priority']; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-purple-100 text-purple-800' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold bg-transparent border-none focus:outline-none w-full"
                placeholder="Card title"
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Created {new Date(card.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>By {card.created_by}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span>Description</span>
              </h3>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a more detailed description..."
                className="w-full p-3 border rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            {/* Comments */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>Comments</span>
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-medium text-blue-600">
                      {card.created_by.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Write a comment..."
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Add to card</h3>
            
            {/* Members */}
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg">
              <Users className="w-5 h-5 text-gray-500" />
              <span>Members</span>
            </button>
            
            {/* Labels */}
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg">
              <Tag className="w-5 h-5 text-gray-500" />
              <span>Labels</span>
            </button>
            
            {/* Due Date */}
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Due Date</span>
              </h4>
              <input
                type="datetime-local"
                value={dueDate ? dueDate.slice(0, 16) : ''}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
            </div>
            
            {/* Priority */}
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Priority</h4>
              <div className="space-y-1">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPriority(option.value)}
                    className={`w-full px-3 py-2 rounded text-left ${priority === option.value ? option.color : 'hover:bg-gray-100'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Attachments */}
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg">
              <Paperclip className="w-5 h-5 text-gray-500" />
              <span>Attachments</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-between">
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Card
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};