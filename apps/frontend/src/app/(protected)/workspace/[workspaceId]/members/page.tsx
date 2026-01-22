"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MembersList } from "@/components/workspace/MembersList";
import { AddMemberDialog } from "@/components/workspace/AddMemberDialog";
import { membersAPI, type MemberOut, type RoleEnum } from "@/lib/api/members";
import { workspaceAPI, type Workspace } from "@/lib/api/workspaces";

export default function WorkspaceMembersPage() {
    const params = useParams();
    const router = useRouter();
    const workspaceId = (params?.workspaceId as string) || "";

    const [workspace, setWorkspace] = useState<Workspace | null>(null);
    const [members, setMembers] = useState<MemberOut[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string>("");

    // Get current user from localStorage
    useEffect(() => {
        try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                setCurrentUserId(user.id || "");
            }
        } catch {
            console.error("Failed to parse user from localStorage");
        }
    }, []);

    const fetchData = useCallback(async () => {
        if (!workspaceId) return;

        setLoading(true);
        setError(null);

        try {
            // Fetch workspace details
            const ws = await workspaceAPI.getById(workspaceId);
            setWorkspace(ws);

            // Note: The backend 'list_workspaces' endpoint currently ONLY returns workspaces owned by the user.
            // Therefore, if we can fetch the workspace, the current user is the owner/admin.
            if (ws) {
                setIsAdmin(true);
                // If strict ID matching fails (e.g. case sensitivity or missing local user), 
                // we still trust the API's implicit ownership for now.
                if (currentUserId && ws.owner_id !== currentUserId) {
                    console.warn(`User ID mismatch: Local(${currentUserId}) vs WS-Owner(${ws.owner_id})`);
                }
            }

            // Show the owner in the members list
            const ownerMember: MemberOut = {
                user_id: ws?.owner_id || currentUserId || "unknown",
                role: "owner", // It's their workspace
                created_at: ws?.created_at || new Date().toISOString(),
            };
            setMembers([ownerMember]);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load workspace");
        } finally {
            setLoading(false);
        }
    }, [workspaceId, currentUserId]);

    useEffect(() => {
        if (workspaceId) {
            fetchData();
        }
    }, [fetchData, workspaceId]);

    const handleAddMember = async (userId: string, role: RoleEnum) => {
        const newMember = await membersAPI.addMember(workspaceId, { user_id: userId, role });
        setMembers((prev) => [...prev, newMember]);
    };

    const handleRemoveMember = async (userId: string) => {
        await membersAPI.removeMember(workspaceId, userId);
        setMembers((prev) => prev.filter((m) => m.user_id !== userId));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Workspace Members
                                </h1>
                                <p className="text-gray-600 text-sm">
                                    {workspace?.name || "Loading..."}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchData}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh
                            </Button>
                            {isAdmin && (
                                <AddMemberDialog onAddMember={handleAddMember} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Members ({members.length})
                        </h2>
                    </div>

                    <MembersList
                        members={members.map((m) => ({
                            user_id: m.user_id,
                            role: m.role,
                            created_at: m.created_at,
                        }))}
                        onRemoveMember={handleRemoveMember}
                        isAdmin={isAdmin}
                        currentUserId={currentUserId}
                        isLoading={loading}
                    />

                    {!isAdmin && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center text-gray-600 text-sm">
                            Only workspace admins can add or remove members.
                        </div>
                    )}
                </div>

                {/* Info notice */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                        <strong>Note:</strong> To add a member, you need their User ID (UUID).
                        Ask them to share it from their account settings.
                    </p>
                </div>
            </div>
        </div>
    );
}
