// src/components/boards/BoardHeader.tsx
'use client';

import { Board } from '@/lib/types';
import { Lock, Globe, Users, MoreVertical, Star } from 'lucide-react';

type Props = {
  board: Board;
};

export default function BoardHeader({ board }: Props) {
  const getPrivacyIcon = () => {
    switch (board.privacy) {
      case 'private':
        return <Lock className="w-4 h-4" />;
      case 'workspace':
        return <Users className="w-4 h-4" />;
      case 'public':
        return <Globe className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <header
      className="relative text-white p-4 md:p-6 rounded-t-xl"
      style={{ backgroundColor: board.background }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent rounded-t-xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold drop-shadow">{board.name}</h1>
            <button
              className="p-1 hover:bg-white/20 rounded"
              title="Star board"
            >
              <Star className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/20 rounded">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {getPrivacyIcon()}
            <span className="capitalize">{board.privacy}</span>
          </div>
          
          {board.description && (
            <p className="text-white/90 drop-shadow">{board.description}</p>
          )}
        </div>
      </div>
    </header>
  );
}