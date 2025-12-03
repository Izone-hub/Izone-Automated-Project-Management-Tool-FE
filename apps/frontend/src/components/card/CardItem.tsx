// components/card/CardItem.tsx
'use client';

import { Card } from "@/lib/types";
import { useBoardStore } from "@/store/boardStore";

export const CardItem = ({ 
  boardId, 
  listId, 
  card 
}: { 
  boardId: string; 
  listId: string; 
  card: Card 
}) => {
  if (!card) {
    console.error("CardItem received null/undefined card");
    return null;
  }

  const removeCard = useBoardStore((state) => state.removeCard);

  const handleDelete = () => {
    if (confirm(`Delete card "${card.title}"?`)) {
      removeCard(boardId, listId, card.id);
    }
  };

  return (
    <div className="p-3 bg-white border rounded shadow-sm hover:shadow cursor-pointer">
      <div className="flex justify-between items-start">
        <p className="font-medium">{card.title}</p>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 text-sm"
        >
          ×
        </button>
      </div>
      {card.description && (
        <p className="text-sm text-gray-600 mt-1">{card.description}</p>
      )}
    </div>
  );
};