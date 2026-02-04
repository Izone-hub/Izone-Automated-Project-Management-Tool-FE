
export type RoleEnum = 'owner' | 'member' | 'admin';

export interface WorkspaceMember {
    user_id: string;
    email?: string;
    role: RoleEnum;
    created_at: string;
}

export interface AddMemberPayload {
    email: string;
    role: RoleEnum;
}
