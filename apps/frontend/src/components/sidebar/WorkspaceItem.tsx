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

interface Workspace {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface WorkspaceItemProps {
  workspace: Workspace;
}

const workspaceMenuItems = [
  { icon: Layout, label: 'Boards', href: '/boards' },
  { icon: Users, label: 'Members', href: '/members' },
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: CreditCard, label: 'Billing', href: '/billing' },
];

export const WorkspaceItem = ({ workspace }: WorkspaceItemProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useRouter();
  const { setSelectedWorkspace } = useWorkspaces();

  const handleWorkspaceClick = () => {
    // Find the full workspace data from your hook
    const { workspaces } = useWorkspaces();
    const fullWorkspace = workspaces.find(w => w.id === workspace.id);
    if (fullWorkspace) {
      setSelectedWorkspace(fullWorkspace);
    }
    setIsExpanded(!isExpanded);
  };

  const handleMenuClick = (href: string) => {
    // Navigate to the specific page with workspace context
    router.push(`${href}?workspace=${workspace.id}`);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton 
          onClick={handleWorkspaceClick}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2 flex-1">
            <div 
              className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white`}
              style={{ backgroundColor: workspace.color.includes('#') ? workspace.color : '#6B7280' }}
            >
              {workspace.icon}
            </div>
            <span className="font-medium text-sm truncate">{workspace.name}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 flex-shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
          )}
        </SidebarMenuButton>
        
        {isExpanded && (
          <SidebarMenuSub>
            {workspaceMenuItems.map((item) => (
              <SidebarMenuSubItem key={item.label}>
                <SidebarMenuSubButton 
                  onClick={() => handleMenuClick(item.href)}
                  className="flex items-center gap-2 w-full"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
};


// 'use client';

// import { useState } from 'react';
// import { ChevronDown, ChevronRight, Users, CreditCard, Settings, Layout } from 'lucide-react';
// import { 
//   SidebarMenu, 
//   SidebarMenuItem, 
//   SidebarMenuButton, 
//   SidebarMenuSub, 
//   SidebarMenuSubItem, 
//   SidebarMenuSubButton 
// } from '@/components/ui/sidebar';
// import { useRouter } from 'next/navigation';

// interface Workspace {
//   id: string;
//   name: string;
//   icon: string;
//   color: string;
// }

// interface WorkspaceItemProps {
//   workspace: Workspace;
// }

// const workspaceMenuItems = [
//   { icon: Layout, label: 'Boards', href: '/boards' },
//   { icon: Users, label: 'Members', href: '/members' },
//   { icon: Settings, label: 'Settings', href: '/settings' },
//   { icon: CreditCard, label: 'Billing', href: '/billing' },
// ];

// export const WorkspaceItem = ({ workspace }: WorkspaceItemProps) => {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const router = useRouter();

//   const handleWorkspaceClick = () => {
//     setIsExpanded(!isExpanded);
//   };

//   const handleMenuClick = (href: string) => {
//     // Navigate to the specific page with workspace context
//     router.push(`${href}?workspace=${workspace.id}`);
//   };

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <SidebarMenuButton 
//           onClick={handleWorkspaceClick}
//           className="flex items-center justify-between w-full"
//         >
//           <div className="flex items-center gap-2 flex-1">
//             <div 
//               className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white ${workspace.color}`}
//             >
//               {workspace.icon}
//             </div>
//             <span className="font-medium text-sm truncate">{workspace.name}</span>
//           </div>
//           {isExpanded ? (
//             <ChevronDown className="h-4 w-4 flex-shrink-0" />
//           ) : (
//             <ChevronRight className="h-4 w-4 flex-shrink-0" />
//           )}
//         </SidebarMenuButton>
        
//         {isExpanded && (
//           <SidebarMenuSub>
//             {workspaceMenuItems.map((item) => (
//               <SidebarMenuSubItem key={item.label}>
//                 <SidebarMenuSubButton 
//                   onClick={() => handleMenuClick(item.href)}
//                   className="flex items-center gap-2 w-full"
//                 >
//                   <item.icon className="h-4 w-4" />
//                   <span className="text-sm">{item.label}</span>
//                 </SidebarMenuSubButton>
//               </SidebarMenuSubItem>
//             ))}
//           </SidebarMenuSub>
//         )}
//       </SidebarMenuItem>
//     </SidebarMenu>
//   );
// };

