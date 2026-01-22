"use client";

import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { RoleEnum } from "@/types/member";

interface AddMemberDialogProps {
    onAddMember: (userId: string, role: RoleEnum) => Promise<void>;
    isLoading?: boolean;
}

export function AddMemberDialog({ onAddMember, isLoading = false }: AddMemberDialogProps) {
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState("");
    const [role, setRole] = useState<RoleEnum>("member");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!userId.trim()) {
            setError("User ID is required");
            return;
        }

        // Basic UUID validation
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidPattern.test(userId.trim())) {
            setError("Please enter a valid UUID format");
            return;
        }

        setSubmitting(true);
        try {
            await onAddMember(userId.trim(), role);
            setUserId("");
            setRole("member");
            setOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add member");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Add Member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Workspace Member</DialogTitle>
                        <DialogDescription>
                            Enter the user ID of the person you want to add to this workspace.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="userId">User ID (UUID)</Label>
                            <Input
                                id="userId"
                                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                disabled={submitting}
                            />
                            <p className="text-xs text-gray-500">
                                Ask the user for their account UUID to add them.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={role} onValueChange={(v) => setRole(v as RoleEnum)} disabled={submitting}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="member">Member - Can view and edit</SelectItem>
                                    <SelectItem value="admin">Admin - Can manage members</SelectItem>
                                    <SelectItem value="owner">Owner - Full control</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting || isLoading}>
                            {submitting ? "Adding..." : "Add Member"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
