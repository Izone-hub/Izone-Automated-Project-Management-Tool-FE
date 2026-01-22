'use client';

import { use, useEffect } from 'react';
import { useBoardStore } from '@/store/boardStore';
import { BoardList } from '@/components/boards/BoardList';
import { BoardHeader } from '@/components/boards/BoardHeader'; // Assuming this exists or I should create/use one

export default function BoardPage({ params }: { params: Promise<{ boardId: string }> }) {
  const resolvedParams = use(params);
  const boardId = resolvedParams.boardId;

  const { fetchBoard, isLoading, error, boards } = useBoardStore();
  const board = boards.find(b => b.id === boardId);

  useEffect(() => {
    if (boardId) {
      fetchBoard(boardId);
    }
  }, [boardId, fetchBoard]);

  if (isLoading && !board) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || (!isLoading && !board)) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-2">Board Not Found</h1>
          <p className="text-gray-300">The board you're looking for doesn't exist.</p>
          <p className="text-gray-400 text-sm mt-2">Board ID: {boardId}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: board?.background_color || board?.color || '#0079bf',
        backgroundImage: board?.background?.startsWith('http') || board?.background?.startsWith('url')
          ? `url(${board.background})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <BoardHeader board={board as any} />

      {/* Board Content - The Lists */}
      <div className="flex-1 overflow-x-auto">
        <BoardList boardId={boardId} />
      </div>
    </div>
  );
}