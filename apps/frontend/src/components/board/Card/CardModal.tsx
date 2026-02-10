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
  onClose: () => void;
}

export const CardModal: React.FC<CardModalProps> = ({
  card,
  onUpdate,
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
      await onUpdate({ _delete: true }); // Special flag for delete
      toast.success('Card deleted successfully');
      onClose();
    } catch (error) {
      console.error('Failed to delete card:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete card');
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
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
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-purple-100 text-purple-800' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold bg-transparent border-none focus:outline-none w-full"
                placeholder="Card title"
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
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
            className="p-2 hover:bg-gray-100 rounded-lg"
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
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span>Description</span>
              </h3>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a more detailed description..."
                className="w-full p-3 border rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            {/* Comments */}
            <CommentsList cardId={card.id} />
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Add to card</h3>



            {/* Due Date */}
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Due Date</span>
              </h4>
              <input
                type="datetime-local"
                value={dueDate ? dueDate.slice(0, 16) : ''}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
            </div>

            {/* Priority */}
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Priority</h4>
              <div className="space-y-1">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPriority(option.value)}
                    className={`w-full px-3 py-2 rounded text-left ${priority === option.value ? option.color : 'hover:bg-gray-100'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setShowAttachments(!showAttachments)}
                className="w-full flex items-center justify-between gap-3 p-3 text-left hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <Paperclip className="w-5 h-5 text-gray-500" />
                  <span>Attachments</span>
                </div>
                {attachments.length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {attachments.length}
                  </span>
                )}
              </button>

              {showAttachments && (
                <div className="p-3 border-t space-y-3">
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
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-between">
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
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};