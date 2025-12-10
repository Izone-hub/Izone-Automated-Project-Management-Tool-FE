


// import { create } from 'zustand';
// import { Workspace, CreateWorkspaceData, UpdateWorkspaceData } from '@/types/workspace';
// import * as api from '@/lib/api/workspaces';

// interface WorkspaceStoreState {
//   workspaces: Workspace[];
//   currentWorkspace: Workspace | null;
//   selectedWorkspaceId: string | null;
//   isLoading: boolean;
//   error: string | null;
// }

// interface WorkspaceStoreActions {
//   fetchWorkspaces: () => Promise<void>;
//   fetchWorkspaceById: (id: string) => Promise<void>;
//   createWorkspace: (data: CreateWorkspaceData) => Promise<Workspace>;
//   updateWorkspace: (id: string, data: UpdateWorkspaceData) => Promise<void>;
//   deleteWorkspace: (id: string) => Promise<void>;
//   selectWorkspace: (id: string) => void;
//   setCurrentWorkspace: (workspace: Workspace | null) => void;
//   clearError: () => void;
//   getSelectedWorkspace: () => Workspace | undefined;
// }

// const transformWorkspace = (backendWorkspace: any): Workspace => {
//   return {
//     ...backendWorkspace,
//     visibility: 'private' as const,
//     color: '#6366f1',
//     createdBy: backendWorkspace.owner_id,
//     createdAt: new Date(backendWorkspace.created_at),
//     updatedAt: new Date(backendWorkspace.updated_at),
//     memberCount: 1,
//     boardCount: 0,
//   };
// };

// const useWorkspaceStore = create<WorkspaceStoreState & WorkspaceStoreActions>((set, get) => ({
//   // Initial state
//   workspaces: [],
//   currentWorkspace: null,
//   selectedWorkspaceId: null,
//   isLoading: false,
//   error: null,

//   // Actions
//   fetchWorkspaces: async () => {
//     set({ isLoading: true, error: null });
//     try {
//       const backendWorkspaces = await api.getWorkspaces();
//       const workspaces = backendWorkspaces.map(transformWorkspace);
//       set({ workspaces, isLoading: false });
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Failed to fetch workspaces';
//       set({ 
//         error: errorMessage,
//         isLoading: false 
//       });
//       console.error('Error fetching workspaces:', error);
//     }
//   },

//   fetchWorkspaceById: async (id: string) => {
//     set({ isLoading: true, error: null });
//     try {
//       const backendWorkspace = await api.getWorkspaceById(id);
//       const workspace = transformWorkspace(backendWorkspace);
//       set({ 
//         currentWorkspace: workspace,
//         selectedWorkspaceId: id,
//         isLoading: false 
//       });
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Failed to fetch workspace';
//       set({ 
//         error: errorMessage,
//         isLoading: false 
//       });
//       console.error(`Error fetching workspace ${id}:`, error);
//     }
//   },

//   createWorkspace: async (data: CreateWorkspaceData) => {
//     set({ isLoading: true, error: null });
//     try {
//       // Check if we have token before making request
//       if (typeof window !== 'undefined') {
//         const hasToken = localStorage.getItem('access_token') || 
//                         localStorage.getItem('token') ||
//                         localStorage.getItem('auth_token');
//         if (!hasToken) {
//           throw new Error('You need to login first. No authentication token found.');
//         }
//       }

//       const backendWorkspace = await api.createWorkspace(data);
//       const workspace = transformWorkspace(backendWorkspace);
      
//       set(state => ({
//         workspaces: [...state.workspaces, workspace],
//         currentWorkspace: workspace,
//         selectedWorkspaceId: workspace.id,
//         isLoading: false
//       }));
      
//       return workspace;
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Failed to create workspace';
//       set({ 
//         error: errorMessage,
//         isLoading: false 
//       });
//       console.error('Error creating workspace:', error);
//       throw error;
//     }
//   },

//   updateWorkspace: async (id: string, data: UpdateWorkspaceData) => {
//     set({ isLoading: true, error: null });
//     try {
//       const backendWorkspace = await api.updateWorkspace(id, data);
//       const updatedWorkspace = transformWorkspace(backendWorkspace);
      
//       set(state => ({
//         workspaces: state.workspaces.map(w => 
//           w.id === id ? updatedWorkspace : w
//         ),
//         currentWorkspace: state.currentWorkspace?.id === id ? updatedWorkspace : state.currentWorkspace,
//         isLoading: false
//       }));
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Failed to update workspace';
//       set({ 
//         error: errorMessage,
//         isLoading: false 
//       });
//       console.error(`Error updating workspace ${id}:`, error);
//       throw error;
//     }
//   },

//   deleteWorkspace: async (id: string) => {
//     set({ isLoading: true, error: null });
//     try {
//       await api.deleteWorkspace(id);
      
//       set(state => ({
//         workspaces: state.workspaces.filter(w => w.id !== id),
//         currentWorkspace: state.currentWorkspace?.id === id ? null : state.currentWorkspace,
//         selectedWorkspaceId: state.selectedWorkspaceId === id ? null : state.selectedWorkspaceId,
//         isLoading: false
//       }));
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Failed to delete workspace';
//       set({ 
//         error: errorMessage,
//         isLoading: false 
//       });
//       console.error(`Error deleting workspace ${id}:`, error);
//       throw error;
//     }
//   },

//   selectWorkspace: (id: string) => {
//     const { workspaces } = get();
//     const workspace = workspaces.find(w => w.id === id);
//     set({ 
//       selectedWorkspaceId: id,
//       currentWorkspace: workspace || null
//     });
//   },

//   setCurrentWorkspace: (workspace: Workspace | null) => {
//     set({ currentWorkspace: workspace });
//   },

//   clearError: () => {
//     set({ error: null });
//   },

//   getSelectedWorkspace: () => {
//     const { workspaces, selectedWorkspaceId } = get();
//     return workspaces.find(w => w.id === selectedWorkspaceId);
//   },
// }));

// export { useWorkspaceStore };










// // import { create } from 'zustand';
// // import { Workspace, CreateWorkspaceData, UpdateWorkspaceData } from '@/types/workspace';
// // import { workspaceAPI } from '@/lib/api/workspaces';

// // interface WorkspaceStore {
// //   // State
// //   workspaces: Workspace[];
// //   currentWorkspace: Workspace | null;
// //   selectedWorkspaceId: string | null; // New: Track selected workspace ID
// //   isLoading: boolean;
// //   error: string | null;
  
// //   // Actions
// //   fetchWorkspaces: () => Promise<void>;
// //   fetchWorkspaceById: (id: string) => Promise<void>;
// //   createWorkspace: (data: CreateWorkspaceData) => Promise<Workspace>;
// //   updateWorkspace: (id: string, data: UpdateWorkspaceData) => Promise<void>;
// //   deleteWorkspace: (id: string) => Promise<void>;
  
// //   // Selection actions
// //   selectWorkspace: (id: string) => void; // New: Select workspace by ID
// //   setCurrentWorkspace: (workspace: Workspace | null) => void;
// //   clearError: () => void;
  
// //   // Getters
// //   getSelectedWorkspace: () => Workspace | undefined; // New: Get selected workspace
// // }

// // export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
// //   // Initial state
// //   workspaces: [],
// //   currentWorkspace: null,
// //   selectedWorkspaceId: null,
// //   isLoading: false,
// //   error: null,

// //   // Fetch all workspaces
// //   fetchWorkspaces: async () => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const workspaces = await workspaceAPI.getAllWorkspaces();
// //       set({ workspaces, isLoading: false });
// //     } catch (error) {
// //       set({ 
// //         error: error instanceof Error ? error.message : 'Failed to fetch workspaces',
// //         isLoading: false 
// //       });
// //     }
// //   },

// //   // Fetch workspace by ID
// //   fetchWorkspaceById: async (id: string) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const workspace = await workspaceAPI.getWorkspaceById(id);
// //       if (workspace) {
// //         set({ 
// //           currentWorkspace: workspace, 
// //           selectedWorkspaceId: id,
// //           isLoading: false 
// //         });
// //       } else {
// //         set({ error: 'Workspace not found', isLoading: false });
// //       }
// //     } catch (error) {
// //       set({ 
// //         error: error instanceof Error ? error.message : 'Failed to fetch workspace',
// //         isLoading: false 
// //       });
// //     }
// //   },

// //   // Create new workspace
// //   createWorkspace: async (data: CreateWorkspaceData) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const newWorkspace = await workspaceAPI.createWorkspace(data);
// //       set(state => ({ 
// //         workspaces: [...state.workspaces, newWorkspace],
// //         selectedWorkspaceId: newWorkspace.id, // Auto-select newly created workspace
// //         isLoading: false 
// //       }));
// //       return newWorkspace;
// //     } catch (error) {
// //       set({ 
// //         error: error instanceof Error ? error.message : 'Failed to create workspace',
// //         isLoading: false 
// //       });
// //       throw error;
// //     }
// //   },

// //   // Update existing workspace
// //   updateWorkspace: async (id: string, data: UpdateWorkspaceData) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const updatedWorkspace = await workspaceAPI.updateWorkspace(id, data);
// //       set(state => ({
// //         workspaces: state.workspaces.map(w => 
// //           w.id === id ? updatedWorkspace : w
// //         ),
// //         currentWorkspace: state.currentWorkspace?.id === id ? updatedWorkspace : state.currentWorkspace,
// //         isLoading: false
// //       }));
// //     } catch (error) {
// //       set({ 
// //         error: error instanceof Error ? error.message : 'Failed to update workspace',
// //         isLoading: false 
// //       });
// //       throw error;
// //     }
// //   },

// //   // Delete workspace
// //   deleteWorkspace: async (id: string) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       await workspaceAPI.deleteWorkspace(id);
// //       set(state => ({
// //         workspaces: state.workspaces.filter(w => w.id !== id),
// //         currentWorkspace: state.currentWorkspace?.id === id ? null : state.currentWorkspace,
// //         selectedWorkspaceId: state.selectedWorkspaceId === id ? null : state.selectedWorkspaceId,
// //         isLoading: false
// //       }));
// //     } catch (error) {
// //       set({ 
// //         error: error instanceof Error ? error.message : 'Failed to delete workspace',
// //         isLoading: false 
// //       });
// //       throw error;
// //     }
// //   },

// //   // Select workspace by ID (NEW FUNCTION)
// //   selectWorkspace: (id: string) => {
// //     const { workspaces } = get();
// //     const selectedWorkspace = workspaces.find(w => w.id === id);
    
// //     set({ 
// //       selectedWorkspaceId: id,
// //       currentWorkspace: selectedWorkspace || null 
// //     });
// //   },

// //   // Set current workspace
// //   setCurrentWorkspace: (workspace: Workspace | null) => {
// //     set({ 
// //       currentWorkspace: workspace,
// //       selectedWorkspaceId: workspace?.id || null 
// //     });
// //   },

// //   // Clear error
// //   clearError: () => {
// //     set({ error: null });
// //   },

// //   // Get selected workspace (helper)
// //   getSelectedWorkspace: () => {
// //     const { workspaces, selectedWorkspaceId } = get();
// //     return workspaces.find(w => w.id === selectedWorkspaceId);
// //   },
// // }));

// // // store/workspace.store.ts
// // import { create } from 'zustand';
// // import { Workspace, CreateWorkspaceData, UpdateWorkspaceData } from '@/types/workspace';
// // import { workspaceApi } from '@/lib/api/workspaces';

// // interface WorkspaceStore {
// //   // State
// //   workspaces: Workspace[];
// //   currentWorkspace: Workspace | null;
// //   selectedWorkspaceId: string | null;
// //   isLoading: boolean;
// //   error: string | null;
  
// //   // Actions
// //   fetchWorkspaces: () => Promise<void>;
// //   fetchWorkspaceById: (id: string) => Promise<void>;
// //   createWorkspace: (data: CreateWorkspaceData) => Promise<Workspace>;
// //   updateWorkspace: (id: string, data: UpdateWorkspaceData) => Promise<void>;
// //   deleteWorkspace: (id: string) => Promise<void>;
// //   selectWorkspace: (id: string | null) => void;
// //   setCurrentWorkspace: (workspace: Workspace | null) => void;
// //   clearError: () => void;
  
// //   // Derived getter
// //   getSelectedWorkspace: () => Workspace | null;
// // }

// // export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
// //   // Initial state
// //   workspaces: [],
// //   currentWorkspace: null,
// //   selectedWorkspaceId: null,
// //   isLoading: false,
// //   error: null,

// //   // Fetch all workspaces
// //   fetchWorkspaces: async () => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const workspaces = await workspaceApi.getWorkspaces();
      
// //       // Transform backend data to frontend format if needed
// //       const transformedWorkspaces = workspaces.map(workspace => ({
// //         ...workspace,
// //         createdBy: workspace.owner_id,
// //         createdAt: new Date(workspace.created_at),
// //         updatedAt: new Date(workspace.updated_at),
// //         // Add default values for frontend-only fields
// //         visibility: 'private' as const,
// //         color: '#6366f1',
// //         memberCount: 1,
// //         boardCount: 0,
// //       }));
      
// //       set({ workspaces: transformedWorkspaces, isLoading: false });
// //     } catch (error) {
// //       set({ 
// //         error: error instanceof Error ? error.message : 'Failed to fetch workspaces', 
// //         isLoading: false 
// //       });
// //     }
// //   },

// //   // Fetch single workspace by ID
// //   fetchWorkspaceById: async (id: string) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const workspace = await workspaceApi.getWorkspaceById(id);
      
// //       // Transform backend data
// //       const transformedWorkspace = {
// //         ...workspace,
// //         createdBy: workspace.owner_id,
// //         createdAt: new Date(workspace.created_at),
// //         updatedAt: new Date(workspace.updated_at),
// //         visibility: 'private' as const,
// //         color: '#6366f1',
// //         memberCount: 1,
// //         boardCount: 0,
// //       };
      
// //       set({ currentWorkspace: transformedWorkspace, isLoading: false });
// //     } catch (error) {
// //       set({ 
// //         error: error instanceof Error ? error.message : 'Failed to fetch workspace', 
// //         isLoading: false 
// //       });
// //     }
// //   },

// //   // Create new workspace
// //   createWorkspace: async (data: CreateWorkspaceData): Promise<Workspace> => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       // You might need to get the current user ID from your auth store
// //       const ownerId = localStorage.getItem('userId') || 'current-user-id';
      
// //       const workspaceData = {
// //         ...data,
// //         owner_id: ownerId,
// //       };
      
// //       const workspace = await workspaceApi.createWorkspace(workspaceData);
      
// //       // Transform backend response
// //       const transformedWorkspace = {
// //         ...workspace,
// //         createdBy: workspace.owner_id,
// //         createdAt: new Date(workspace.created_at),
// //         updatedAt: new Date(workspace.updated_at),
// //         visibility: 'private' as const,
// //         color: '#6366f1',
// //         memberCount: 1,
// //         boardCount: 0,
// //       };
      
// //       // Add to local state
// //       set(state => ({
// //         workspaces: [...state.workspaces, transformedWorkspace],
// //         isLoading: false,
// //       }));
      
// //       return transformedWorkspace;
// //     } catch (error) {
// //       set({ 
// //         error: error instanceof Error ? error.message : 'Failed to create workspace', 
// //         isLoading: false 
// //       });
// //       throw error;
// //     }
// //   },

// //   // Update workspace
// //   updateWorkspace: async (id: string, data: UpdateWorkspaceData) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const workspace = await workspaceApi.updateWorkspace(id, data);
      
// //       // Transform backend response
// //       const transformedWorkspace = {
// //         ...workspace,
// //         createdBy: workspace.owner_id,
// //         createdAt: new Date(workspace.created_at),
// //         updatedAt: new Date(workspace.updated_at),
// //         visibility: 'private' as const,
// //         color: '#6366f1',
// //         memberCount: 1,
// //         boardCount: 0,
// //       };
      
// //       // Update in local state
// //       set(state => ({
// //         workspaces: state.workspaces.map(w => 
// //           w.id === id ? transformedWorkspace : w
// //         ),
// //         currentWorkspace: state.currentWorkspace?.id === id 
// //           ? transformedWorkspace 
// //           : state.currentWorkspace,
// //         isLoading: false,
// //       }));
// //     } catch (error) {
// //       set({ 
// //         error: error instanceof Error ? error.message : 'Failed to update workspace', 
// //         isLoading: false 
// //       });
// //       throw error;
// //     }
// //   },

// //   // Delete workspace
// //   deleteWorkspace: async (id: string) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       await workspaceApi.deleteWorkspace(id);
      
// //       // Remove from local state
// //       set(state => ({
// //         workspaces: state.workspaces.filter(w => w.id !== id),
// //         currentWorkspace: state.currentWorkspace?.id === id 
// //           ? null 
// //           : state.currentWorkspace,
// //         selectedWorkspaceId: state.selectedWorkspaceId === id 
// //           ? null 
// //           : state.selectedWorkspaceId,
// //         isLoading: false,
// //       }));
// //     } catch (error) {
// //       set({ 
// //         error: error instanceof Error ? error.message : 'Failed to delete workspace', 
// //         isLoading: false 
// //       });
// //       throw error;
// //     }
// //   },

// //   // Select workspace
// //   selectWorkspace: (id: string | null) => {
// //     set({ selectedWorkspaceId: id });
// //   },

// //   // Set current workspace
// //   setCurrentWorkspace: (workspace: Workspace | null) => {
// //     set({ currentWorkspace: workspace });
// //   },

// //   // Clear error
// //   clearError: () => {
// //     set({ error: null });
// //   },

// //   // Get selected workspace
// //   getSelectedWorkspace: () => {
// //     const { workspaces, selectedWorkspaceId } = get();
// //     return workspaces.find(w => w.id === selectedWorkspaceId) || null;
// //   },
// // }));




