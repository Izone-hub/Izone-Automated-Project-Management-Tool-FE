import React, { useEffect, useState } from 'react';
import { attachmentService, Attachment } from '@/lib/api/attachments';
import { Button } from '@/components/ui/button';
import { FileIcon, Trash2, Download, ExternalLink, Image as ImageIcon } from 'lucide-react'; // Renamed Image to ImageIcon to avoid conflict with next/image
import { toast } from 'sonner';

interface AttachmentListProps {
    cardId: string;
}

export const AttachmentList: React.FC<AttachmentListProps> = ({ cardId }) => {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [loading, setLoading] = useState(true);

    const loadAttachments = async () => {
        try {
            const data = await attachmentService.getAttachments(cardId);
            setAttachments(data);
        } catch (error) {
            console.error("Failed to load attachments", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAttachments();
    }, [cardId]);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this attachment?")) return;
        try {
            await attachmentService.deleteAttachment(id);
            setAttachments(prev => prev.filter(a => a.id !== id));
            toast.success("Attachment deleted");
        } catch (error) {
            toast.error("Failed to delete attachment");
        }
    };

    // Helper to determine icon based on file type
    const getIcon = (type?: string) => {
        if (type?.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
        if (type === 'application/pdf') return <FileIcon className="w-5 h-5 text-red-500" />;
        return <FileIcon className="w-5 h-5 text-gray-500" />;
    };

    // Construct full URL (assuming backend is on localhost:8000 for dev)
    const getUrl = (path: string) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        return `${baseUrl}${path}`;
    };

    if (loading) return <div className="text-sm text-gray-500">Loading attachments...</div>;

    if (attachments.length === 0) {
        return <div className="text-sm text-gray-400 italic">No attachments yet.</div>;
    }

    return (
        <div className="space-y-2">
            {attachments.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-2 border rounded-lg bg-gray-50 hover:bg-gray-100 group transition-colors">
                    <a
                        href={getUrl(file.file_path)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 flex-1 min-w-0"
                    >
                        {getIcon(file.file_type)}
                        <span className="text-sm font-medium truncate">{file.file_name}</span>
                    </a>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => window.open(getUrl(file.file_path), '_blank')}
                        >
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 decoration-red-900"
                            onClick={() => handleDelete(file.id)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};
