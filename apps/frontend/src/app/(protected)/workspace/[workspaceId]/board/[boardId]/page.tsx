



// src/app/(protected)/workspace/[workspaceId]/board/[boardId]/page.tsx
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from "next/navigation";
import { useBoardStore } from "@/store/boardStore";
import { BoardHeader } from "@/components/boards/BoardHeader";
import { BoardList } from "@/components/boards/BoardList";
import { ArrowLeft, Loader2 } from "lucide-react"; // ADD Loader2 here

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;
  const boardId = params.boardId as string;
  
  const { fetchBoardCards, boards } = useBoardStore();
  
  const board = boards.find(b => b.id === boardId);

  useEffect(() => {
    if (boardId) {
      fetchBoardCards(boardId);
    }
  }, [boardId, fetchBoardCards]);

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading board...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Board Header */}
      <BoardHeader board={board} />
      
      {/* Board Lists */}
      <BoardList boardId={boardId} />
      
      {/* Back Button */}
      <div className="p-4">
        <button
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
          Back to Workspace
        </button>
      </div>
    </div>
  );
}