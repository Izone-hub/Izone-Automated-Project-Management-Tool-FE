'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Board } from '@/types/board';
import { Workspace } from '@/types/workspace';
import { mockWorkspaces, mockBoards } from '@/lib/mockData';
import {useWorkspaces} from '@/hooks/useWorkspaces';
import { useBoards } from '@/hooks/useBoards';
import { CreateBoardForm } from '@/components/boards/CreateBoardForm'; // New direct board form

export default function DashboardPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBoardForm, setShowBoardForm] = useState(false);
  const [showWorkspaceForm, setShowWorkspaceForm] = useState(false);

  const { boards: allBoards, createBoard } = useBoards();
  const { workspaces: workspacesData, createWorkspace } = useWorkspaces();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWorkspaces(mockWorkspaces);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleCreateBoard = (boardData: { name: string; description?: string }) => {
    // Direct board creation - no intermediate project
    const board = createBoard({
      name: boardData.name,
      description: boardData.description,
      privacy: 'workspace', // default
      background: '#4f46e5' // default
    });
    setShowBoardForm(false);
  };

  const handleCreateWorkspace = async (workspaceData: { name: string; description?: string }) => {
    await createWorkspace(workspaceData);
    setShowWorkspaceForm(false);
  };

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
        {/* Header with TWO clear buttons */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowWorkspaceForm(true)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Create Workspace
            </button>
            <button
              onClick={() => setShowBoardForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Board
            </button>
          </div>
        </div>

        {/* Create Board Modal */}
        {showBoardForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Create New Board</h2>
                  <button
                    onClick={() => setShowBoardForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <CreateBoardForm 
                  onSubmit={handleCreateBoard}
                  onCancel={() => setShowBoardForm(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Create Workspace Modal */}
        {showWorkspaceForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Create New Workspace</h2>
                  <button
                    onClick={() => setShowWorkspaceForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Workspace Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Marketing Team"
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      placeholder="Describe this workspace"
                      className="w-full p-2 border rounded"
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setShowWorkspaceForm(false)}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // Get form data and call handleCreateWorkspace
                        const name = document.querySelector('input')?.value;
                        const desc = document.querySelector('textarea')?.value;
                        if (name) {
                          handleCreateWorkspace({ name, description: desc });
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Create Workspace
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workspaces Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Workspaces</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
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
                    {mockBoards.filter(b => b.workspaceId === workspace.id).length} boards
                  </span>
                </div>
              </Link>
            ))}
            
            {/* Create Workspace Card */}
            <button
              onClick={() => setShowWorkspaceForm(true)}
              className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-6 hover:border-gray-400 transition-colors flex flex-col items-center justify-center text-center w-full"
            >
              <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Workspace</h3>
              <p className="text-sm text-gray-500">Start organizing boards</p>
            </button>
          </div>
        </div>

        {/* All Boards Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Boards ({allBoards.length})</h2>
          {allBoards.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-600 mb-4">No boards yet. Create a workspace or board to get started.</p>
              <button
                onClick={() => setShowBoardForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Board
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full">
              {allBoards.map(board => {
                const workspace = workspaces.find(ws => ws.id === board.workspaceId);
                
                return (
                  <Link
                    key={board.id}
                    href={`/b/${board.id}/${board.name?.toLowerCase().replace(/[^a-z0-9]+/g,'-') || 'board'}`}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow block w-full"
                  >
                    <div className={`h-3 rounded-t-lg mb-3 ${board.background === 'blue' ? 'bg-blue-500' : 'bg-gray-500'}`} />
                    <h4 className="font-semibold text-gray-900 mb-2 truncate">
                      {board.name}
                    </h4>
                    {board.description && (
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {board.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{workspace?.name || 'Personal'}</span>
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






// // 'use client';

// // import { useState, useEffect } from 'react';
// // import Link from 'next/link';
// // import { Workspace, Board } from '@/types/board';
// // import { mockWorkspaces, mockBoards } from '@/lib/mockData';
// // import { useProjects } from '@/hooks/useProject';
// // import { useBoards } from '@/hooks/useBoards';


// // export default function DashboardPage() {
// //   const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [showProjectForm, setShowProjectForm] = useState(false);

// //   // Use hooks with safe defaults
// //   const { projects = [], createProject, archiveProject } = useProjects();
// //   const { boards: trelloBoards = [], createBoard } = useBoards();

// //   useEffect(() => {
// //     const loadData = async () => {
// //       setIsLoading(true);
// //       await new Promise(resolve => setTimeout(resolve, 1000));
// //       setWorkspaces(mockWorkspaces || []);
// //       setIsLoading(false);
// //     };

// //     loadData();
// //   }, []);

// //   const handleCreateProject = (projectData: { name: string; description?: string }) => {
// //     try {
// //       console.log('Dashboard: Creating project', projectData);
// //       const project = createProject(projectData);
      
// //       // Create a default board for the project with proper ID
// //       if (createBoard) {
// //         const boardId = `board-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
// //         const board = createBoard({
// //           id: boardId,
// //           name: `${projectData.name} Board`,
// //           title: `${projectData.name} Board`,
// //           projectId: project.id,
// //           description: projectData.description,
// //           lists: [] // Start with empty lists
// //         });
        
// //         console.log('Dashboard: Created board for project', board);
// //       }
// //       setShowProjectForm(false);
// //     } catch (error) {
// //       console.error('Error creating project:', error);
// //     }
// //   };

// //   // ... rest of your dashboard code remains the same




// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import {  Board } from '@/types/board';
// import { Workspace } from '@/types/workspace';
// import { mockWorkspaces, mockBoards } from '@/lib/mockData';
// import { useProjects } from '@/hooks/useProject';
// import { useBoards } from '@/hooks/useBoards';
// import ProjectForm from '@/components/projects/ProjectForm';

// export default function DashboardPage() {
//   const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showProjectForm, setShowProjectForm] = useState(false);

//   const { projects, createProject, archiveProject } = useProjects();
//   const { boards: trelloBoards = [], createBoard } = useBoards(); // Default to empty array

//   useEffect(() => {
//     const loadData = async () => {
//       setIsLoading(true);
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       setWorkspaces(mockWorkspaces);
//       setIsLoading(false);
//     };

//     loadData();
//   }, []);

//   const handleCreateProject = (projectData: { name: string; description?: string }) => {
//     const project = createProject(projectData);
//     // Create a default board for the project
//     createBoard({
//       name: `${projectData.name} Board`,
//       projectId: project.id,
//       description: projectData.description
//     });
//     setShowProjectForm(false);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   // Safe array access with default values
//   const safeBoards = mockBoards || [];
//   const safeTrelloBoards = trelloBoards || [];
  
//   // Combine and remove duplicates
//   const allBoards = [...safeBoards, ...safeTrelloBoards].reduce((acc: Board[], current) => {
//     const exists = acc.find(board => board.id === current.id);
//     if (!exists) {
//       acc.push(current);
//     }
//     return acc;
//   }, []);

//   const totalBoardsCount = allBoards.length;

//   return (
//     <div className="min-h-screen bg-gray-50 w-full">
//       <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8 flex justify-between items-center">
//           <h1 className="text-3xl font-bold text-gray-900">Workspaces</h1>
//           <button
//             onClick={() => setShowProjectForm(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Create Board
//           </button>
//         </div>

//         {/* Project Creation Modal */}
//         {showProjectForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg w-full max-w-md">
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-semibold">Create New Project</h2>
//                   <button
//                     onClick={() => setShowProjectForm(false)}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     ✕
//                   </button>
//                 </div>
//                 <ProjectForm 
//                   onSubmit={handleCreateProject}
//                   onCancel={() => setShowProjectForm(false)}
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Projects Section */}
//         {projects && projects.length > 0 && (
//           <div className="mb-12">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Projects</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
//               {projects.filter(p => !p.isArchived).map(project => {
//                 const projectBoard = safeTrelloBoards.find(b => b.projectId === project.id);
//                 return (
//                   <div
//                     key={project.id}
//                     className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow block w-full"
//                   >
//                     <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
//                     {project.description && (
//                       <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
//                     )}
//                     <div className="flex gap-2 mt-4">
//                       {projectBoard ? (
//                         <Link
//                           href={`/b/${projectBoard.id}/${projectBoard.name?.toLowerCase().replace(/[^a-z0-9]+/g,'-') || 'board'}`}
//                           className="flex-1 bg-blue-500 text-white text-center py-2 rounded text-sm hover:bg-blue-600"
//                         >
//                           Open Board
//                         </Link>
//                       ) : (
//                         <button className="flex-1 bg-gray-500 text-white text-center py-2 rounded text-sm cursor-not-allowed opacity-50">
//                           No Board
//                         </button>
//                       )}
//                       <button
//                         onClick={() => archiveProject(project.id)}
//                         className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
//                       >
//                         Archive
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

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
//                   {safeBoards.filter(b => b.workspaceId === workspace.id).length} boards
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
//           </Link>
//         </div>

//         {/* All Boards Section */}
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">All Boards ({totalBoardsCount})</h2>
//           {totalBoardsCount === 0 ? (
//             <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
//               <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
//               </svg>
//               <p className="text-gray-600 mb-4">No boards yet. Create a project or workspace to get started.</p>
//               <button
//                 onClick={() => setShowProjectForm(true)}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Create Your First Board
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full">
//               {allBoards.map(board => {
//                 const workspace = workspaces.find(ws => ws.id === board.workspaceId);
//                 const isTrelloBoard = !board.workspaceId; // Trello boards don't have workspaceId
                
//                 return (
//                   <Link
//                     key={board.id}
//                     href={`/b/${board.id}/${board.name?.toLowerCase().replace(/[^a-z0-9]+/g,'-') || board.title?.toLowerCase().replace(/[^a-z0-9]+/g,'-') || 'board'}`}
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
//                     <h4 className="font-semibold text-gray-900 mb-2 truncate">
//                       {board.name || board.title || 'Untitled Board'}
//                     </h4>
//                     {board.description && (
//                       <p className="text-gray-600 text-sm mb-2 line-clamp-2">
//                         {board.description}
//                       </p>
//                     )}
//                     <div className="flex items-center justify-between text-xs text-gray-500">
//                       <span>
//                         {isTrelloBoard ? 'Project' : workspace?.name || 'Workspace'}
//                       </span>
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



