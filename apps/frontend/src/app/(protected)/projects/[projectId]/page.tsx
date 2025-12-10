




// app/projects/[projectId]/page.tsx
'use client';

import { use } from 'react';
import { useProjects } from '@/hooks/useProject';
import { ListContainer } from '@/components/board/ListContainer';

export default function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.projectId;
  
  const { projects, isLoading, error } = useProjects();
  const project = projects.find(p => p.id === projectId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
          <p className="text-gray-300">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ 
        background: project.background?.includes('gradient') 
          ? `linear-gradient(135deg, ${getGradientColors(project.background)})`
          : getBackgroundColor(project.background)
      }}
    >
      {/* Project Header */}
      <div className="p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            {project.description && (
              <p className="text-white text-opacity-80 mt-1">{project.description}</p>
            )}
            <div className="flex gap-4 mt-2 text-sm text-white text-opacity-70">
              <span>Status: {project.status}</span>
              <span>Created: {project.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors">
              Share
            </button>
            <button className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors">
              Settings
            </button>
          </div>
        </div>
      </div>
      
      {/* Project Content - Reuse your existing ListContainer */}
      <ListContainer board={project} />
    </div>
  );
}