import api from '@/lib/axios';

export interface ActivityLog {
    id: string;
    workspace_id: string;
    user_id: string;
    user_name?: string;
    user_avatar?: string;
    action: string;
    entity_type: string;
    entity_id?: string;
    details: string;
    created_at: string;
}

export const activityService = {
    getActivities: async (workspaceId: string): Promise<ActivityLog[]> => {
        const { data } = await api.get(`/activity/${workspaceId}`);
        return data;
    }
};
