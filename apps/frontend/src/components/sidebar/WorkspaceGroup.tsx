'use client';

import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent 
} from '@/components/ui/sidebar';
import { WorkspaceItem } from './WorkspaceItem';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useWorkspaces } from '@/hooks/workspaces/use-workspaces';
import { useState } from 'react';
import { WorkspaceForm } from '../workspaces/workspace-form';

export const WorkspaceGroup = () => {
  const { workspaces, createWorkspace } = useWorkspaces();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateWorkspace = (workspaceData: any) => {
    createWorkspace(workspaceData);
    setShowCreateForm(false);
  };

  // Convert your workspace data to the format needed by WorkspaceItem
  const formattedWorkspaces = workspaces.map(workspace => ({
    id: workspace.id,
    name: workspace.name,
    icon: workspace.emoji || workspace.name.charAt(0),
    color: workspace.color // Use the color directly since it's already hex codes
  }));

  return (
    <>
      <SidebarGroup>
        <div className="flex items-center justify-between px-2">
          <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <SidebarGroupContent>
          {formattedWorkspaces.map((workspace) => (
            <WorkspaceItem key={workspace.id} workspace={workspace} />
          ))}
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Workspace Creation Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-2xl mx-4">
            <WorkspaceForm
              onSubmit={handleCreateWorkspace}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};
//   SidebarGroupLabel, 
//   SidebarGroupContent 
// } from '@/components/ui/sidebar';
// import { WorkspaceItem } from './WorkspaceItem';
// import { Button } from '@/components/ui/button';
// import { Plus } from 'lucide-react';
// import { useWorkspaces } from '@/hooks/workspaces/use-workspaces';
// import { useState } from 'react';
// import { WorkspaceForm } from '../workspaces/workspace-form';

// export const WorkspaceGroup = () => {
//   const { workspaces, createWorkspace } = useWorkspaces();
//   const [showCreateForm, setShowCreateForm] = useState(false);

//   const handleCreateWorkspace = (workspaceData: any) => {
//     createWorkspace(workspaceData);
//     setShowCreateForm(false);
//   };

//   // Convert your workspace data to the format needed by WorkspaceItem
//   const formattedWorkspaces = workspaces.map(workspace => ({
//     id: workspace.id,
//     name: workspace.name,
//     icon: workspace.emoji || workspace.name.charAt(0),
//     color: workspace.color.startsWith('#') ? `bg-[${workspace.color}]` : workspace.color
//   }));

//   return (
//     <>
//       <SidebarGroup>
//         <div className="flex items-center justify-between px-2">
//           <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
//           <Button 
//             variant="ghost" 
//             size="icon" 
//             className="h-6 w-6 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
//             onClick={() => setShowCreateForm(true)}
//           >
//             <Plus className="h-3 w-3" />
//           </Button>
//         </div>
//         <SidebarGroupContent>
//           {formattedWorkspaces.map((workspace) => (
//             <WorkspaceItem key={workspace.id} workspace={workspace} />
//           ))}
//         </SidebarGroupContent>
//       </SidebarGroup>

//       {/* Workspace Creation Modal */}
//       {showCreateForm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-background rounded-lg p-6 w-full max-w-2xl mx-4">
//             <WorkspaceForm
//               onSubmit={handleCreateWorkspace}
//               onCancel={() => setShowCreateForm(false)}
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };
