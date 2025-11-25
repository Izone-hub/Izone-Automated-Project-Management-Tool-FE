'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Workspace, Board } from '@/types';
import { mockWorkspaces, mockBoards } from '@/lib/mockData';
import { CreateBoardForm } from '@/components/workspaces/CreateBoardForm';
import { useBoard } from '@/hooks/useBoard';

export default function BoardsPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createWorkspaceId, setCreateWorkspaceId] = useState<string | null>(null);
  const [createWorkspaceName, setCreateWorkspaceName] = useState<string | undefined>(undefined);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { createBoard } = useBoard();

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setWorkspaces(mockWorkspaces);
      setBoards(mockBoards);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Open create modal when ?workspace= is present
  useEffect(() => {
    const ws = searchParams?.get('workspace');
    if (ws) {
      const found = mockWorkspaces.find(w => w.id === ws);
      setCreateWorkspaceId(ws);
      setCreateWorkspaceName(found?.name);
      setShowCreate(true);
    }
  }, [searchParams]);

  const handleCloseCreate = () => {
    setShowCreate(false);
    // remove query param to avoid reopening on refresh
    router.push('/boards');
  };

  const handleCreateBoard = async (data: { title: string; description?: string; background?: string; workspaceId: string }) => {
    try {
      const newBoard = await createBoard(data);
      // Navigate to the new board using Trello-style public URL
      const slugify = (s: string) =>
        s
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
          .slice(0, 50);

      const slug = slugify(newBoard.title || 'board');
      router.push(`/b/${newBoard.id}/${slug}`);
    } catch (err) {
      console.error('Failed to create board', err);
    }
  };

  // Group boards by workspace for Trello-like organization
  const boardsByWorkspace = workspaces.map(workspace => ({
    workspace,
    boards: boards.filter(board => board.workspaceId === workspace.id)
  })).filter(group => group.boards.length > 0);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Boards</h1>
          <p className="text-gray-600 mt-2">Browse all boards across your workspaces</p>
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-600 mb-4">No boards yet.</p>
            <Link 
              href="/workspace/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Workspace
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {boardsByWorkspace.map(({ workspace, boards: workspaceBoards }) => (
              <div key={workspace.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{workspace.name}</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {workspaceBoards.length} board{workspaceBoards.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Link
                    href={`/workspace/${workspace.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  >
                    View workspace
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full">
                  {workspaceBoards.map(board => (
                    <Link
                      key={board.id}
                      href={`/b/${board.id}/${board.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}`}
                      className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow block w-full"
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
                        <span>{workspace.name}</span>
                        <span>{board.lists?.length || 0} lists</span>
                      </div>
                    </Link>
                  ))}
                  
                  {/* Create new board card for this workspace */}
                  <button
                    onClick={() => {
                      setCreateWorkspaceId(workspace.id);
                      setCreateWorkspaceName(workspace.name);
                      setShowCreate(true);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors flex flex-col items-center justify-center min-h-[120px] w-full"
                  >
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-gray-600 font-medium">Create new board</span>
                  </button>
                </div>
              </div>
            ))}
            
            {/* Quick create section for workspaces without boards */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create new board</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
                {workspaces.map(workspace => (
                  <button
                    key={workspace.id}
                    onClick={() => {
                      setCreateWorkspaceId(workspace.id);
                      setCreateWorkspaceName(workspace.name);
                      setShowCreate(true);
                    }}
                    className="bg-gray-50 hover:bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors text-left w-full"
                  >
                    <div className="font-medium text-gray-900">{workspace.name}</div>
                    <div className="text-sm text-gray-600 mt-1">Create new board</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <CreateBoardForm
        isOpen={showCreate}
        onClose={handleCloseCreate}
        onSubmit={handleCreateBoard}
        workspaceId={createWorkspaceId || ''}
        workspaceName={createWorkspaceName}
      />
    </div>
  );
}




// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { Workspace, Board } from '@/types';
// import { mockWorkspaces, mockBoards } from '@/lib/mockData';
// import { CreateBoardForm } from '@/components/workspaces/CreateBoardForm';
// import { useBoard } from '@/hooks/useBoard';

// export default function BoardsPage() {
//   const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
//   const [boards, setBoards] = useState<Board[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showCreate, setShowCreate] = useState(false);
//   const [createWorkspaceId, setCreateWorkspaceId] = useState<string | null>(null);
//   const [createWorkspaceName, setCreateWorkspaceName] = useState<string | undefined>(undefined);

//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const { createBoard } = useBoard();

//   useEffect(() => {
//     // Simulate loading data
//     const loadData = async () => {
//       setIsLoading(true);
//       await new Promise(resolve => setTimeout(resolve, 400));
//       setWorkspaces(mockWorkspaces);
//       setBoards(mockBoards);
//       setIsLoading(false);
//     };

//     loadData();
//   }, []);

//   // Open create modal when ?workspace= is present
//   useEffect(() => {
//     const ws = searchParams?.get('workspace');
//     if (ws) {
//       const found = mockWorkspaces.find(w => w.id === ws);
//       setCreateWorkspaceId(ws);
//       setCreateWorkspaceName(found?.name);
//       setShowCreate(true);
//     }
//   }, [searchParams]);

//   const handleCloseCreate = () => {
//     setShowCreate(false);
//     // remove query param to avoid reopening on refresh
//     router.push('/boards');
//   };

//   const handleCreateBoard = async (data: { title: string; description?: string; background?: string; workspaceId: string }) => {
//     try {
//       const newBoard = await createBoard(data);
//       // Navigate to the new board using Trello-style public URL
//       const slugify = (s: string) =>
//         s
//           .toLowerCase()
//           .replace(/[^a-z0-9]+/g, '-')
//           .replace(/(^-|-$)/g, '')
//           .slice(0, 50);

//       const slug = slugify(newBoard.title || 'board');
//       router.push(`/b/${newBoard.id}/${slug}`);
//     } catch (err) {
//       console.error('Failed to create board', err);
//     }
//   };

//   // Group boards by workspace for Trello-like organization
//   const boardsByWorkspace = workspaces.map(workspace => ({
//     workspace,
//     boards: boards.filter(board => board.workspaceId === workspace.id)
//   })).filter(group => group.boards.length > 0);

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
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">All Boards</h1>
//           <p className="text-gray-600 mt-2">Browse all boards across your workspaces</p>
//         </div>

//         {boards.length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
//             <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
//             </svg>
//             <p className="text-gray-600 mb-4">No boards yet.</p>
//             <Link 
//               href="/workspace/create"
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Create Your First Workspace
//             </Link>
//           </div>
//         ) : (
//           <div className="space-y-8">
//             {boardsByWorkspace.map(({ workspace, boards: workspaceBoards }) => (
//               <div key={workspace.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div>
//                     <h2 className="text-xl font-bold text-gray-900">{workspace.name}</h2>
//                     <p className="text-gray-600 text-sm mt-1">
//                       {workspaceBoards.length} board{workspaceBoards.length !== 1 ? 's' : ''}
//                     </p>
//                   </div>
//                   <Link
//                     href={`/workspace/${workspace.id}`}
//                     className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
//                   >
//                     View workspace
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   </Link>
//                 </div>
                
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full">
//                   {workspaceBoards.map(board => (
//                     <Link
//                       key={board.id}
//                       href={`/b/${board.id}/${board.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}`}
//                       className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow block"
//                     >
//                       <div className={`h-3 rounded-t-lg mb-3 ${
//                         board.background === 'blue' ? 'bg-blue-500' :
//                         board.background === 'green' ? 'bg-green-500' :
//                         board.background === 'red' ? 'bg-red-500' :
//                         board.background === 'purple' ? 'bg-purple-500' :
//                         board.background === 'orange' ? 'bg-orange-500' :
//                         board.background === 'pink' ? 'bg-pink-500' :
//                         'bg-blue-500'
//                       }`} />
//                       <h4 className="font-semibold text-gray-900 mb-2 truncate">{board.title}</h4>
//                       {board.description && (
//                         <p className="text-gray-600 text-sm mb-2 line-clamp-2">{board.description}</p>
//                       )}
//                       <div className="flex items-center justify-between text-xs text-gray-500">
//                         <span>{workspace.name}</span>
//                         <span>{board.lists?.length || 0} lists</span>
//                       </div>
//                     </Link>
//                   ))}
                  
//                   {/* Create new board card for this workspace */}
//                   <button
//                     onClick={() => {
//                       setCreateWorkspaceId(workspace.id);
//                       setCreateWorkspaceName(workspace.name);
//                       setShowCreate(true);
//                     }}
//                     className="bg-gray-100 hover:bg-gray-200 rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors flex flex-col items-center justify-center min-h-[120px]"
//                   >
//                     <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                     </svg>
//                     <span className="text-gray-600 font-medium">Create new board</span>
//                   </button>
//                 </div>
//               </div>
//             ))}
            
//             {/* Quick create section for workspaces without boards */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">Create new board</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {workspaces.map(workspace => (
//                   <button
//                     key={workspace.id}
//                     onClick={() => {
//                       setCreateWorkspaceId(workspace.id);
//                       setCreateWorkspaceName(workspace.name);
//                       setShowCreate(true);
//                     }}
//                     className="bg-gray-50 hover:bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors text-left"
//                   >
//                     <div className="font-medium text-gray-900">{workspace.name}</div>
//                     <div className="text-sm text-gray-600 mt-1">Create new board</div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <CreateBoardForm
//         isOpen={showCreate}
//         onClose={handleCloseCreate}
//         onSubmit={handleCreateBoard}
//         workspaceId={createWorkspaceId || ''}
//         workspaceName={createWorkspaceName}
//       />
//     </div>
//   );
// }



