// src/components/boards/ListColumn.tsx
'use client';

import { List } from '@/lib/types';
import { useBoardStore } from '@/store/board.store';
import { MoreVertical, Plus } from 'lucide-react';
import { useState } from 'react';

type Props = {
  list: List;
};

export default function ListColumn({ list }: Props) {
  const cards = useBoardStore((state) => 
    state.cards.filter((card) => card.listId === list.id)
  );
  const { createCard, updateList, deleteList } = useBoardStore();
  
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      createCard(list.id, newCardTitle);
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  return (
    <div className="min-w-64 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
      {/* List Header */}
      <div className="p-3 border-b flex items-center justify-between">
        <input
          type="text"
          value={list.title}
          onChange={(e) => updateList(list.id, { title: e.target.value })}
          className="font-medium bg-transparent focus:outline-none focus:bg-white px-1 rounded"
        />
        <button
          onClick={() => deleteList(list.id)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      
      {/* Cards */}
      <div className="p-2 space-y-2 max-h-[70vh] overflow-y-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            className="p-3 bg-white border rounded shadow-sm hover:shadow cursor-pointer"
          >
            {card.title}
          </div>
        ))}
      </div>
      
      {/* Add Card */}
      <div className="p-2">
        {isAddingCard ? (
          <div className="space-y-2">
            <textarea
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Enter a title for this card..."
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddCard}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Add Card
              </button>
              <button
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle('');
                }}
                className="px-3 py-1.5 text-gray-700 text-sm hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm"
          >
            <Plus className="w-4 h-4" />
            Add a card
          </button>
        )}
      </div>
    </div>
  );
}