'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Users, CreditCard, Settings, Layout } from 'lucide-react';
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarMenuSub, 
  SidebarMenuSubItem, 
  SidebarMenuSubButton 
} from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { useWorkspaces } from '@/hooks/workspaces/use-workspaces';

const workspaceMenuItems = [
  { icon: Layout, label: 'Boards', href: '/boards' },
  { icon: Users, label: 'Members', href: '/members' },
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: CreditCard, label: 'Billing', href: '/billing' },
];

export const WorkspaceItem = ({ workspace }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useRouter();
  const { setSelectedWorkspace, workspaces } = useWorkspaces();

  const handleWorkspaceClick = () => {
    const fullWorkspace = workspaces.find(w => w.id === workspace.id);
    if (fullWorkspace) setSelectedWorkspace(fullWorkspace);

    setIsExpanded(!isExpanded);
  };

  const handleMenuClick = (href: string) => {
    router.push(`${href}?workspace=${workspace.id}`);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={handleWorkspaceClick}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded text-white flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: workspace.color || '#6B7280' }}
            >
              {workspace.icon}
            </div>
            <span>{workspace.name}</span>
          </div>

          {isExpanded ? <ChevronDown /> : <ChevronRight />}
        </SidebarMenuButton>

        {isExpanded && (
          <SidebarMenuSub>
            {workspaceMenuItems.map((item) => (
              <SidebarMenuSubItem key={item.label}>
                <SidebarMenuSubButton
                  onClick={() => handleMenuClick(item.href)}
                  className="flex items-center gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
};






