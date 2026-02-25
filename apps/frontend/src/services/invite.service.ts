import type { AcceptInviteResponse, InviteRequest, WorkspaceInvitationResponse } from '../types/invite'; // Adjust the path as needed

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const inviteService = {
  // 1. Send invite (POST /workspaces/{id}/invite)
  async sendInvite(workspaceId: string, data: InviteRequest): Promise<WorkspaceInvitationResponse> {
    const res = await fetch(`${API_URL}/workspaces/${workspaceId}/invite`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to send invitation');
    }
    return res.json();
  },

  // 2. Get invite info (GET /workspaces/invitations/{token})
  async getInviteDetails(token: string): Promise<WorkspaceInvitationResponse> {
    const res = await fetch(`${API_URL}/workspaces/invitations/${token}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }, // Public endpoint
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Invitation invalid or expired');
    }
    return res.json();
  },

  // 3. Accept invite (POST /workspaces/invitations/{token}/accept)
  async acceptInvite(token: string): Promise<AcceptInviteResponse> {
    const res = await fetch(`${API_URL}/workspaces/invitations/${token}/accept`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to join workspace');
    }
    return res.json();
  }
};