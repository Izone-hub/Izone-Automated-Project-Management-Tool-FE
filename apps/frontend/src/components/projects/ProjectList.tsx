import React, { useState } from 'react';
import { useStore } from '../../store';
import ProjectCard from './ProjectCard';
import CreateProjectModal from './CreateProjectModal';

export default function ProjectList() {
  const { projects, clearAllData } = useStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [view, setView] = useState<'all' | 'active' | 'archived' | 'favorites'>('all');

  const filteredProjects = projects.filter(project => {
    switch (view) {
      case 'active':
        return project.status === 'active';
      case 'archived':
        return project.status === 'archived';
      case 'favorites':
        return project.isFavorite;
      default:
        return true;
    }
  });

  const activeProjectsCount = projects.filter(p => p.status === 'active').length;
  const archivedProjectsCount = projects.filter(p => p.status === 'archived').length;
  const favoriteProjectsCount = projects.filter(p => p.isFavorite).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-2">Manage your projects and tasks</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Project
            </button>

            <button
              onClick={clearAllData}
              className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 flex items-center shadow-sm"
            >
              Clear All Data
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl font-bold text-gray-900">{projects.length}</div>
            <div className="text-gray-600">Total Projects</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl font-bold text-green-600">{activeProjectsCount}</div>
            <div className="text-gray-600">Active</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl font-bold text-blue-600">{favoriteProjectsCount}</div>
            <div className="text-gray-600">Favorites</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl font-bold text-gray-600">{archivedProjectsCount}</div>
            <div className="text-gray-600">Archived</div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setView('all')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                view === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setView('active')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                view === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setView('favorites')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                view === 'favorites'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Favorites
            </button>
            <button
              onClick={() => setView('archived')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                view === 'archived'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Archived
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-6">
              {view === 'all' 
                ? "Get started by creating your first project."
                : `No ${view} projects found.`
              }
            </p>
            {view === 'all' && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Create Your First Project
              </button>
            )}
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}