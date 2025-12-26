// components/board/List/AddCardForm.tsx
'use client';

import { useState } from 'react';

interface AddCardFormProps {
  onAddCard: (title: string) => Promise<void>;
  onCancel: () => void;
}

export const AddCardForm: React.FC<AddCardFormProps> = ({
  onAddCard,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onAddCard(title.trim());
      setTitle('');
    } catch (error) {
      console.error('Failed to add card:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a title for this card..."
        className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        rows={3}
        autoFocus
        disabled={isSubmitting}
      />
      
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Adding...' : 'Add card'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};