'use client';

import { useState, useEffect } from 'react';

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Development Team',
    description: 'Software development projects',
    members: ['user-1', 'user-2'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // {
  //   id: 'ws-2', 
  //   name: 'Marketing',
  //   description: 'Marketing campaigns and content',
  //   members: ['user-1', 'user-3'],
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // }
];

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWorkspaces = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setWorkspaces(mockWorkspaces);
      setIsLoading(false);
    };
    
    loadWorkspaces();
  }, []);

  const createWorkspace = async (workspaceData: { name: string; description?: string }): Promise<Workspace> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newWorkspace: Workspace = {
          id: `ws-${Date.now()}`,
          name: workspaceData.name,
          description: workspaceData.description,
          members: ['user-1'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setWorkspaces(prev => [...prev, newWorkspace]);
        resolve(newWorkspace);
      }, 500);
    });
  };

  return {
    workspaces,
    isLoading,
    createWorkspace,
  };
}







// import { useState, useEffect } from 'react';
// import { Workspace } from '@/types';
// import { mockWorkspaces } from '@/lib/mockData';

// export function useWorkspace() {
//   const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

//   useEffect(() => {
//     // Load initial workspaces from mock data
//     setWorkspaces(mockWorkspaces);
//   }, []);

//   const createWorkspace = async (workspaceData: { name: string; description?: string }): Promise<Workspace> => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const newWorkspace: Workspace = {
//           id: `ws-${Date.now()}`,
//           name: workspaceData.name,
//           description: workspaceData.description,
//           members: ['user-1'], // Default member
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         };
        
//         setWorkspaces(prev => [...prev, newWorkspace]);
//         resolve(newWorkspace);
//       }, 500);
//     });
//   };

//   const updateWorkspace = async (workspaceId: string, updates: Partial<Workspace>): Promise<Workspace> => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         setWorkspaces(prev => 
//           prev.map(ws => 
//             ws.id === workspaceId 
//               ? { ...ws, ...updates, updatedAt: new Date().toISOString() }
//               : ws
//           )
//         );
//         const updated = workspaces.find(ws => ws.id === workspaceId);
//         resolve(updated || {} as Workspace);
//       }, 500);
//     });
//   };

//   return {
//     workspaces,
//     createWorkspace,
//     updateWorkspace,
//   };
// }


// // hooks/workspaces/use-workspaces.ts
// 'use client';

// import { useState, useEffect } from 'react';

// // Types that match your component structure
// export interface Member {
//   id: string;
//   name: string;
//   email: string;
//   avatar: string;
//   role: 'owner' | 'member';
// }

// export interface Board {
//   id: string;
//   name: string;
//   description: string;
//   workspaceId: string;
//   members: Member[];
//   lists: List[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface List {
//   id: string;
//   title: string;
//   cards: Card[];
// }

// export interface Card {
//   id: string;
//   title: string;
//   description?: string;
// }

// export interface Workspace {
//   id: string;
//   name: string;
//   description: string;
//   color: string;
//   emoji: string;
//   members: Member[];
//   boards: Board[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// // Mock data - Only Web Development workspace
// const initialWorkspaces: Workspace[] = [
//   {
//     id: '1',
//     name: 'Web Development',
//     description: 'Full-stack web development projects and tasks',
//     color: '#3B82F6',
//     emoji: '💻',
//     members: [
//       { 
//         id: '1', 
//         name: 'John Doe', 
//         email: 'john@example.com', 
//         avatar: '', 
//         role: 'owner' 
//       },
//       { 
//         id: '2', 
//         name: 'Jane Smith', 
//         email: 'jane@example.com', 
//         avatar: '', 
//         role: 'member' 
//       },
//       { 
//         id: '3', 
//         name: 'Mike Johnson', 
//         email: 'mike@example.com', 
//         avatar: '', 
//         role: 'member' 
//       },
//     ],
//     boards: [
//       {
//         id: '1',
//         name: 'Frontend Development',
//         description: 'React, Next.js and UI components',
//         workspaceId: '1',
//         members: [],
//         lists: [
//           { 
//             id: '1', 
//             title: 'To Do', 
//             cards: [
//               { id: '1', title: 'Create responsive navbar' },
//               { id: '2', title: 'Implement dark mode' },
//             ] 
//           },
//           { 
//             id: '2', 
//             title: 'In Progress', 
//             cards: [
//               { id: '3', title: 'User dashboard components' },
//             ] 
//           },
//           { 
//             id: '3', 
//             title: 'Done', 
//             cards: [
//               { id: '4', title: 'Project setup and routing' },
//             ] 
//           },
//         ],
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         id: '2',
//         name: 'Backend API',
//         description: 'Server, database and API endpoints',
//         workspaceId: '1',
//         members: [],
//         lists: [
//           { 
//             id: '1', 
//             title: 'Planning', 
//             cards: [
//               { id: '1', title: 'Design database schema' },
//               { id: '2', title: 'Plan API endpoints' },
//             ] 
//           },
//           { 
//             id: '2', 
//             title: 'Development', 
//             cards: [
//               { id: '3', title: 'User authentication' },
//             ] 
//           },
//         ],
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         id: '3',
//         name: 'DevOps & Deployment',
//         description: 'CI/CD, hosting and deployment pipeline',
//         workspaceId: '1',
//         members: [],
//         lists: [
//           { 
//             id: '1', 
//             title: 'Setup', 
//             cards: [
//               { id: '1', title: 'Configure Vercel deployment' },
//               { id: '2', title: 'Setup environment variables' },
//             ] 
//           },
//         ],
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ],
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
// ];

// export function useWorkspaces() {
//   const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
//   const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Simulate API call
//     const loadWorkspaces = async () => {
//       setIsLoading(true);
//       try {
//         // In a real app, this would be an API call
//         await new Promise(resolve => setTimeout(resolve, 500));
//         setWorkspaces(initialWorkspaces);
//       } catch (error) {
//         console.error('Failed to load workspaces:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadWorkspaces();
//   }, []);

//   const createWorkspace = (workspaceData: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt' | 'boards'>) => {
//     const newWorkspace: Workspace = {
//       ...workspaceData,
//       id: Date.now().toString(),
//       boards: [],
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };
    
//     setWorkspaces(prev => [...prev, newWorkspace]);
//     return newWorkspace;
//   };

//   const createBoard = (workspaceId: string, boardData: Omit<Board, 'id' | 'createdAt' | 'updatedAt' | 'lists' | 'members'>) => {
//     const newBoard: Board = {
//       ...boardData,
//       id: Date.now().toString(),
//       workspaceId,
//       members: [],
//       lists: [
//         { id: '1', title: 'To Do', cards: [] },
//         { id: '2', title: 'In Progress', cards: [] },
//         { id: '3', title: 'Done', cards: [] },
//       ],
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     setWorkspaces(prev => prev.map(ws => 
//       ws.id === workspaceId 
//         ? { ...ws, boards: [...ws.boards, newBoard] }
//         : ws
//     ));
    
//     return newBoard;
//   };

//   const updateBoard = (workspaceId: string, boardId: string, updates: Partial<Board>) => {
//     setWorkspaces(prev => prev.map(ws => 
//       ws.id === workspaceId 
//         ? { 
//             ...ws, 
//             boards: ws.boards.map(b => 
//               b.id === boardId 
//                 ? { ...b, ...updates, updatedAt: new Date() }
//                 : b
//             ) 
//           }
//         : ws
//     ));
//   };

//   const updateWorkspace = (workspaceId: string, updates: Partial<Workspace>) => {
//     setWorkspaces(prev => prev.map(workspace => 
//       workspace.id === workspaceId 
//         ? { ...workspace, ...updates, updatedAt: new Date() }
//         : workspace
//     ));
//   };

//   const deleteWorkspace = (workspaceId: string) => {
//     setWorkspaces(prev => prev.filter(workspace => workspace.id !== workspaceId));
//     if (selectedWorkspace?.id === workspaceId) {
//       setSelectedWorkspace(null);
//     }
//   };

//   const deleteBoard = (workspaceId: string, boardId: string) => {
//     setWorkspaces(prev => prev.map(workspace => 
//       workspace.id === workspaceId 
//         ? { ...workspace, boards: workspace.boards.filter(board => board.id !== boardId) }
//         : workspace
//     ));
//   };

//   const addMemberToWorkspace = (workspaceId: string, member: Omit<Member, 'id'>) => {
//     const newMember = {
//       ...member,
//       id: Date.now().toString(),
//     };

//     setWorkspaces(prev => prev.map(workspace => 
//       workspace.id === workspaceId 
//         ? { 
//             ...workspace, 
//             members: [...workspace.members, newMember],
//             updatedAt: new Date()
//           }
//         : workspace
//     ));
//   };

//   return {
//     // State
//     workspaces,
//     selectedWorkspace,
//     isLoading,
    
//     // Setters
//     setSelectedWorkspace,
    
//     // Workspace operations
//     createWorkspace,
//     updateWorkspace,
//     deleteWorkspace,
//     addMemberToWorkspace,
    
//     // Board operations
//     createBoard,
//     updateBoard,
//     deleteBoard,
//   };
// }