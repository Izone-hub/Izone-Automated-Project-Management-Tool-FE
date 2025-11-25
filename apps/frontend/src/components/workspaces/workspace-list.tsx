// components/workspaces/workspace-list.tsx
'use client';

import { Workspace } from '@/lib/types/workspace';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';

interface WorkspaceListProps {
  workspaces: Workspace[];
  onCreateWorkspace: () => void;
}

export default function WorkspaceList({ workspaces, onCreateWorkspace }: WorkspaceListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Existing Workspaces */}
      {workspaces.map(workspace => (
        <Card key={workspace.id} className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: workspace.color + '20', color: workspace.color }}
                >
                  {workspace.emoji}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{workspace.name}</h3>
                  <p className="text-sm text-gray-600">{workspace.boards.length} boards</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {workspace.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {workspace.members.slice(0, 3).map(member => (
                  <Avatar key={member.id} className="w-6 h-6 border-2 border-white">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-xs bg-gray-200">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {workspace.members.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{workspace.members.length - 3}
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {workspace.members.length} members
              </span>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Create New Workspace Card */}
      <Card 
        className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
        onClick={onCreateWorkspace}
      >
        <CardContent className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <Plus className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-700 group-hover:text-blue-700">
            Create New Workspace
          </h3>
          <p className="text-sm text-gray-500 text-center">
            Start organizing your projects with a new workspace
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


