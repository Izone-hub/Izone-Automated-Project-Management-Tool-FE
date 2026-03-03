// components/board/List/AddListButton.tsx
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddListButtonProps {
  onAddList: (title: string) => Promise<void>;
}

export const AddListButton: React.FC<AddListButtonProps> = ({ onAddList }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddList(title.trim());
      setTitle('');
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add list:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="min-w-72 bg-secondary hover:bg-muted rounded-lg p-4 h-fit flex items-center gap-2 text-muted-foreground flex-shrink-0"
      >
        <Plus className="w-5 h-5" />
        Add another list
      </button>
    );
  }

  return (
    <div className="min-w-72 bg-card rounded-lg shadow-sm p-4 h-fit flex-shrink-0 border border-border">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter list title..."
          className="w-full px-3 py-2 border border-input rounded mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-background text-foreground"
          autoFocus
          disabled={isSubmitting}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add list'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setTitle('');
            }}
            disabled={isSubmitting}
            className="px-3 py-2 bg-secondary text-secondary-foreground rounded text-sm hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};