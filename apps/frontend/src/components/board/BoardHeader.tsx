'use client';

import { useState } from 'react';
import { BoardWithDetails } from '@/types';
import { BoardBackground } from './BoardBackground';

interface BoardHeaderProps {
  board: BoardWithDetails;
  onUpdateBackground?: (background: string) => Promise<void> | void;
}

export function BoardHeader({ board, onUpdateBackground }: BoardHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(board.title);
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);

  const handleSave = () => {
    // TODO: Implement update board title/description via provided API
    setIsEditing(false);
  };

  const handleBackgroundChange = (bg: string) => {
    if (onUpdateBackground) {
      const res = onUpdateBackground(bg);
      if (res instanceof Promise) {
        res.then(() => setShowBackgroundPicker(false)).catch(() => {});
      } else {
        setShowBackgroundPicker(false);
      }
    }
  };

  return (
    <div className="p-4 bg-black bg-opacity-30 text-white relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              className="text-2xl font-bold bg-transparent border-b border-white outline-none"
              autoFocus
            />
          ) : (
            <h1 
              className="text-2xl font-bold cursor-pointer hover:bg-white hover:bg-opacity-20 rounded px-2 py-1"
              onClick={() => setIsEditing(true)}
            >
              {board.title}
            </h1>
          )}
          {board.description && (
            <p className="text-gray-300">{board.description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition">
            Share
          </button>
          <div className="relative">
            <button
              onClick={() => setShowBackgroundPicker((v) => !v)}
              className="px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition"
            >
              Background
            </button>

            {showBackgroundPicker && (
              <div className="absolute right-0 mt-2 w-64 z-40">
                <div className="bg-white rounded-md shadow-lg overflow-hidden">
                  <BoardBackground board={board} onUpdateBackground={handleBackgroundChange} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



