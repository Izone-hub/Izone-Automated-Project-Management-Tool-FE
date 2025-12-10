import React from 'react';
import { Workspace } from '@/types/workspace';
import { Users, Settings, Share2, Globe, Lock } from 'lucide-react';

interface WorkspaceHeaderProps {
  workspace: Workspace;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({ workspace }) => {
  const VisibilityIcon = { public: Globe, private: Lock, team: Users }[workspace.visibility];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="h-32 rounded-t-lg" style={{ backgroundColor: workspace.color }} />
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{workspace.name}</h1>
              <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                <VisibilityIcon className="w-4 h-4" />
                <span>{workspace.visibility.charAt(0).toUpperCase() + workspace.visibility.slice(1)}</span>
              </div>
            </div>
            {workspace.description && <p className="text-gray-600 mb-4">{workspace.description}</p>}
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2"><Users className="w-4 h-4" />{workspace.memberCount} members</div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 14H7v-4h4v4zm0-6H7v-2h4v4zm0-6H7V7h4v4zm6 12h-4v-4h4v4zm0-6h-4v-2h4v4zm0-6h-4V7h4v4z" />
                </svg>
                {workspace.boardCount} boards
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Settings className="w-4 h-4" /> Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};