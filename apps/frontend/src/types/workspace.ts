export type WorkspaceRole = "owner" | "admin" | "member" | "guest";

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_by: string;
  created_at: string;
  updated_at?: string;
  // Optional: Add these if your API returns them
  member_count?: number;
  project_count?: number;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  created_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
}

export interface WorkspaceInvite {
  id: string;
  workspace_id: string;
  email: string;
  role: WorkspaceRole;
  token: string;
  invited_by: string;
  expires_at: string;
  created_at: string;
}

export interface CreateWorkspaceData {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceData {
  name?: string;
  description?: string;
}


