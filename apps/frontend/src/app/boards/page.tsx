'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Workspace, Board } from '@/types/board';
import { mockWorkspaces, mockBoards } from '@/lib/mockData';
import { CreateBoardForm } from '@/components/workspaces/CreateBoardForm';
import { useBoard } from '@/hooks/useBoard';

export default function BoardsPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createWorkspaceId, setCreateWorkspaceId] = useState<string | null>(null);
  const [createWorkspaceName, setCreateWorkspaceName] = useState<string | undefined>(undefined);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { createBoard } = useBoard();

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setWorkspaces(mockWorkspaces);
      setBoards(mockBoards);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Open create modal when ?workspace= is present
  useEffect(() => {
    const ws = searchParams?.get('workspace');
    if (ws) {
      const found = mockWorkspaces.find(w => w.id === ws);
      setCreateWorkspaceId(ws);
      setCreateWorkspaceName(found?.name);
      setShowCreate(true);
    }
  }, [searchParams]);

  const handleCloseCreate = () => {
    setShowCreate(false);
    // remove query param to avoid reopening on refresh
    router.push('/boards');
  };

  const handleCreateBoard = async (data: { title: string; description?: string; background?: string; workspaceId: string }) => {
    try {
      const newBoard = await createBoard(data);
      // Navigate to the new board using Trello-style public URL
      const slugify = (s: string) =>
        s
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
          .slice(0, 50);

      const slug = slugify(newBoard.title || 'board');
      router.push(`/b/${newBoard.id}/${slug}`);
    } catch (err) {
      console.error('Failed to create board', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Boards</h1>
          <p className="text-gray-600 mt-2">Browse all boards across your workspaces</p>
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-600 mb-4">No boards yet.</p>
            <Link 
              href="/workspace/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Workspace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {boards.map(board => {
              const workspace = workspaces.find(ws => ws.id === board.workspaceId);
              return (
                <Link
                  key={board.id}
                  href={`/b/${board.id}/${board.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow block"
                >
                  <div className={`h-3 rounded-t-lg mb-3 ${
                    board.background === 'blue' ? 'bg-blue-500' :
                    board.background === 'green' ? 'bg-green-500' :
                    board.background === 'red' ? 'bg-red-500' :
                    board.background === 'purple' ? 'bg-purple-500' :
                    board.background === 'orange' ? 'bg-orange-500' :
                    board.background === 'pink' ? 'bg-pink-500' :
                    'bg-blue-500'
                  }`} />
                  <h4 className="font-semibold text-gray-900 mb-2 truncate">{board.title}</h4>
                  {board.description && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{board.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{workspace?.name || 'Workspace'}</span>
                    <span>{board.lists?.length || 0} lists</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <CreateBoardForm
        isOpen={showCreate}
        onClose={handleCloseCreate}
        onSubmit={handleCreateBoard}
        workspaceId={createWorkspaceId || ''}
        workspaceName={createWorkspaceName}
      />
    </div>
  );
}