'use client';

import { Attachment } from '@/types/attachment';
import { File, Image, FileText, X, Download } from 'lucide-react';
import { toast } from 'sonner';

interface AttachmentListProps {
    attachments: Attachment[];
    onDelete: (id: string) => Promise<void>;
    isDeleting?: boolean;
}

export const AttachmentList: React.FC<AttachmentListProps> = ({
    attachments,
    onDelete,
    isDeleting = false,
}) => {
    const getFileName = (path: string) => {
        return path.split('/').pop()?.split('\\').pop() || 'Unknown File';
    };

    const getFileUrl = (path: string) => {
        if (path.startsWith('http')) return path;
        // Ensure path doesn't start with / if we are appending
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        return `${baseUrl}/${cleanPath}`;
    };

    const getMimeType = (path: string) => {
        const ext = path.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image/jpeg';
        if (ext === 'pdf') return 'application/pdf';
        return 'application/octet-stream';
    };

    const formatFileSize = (bytes?: number): string => {
        if (bytes === undefined) return '';
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />;
        if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
        return <File className="w-5 h-5 text-gray-500" />;
    };

    const handleDelete = async (id: string, fileName: string) => {
        try {
            await onDelete(id);
            toast.success(`Deleted ${fileName}`);
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Failed to delete file');
        }
    };

    if (attachments.length === 0) {
        return (
            <div className="text-center py-4 text-muted-foreground text-sm">
                No attachments yet
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {attachments.map((attachment) => {
                const fileName = attachment.file_name || attachment.originalName || getFileName(attachment.file_path);
                const fileUrl = attachment.url || getFileUrl(attachment.file_path);
                const mimeType = attachment.mimeType || getMimeType(attachment.file_path);

                return (
                    <div
                        key={attachment.id}
                        className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                        {/* File Icon or Image Preview */}
                        {mimeType.startsWith('image/') ? (
                            <img
                                src={fileUrl}
                                alt={fileName}
                                className="w-12 h-12 object-cover rounded"
                                onError={(e) => {
                                    // Fallback to icon if image fails to load
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                        ) : (
                            <div className="w-12 h-12 flex items-center justify-center bg-muted rounded">
                                {getFileIcon(mimeType)}
                            </div>
                        )}
                        {/* Fallback icon container (hidden by default, shown on error) */}
                        <div className="hidden w-12 h-12 items-center justify-center bg-muted rounded">
                            {getFileIcon(mimeType)}
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                                {fileName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatFileSize(attachment.size)}
                                {attachment.uploaded_at && (
                                    <span className="ml-2">
                                        {new Date(attachment.uploaded_at).toLocaleDateString()}
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a
                                href={fileUrl}
                                download={fileName}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground"
                                title="Download"
                            >
                                <Download className="w-4 h-4" />
                            </a>
                            <button
                                onClick={() => handleDelete(attachment.id, fileName)}
                                disabled={isDeleting}
                                className="p-1 hover:bg-red-500/10 rounded disabled:opacity-50 transition-colors"
                                title="Delete"
                            >
                                <X className="w-4 h-4 text-red-600" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
