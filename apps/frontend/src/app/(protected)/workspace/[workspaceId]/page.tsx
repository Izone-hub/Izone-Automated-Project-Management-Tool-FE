// // app/workspace/[workspaceId]/page.tsx
// 'use client';

// import React, { useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useWorkspaces } from '@/hooks/useWorkspace';
// import { Loader2, ArrowLeft } from 'lucide-react';
// import Link from 'next/link';

// // IMPORT BOARDS PAGE HERE 👇
// import BoardsPage from '@/app/(protected)/boards/page'; 
// // or wherever your boards component is located

// export default function WorkspaceDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const workspaceId = params.workspaceId as string;

//   const { 
//     loading, 
//     error, 
//     getWorkspaceById,
//     reload 
//   } = useWorkspaces();

//   const currentWorkspace = getWorkspaceById(workspaceId);

//   useEffect(() => {
//     if (!currentWorkspace && !loading && workspaceId) {
//       const timer = setTimeout(() => {
//         reload();
//       }, 100);
//       return () => clearTimeout(timer);
//     }
//   }, [currentWorkspace, loading, workspaceId, reload]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
//       </div>
//     );
//   }

//   if (error || !currentWorkspace) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">Workspace not found</h2>
//           <p className="text-gray-600 mb-4">
//             {error || 'The workspace does not exist or you do not have access'}
//           </p>
//           <Link 
//             href="/dashboard"
//             className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             <ArrowLeft className="w-4 h-4" /> Back to Dashboard
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* Top nav */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
//           <Link 
//             href="/dashboard"
//             className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
//           >
//             <ArrowLeft className="w-4 h-4" /> Back to Dashboard
//           </Link>
//         </div>
//       </div>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

//         {/* Workspace Header */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
//           <div className="p-6">
//             <h1 className="text-2xl font-bold text-gray-900">
//               {currentWorkspace.name}
//             </h1>

//             {currentWorkspace.description && (
//               <p className="text-gray-600 mt-2">{currentWorkspace.description}</p>
//             )}

//             <div className="flex items-center gap-6 text-sm text-gray-500 mt-4">
//               <div>
//                 Created: {new Date(currentWorkspace.created_at).toLocaleDateString()}
//               </div>
//               <div>
//                 Updated: {currentWorkspace.updated_at ? 
//                   new Date(currentWorkspace.updated_at).toLocaleDateString() : 'Never'}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* RENDER BOARDS HERE 👇 */}
//         <BoardsPage />

//       </main>
//     </div>
//   );
// }



// app/workspace/[workspaceId]/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWorkspaces } from '@/hooks/useWorkspace';
import { useBoardStore } from '@/store/boardStore'; // ADD THIS
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// IMPORT BOARDS PAGE HERE 👇
import BoardsPage from '@/app/(protected)/boards/page';
// or wherever your boards component is located

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;

  const {
    loading,
    error,
    getWorkspaceById,
    reload
  } = useWorkspaces();

  // ADD THIS: Get board store functions
  const { fetchWorkspaceBoards } = useBoardStore();

  const currentWorkspace = getWorkspaceById(workspaceId);

  // Removed redundant retry loop that causes infinite fetching if workspace is not found
  // The useWorkspaces hook already loads data on mount.

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
                Created: {new Date(currentWorkspace.created_at).toLocaleDateString()}
              </div>
              <div>
                Updated: {currentWorkspace.updated_at ?
                  new Date(currentWorkspace.updated_at).toLocaleDateString() : 'Never'}
              </div>
            </div>
          </div>
        </div>

        {/* RENDER BOARDS HERE 👇 */}
        <BoardsPage />

      </main>
    </div>
  );
}
















