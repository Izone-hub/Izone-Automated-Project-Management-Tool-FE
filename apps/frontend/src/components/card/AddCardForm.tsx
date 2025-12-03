// components/card/AddCardForm.tsx
'use client';

import { useState } from "react";
import { useBoardStore } from "@/store/boardStore";
import { X } from "lucide-react";

export const AddCardForm = ({ 
  boardId, 
  listId,
  onClose 
}: { 
  boardId: string; 
  listId: string;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState("");
  const addCard = useBoardStore((state) => state.addCard);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    // CHANGED: Just pass the string, store will convert to Card object
    addCard(boardId, listId, title.trim());
    setTitle("");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a title for this card..."
        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        rows={2}
        autoFocus
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Add card
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
        >
          <X size={16} />
        </button>
      </div>
    </form>
  );
};






