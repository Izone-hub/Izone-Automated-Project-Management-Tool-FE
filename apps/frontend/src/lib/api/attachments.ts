import api from '@/lib/axios';

export interface Attachment {
    id: string;
    card_id: string;
    file_name: string;
    file_type?: string;
    file_path: string;
    uploaded_at: string;
}

export const attachmentService = {
    // Upload a file
    async uploadFile(cardId: string, file: File): Promise<Attachment> {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await api.post(`/attachments/upload/${cardId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },

    // Get attachments for a card
    async getAttachments(cardId: string): Promise<Attachment[]> {
        const { data } = await api.get(`/attachments/card/${cardId}`);
        return data;
    },

    // Delete an attachment
    async deleteAttachment(attachmentId: string): Promise<void> {
        await api.delete(`/attachments/${attachmentId}`);
    }
};
