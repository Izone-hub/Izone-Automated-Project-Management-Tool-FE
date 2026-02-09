// app/workspace/[workspaceId]/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWorkspaces } from '@/hooks/useWorkspace';
import { useBoardStore } from '@/store/boardStore';
import { Loader2, ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';

// IMPORT BOARDS PAGE HERE 👇
import BoardsPage from '@/app/(protected)/boards/page';
import { ActivityFeed } from '@/components/common/ActivityFeed';
// or wherever your boards component is located

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = (params?.workspaceId as string) || "";

  const {
    loading,
    error,
    getWorkspaceById,
    reload
  } = useWorkspaces();

  // ADD THIS: Get board store functions
  const { fetchWorkspaceBoards } = useBoardStore();

  const currentWorkspace = getWorkspaceById(workspaceId);

  // Retry loading if workspace not found (handles store hydration timing)
  useEffect(() => {
    if (!currentWorkspace && !loading && workspaceId) {
      // Workspace not in store, try reloading
      reload();
    }
  }, [currentWorkspace, loading, workspaceId, reload]);

  // ADD THIS: Fetch boards when workspace loads
  useEffect(() => {
    if (currentWorkspace && workspaceId) {
      fetchWorkspaceBoards(workspaceId);
    }
  }, [currentWorkspace, workspaceId, fetchWorkspaceBoards]);

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
          <p className="text-gray-600 mb-4">
            {error || 'The workspace does not exist or you do not have access'}
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

      {/* Top nav */}
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
            <h1 className="text-2xl font-bold text-gray-900">
              {currentWorkspace.name}
            </h1>

            {currentWorkspace.description && (
              <p className="text-gray-600 mt-2">{currentWorkspace.description}</p>
            )}

            <div className="flex items-center gap-6 text-sm text-gray-500 mt-4">
              <div>
                Created: {currentWorkspace.createdAt ? new Date(currentWorkspace.createdAt).toLocaleDateString() : 'Unknown'}
              </div>
              <div>
                Updated: {currentWorkspace.updatedAt && new Date(currentWorkspace.updatedAt).getFullYear() > 1970
                  ? new Date(currentWorkspace.updatedAt).toLocaleDateString()
                  : 'Never'}
              </div>
              <Link
                href={`/workspace/${workspaceId}/members`}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Users className="w-4 h-4" />
                Manage Members
              </Link>
              <Link
                href={`/workspace/${workspaceId}/tickets`}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="w-4 h-4">🎫</div>
                View Tickets
              </Link>
            </div>
          </div>
        </div>

        {/* RENDER BOARDS & ACTIVITY FEED */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <BoardsPage />
          </div>
          <div className="xl:col-span-1 h-full">
            <ActivityFeed workspaceId={workspaceId} />
          </div>
        </div>

      </main>
    </div>
  );
}
















