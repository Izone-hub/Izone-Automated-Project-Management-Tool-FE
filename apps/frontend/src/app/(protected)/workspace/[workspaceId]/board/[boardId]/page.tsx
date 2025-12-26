// // src/app/(protected)/workspace/[workspaceId]/board/[boardId]/page.tsx
// 'use client';

// import { useEffect } from 'react';
// import { useParams, useRouter } from "next/navigation";
// import { useBoardStore } from "@/store/boardStore";
// import { BoardHeader } from "@/components/boards/BoardHeader";
// import { BoardList } from "@/components/boards/BoardList";
// import { ArrowLeft, Loader2 } from "lucide-react"; // ADD Loader2 here

// export default function BoardPage() {
//   const params = useParams();
//   const router = useRouter();
//   const workspaceId = params.workspaceId as string;
//   const boardId = params.boardId as string;

//   const { fetchBoardCards, boards } = useBoardStore();

//   const board = boards.find(b => b.id === boardId);

//   useEffect(() => {
//     if (boardId) {
//       fetchBoardCards(boardId);
//     }
//   }, [boardId, fetchBoardCards]);

//   if (!board) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading board...</h2>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Board Header */}
//       <BoardHeader board={board} />

//       {/* Board Lists */}
//       <BoardList boardId={boardId} />

//       {/* Back Button */}
//       <div className="p-4">
//         <button
//           onClick={() => router.push(`/workspace/${workspaceId}`)}
//           className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
//         >
//           <ArrowLeft size={20} />
//           Back to Workspace
//         </button>
//       </div>
//     </div>
//   );
// }


// // src/app/(protected)/workspace/[workspaceId]/board/[boardId]/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from "next/navigation";
// import { useBoardStore } from "@/store/boardStore";
// import { BoardHeader } from "@/components/boards/BoardHeader";
// import {listContainer} from '@/components/board/ListsContainer';
// import { ArrowLeft, Loader2 } from "lucide-react";

// export default function BoardPage() {
//   const params = useParams();
//   const router = useRouter();
//   const workspaceId = params.workspaceId as string;
//   const boardId = params.boardId as string;

//   const { fetchBoardCards, boards } = useBoardStore();
//   const [projectId, setProjectId] = useState<string | null>(null);

//   const board = boards.find(b => b.id === boardId);

//   useEffect(() => {
//     if (boardId) {
//       fetchBoardCards(boardId);
//     }
//   }, [boardId, fetchBoardCards]);

//   // Update projectId state when board data becomes available
//   useEffect(() => {
//     if (board) {
//       setProjectId(board.project_id || boardId);
//     }
//   }, [board, boardId]);

//   if (!board) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading board...</h2>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Board Header */}
//       <BoardHeader board={board} />

//       {/* Trello Lists & Cards Interface */}
//       {projectId ? (
//         <ListsContainer projectId={projectId} />
//       ) : (
//         <div className="p-4">
//           <div className="animate-pulse">
//             <div className="flex gap-4">
//               {[1, 2, 3].map(i => (
//                 <div key={i} className="w-72 bg-gray-100 rounded-lg p-4">
//                   <div className="h-6 bg-gray-200 rounded mb-4"></div>
//                   <div className="space-y-2">
//                     <div className="h-16 bg-gray-200 rounded"></div>
//                     <div className="h-16 bg-gray-200 rounded"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Back Button */}
//       <div className="p-4">
//         <button
//           onClick={() => router.push(`/workspace/${workspaceId}`)}
//           className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
//         >
//           <ArrowLeft size={20} />
//           Back to Workspace
//         </button>
//       </div>
//     </div>
//   );
// }


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

  const { fetchBoardCards, boards } = useBoardStore();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const board = boards.find(b => b.id === boardId);

  useEffect(() => {
    const loadBoardData = async () => {
      if (boardId) {
        try {
          setLoading(true);
          await fetchBoardCards(boardId);
        } catch (error) {
          console.error("Error loading board data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadBoardData();
  }, [boardId, fetchBoardCards]);

  // Update projectId state when board data becomes available
  useEffect(() => {
    if (board) {
      // Use the project_id from board, fallback to boardId
      const id = board.project_id || boardId;
      setProjectId(id);
      console.log('Board data loaded:', {
        boardId: board.id,
        projectId: board.project_id,
        usingProjectId: id
      });
    }
  }, [board, boardId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading board...</h2>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Board not found</h2>
          <p className="text-gray-600 mb-6">The board you're looking for doesn't exist or you don't have access.</p>
          <button
            onClick={() => router.push(`/workspace/${workspaceId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mx-auto"
          >
            <ArrowLeft size={20} />
            Back to Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Board Header */}
      <BoardHeader board={board} />

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

      {/* Back Button */}
      <div className="p-4">
        <button
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Workspace
        </button>
      </div>
    </div>
  );
}