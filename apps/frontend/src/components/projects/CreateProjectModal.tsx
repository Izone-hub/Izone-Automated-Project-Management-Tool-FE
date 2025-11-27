import React, { useState } from 'react';
import { useStore, BACKGROUND_OPTIONS } from '../../store';
import { Project } from '../../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const { addProject } = useStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    background: 'blue',
    color: '#3B82F6',
    visibility: 'private' as Project['visibility'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    addProject({
      title: formData.title,
      description: formData.description,
      background: formData.background,
      color: formData.color,
      visibility: formData.visibility,
      members: ['1'], // Current user
    });

    setFormData({
      title: '',
      description: '',
      background: 'blue',
      color: '#3B82F6',
      visibility: 'private',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Create New Project</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Project description (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background
              </label>
              <div className="grid grid-cols-4 gap-3">
                {BACKGROUND_OPTIONS.map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, background: bg.id })}
                    className={`aspect-video rounded-lg border-2 ${
                      formData.background === bg.id 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-300 hover:border-gray-400'
                    } ${bg.class} transition-all hover:scale-105`}
                    title={bg.id.includes('gradient') ? bg.id.replace('gradient-', '').charAt(0).toUpperCase() + bg.id.replace('gradient-', '').slice(1) + ' Gradient' : bg.id.charAt(0).toUpperCase() + bg.id.slice(1)}
                  >
                    <span className="sr-only">{bg.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visibility
              </label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value as Project['visibility'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="private">Private</option>
                <option value="workspace">Workspace</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}