// app/projects/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProjects } from '@/hooks/useProject';
import { CreateProjectForm } from '@/components/projects/CreateProjectForm';

export default function ProjectsPage() {
  const { projects, isLoading, archiveProject } = useProjects();
  const [showCreate, setShowCreate] = useState(false);

  const handleArchiveProject = async (projectId: string) => {
    if (confirm('Are you sure you want to archive this project?')) {
      await archiveProject(projectId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-2">Manage your projects and track progress</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Project
          </button>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-600 mb-4">No projects yet.</p>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Project Header with Background */}
                <div 
                  className="h-4"
                  style={{ 
                    background: project.background?.includes('gradient') 
                      ? `linear-gradient(135deg, ${getGradientColors(project.background)})`
                      : getBackgroundColor(project.background)
                  }}
                />
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{project.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'active' ? 'bg-green-100 text-green-800' :
                      project.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{project.lists?.length || 0} lists</span>
                    <span>Created: {project.createdAt.toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Open Project
                    </Link>
                    <button
                      onClick={() => handleArchiveProject(project.id)}
                      className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      title="Archive project"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateProjectForm
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </div>
  );
}

// Helper functions (keep these from your existing code)
function getGradientColors(background: string = 'blue') {
  const gradients = {
    'gradient-blue': '#3b82f6, #1d4ed8',
    'gradient-green': '#10b981, #047857',
    'gradient-red': '#ef4444, #dc2626',
    'gradient-purple': '#8b5cf6, #7c3aed',
    'gradient-orange': '#f59e0b, #d97706',
    'gradient-pink': '#ec4899, #db2777',
  };
  return gradients[background as keyof typeof gradients] || '#3b82f6, #1d4ed8';
}

function getBackgroundColor(background: string = 'blue') {
  const colors = {
    'blue': '#3b82f6',
    'green': '#10b981',
    'red': '#ef4444',
    'purple': '#8b5cf6',
    'orange': '#f59e0b',
    'pink': '#ec4899',
  };
  return colors[background as keyof typeof colors] || '#3b82f6';
}