"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

            if (ws) {
                setIsAdmin(true);
            }

            // Fetch actual members list from backend
            const memberList = await membersAPI.listMembers(workspaceId);
            setMembers(memberList);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load workspace");
        } finally {
            setLoading(false);
        }
    }, [workspaceId]);

    useEffect(() => {
        if (workspaceId) {
            fetchData();
        }
    }, [fetchData, workspaceId]);

    const handleAddMember = async (email: string, role: RoleEnum) => {
        const newMember = await membersAPI.addMember(workspaceId, { email, role });
        setMembers((prev) => {
            // Prevent adding duplicate if it already exists (e.g. backend returned success but same ID)
            if (prev.find(m => m.user_id === newMember.user_id)) return prev;
            return [...prev, newMember];
        });
    };

    const handleRemoveMember = async (userId: string) => {
        try {
            await membersAPI.removeMember(workspaceId, userId);
            setMembers((prev) => prev.filter((m) => m.user_id !== userId));
            toast.success("Member removed successfully");
        } catch (err) {
            console.error("Failed to remove member:", err);
            toast.error(err instanceof Error ? err.message : "Failed to remove member");
        }
    };

    const handleUpdateRole = async (userId: string, role: RoleEnum) => {
        try {
            // Find existing member to get email
            const member = members.find(m => m.user_id === userId);
            if (!member) return;

            // Using addMember to update role as per backend CRUD logic
            const updated = await membersAPI.addMember(workspaceId, {
                email: member.email,
                role: role
            });

            setMembers((prev) => prev.map(m => m.user_id === userId ? updated : m));
            toast.success("Member role updated successfully");
        } catch (err) {
            console.error("Failed to update member role:", err);
            toast.error(err instanceof Error ? err.message : "Failed to update role");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
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
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    Workspace Members
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
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
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Members ({members.length})
                        </h2>
                    </div>

                    <MembersList
                        members={Array.from(new Map(members.map(m => [m.user_id, m])).values()).map((m) => ({
                            user_id: m.user_id,
                            email: m.email,
                            role: m.role,
                            created_at: m.created_at,
                        }))}
                        onRemoveMember={handleRemoveMember}
                        onUpdateRole={handleUpdateRole}
                        isAdmin={isAdmin}
                        currentUserId={currentUserId}
                        isLoading={loading}
                    />

                    {!isAdmin && (
                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center text-gray-600 dark:text-gray-400 text-sm">
                            Only workspace admins can add or remove members.
                        </div>
                    )}
                </div>

                {/* Info notice */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-300 text-sm">
                        <strong>Note:</strong> To add a member, you need their registered Email Address.
                        Ask them to share the email they used to sign up.
                    </p>
                </div>
            </div>
        </div>
    );
}
