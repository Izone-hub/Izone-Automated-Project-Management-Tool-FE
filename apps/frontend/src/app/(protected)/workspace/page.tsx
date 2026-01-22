'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useWorkspaces } from '@/hooks/useWorkspace';
import { useBoardStore } from '@/store/boardStore';
import { Loader2, ArrowLeft, Plus, Grid } from 'lucide-react';
import Link from 'next/link';

export default function WorkspaceDetailPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  
  const { 
    loading: workspaceLoading, 
    error: workspaceError, 
    getWorkspaceById,
    reload 
  } = useWorkspaces();
  
  // Get boards for this workspace
  const workspaceBoards = useBoardStore((state) => 
    state.getWorkspaceBoards(workspaceId)
  );
  
  const boardCount = useBoardStore((state) => 
    state.getWorkspaceBoardCount(workspaceId)
  );
  
  // Get workspace from the list
  const currentWorkspace = getWorkspaceById(workspaceId);

  useEffect(() => {
    // If workspace not found and we're not loading, try to reload
    if (!currentWorkspace && !workspaceLoading && workspaceId) {
      const timer = setTimeout(() => {
        reload();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [currentWorkspace, workspaceLoading, workspaceId, reload]);

  if (workspaceLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (workspaceError || !currentWorkspace) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Workspace not found</h2>
          <p className="text-gray-600 mb-4">
            {workspaceError || 'The workspace does not exist or you do not have access'}
          </p>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Workspace Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">{currentWorkspace.name}</h1>
            {currentWorkspace.description && (
              <p className="text-gray-600 mt-2">{currentWorkspace.description}</p>
            )}
            <div className="flex items-center gap-6 text-sm text-gray-500 mt-4">
              <div>
                Created: {new Date(currentWorkspace.created_at).toLocaleDateString()}
              </div>
              <div>
                Updated: {currentWorkspace.updated_at ? 
                  new Date(currentWorkspace.updated_at).toLocaleDateString() : 
                  'Never'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Boards Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Workspace Boards</h2>
              <p className="text-gray-600 text-sm mt-1">
                {boardCount === 0 
                  ? "No boards yet. Create your first board to get started."
                  : `${boardCount} board${boardCount !== 1 ? 's' : ''} in this workspace`
                }
              </p>
            </div>
            <Link
              href={`/workspace/${workspaceId}/boards/create`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Create Board
            </Link>
          </div>
          
          {/* Boards Grid */}
          {boardCount === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Grid className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No boards yet</h3>
              <p className="text-gray-600 mb-6">Create your first board to organize tasks and projects</p>
              <Link
                href={`/workspace/${workspaceId}/boards/create`}
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Create Your First Board
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaceBoards.map((board) => (
                <Link
                  key={board.id}
                  href={`/workspace/${workspaceId}/board/${board.id}`}
                  className="block group"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 h-40 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-800 group-hover:text-blue-700">
                        {board.name}
                      </h3>
                      <span className="text-xs bg-white px-2 py-1 rounded text-gray-600">
                        {board.lists?.length || 0} lists
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {/* Show first 2-3 lists */}
                      {board.lists?.slice(0, 3).map((list, idx) => (
                        <div key={idx} className="text-sm text-gray-600">
                          • {list.title} ({list.cards?.length || 0})
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      Updated {new Date(board.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
              
              {/* Add New Board Card */}
              <Link
                href={`/workspace/${workspaceId}/boards/create`}
                className="block group"
              >
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-40 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100">
                    <Plus className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                  </div>
                  <span className="text-gray-600 font-medium group-hover:text-blue-600">
                    Create New Board
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>
        
        {/* Optional: Workspace Members Section */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Workspace Members</h2>
          <p className="text-gray-600">Invite team members to collaborate on boards.</p>
          <button className="mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Manage Members
          </button>
        </div>
      </main>
    </div>
  );
}


