'use client';

import { useState } from 'react';
import { Card as CardType } from '@/types/card';

interface CardModalProps {
  card: CardType;
  isOpen: boolean;
  onClose: () => void;
  onUpdateCard?: (cardId: string, updates: Partial<CardType>) => void;
}

export function CardModal({ card, isOpen, onClose, onUpdateCard }: CardModalProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState(card.dueDate?.toISOString().split('T')[0] || '');

  const handleSave = () => {
    if (onUpdateCard) {
      onUpdateCard(card.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      });
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full text-xl font-semibold text-gray-900 border-none resize-none focus:outline-none focus:ring-0"
                rows={2}
                placeholder="Card title..."
              />
              <p className="text-gray-600 text-sm mt-2">
                in list <span className="underline">List Name</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Description
                </h3>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a more detailed description..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Attachments */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Attachments
                </h3>
                {card.attachments.length === 0 ? (
                  <p className="text-gray-500 text-sm">No attachments yet</p>
                ) : (
                  <div className="space-y-2">
                    {card.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span className="text-sm text-gray-700">{attachment}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-sm">Add to card</h3>
              
              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              {/* Labels */}
              <div>
                <h4 className="font-medium text-gray-700 text-sm mb-2">Labels</h4>
                <div className="space-y-1">
                  {['high-priority', 'design', 'development', 'bug'].map((label) => (
                    <button
                      key={label}
                      onClick={() => {
                        // Toggle label logic
                      }}
                      className={`w-full text-left px-2 py-1 rounded text-xs ${
                        card.labels.includes(label)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}