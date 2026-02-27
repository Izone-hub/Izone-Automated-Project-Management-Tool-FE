'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card as CardType } from '@/types/card';
import { Attachment } from '@/types/attachment';
import { X, Calendar, Tag, Users, Paperclip, Save, Clock } from 'lucide-react';
import { attachmentService } from '@/services/attachment';
import { FileUploader } from './FileUploader';
import { AttachmentList } from './AttachmentList';
import CommentsList from '@/components/comments/CommentsList';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CardModalProps {
  card: CardType;
  onUpdate: (data: any) => Promise<void>;
  onDelete?: () => Promise<void>;
  onDuplicate?: () => Promise<void>;
  onClose: () => void;
}

export const CardModal: React.FC<CardModalProps> = ({
  card,
  onUpdate,
  onDelete,
  onDuplicate,
  onClose,
}) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState(card.due_date || '');
  const [priority, setPriority] = useState(card.priority);
  const [isSaving, setIsSaving] = useState(false);

  // Attachment state
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  // Fetch attachments when modal opens or showAttachments is toggled
  useEffect(() => {
    if (showAttachments && card.id) {
      attachmentService.getTaskAttachments(card.id)
        .then(setAttachments)
        .catch(err => toast.error('Failed to load attachments'));
    }
  }, [showAttachments, card.id]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSave = async () => {
    console.log('💾 handleSave triggered. current title:', title, 'original:', card.title);
    setIsSaving(true);
    try {
      const updates: any = {};
      if (title !== card.title) updates.title = title;
      if (description !== card.description) updates.description = description;

      // Compare due dates safely
      const originalDueDate = card.due_date ? new Date(card.due_date).toISOString() : null;
      const newDueDate = dueDate ? new Date(dueDate).toISOString() : null;
      if (newDueDate !== originalDueDate) updates.due_date = dueDate;

      if (priority !== card.priority) updates.priority = priority;

      console.log('💾 Updates prepared:', updates);

      if (Object.keys(updates).length > 0) {
        console.log('🚀 Calling onUpdate with:', updates);
        await onUpdate(updates);
        console.log('✅ onUpdate completed successfully');
        toast.success('Card updated successfully');
        onClose();
      } else {
        console.log('ℹ️ No changes detected, closing modal');
        onClose();
      }
    } catch (error) {
      console.error('❌ Failed to save card:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save card');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (onDelete) {
        await onDelete();
      } else {
        await onUpdate({ _delete: true }); // Special flag for delete
      }
      toast.success('Card deleted successfully');
      onClose();
    } catch (error) {
      console.error('Failed to delete card:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete card');
    }
  };

  const handleDuplicate = async () => {
    if (!onDuplicate) return;
    try {
      await onDuplicate();
      toast.success('Card duplicated successfully');
      onClose();
    } catch (error) {
      console.error('Failed to duplicate card:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to duplicate card');
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      console.log('[CardModal] Uploading file to card:', card.id);
      const newAttachment = await attachmentService.uploadAttachment(card.id, file);
      setAttachments(prev => [...prev, newAttachment]);
      toast.success(`Uploaded ${file.name}`);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAttachment = async (id: string) => {
    try {
      await attachmentService.deleteAttachment(id);
      setAttachments(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
      throw error;
    }
  };

  const priorityOptions: { value: CardType['priority']; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: 'bg-green-500/10 text-green-600 dark:text-green-400 dark:bg-green-500/20' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 dark:bg-yellow-500/20' },
    { value: 'high', label: 'High', color: 'bg-red-500/10 text-red-600 dark:text-red-400 dark:bg-red-500/20' },
    { value: 'urgent', label: 'Urgent', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 dark:bg-purple-500/20' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold bg-transparent border-none focus:outline-none w-full text-foreground"
                placeholder="Card title"
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {card.created_at && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Created {new Date(card.created_at).toLocaleDateString()}</span>
                </div>
              )}
              {card.created_by && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>By {card.created_by}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span>Description</span>
              </h3>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a more detailed description..."
                className="w-full p-3 border border-input rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
                rows={4}
              />
            </div>

            {/* Comments */}
            <CommentsList cardId={card.id} />
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Add to card</h3>



            {/* Due Date */}
            <div className="p-3 border border-border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2 text-foreground">
                <Calendar className="w-4 h-4" />
                <span>Due Date</span>
              </h4>
              <input
                type="datetime-local"
                value={dueDate ? dueDate.slice(0, 16) : ''}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 border border-input bg-background text-foreground rounded mb-2"
              />
            </div>

            {/* Priority */}
            <div className="p-3 border border-border rounded-lg">
              <h4 className="font-medium mb-2 text-foreground">Priority</h4>
              <div className="space-y-1">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPriority(option.value)}
                    className={`w-full px-3 py-2 rounded text-left transition-colors ${priority === option.value ? option.color : 'hover:bg-accent text-muted-foreground'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setShowAttachments(!showAttachments)}
                className="w-full flex items-center justify-between gap-3 p-3 text-left hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Paperclip className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">Attachments</span>
                </div>
                {attachments.length > 0 && (
                  <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full border border-blue-500/20">
                    {attachments.length}
                  </span>
                )}
              </button>

              {showAttachments && (
                <div className="p-3 border-t border-border space-y-3">
                  <FileUploader
                    onUpload={handleFileUpload}
                    disabled={isUploading}
                  />
                  <AttachmentList
                    attachments={attachments}
                    onDelete={handleDeleteAttachment}
                  />
                </div>
              )}
            </div>

            {/* Actions / Duplication */}
            {onDuplicate && (
              <button
                onClick={handleDuplicate}
                className="w-full flex items-center justify-center gap-2 p-3 border border-border rounded-lg text-foreground hover:bg-accent transition-colors"
              >
                Copy Card
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-between bg-muted/30">
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Card
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this card
                    and remove its data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-input text-foreground rounded-lg hover:bg-accent transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};