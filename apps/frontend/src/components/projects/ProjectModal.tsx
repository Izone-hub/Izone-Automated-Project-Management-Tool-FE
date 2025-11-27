import React, { useState, useEffect } from 'react';
import { useStore, BACKGROUND_OPTIONS } from '../../store';
import { Project } from '../../types';

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const { updateProject, deleteProject, tasks } = useStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    background: 'blue',
    color: '#3B82F6',
    visibility: 'private' as Project['visibility'],
    status: 'active' as Project['status'],
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description || '',
        background: project.background,
        color: project.color,
        visibility: project.visibility,
        status: project.status,
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedData = {
      title: formData.title,
      description: formData.description,
      background: formData.background,
      color: formData.color,
      visibility: formData.visibility,
      status: formData.status,
    };

    updateProject(project.id, updatedData);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteProject(project.id);
      onClose();
    }
  };

  const handleArchive = () => {
    updateProject(project.id, { status: 'archived' });
    onClose();
  };

  const handleRestore = () => {
    updateProject(project.id, { status: 'active' });
    onClose();
  };

  if (!isOpen) return null;

  const projectTasks = tasks.filter(task => task.projectId === project.id);
  const completedTasks = projectTasks.filter(task => task.status === 'done').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Edit Project</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{projectTasks.length}</div>
              <div className="text-gray-600 text-sm">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
              <div className="text-gray-600 text-sm">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0}%
              </div>
              <div className="text-gray-600 text-sm">Progress</div>
            </div>
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
                placeholder="Project description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {BACKGROUND_OPTIONS.slice(0, 6).map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, background: bg.id })}
                      className={`aspect-video rounded border-2 ${
                        formData.background === bg.id 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-300 hover:border-gray-400'
                      } ${bg.class} transition-all hover:scale-105`}
                    >
                      <span className="sr-only">{bg.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t">
              <div className="flex space-x-2">
                {project.status === 'archived' ? (
                  <button
                    type="button"
                    onClick={handleRestore}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Restore Project
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleArchive}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Archive Project
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Project
                </button>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Project
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}