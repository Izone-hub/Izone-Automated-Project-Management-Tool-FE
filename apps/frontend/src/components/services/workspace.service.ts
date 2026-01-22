import api from '@/lib/axios';
import { Workspace } from '@/types/workspace';
import { WorkspaceMember } from '@/types/member';


export const workspaceService = {
    async list(): Promise<Workspace[]> {
        const { data } = await api.get('/workspaces');
        return data;
    },


    async get(id: string): Promise<Workspace> {
        const { data } = await api.get(`/workspaces/${id}`);
        return data;
    },


    async create(payload: { name: string; description?: string; owner_id: string }) {
        const { data } = await api.post('/workspaces', payload);
        return data as Workspace;
    },


    async update(id: string, payload: { name?: string; description?: string }) {
        const { data } = await api.put(`/workspaces/${id}`, payload);
        return data as Workspace;
    },


    async remove(id: string) {
        const { data } = await api.delete(`/workspaces/${id}`);
        return data;
    },


    async members(id: string): Promise<WorkspaceMember[]> {
        const { data } = await api.get(`/workspaces/${id}/members`);
        return data;
    },


    async addMember(id: string, payload: { user_id: string; role: 'admin' | 'member' }) {
        const { data } = await api.post(`/workspaces/${id}/members`, payload);
        return data as WorkspaceMember;
    },


    async removeMember(id: string, userId: string) {
        const { data } = await api.delete(`/workspaces/${id}/members/${userId}`);
        return data;
    },
};