// components/board/List/ListHeader.tsx
'use client';

import { MoreVertical, X } from 'lucide-react';
import { useState } from 'react';

interface ListHeaderProps {
  title: string;
  cardCount: number;
  onEditTitle: () => void;
  onDeleteList: () => void;
}

export const ListHeader: React.FC<ListHeaderProps> = ({
  title,
  cardCount,
  onEditTitle,
  onDeleteList,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h3 className="font-medium text-gray-800 text-sm">{title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded">
            {cardCount} card{cardCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 hover:bg-gray-200 rounded"
        >
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>
        
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-8 z-20 w-48 bg-white rounded-lg shadow-lg border py-1">
              <button
                onClick={() => {
                  onEditTitle();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                Rename list
              </button>
              <button
                onClick={() => {
                  onDeleteList();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Delete list
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};