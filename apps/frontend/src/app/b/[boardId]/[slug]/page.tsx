'use client';

import { use } from 'react';
import { useBoard } from '@/hooks/useBoard';
import { BoardHeader } from '@/components/board/BoardHeader';
import { ListContainer} from "@/components/board/ListContainer"
import { BoardWithDetails } from '@/types/board';

interface BoardPageProps {
  params: Promise<{
    boardId: string;
    slug: string;
  }>;
}

export default function BoardPage({ params }: BoardPageProps) {
  const resolvedParams = use(params);
  const boardId = resolvedParams.boardId;
  
  const { board, isLoading, error, refetch } = useBoard(boardId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !board) {
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

  // ✅ Convert board to project format for BoardHeader
  const project = {
    ...board,
    title: board.title || 'Untitled Board',
    background: board.background || 'blue',
    description: board.description,
    visibility: 'private' as const,
    isFavorite: false,
    lastActivity: new Date().toISOString(),
    createdAt: board.createdAt || new Date().toISOString(),
    updatedAt: board.updatedAt || new Date().toISOString(),
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        background: project.background?.includes('gradient') 
          ? project.background === 'gradient-blue' 
            ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
            : 'linear-gradient(135deg, #10B981, #047857)'
          : project.background === 'blue' ? '#3B82F6' :
            project.background === 'green' ? '#10B981' :
            project.background === 'red' ? '#EF4444' :
            project.background === 'purple' ? '#8B5CF6' :
            project.background === 'orange' ? '#F59E0B' :
            project.background === 'pink' ? '#EC4899' : '#3B82F6'
      }}
    >
      <BoardHeader 
        project={project}  // ✅ Pass as project prop
        onUpdateBackground={(background) => {
          // Handle background update if needed
        }}
      />
      <ListContainer board={board as BoardWithDetails} onRefresh={refetch} />
    </div>
  );
}