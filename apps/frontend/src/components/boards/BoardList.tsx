// src/components/board/BoardList.tsx
'use client';

import { useBoardStore } from '@/store/board.store';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface BoardListProps {
  boardId: string;
}

export default function BoardList({ boardId }: BoardListProps) {
  const lists = useBoardStore((state) => 
    state.lists.filter((list) => list.boardId === boardId)
  );
  const cards = useBoardStore((state) => state.cards);
  const { createList, createCard } = useBoardStore();
  
  const [newListTitle, setNewListTitle] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);

  const handleAddList = () => {
    if (newListTitle.trim()) {
      createList(boardId, newListTitle);
      setNewListTitle('');
      setIsAddingList(false);
    }
  };

  const handleAddCard = (listId: string) => {
    const cardTitle = prompt('Enter card title:');
    if (cardTitle?.trim()) {
      createCard(listId, cardTitle);
    }
  };

  if (lists.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-700 mb-4">No lists yet</h3>
        <button
          onClick={() => setIsAddingList(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 mx-auto"
        >
          <Plus size={16} />
          Create your first list
        </button>
        
        {isAddingList && (
          <div className="mt-4 max-w-md mx-auto">
            <input
              type="text"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
              placeholder="Enter list title (e.g., To Do, Doing, Done)"
              className="w-full px-3 py-2 border rounded mb-2"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddList}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add List
              </button>
              <button
                onClick={() => {
                  setIsAddingList(false);
                  setNewListTitle('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        {lists.map((list) => {
          const listCards = cards.filter(card => card.listId === list.id);
          
          return (
            <div key={list.id} className="min-w-64 bg-gray-50 rounded-lg shadow-sm">
              <div className="p-3 bg-gray-100 rounded-t-lg">
                <h3 className="font-medium text-gray-800">{list.title}</h3>
              </div>
              
              <div className="p-2 space-y-2 min-h-[100px]">
                {listCards.map((card) => (
                  <div
                    key={card.id}
                    className="p-3 bg-white border rounded shadow-sm hover:shadow cursor-pointer"
                  >
                    {card.title}
                  </div>
                ))}
              </div>
              
              <div className="p-2">
                <button
                  onClick={() => handleAddCard(list.id)}
                  className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-200 rounded text-sm"
                >
                  + Add a card
                </button>
              </div>
            </div>
          );
        })}
        
        {/* Add New List Button */}
        <div className="min-w-64">
          {isAddingList ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
                placeholder="List title"
                className="w-full px-3 py-2 border rounded mb-3"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddList}
                  className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
                >
                  Add list
                </button>
                <button
                  onClick={() => {
                    setIsAddingList(false);
                    setNewListTitle('');
                  }}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingList(true)}
              className="w-full h-full min-h-[200px] bg-gray-100 hover:bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-700"
            >
              <Plus size={24} className="mb-2" />
              <span>Add another list</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}