// src/app/boards/page.tsx
'use client';

import { useState } from 'react';
import { useBoardStore } from '@/store/boardStore';
import { BoardCard } from '@/components/Boards/BoardCard';
import {createBoard} from "@/components/board/createBoard";
import { Search, Filter, Grid, List, Archive, Star, Plus } from 'lucide-react';

export default function BoardsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showArchived, setShowArchived] = useState(false);
  const [showStarred, setShowStarred] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get boards from store
  const boards = useBoardStore((state) => state.boards);
  const createBoard = useBoardStore((state) => state.createBoard);

  const handleCreateBoard = (boardData: any) => {
    createBoard(boardData);
    setIsModalOpen(false);
  };

  // Filter boards based on search, starred, and archived filters
  const filteredBoards = boards.filter(board => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      board.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Archived filter (if you have status property)
    // const matchesArchived = showArchived ? board.status === 'archived' : board.status === 'active';
    
    // Starred filter (if you have isStarred property)
    // const matchesStarred = !showStarred || board.isStarred === true;
    
    return matchesSearch; // Add && matchesArchived && matchesStarred when you add those properties
  });

  // Stats
  const stats = {
    total: boards.length,
    active: boards.length, // Update when adding status property
    archived: 0, // Update when adding status property
    starred: 0, // Update when adding isStarred property
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Boards</h1>
              <p className="text-gray-600 mt-2">
                Manage all your boards in one place
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Create Board
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600">Total Boards</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600">Archived</p>
            <p className="text-2xl font-bold text-amber-600">{stats.archived}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600">Starred</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.starred}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search boards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowStarred(!showStarred)}
                  className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    showStarred
                      ? 'bg-yellow-50 border border-yellow-200 text-yellow-700'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Star size={16} className={showStarred ? 'fill-yellow-500 text-yellow-500' : ''} />
                  Starred
                </button>
                <button
                  onClick={() => setShowArchived(!showArchived)}
                  className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    showArchived
                      ? 'bg-amber-50 border border-amber-200 text-amber-700'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Archive size={16} />
                  Archived
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Boards Display */}
        {filteredBoards.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <Grid size={32} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              {searchTerm || showArchived || showStarred ? 'No boards found' : 'No boards yet'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search or filter to find what you\'re looking for.'
                : 'Create your first board to start organizing tasks and projects.'
              }
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Board
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
            : 'space-y-3'
          }>
            {filteredBoards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
            
            {/* Add New Board Card */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-1.5"
            >
              <div className={`bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50/50 ${
                viewMode === 'grid' ? 'h-full min-h-[200px]' : 'h-32'
              }`}>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                  <Plus className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
                </div>
                <span className="text-gray-700 font-semibold group-hover:text-blue-700 transition-colors">
                  Create New Board
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Create Board Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <CreateBoard 
              onCreate={handleCreateBoard}
              onClose={() => setIsModalOpen(false)} 
            />
          </div>
        )}
      </div>
    </div>
  );
}


