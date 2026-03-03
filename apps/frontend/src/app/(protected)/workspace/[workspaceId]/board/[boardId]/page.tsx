// src/app/(protected)/workspace/[workspaceId]/board/[boardId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from "next/navigation";
import { useBoardStore } from "@/store/boardStore";
import { BoardHeader } from "@/components/boards/BoardHeader";
import { ListsContainer } from '@/components/board/ListsContainer';
import { ArrowLeft, Loader2 } from "lucide-react";

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;
  const boardId = params.boardId as string;

  const { fetchBoardCards, boards, fetchBoard, isLoading: storeLoading, error: storeError } = useBoardStore();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const board = boards.find(b => b.id === boardId);
  // Only show loading if we're actively loading OR if we're fetching OR if we haven't attempted fetch yet
  const loading = storeLoading || isFetching || (!hasAttemptedFetch && !board);

  useEffect(() => {
    const loadBoardData = async () => {
      if (!boardId) return;

      // Skip if already fetching
      if (isFetching) return;

      // Fetch board first, then cards
      try {
        setIsFetching(true);
        setLocalError(null);
        setHasAttemptedFetch(true);

        // Always fetch board first to ensure we have it (especially on refresh)
        await fetchBoard(boardId);

        // Wait for store to update and React to re-render
        // Check if board is now in store (with retries)
        let boardFound = false;
        for (let i = 0; i < 20; i++) {
          const currentBoards = useBoardStore.getState().boards;
          if (currentBoards.find(b => b.id === boardId)) {
            boardFound = true;
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        if (!boardFound) {
          throw new Error('Board not found after fetch');
        }

        // Always fetch the cards to ensure they're up to date
        await fetchBoardCards(boardId);
      } catch (error) {
        console.error("Error loading board data:", error);
        setLocalError(error instanceof Error ? error.message : 'Failed to load board');
      } finally {
        setIsFetching(false);
      }
    };

    loadBoardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  // Update projectId state when board data becomes available
  useEffect(() => {
    if (board) {
      // Use the project_id from board, fallback to boardId
      const id = board.id || boardId;
      setProjectId(id);
      console.log('Board data loaded:', {
        boardId: board.id,
        projectId: board.id,
        usingProjectId: id
      });
    }
  }, [board, boardId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">Loading board...</h2>
        </div>
      </div>
    );
  }

  // Show error if we've attempted fetch, not loading, no board found, and there's an error
  const error = storeError || localError;
  if (hasAttemptedFetch && !storeLoading && !board) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Board not found</h2>
          <p className="text-muted-foreground mb-6">
            {error || "The board you're looking for doesn't exist or you don't have access."}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mx-auto"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Board Header */}
      <BoardHeader board={board!} />

      {/* Trello Lists & Cards Interface */}
      {projectId ? (
        <ListsContainer projectId={projectId} />
      ) : (
        <div className="p-4">
          <div className="animate-pulse">
            <div className="flex gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-72 bg-gray-100 rounded-lg p-4">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}