export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'guest';

export interface InviteRequest {
  email: string;
  role: WorkspaceRole;
}

export interface WorkspaceInvitationResponse {
  id: string;
  workspace_id: string;
  invited_user_id: string;
  invited_by_id: string;
  role: WorkspaceRole;
  token: string;
  is_accepted: boolean;
  expires_at: string;
  created_at: string;
  email: string; // Association proxy from backend
}

export interface AcceptInviteResponse {
  status: string;
  workspace_id: string;
}