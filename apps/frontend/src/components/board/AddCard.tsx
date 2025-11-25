'use client';

import { useState, useEffect, useRef } from 'react';

interface AddCardProps {
  listId: string;
  onCreateCard: (listId: string, title: string) => Promise<boolean>;
  onCardCreated?: () => void;
  onClose?: () => void;
  autoOpen?: boolean;
  focusOnMount?: boolean;
}

export function AddCard({ 
  listId, 
  onCreateCard, 
  onCardCreated, 
  onClose, 
  autoOpen = false,
  focusOnMount = false 
}: AddCardProps) {
  const [isAdding, setIsAdding] = useState(autoOpen);
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isAdding && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isAdding]);

  useEffect(() => {
    if (autoOpen) {
      setIsAdding(true);
    }
  }, [autoOpen]);

  useEffect(() => {
    if (focusOnMount && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [focusOnMount]);

  const handleSubmit = async () => {
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const success = await onCreateCard(listId, title.trim());
      if (success) {
        setTitle('');
        onCardCreated?.();
        // Keep the form open for next card (Trello behavior)
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }
    } catch (error) {
      console.error('Failed to create card:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setTitle('');
      onClose?.();
    }
  };

  const handleClose = () => {
    setIsAdding(false);
    setTitle('');
    onClose?.();
  };

  if (isAdding) {
    return (
      <div className="space-y-2">
        <textarea
          ref={textareaRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a title for this card..."
          className="w-full p-2 border border-gray-300 rounded shadow-sm resize-none focus:outline-none focus:border-blue-500 text-sm"
          rows={3}
          disabled={isSubmitting}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || isSubmitting}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Adding...' : 'Add Card'}
          </button>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-xs text-gray-500">
          Press Enter to save, Shift+Enter for new line, Escape to cancel
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="w-full text-left text-gray-600 hover:bg-gray-300 p-2 rounded flex items-center gap-2 transition-colors text-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Add a card
    </button>
  );
}



