// lib/api/members.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Safe token getter
function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
}

function headers(): HeadersInit {
    const token = getToken();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
}

// Types matching backend schema
export type RoleEnum = "owner" | "member" | "admin";

export interface MemberOut {
    user_id: string;
    email: string;
    role: RoleEnum;
    created_at: string;
}

export interface MemberAdd {
    email: string;
    role: RoleEnum;
}

export const membersAPI = {
    /**
     * Add a member to a workspace
     * POST /workspaces/{workspace_id}/members
     * Requires admin role in the workspace
     */
    async addMember(workspaceId: string, payload: MemberAdd): Promise<MemberOut> {
        try {
            const res = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/members`, {
                method: "POST",
                headers: headers(),
                body: JSON.stringify(payload),
            });

            if (res.status === 401) {
                localStorage.removeItem("auth_token");
                throw new Error("Session expired. Please login again.");
            }

            if (res.status === 403) {
                throw new Error("Only admins can add members to this workspace.");
            }

            if (res.status === 400) {
                const data = await res.json();
                throw new Error(data.detail || "User does not exist.");
            }

            if (res.status === 404) {
                throw new Error("Workspace not found.");
            }

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `Failed to add member: ${res.statusText}`);
            }

            return res.json();
        } catch (error) {
            console.error("Error adding member:", error);
            throw error;
        }
    },

    /**
     * Remove a member from a workspace
     * DELETE /workspaces/{workspace_id}/members/{user_id}
     * Requires admin role in the workspace
     */
    async removeMember(workspaceId: string, userId: string): Promise<void> {
        try {
            const res = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/members/${userId}`, {
                method: "DELETE",
                headers: headers(),
            });

            if (res.status === 401) {
                localStorage.removeItem("auth_token");
                throw new Error("Session expired. Please login again.");
            }

            if (res.status === 403) {
                throw new Error("Only admins can remove members from this workspace.");
            }

            if (res.status === 400) {
                const data = await res.json();
                throw new Error(data.detail || "Cannot remove the last admin.");
            }

            if (res.status === 404) {
                throw new Error("Member not found.");
            }

            if (!res.ok && res.status !== 204) {
                const text = await res.text();
                throw new Error(text || `Failed to remove member: ${res.statusText}`);
            }
        } catch (error) {
            console.error("Error removing member:", error);
            throw error;
        }
    },

    /**
     * List all members of a workspace
     */
    async listMembers(workspaceId: string): Promise<MemberOut[]> {
        try {
            const res = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/members`, {
                headers: headers(),
            });

            if (res.status === 401) {
                localStorage.removeItem("auth_token");
                throw new Error("Session expired. Please login again.");
            }

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `Failed to load members list: ${res.statusText}`);
            }

            return res.json();
        } catch (error) {
            console.error("Error listing members:", error);
            throw error;
        }
    },
};
