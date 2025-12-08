import React, { useState } from 'react';
import { X, Globe, Lock, Users } from 'lucide-react';
import { useWorkspaces } from '@/hooks/useWorkspace';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (workspaceId: string) => void;
}

const colorOptions = [
  '#0079bf', '#d29034', '#519839', '#b04632', 
  '#89609e', '#00aECC', '#838C91', '#ff78cb'
];

export const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'team'>('private');
  const [color, setColor] = useState('#0079bf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addWorkspace } = useWorkspace();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const newWorkspace = await addWorkspace({
        name: name.trim(),
        description: description.trim() || undefined,
        visibility,
        color,
      });
      onSuccess?.(newWorkspace.id);
      setName('');
      setDescription('');
      setVisibility('private');
      setColor('#0079bf');
      onClose();
    } catch (error) {
      console.error('Failed to create workspace:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Create Workspace</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Workspace name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Marketing Team" required autoFocus />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="What's this workspace for?" rows={3} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => setVisibility('private')} 
                className={`px-3 py-2 text-sm rounded-lg border ${visibility === 'private' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                Private
              </button>
              <button type="button" onClick={() => setVisibility('team')} 
                className={`px-3 py-2 text-sm rounded-lg border ${visibility === 'team' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                Team
              </button>
              <button type="button" onClick={() => setVisibility('public')} 
                className={`px-3 py-2 text-sm rounded-lg border ${visibility === 'public' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                Public
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((colorOption) => (
                <button key={colorOption} type="button" onClick={() => setColor(colorOption)}
                  className={`w-8 h-8 rounded-full ${color === colorOption ? 'ring-2 ring-offset-2 ring-gray-800' : ''}`}
                  style={{ backgroundColor: colorOption }} />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={!name.trim() || isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Creating...' : 'Create Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};