import React from 'react';
import { useStore } from '../../store';
import { ProjectWithDetails } from '../../types';
import { BoardHeader } from './BoardHeader';
import { ListContainer } from './ListContainer';

interface BoardViewProps {
  project: ProjectWithDetails;
}

export default function BoardView({ project }: BoardViewProps) {
  const { updateProject } = useStore();

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

  const handleUpdateBackground = (background: string) => {
    updateProject(project.id, { background });
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={getBackgroundStyle()}
    >
      {/* Board Header */}
      <BoardHeader 
        project={project}
        onUpdateBackground={handleUpdateBackground}
      />
      
      {/* Lists Container */}
      <ListContainer project={project} />
    </div>
  );
}