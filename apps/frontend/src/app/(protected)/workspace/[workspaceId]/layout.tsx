import { ReactNode } from 'react';

interface WorkspaceLayoutProps {
  children: ReactNode;
  params: { workspaceId: string };
}

export default function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}

// Generate metadata for the workspace page
export async function generateMetadata({ params }: { params: { workspaceId: string } }) {
  // In a real app, you would fetch workspace data here
  return {
    title: `Workspace | Task Management App`,
    description: 'Manage your workspace boards and tasks',
  };
}