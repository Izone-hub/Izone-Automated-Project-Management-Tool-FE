'use client';

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploaderProps {
    onUpload: (file: File) => Promise<void>;
    accept?: string;
    maxSizeMB?: number;
    disabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    onUpload,
    accept = '*',
    maxSizeMB = 5,
    disabled = false,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): boolean => {
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            toast.error(`File size exceeds ${maxSizeMB}MB limit`);
            return false;
        }
        return true;
    };

    const handleFileSelect = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        if (!validateFile(file)) return;

        try {
            await onUpload(file);
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Failed to upload file');
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (!disabled) {
            handleFileSelect(e.dataTransfer.files);
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
            className={`
        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
        ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-border hover:border-muted-foreground'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                disabled={disabled}
            />
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-foreground">
                <span className="font-semibold text-blue-500">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
                Maximum file size: {maxSizeMB}MB
            </p>
        </div>
    );
};
