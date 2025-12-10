import React from 'react';
import { Trello, Rocket } from 'lucide-react';

interface WorkspaceEmptyProps {
  onCreateClick?: () => void;
}

export const WorkspaceEmpty: React.FC<WorkspaceEmptyProps> = ({ onCreateClick }) => {
  return (
    <div className="max-w-2xl mx-auto text-center py-12 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
        <Trello className="w-8 h-8 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create your first workspace</h2>
      <p className="text-gray-600 mb-8">
        Workspaces help you organize your boards and collaborate with team members.
      </p>
      <button onClick={onCreateClick} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-medium">
        <Rocket className="w-5 h-5" /> Create Workspace
      </button>
    </div>
  );
};