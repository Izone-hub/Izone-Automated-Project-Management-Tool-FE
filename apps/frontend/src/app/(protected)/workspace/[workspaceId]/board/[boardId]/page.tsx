// src/app/workspace/[workspaceId]/board/[boardId]/page.tsx
'use client';

import { useParams, useRouter } from "next/navigation";
import { useBoardStore } from "@/store/boardStore";
import { BoardHeader } from "@/components/boards/BoardHeader";
import { BoardList } from "@/components/boards/BoardList";
import { ArrowLeft } from "lucide-react";

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.boardId as string;
  
  const board = useBoardStore((state) => 
    state.boards.find(b => b.id === boardId)
  );

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Board not found</h2>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
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
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
          Back to Workspace
        </button>
      </div>
    </div>
  );
}




