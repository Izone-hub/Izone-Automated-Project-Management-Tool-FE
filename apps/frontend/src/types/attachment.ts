export interface Attachment {
    id: string;
    card_id: string;
    file_path: string;
    uploaded_at: string;
    // Derived or optional properties for UI
    originalName?: string;
    mimeType?: string;
    size?: number;
    url?: string;
    uploadStatus?: 'uploading' | 'completed' | 'error';
    progress?: number;
}
