import api from '@/lib/axios';
import { Attachment } from '@/types/attachment';

export const attachmentService = {
    uploadAttachment: async (cardId: string, file: File): Promise<Attachment> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('card_id', cardId);

        const response = await api.post<Attachment>('/attachments/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getTaskAttachments: async (cardId: string): Promise<Attachment[]> => {
        const response = await api.get<Attachment[]>(`/attachments/task/${cardId}`);
        return response.data;
    },

    deleteAttachment: async (attachmentId: string): Promise<void> => {
        await api.delete(`/attachments/${attachmentId}`);
    },
};
