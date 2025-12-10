// src/app/workspace/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspaces } from '@/hooks/useWorkspace';
import { ArrowLeft, Globe, Lock, Users, Palette } from 'lucide-react';
import Link from 'next/link';

const colorOptions = [
  { value: '#0079bf', label: 'Blue' },
  { value: '#d29034', label: 'Orange' },
  { value: '#519839', label: 'Green' },
  { value: '#b04632', label: 'Red' },
  { value: '#89609e', label: 'Purple' },
  { value: '#00aECC', label: 'Teal' },
  { value: '#838C91', label: 'Gray' },
  { value: '#ff78cb', label: 'Pink' },
];

export default function CreateWorkspacePage() {
  const router = useRouter();
  const { createWorkspace, loadWorkspaces } = useWorkspace();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#0079bf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    setIsClient(true);
    
    // Check if user is authenticated
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login?redirect=" + encodeURIComponent("/workspace/create"));
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Workspace name is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      // Call createWorkspace with only name and description
      // Backend will automatically set owner_id from current user
      const newWorkspace = await createWorkspace({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      // Refresh workspaces list
      await loadWorkspaces();

      // Redirect to the dashboard or workspace list
      router.push("/dashboard"); // Change this to your actual dashboard route
      
    } catch (err: any) {
      console.error('Failed to create workspace:', err);
      
      // Handle specific error messages
      if (err.message.includes("not logged in") || err.message.includes("Session expired")) {
        setError("Your session has expired. Please login again.");
      } else if (err.message.includes("Unauthorized")) {
        setError("You don't have permission to create a workspace.");
      } else if (err.message.includes("Validation error")) {
        setError("Please check your input and try again.");
      } else if (err.message.includes("Network error") || err.message.includes("Failed to fetch")) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(err.message || "Failed to create workspace. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show nothing while checking authentication
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/dashboard" // Change this to your dashboard route
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create New Workspace</h1>
          <p className="text-gray-600 text-sm">Organize your projects and collaborate with your team</p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setError(null)}
                    className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Workspace Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <span className="flex items-center gap-2">
                  Workspace name <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder="e.g., Marketing Team, Product Development"
                required
                autoFocus
                disabled={isSubmitting}
              />
              <p className="text-sm text-gray-500 mt-2">
                This is the name of your company, team, or project.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Description <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="What's this workspace for? Describe the purpose or goals."
                rows={4}
                disabled={isSubmitting}
              />
              <p className="text-sm text-gray-500 mt-2">
                Let team members know what this workspace is about.
              </p>
            </div>

            {/* Color Theme - Optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <span className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Color Theme (Optional)
                </span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setColor(option.value)}
                    disabled={isSubmitting}
                    className={`relative w-10 h-10 rounded-full transition-transform ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'
                    } ${
                      color === option.value 
                        ? 'ring-2 ring-offset-2 ring-gray-800 scale-110' 
                        : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-300'
                    }`}
                    style={{ backgroundColor: option.value }}
                    title={option.label}
                  >
                    {color === option.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full opacity-90" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Choose a color that represents your workspace (frontend only)
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Link
                href="/dashboard" // Change this to your dashboard route
                className={`px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium ${
                  isSubmitting ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!name.trim() || isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium min-w-[140px] flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Workspace'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Workspaces are free to create. You can invite members and create projects within your workspace.
          </p>
        </div>
      </main>
    </div>
  );
}








