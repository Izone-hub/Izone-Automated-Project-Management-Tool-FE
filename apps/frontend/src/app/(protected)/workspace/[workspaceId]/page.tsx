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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !currentWorkspace) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Workspace not found</h2>
          <p className="text-muted-foreground mb-4">
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
    <div className="min-h-screen bg-background">

      {/* Top nav */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Workspace Header */}
        <div className="bg-card rounded-lg shadow-sm border border-border mb-6">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground">
              {currentWorkspace.name}
            </h1>

            {currentWorkspace.description && (
              <p className="text-muted-foreground mt-2">{currentWorkspace.description}</p>
            )}

            <div className="flex items-center gap-6 text-sm text-muted-foreground mt-4">
              <div>
                Created: {new Date(currentWorkspace.createdAt).toLocaleDateString()}
              </div>
              <div>
                Updated: {currentWorkspace.updatedAt ?
                  new Date(currentWorkspace.updatedAt).toLocaleDateString() : 'Never'}
              </div>
              <Link
                href={`/workspace/${workspaceId}/members`}
                className="flex items-center gap-2 px-3 py-1.5 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors"
              >
                <Users className="w-4 h-4" />
                Manage Members
              </Link>
            </div>
          </div>
        </div>

        {/* RENDER BOARDS HERE 👇 */}
        <BoardsPage />

      </main>
    </div>
  );
}
















