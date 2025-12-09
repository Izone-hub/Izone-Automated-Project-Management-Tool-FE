
'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaces } from "@/hooks/useWorkspace";
import WorkspaceForm from "@/components/workspace/WorkspaceForm";

export default function DashboardPage() {
  const router = useRouter();
  const { workspaces, loading, error, isAuthenticated, reload } = useWorkspaces();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated && error?.includes("login")) {
      router.push("/login?redirect=/dashboard");
    }
  }, [loading, isAuthenticated, error, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => router.push("/login?redirect=/dashboard")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Login to Continue
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Workspaces</h1>
        <button
          onClick={() => setShowForm(prev => !prev)}
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {showForm ? "Close Form" : "Create Workspace"}
        </button>
      </div>

      {showForm && <WorkspaceForm onSuccess={reload} />}

      {error && !error.includes("login") && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {workspaces.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No workspaces yet. Create your first one!</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {workspaces.map(ws => (
            <div key={ws.id} className="border rounded p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg mb-2">{ws.name}</h3>
              {ws.description && <p className="text-gray-600 text-sm mb-3">{ws.description}</p>}
              <p className="text-gray-500 text-xs">Created: {new Date(ws.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}







