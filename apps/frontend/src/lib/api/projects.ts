// import api from '@/lib/api/index';
// import { Project } from '@/types/project';
// import { CreateProjectData } from '@/types/project';
// import { UpdateProjectData } from '@/types/project';

// export const projectApi = {
//   // Create a new project
//   async create(data: CreateProjectData) {
//     const response = await api.post('/projects', data);
//     return response.data;
//   },

//   // Update a project
//   async update(id: string, data: UpdateProjectData) {
//     const response = await api.put(`/projects/${id}`, data);
//     return response.data;
//   },

//   // Archive a project
//   async archive(id: string) {
//     const response = await api.put(`/projects/${id}/archive`);
//     return response.data;
//   },

//   // Get projects by workspace
//   async getByWorkspace(workspaceId: string) {
//     const response = await api.get(`/workspaces/${workspaceId}/projects`);
//     return response.data;
//   },

//   // Get all projects for current user
//   async getAll() {
//     const response = await api.get('/projects');
//     return response.data;
//   },

//   // Get project by ID
//   async getById(id: string) {
//     const response = await api.get(`/projects/${id}`);
//     return response.data;
//   },

//   // Delete a project
//   async delete(id: string) {
//     const response = await api.delete(`/projects/${id}`);
//     return response.data;
//   },

//   // Restore an archived project
//   async restore(id: string) {
//     const response = await api.put(`/projects/${id}/restore`);
//     return response.data;
//   }
// };