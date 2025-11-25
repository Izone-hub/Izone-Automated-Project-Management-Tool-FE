'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Workspace, Board } from '@/types';
import { mockWorkspaces, mockBoards } from '@/lib/mockData';

export default function DashboardPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWorkspaces(mockWorkspaces);
      setBoards(mockBoards);
      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Workspaces</h1>
        </div>

        {/* Workspaces Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12 w-full">
          {workspaces.map(workspace => (
            <Link
              key={workspace.id}
              href={`/workspace/${workspace.id}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow block w-full"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{workspace.name}</h3>
              {workspace.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">{workspace.description}</p>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{workspace.members.length} members</span>
                <span>
                  {boards.filter(b => b.workspaceId === workspace.id).length} boards
                </span>
              </div>
            </Link>
          ))}
          
          {/* Create Workspace Card */}
          <Link
            href="/workspace/create"
            className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-6 hover:border-gray-400 transition-colors flex flex-col items-center justify-center text-center block w-full"
          >
            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Workspace</h3>
          </Link>
        </div>

        {/* All Boards Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Boards</h2>
          {boards.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-600">No boards yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full">
              {boards.map(board => {
                const workspace = workspaces.find(ws => ws.id === board.workspaceId);
                return (
                  <Link
                    key={board.id}
                    href={`/b/${board.id}/${board.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}`}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow block w-full"
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
      </div>
    </div>
  );
}




// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { Workspace, Board } from '@/types';
// import { mockWorkspaces, mockBoards } from '@/lib/mockData';

// export default function DashboardPage() {
//   const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
//   const [boards, setBoards] = useState<Board[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Simulate loading data
//     const loadData = async () => {
//       setIsLoading(true);
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       setWorkspaces(mockWorkspaces);
//       setBoards(mockBoards);
//       setIsLoading(false);
//     };

//     loadData();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 w-full">
//       <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Your Workspaces</h1>
//           <p className="text-gray-600 mt-2">Manage your boards and workspaces</p>
//         </div>

//         {/* Workspaces Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12 w-full">
//           {workspaces.map(workspace => (
//             <Link
//               key={workspace.id}
//               href={`/workspace/${workspace.id}`}
//               className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow block w-full"
//             >
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">{workspace.name}</h3>
//               {workspace.description && (
//                 <p className="text-gray-600 mb-4 line-clamp-2">{workspace.description}</p>
//               )}
//               <div className="flex items-center justify-between text-sm text-gray-500">
//                 <span>{workspace.members.length} members</span>
//                 <span>
//                   {boards.filter(b => b.workspaceId === workspace.id).length} boards
//                 </span>
//               </div>
//             </Link>
//           ))}
          
//           {/* Create Workspace Card */}
//           <Link
//             href="/workspace/create"
//             className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-6 hover:border-gray-400 transition-colors flex flex-col items-center justify-center text-center block w-full"
//           >
//             <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//             </svg>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Workspace</h3>
//             <p className="text-gray-600">Start a new workspace</p>
//           </Link>
//         </div>

//         {/* All Boards Section */}
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Boards</h2>
//           {boards.length === 0 ? (
//             <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
//               <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
//               </svg>
//               <p className="text-gray-600">No boards yet. Create a workspace to get started!</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full">
//               {boards.map(board => {
//                 const workspace = workspaces.find(ws => ws.id === board.workspaceId);
//                 return (
//                   <Link
//                     key={board.id}
//                     href={`/b/${board.id}/${board.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}`}
//                     className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow block w-full"
//                   >
//                     <div className={`h-3 rounded-t-lg mb-3 ${
//                       board.background === 'blue' ? 'bg-blue-500' :
//                       board.background === 'green' ? 'bg-green-500' :
//                       board.background === 'red' ? 'bg-red-500' :
//                       board.background === 'purple' ? 'bg-purple-500' :
//                       board.background === 'orange' ? 'bg-orange-500' :
//                       board.background === 'pink' ? 'bg-pink-500' :
//                       'bg-blue-500'
//                     }`} />
//                     <h4 className="font-semibold text-gray-900 mb-2 truncate">{board.title}</h4>
//                     {board.description && (
//                       <p className="text-gray-600 text-sm mb-2 line-clamp-2">{board.description}</p>
//                     )}
//                     <div className="flex items-center justify-between text-xs text-gray-500">
//                       <span>{workspace?.name || 'Workspace'}</span>
//                       <span>{board.lists?.length || 0} lists</span>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { Workspace, Board } from '@/types';
// import { mockWorkspaces, mockBoards } from '@/lib/mockData';

// export default function DashboardPage() {
//   const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
//   const [boards, setBoards] = useState<Board[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Track current user id (read from localStorage). Keep hooks at top level so
//   // their order never changes across renders (avoids React hooks order errors).
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);

//   useEffect(() => {
//     // Simulate loading data
//     const loadData = async () => {
//       setIsLoading(true);
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       setWorkspaces(mockWorkspaces);
//       setBoards(mockBoards);
//       setIsLoading(false);
//     };

//     loadData();
//   }, []);

//   // Read current user from localStorage once on mount
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem('user');
//       if (raw) {
//         const parsed = JSON.parse(raw);
//         setCurrentUserId(parsed?.id || parsed?.userId || null);
//       } else {
//         setCurrentUserId(null);
//       }
//     } catch (e) {
//       setCurrentUserId(null);
//     }
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }


//   // Only include workspaces owned by the current user (boards the user created).
//   // If there's no signed-in user, show no workspaces so the list remains empty
//   // (this removes the example 'Web Development' card when not signed in).
//   const userWorkspaces = currentUserId
//     ? workspaces.filter(ws => ws.ownerId === currentUserId)
//     : [];

//   const primaryWorkspace = userWorkspaces[0];
//   const primaryBoards = primaryWorkspace ? boards.filter(b => b.workspaceId === primaryWorkspace.id) : [];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Your Workspaces</h1>
//           <p className="text-gray-600 mt-2">Manage your projects and collaborate with your team</p>
//         </div>

//         {/* Show primary workspace header and its boards (only for workspaces owned by the user) */}
//         <div className="mb-8">
//           {primaryWorkspace ? (
//             <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-6">
//               <div className="flex items-center gap-4">
//                 <div className="w-14 h-14 rounded-lg flex items-center justify-center text-xl font-bold bg-blue-100 text-blue-700">
//                   {primaryWorkspace.name.split(' ').map(s => s[0]).slice(0,2).join('')}
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-semibold text-gray-900">{primaryWorkspace.name}</h2>
//                   <div className="text-sm text-gray-500 flex items-center gap-3">
//                     <span>{primaryWorkspace.members.length} members</span>
//                     <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">Premium</span>
//                     <span className="text-xs text-gray-500">Private</span>
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 <Link href={`/workspace/${primaryWorkspace.id}`} className="text-sm text-blue-600 hover:underline">View workspace</Link>
//               </div>
//             </div>
//           ) : (
//             // If the user doesn't own any workspace, hide the workspace card entirely
//             null
//           )}
//         </div>

//         {/* Your boards - show boards for the primary workspace */}
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">Your boards</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {primaryBoards.map(board => (
//               <Link
//                 key={board.id}
//                 href={`/b/${board.id}/${(board.title || 'board').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0,50)}`}
//                 className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white border border-gray-200"
//               >
//                 <div className={`h-20 ${
//                   board.background === 'blue' ? 'bg-linear-to-r from-blue-400 to-blue-600' :
//                   board.background === 'green' ? 'bg-linear-to-r from-green-400 to-green-600' :
//                   board.background === 'red' ? 'bg-linear-to-r from-red-400 to-red-600' :
//                   board.background === 'purple' ? 'bg-linear-to-r from-purple-400 to-purple-600' :
//                   board.background === 'orange' ? 'bg-linear-to-r from-orange-400 to-orange-600' :
//                   board.background === 'pink' ? 'bg-linear-to-r from-pink-400 to-pink-600' :
//                   'bg-linear-to-r from-gray-200 to-gray-300'
//                 }`} />
//                 <div className="p-4">
//                   <h3 className="font-semibold text-gray-900 mb-1 truncate">{board.title}</h3>
//                   <p className="text-sm text-gray-500 truncate">{board.description}</p>
//                 </div>
//               </Link>
//             ))}

//             {/* Create new board card */}
//             {primaryWorkspace && (
//               <Link
//                 href={`/workspace/${primaryWorkspace.id}/board/create`}
//                 className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white h-36 hover:border-gray-400 transition-colors text-center p-4"
//               >
//                 <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center mb-3">
//                   <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                   </svg>
//                 </div>
//                 <div className="text-sm text-gray-700">Create new board</div>
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



