'use client';

import { use } from 'react';
import { useBoard } from '@/hooks/useBoard';

export default function BoardPage({ params }: { params: Promise<{ boardId: string }> }) {
  const resolvedParams = use(params);
  const boardId = resolvedParams.boardId;
  
  const { board, isLoading, error } = useBoard(boardId);

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

  return (
    <div className="min-h-screen bg-blue-600">
      {/* Board Header */}
      <div className="p-4 text-white">
        <h1 className="text-2xl font-bold">{board.title}</h1>
        {board.description && (
          <p className="text-white text-opacity-80 mt-1">{board.description}</p>
        )}
        <div className="flex gap-4 mt-2 text-sm text-white text-opacity-70">
          <span>Background: {board.background}</span>
          <span>Workspace: {board.workspaceId}</span>
        </div>
      </div>
      
      {/* Board Content */}
      <div className="p-4">
        <div className="bg-white bg-opacity-20 rounded-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">🎉 Board Created Successfully!</h2>
          <p className="mb-4">Your board "<strong>{board.title}</strong>" has been created.</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-10 p-4 rounded">
              <h3 className="font-medium mb-2">Board Details:</h3>
              <ul className="text-sm space-y-1">
                <li>ID: {board.id}</li>
                <li>Title: {board.title}</li>
                <li>Background: {board.background}</li>
                <li>Created: {board.createdAt.toLocaleDateString()}</li>
              </ul>
            </div>
            
            <div className="bg-white bg-opacity-10 p-4 rounded">
              <h3 className="font-medium mb-2">Next Steps:</h3>
              <ul className="text-sm space-y-1">
                <li>✓ Board created successfully</li>
                <li>○ Add lists to organize your work</li>
                <li>○ Create cards for tasks</li>
                <li>○ Invite team members</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}