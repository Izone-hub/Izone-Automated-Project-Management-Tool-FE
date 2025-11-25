// // src/components/Workspace/WorkspaceSidebar.tsx
// 'use client';
// import { useState } from 'react';
// import { Workspace } from '@/types';

// interface WorkspaceSidebarProps {
//   currentWorkspaceId?: number;
//   onWorkspaceSelect: (workspace: Workspace) => void;
// }

// // Mock workspaces data for the sidebar
// const mockWorkspaces: Workspace[] = [
//   {
//     id: 1,
//     name: "AMU Workspace",
//     description: "University Project Workspace",
//     boards: []
//   },
//   {
//     id: 2,
//     name: "Personal Workspace", 
//     description: "Personal Projects",
//     boards: []
//   },
//   {
//     id: 3,
//     name: "Team Collaboration",
//     description: "Team Projects",
//     boards: []
//   }
// ];

// export default function WorkspaceSidebar({ 
//   currentWorkspaceId, 
//   onWorkspaceSelect 
// }: WorkspaceSidebarProps) {
//   const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
//   const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
//   const [newWorkspaceName, setNewWorkspaceName] = useState('');

//   const handleCreateWorkspace = () => {
//     if (newWorkspaceName.trim()) {
//       const newWorkspace: Workspace = {
//         id: Date.now(), // Temporary ID
//         name: newWorkspaceName,
//         boards: []
//       };
//       setWorkspaces([...workspaces, newWorkspace]);
//       setNewWorkspaceName('');
//       setIsCreatingWorkspace(false);
//       onWorkspaceSelect(newWorkspace);
//     }
//   };

//   return (
//     <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
//       {/* Header */}
//       <div className="p-4 border-b border-gray-700">
//         <h1 className="text-xl font-bold">Trello Clone</h1>
//         <p className="text-sm text-gray-400 mt-1">Workspaces</p>
//       </div>

//       {/* Workspaces List */}
//       <div className="flex-1 overflow-y-auto p-4">
//         <div className="mb-6">
//           <h2 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
//             Your Workspaces
//           </h2>
//           <div className="space-y-1">
//             {workspaces.map((workspace) => (
//               <button
//                 key={workspace.id}
//                 onClick={() => onWorkspaceSelect(workspace)}
//                 className={`w-full text-left px-3 py-3 rounded-md transition-all duration-200 ${
//                   currentWorkspaceId === workspace.id
//                     ? 'bg-blue-600 text-white shadow-lg'
//                     : 'text-gray-300 hover:bg-gray-800 hover:text-white'
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-sm font-bold ${
//                     currentWorkspaceId === workspace.id ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'
//                   }`}>
//                     {workspace.name.charAt(0)}
//                   </div>
//                   <div className="flex-1 text-left">
//                     <div className="font-medium text-sm">{workspace.name}</div>
//                     <div className="text-xs text-gray-400 truncate">{workspace.description}</div>
//                   </div>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Create Workspace Section */}
//         {isCreatingWorkspace ? (
//           <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
//             <h3 className="text-sm font-medium mb-2">Create Workspace</h3>
//             <input
//               type="text"
//               value={newWorkspaceName}
//               onChange={(e) => setNewWorkspaceName(e.target.value)}
//               placeholder="Workspace name"
//               className="w-full px-3 py-2 bg-gray-700 text-white rounded text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               autoFocus
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter') handleCreateWorkspace();
//                 if (e.key === 'Escape') setIsCreatingWorkspace(false);
//               }}
//             />
//             <div className="flex gap-2">
//               <button
//                 onClick={handleCreateWorkspace}
//                 className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
//               >
//                 Create
//               </button>
//               <button
//                 onClick={() => setIsCreatingWorkspace(false)}
//                 className="px-3 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors"
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         ) : (
//           <button
//             onClick={() => setIsCreatingWorkspace(true)}
//             className="w-full flex items-center gap-2 px-3 py-3 text-gray-300 hover:bg-gray-800 rounded-md transition-colors duration-200 border border-dashed border-gray-600 hover:border-gray-500"
//           >
//             <div className="w-8 h-8 bg-gray-700 rounded-sm flex items-center justify-center">
//               <span className="text-lg">+</span>
//             </div>
//             <span className="font-medium">Create Workspace</span>
//           </button>
//         )}
//       </div>

//       {/* Navigation Menu */}
//       <div className="p-4 border-t border-gray-700">
//         <nav className="space-y-1">
//           <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md text-sm font-medium transition-colors">
//             📊 Dashboard
//           </button>
//           <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md text-sm font-medium transition-colors">
//             👥 Members
//           </button>
//           <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md text-sm font-medium transition-colors">
//             ⚙️ Settings
//           </button>
//         </nav>
//       </div>

//       {/* User Profile */}
//       <div className="p-4 border-t border-gray-700">
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">
//             U
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium truncate">User Name</p>
//             <p className="text-xs text-gray-400">Free Plan</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }