// components/workspaces/BoardCard.tsx
'use client';

import Link from 'next/link';
import { Board } from '@/types';

interface BoardCardProps {
  board: Board;
  workspaceId: string;
  onDeleteBoard?: (boardId: string) => void;
  onUpdateBoard?: (boardId: string, updates: Partial<Board>) => void;
}

export function BoardCard({ board, workspaceId }: BoardCardProps) {
  return (
    <Link href={`/board/${board.id}`} className="block group">
      <div 
        className="bg-cover bg-center rounded-lg aspect-video p-4 hover:shadow-lg transition-all duration-200 group-hover:scale-105"
        style={{ 
          background: board.background?.includes('gradient') 
            ? `linear-gradient(135deg, ${getGradientColors(board.background)})`
            : getBackgroundColor(board.background)
        }}
      >
        <h3 className="text-white font-semibold text-lg">{board.title}</h3>
        {board.description && (
          <p className="text-white text-opacity-80 text-sm mt-2">{board.description}</p>
        )}
      </div>
    </Link>
  );
}

// Add these helper functions
function getGradientColors(background: string = 'blue') {
  const gradients = {
    'gradient-blue': '#3b82f6, #1d4ed8',
    'gradient-green': '#10b981, #047857',
    'gradient-red': '#ef4444, #dc2626',
    'gradient-purple': '#8b5cf6, #7c3aed',
    'gradient-orange': '#f59e0b, #d97706',
    'gradient-pink': '#ec4899, #db2777',
  };
  return gradients[background as keyof typeof gradients] || '#3b82f6, #1d4ed8';
}

function getBackgroundColor(background: string = 'blue') {
  const colors = {
    'blue': '#3b82f6',
    'green': '#10b981',
    'red': '#ef4444',
    'purple': '#8b5cf6',
    'orange': '#f59e0b',
    'pink': '#ec4899',
  };
  return colors[background as keyof typeof colors] || '#3b82f6';
}