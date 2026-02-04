"use client";

import React from "react";
import { Trash2, Crown, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { WorkspaceMember, RoleEnum } from "@/types/member";

interface MembersListProps {
    members: WorkspaceMember[];
    onRemoveMember: (userId: string) => void;
    onUpdateRole?: (userId: string, role: RoleEnum) => void;
    isAdmin: boolean;
    currentUserId: string;
    isLoading?: boolean;
}

const roleConfig: Record<RoleEnum, { label: string; icon: React.ReactNode; variant: "default" | "secondary" | "outline" }> = {
    owner: { label: "Owner", icon: <Crown className="w-3 h-3" />, variant: "default" },
    admin: { label: "Admin", icon: <Shield className="w-3 h-3" />, variant: "secondary" },
    member: { label: "Member", icon: <User className="w-3 h-3" />, variant: "outline" },
};

export function MembersList({
    members,
    onRemoveMember,
    onUpdateRole,
    isAdmin,
    currentUserId,
    isLoading = false
}: MembersListProps) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full" />
                            <div className="space-y-2">
                                <div className="w-32 h-4 bg-gray-200 rounded" />
                                <div className="w-24 h-3 bg-gray-200 rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (members.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No members in this workspace yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {members.map((member) => {
                const config = roleConfig[member.role];
                const isCurrentUser = member.user_id === currentUserId;
                const canRemove = isAdmin && !isCurrentUser && member.role !== "owner";

                return (
                    <div
                        key={member.user_id}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 active:bg-gray-100 active:scale-[0.99] transition-all duration-200 cursor-pointer select-none touch-none"
                    >
                        <div className="flex items-center gap-3">
                            {/* Avatar placeholder */}
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                {(member.email || member.user_id).slice(0, 2).toUpperCase()}
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">
                                        {member.email || member.user_id}
                                    </span>
                                    {isCurrentUser && (
                                        <span className="text-xs text-gray-500">(You)</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    {isAdmin && !isCurrentUser && member.role !== "owner" ? (
                                        <Select
                                            value={member.role}
                                            onValueChange={(v) => onUpdateRole?.(member.user_id, v as RoleEnum)}
                                        >
                                            <SelectTrigger className="h-7 w-[110px] text-xs py-0">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="member">Member</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Badge variant={config.variant} className="flex items-center gap-1">
                                            {config.icon}
                                            {config.label}
                                        </Badge>
                                    )}
                                    <span className="text-xs text-gray-400">
                                        Joined {new Date(member.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {canRemove && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 active:scale-95 transition-transform"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Remove Member</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to remove <strong>{member.email || member.user_id}</strong> from this workspace?
                                            This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => onRemoveMember(member.user_id)}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            Remove
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
