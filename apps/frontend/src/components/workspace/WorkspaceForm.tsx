// components/workspace/WorkspaceForm.tsx
'use client';
import React, { useState } from "react";
import { useWorkspaces } from "@/hooks/useWorkspace";

interface WorkspaceFormProps {
  onSuccess?: () => void;
}

export default function WorkspaceForm({ onSuccess }: WorkspaceFormProps) {
  const { createWorkspace } = useWorkspaces();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Workspace name is required");
      return;
    }

    setSubmitting(true);
    try {
      await createWorkspace({ name: name.trim(), description: description.trim() || undefined });
      setName("");
      setDescription("");
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Failed to create workspace");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-muted-foreground">Workspace Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-input rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
          placeholder="Marketing Team"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground">Description (Optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border border-input rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 resize-none bg-background text-foreground"
          placeholder="What's this workspace for?"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Creating..." : "Create Workspace"}
      </button>
    </form>
  );
}
