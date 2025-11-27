import React, { useState } from 'react';
import { useStore } from '../../store';
import { Project } from '../../types';
import ProjectModal from './ProjectModal';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { updateProject, toggleProjectFavorite, tasks } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const projectTasks = tasks.filter(task => task.projectId === project.id);
  const completedTasks = projectTasks.filter(task => task.status === 'done').length;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleProjectFavorite(project.id);
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateProject(project.id, { status: 'archived' });
  };

  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateProject(project.id, { status: 'active' });
  };

  const getBackgroundStyle = () => {
    if (project.background.includes('gradient')) {
      return {
        background: project.background === 'gradient-blue' 
          ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
          : project.background === 'gradient-green'
          ? 'linear-gradient(135deg, #10B981, #047857)'
          : 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
      };
    }
    
    const colors: { [key: string]: string } = {
      'blue': '#3B82F6',
      'green': '#10B981',
      'red': '#EF4444',
      'purple': '#8B5CF6',
      'orange': '#F59E0B',
      'pink': '#EC4899',
    };
    
    return { backgroundColor: colors[project.background] || '#3B82F6' };
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Project Header with Background */}
        <div 
          className="h-24 rounded-t-lg relative"
          style={getBackgroundStyle()}
        >
          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
          >
            <svg 
              className={`w-5 h-5 ${project.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`}
              fill={project.isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>

          {/* Status Badge */}
          <div className="absolute bottom-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              project.status === 'active'
                ? 'bg-green-100 text-green-800'
                : project.status === 'archived'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Project Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>
          
          {project.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {project.description}
            </p>
          )}

          {/* Progress */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{completedTasks} / {projectTasks.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: projectTasks.length > 0 
                    ? `${(completedTasks / projectTasks.length) * 100}%` 
                    : '0%' 
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>{projectTasks.length} tasks</span>
              <span>{new Date(project.lastActivity).toLocaleDateString()}</span>
            </div>
            
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {project.status === 'archived' ? (
                <button
                  onClick={handleRestore}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                  title="Restore project"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleArchive}
                  className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                  title="Archive project"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProjectModal
        project={project}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}