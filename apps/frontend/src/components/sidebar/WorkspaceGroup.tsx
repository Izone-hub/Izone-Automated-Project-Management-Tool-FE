'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Folder,
  Settings,
  Users
} from 'lucide-react';
import WorkspaceForm from '@/components/workspace/WorkspaceForm';
import { useWorkspaces } from '@/hooks/useWorkspace';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export const WorkspaceGroup = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { workspaces, loading, error, loadWorkspaces } = useWorkspaces();

  const handleRefresh = () => {
    loadWorkspaces();
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 w-full"
        >
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span>Workspaces</span>
          <span className="text-xs text-gray-500 ml-auto">({workspaces.length})</span>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create Workspace
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRefresh}>
              <ChevronDown className="h-4 w-4 mr-2" /> Refresh
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {showForm && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md border">
          <WorkspaceForm 
            onClose={() => setShowForm(false)}
            onSuccess={handleRefresh}
          />
        </div>
      )}

      {isOpen && (
        <div className="space-y-1 ml-6">
          {loading ? (
            <div className="py-2 text-sm text-gray-500">Loading workspaces...</div>
          ) : error ? (
            <div className="py-2 text-sm text-red-600">{error}</div>
          ) : workspaces.length === 0 ? (
            <div className="py-2 text-sm text-gray-500">No workspaces yet</div>
          ) : (
            workspaces.map((workspace) => (
              <a
                key={workspace.id}
                href={`/workspace/${workspace.id}`}
                className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md group transition-colors"
              >
                <Folder className="h-4 w-4 text-gray-400" />
                <span className="truncate">{workspace.name}</span>
                {workspace.description && (
                  <span className="text-xs text-gray-400 truncate ml-2">- {workspace.description}</span>
                )}
                <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Users className="h-3 w-3" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Settings className="h-3 w-3" />
                  </button>
                </div>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
};












