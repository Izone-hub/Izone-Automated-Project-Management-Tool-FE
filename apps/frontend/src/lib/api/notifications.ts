import api from '@/lib/axios';

export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    link?: string;
    is_read: boolean;
    created_at: string;
}

export const notificationService = {
    getNotifications: async () => {
        const response = await api.get<Notification[]>('/notifications/');
        return response.data;
    },

    markRead: async (id: string) => {
        const response = await api.patch(`/notifications/${id}/read`);
        return response.data;
    },

    markAllRead: async () => {
        const response = await api.patch('/notifications/read-all');
        return response.data;
    }
};
