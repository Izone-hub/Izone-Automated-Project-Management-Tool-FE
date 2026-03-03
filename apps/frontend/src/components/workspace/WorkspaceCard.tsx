// components/workspace/WorkspaceCard.tsx
import React from 'react';
import Link from 'next/link';
import { Users, Trello, Globe, Lock } from 'lucide-react';

interface WorkspaceCardProps {
  workspace: {
    id: string;
    name: string;
    description?: string;
    visibility?: string;
    color?: string;
    memberCount?: number;
    boardCount?: number;
  };
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ workspace }) => {
  const VisibilityIcon = workspace.visibility === 'public' ? Globe :
    workspace.visibility === 'team' ? Users : Lock;

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow overflow-hidden">
      <div className="h-2 w-full" style={{ backgroundColor: workspace.color || '#0079bf' }} />
      <div className="p-4">
        <Link
          href={`/workspace/${workspace.id}`}
          className="block hover:no-underline"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground text-lg hover:text-blue-600">
                  {workspace.name}
                </h3>
                {workspace.visibility && (
                  <VisibilityIcon className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              {workspace.description && (
                <p className="text-muted-foreground text-sm mb-3">{workspace.description}</p>
              )}
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{workspace.memberCount || 0} member{workspace.memberCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <Trello className="w-4 h-4" />
            <span>{workspace.boardCount || 0} board{workspace.boardCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

