'use client';

import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { ChevronRight, Users, Layout, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWorkspaces } from '@/hooks/useWorkspace';
import { useState } from 'react';

interface WorkspaceItemProps {
  workspace: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

const workspaceMenuItems = [
  { icon: Layout, label: 'Boards', href: '/boards' },
  { icon: Users, label: 'Members', href: '/members' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export const WorkspaceItem = ({ workspace }: WorkspaceItemProps) => {
  const router = useRouter();
  const { selectWorkspaces } = useWorkspaces();
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    selectWorkspaces(workspace.id); 
    router.push(`/workspace/${workspace.id}`);
    setExpanded(!expanded);
  };

  return (
    <div>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={handleClick}
          className="w-full justify-start"
        >
          <div 
            className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold mr-2"
            style={{ backgroundColor: workspace.color }}
          >
            {workspace.icon}
          </div>
          <span className="flex-1 text-left truncate">{workspace.name}</span>
          <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {expanded && (
        <div className="ml-6 space-y-1">
          {workspaceMenuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                onClick={() => router.push(`/workspace/${workspace.id}${item.href}`)}
                className="w-full justify-start text-sm"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </div>
      )}
    </div>
  );
};








