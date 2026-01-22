
export type RoleEnum = 'owner' | 'member' | 'admin';

export interface WorkspaceMember {
    user_id: string;
    role: RoleEnum;
    created_at: string;
}

export interface AddMemberPayload {
    user_id: string;
    role: RoleEnum;
}
