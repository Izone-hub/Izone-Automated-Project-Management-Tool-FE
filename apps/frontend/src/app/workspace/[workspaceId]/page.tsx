'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader';
import { useWorkspaces } from '@/hooks/useWorkspace';
import { Loader2, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { Workspace } from '@/lib/api/workspaces'; // Import the Workspace type

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;
  
  // Use the hook correctly - it returns these properties
  const { workspaces, loading, error, reload } = useWorkspaces();
  
  // Add local state for current workspace
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    if (workspaceId && workspaces.length > 0) {
      // Find the workspace from the list
      const workspace = workspaces.find(ws => ws.id === workspaceId);
      if (workspace) {
        setCurrentWorkspace(workspace);
      } else {
        // If not found, reload workspaces to make sure we have the latest
        reload();
      }
    }
  }, [workspaceId, workspaces, reload]);

  // Also load on initial mount if we don't have workspaces
  useEffect(() => {
    if (workspaceId && workspaces.length === 0) {
      reload();
    }
  }, [workspaceId, workspaces.length, reload]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !currentWorkspace) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Workspace not found</h2>
          <p className="text-gray-600 mb-4">{error || 'The workspace does not exist or you do not have access'}</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-600">
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
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Note: WorkspaceHeader expects different props than your Workspace type */}
        {/* You may need to adapt the WorkspaceHeader component or create a simpler version */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">{currentWorkspace.name}</h1>
            {currentWorkspace.description && (
              <p className="text-gray-600 mt-2">{currentWorkspace.description}</p>
            )}
            <div className="flex items-center gap-6 text-sm text-gray-500 mt-4">
              <div>Created: {new Date(currentWorkspace.created_at).toLocaleDateString()}</div>
              <div>Updated: {currentWorkspace.updated_at ? new Date(currentWorkspace.updated_at).toLocaleDateString() : 'Never'}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Boards</h2>
              <p className="text-gray-600 text-sm mt-1">All boards in this workspace</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Plus className="w-4 h-4" /> Create Board
            </button>
          </div>

          {/* Since your Workspace type doesn't have boardCount, you can show a default message */}
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 14H7v-2h4v2zm0-6H7v-2h4v4zm0-6H7V7h4v4zm6 12h-4v-2h4v2zm0-6h-4v-2h4v2zm0-6h-4V7h4v4z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No boards yet</h3>
            <p className="text-gray-600 mb-6">Create your first board to start organizing your work</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Create Board
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}










