'use client';

import React, { useState } from 'react';
import { WorkspaceList } from '@/components/workspace/WorkspaceList';
import { CreateWorkspaceModal } from '@/components/workspace/CreateWorkspaceModal';
import { LayoutDashboard, Search } from 'lucide-react';

export default function WorkspaceDashboardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Workspaces</h1>
                <p className="text-gray-600 text-sm">Manage your teams and projects</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search workspaces..." value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WorkspaceList onCreateClick={() => setIsCreateModalOpen(true)} />
      </main>

      <CreateWorkspaceModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}






