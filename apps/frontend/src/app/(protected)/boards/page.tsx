
'use client';

import { useState, useEffect } from 'react';
import { useBoardStore } from '@/store/boardStore';
import { useWorkspaces } from '@/hooks/useWorkspace';
import { boardsAPI } from '@/lib/api/boards';
import { BoardCard } from '@/components/boards/BoardCard';
import { CreateBoard } from '@/components/boards/CreateBoard';
import { Search, Filter, Grid, List, Archive, Star, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BoardsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showArchived, setShowArchived] = useState(false);
  const [showStarred, setShowStarred] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingBoards, setIsLoadingBoards] = useState(true);

  // Get boards from store
  const boards = useBoardStore((state) => state.boards);
  const addBoard = useBoardStore((state) => state.addBoard);
  const deleteBoard = useBoardStore((state) => state.deleteBoard);
  const { workspaces, loading: workspacesLoading, reload: reloadWorkspaces } = useWorkspaces();

  // Function to fetch all boards from all workspaces
  const fetchAllBoards = async () => {
    if (workspacesLoading || workspaces.length === 0) {
      if (!workspacesLoading && workspaces.length === 0) {
        setIsLoadingBoards(false);
      }
      return;
    }

    try {
      setIsLoadingBoards(true);
      // Fetch boards from all workspaces in parallel
      const allBoardsPromises = workspaces.map(workspace =>
        boardsAPI.getWorkspaceBoards(workspace.id).catch(err => {
          console.error(`Failed to fetch boards for workspace ${workspace.id}:`, err);
          return [];
        })
      );

      const boardsArrays = await Promise.all(allBoardsPromises);
      const allBoards = boardsArrays.flat();

      // Map boards to the expected format
      const formattedBoards = allBoards.map((board: any) => ({
        ...board,
        title: board.name || board.title,
        color: board.background_color || board.color,
        background: board.background_color || board.background,
        privacy: "workspace",
        lists: [],
      }));

      // Update the store with all boards (replace existing)
      useBoardStore.setState({ boards: formattedBoards });
    } catch (error) {
      console.error('Error fetching all boards:', error);
    } finally {
      setIsLoadingBoards(false);
    }
  };

  // Fetch all boards when workspaces are loaded
  useEffect(() => {
    fetchAllBoards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaces.length, workspacesLoading]);

  const handleCreateBoard = async (boardData: any) => {
    try {
      // If no workspaceId provided, use the first workspace
      const workspaceId = boardData.workspaceId || (workspaces.length > 0 ? workspaces[0].id : null);

      if (!workspaceId) {
        throw new Error('No workspace available. Please create a workspace first.');
      }

      await addBoard({
        ...boardData,
        workspaceId,
      });

      setIsModalOpen(false);
      // Refresh boards after creation
      await fetchAllBoards();
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    try {
      await deleteBoard(boardId);
      toast.success('Board deleted successfully');
    } catch (error) {
      console.error('Failed to delete board:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete board');
    }
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

  if (workspacesLoading || isLoadingBoards) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground">Loading boards...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">All Boards</h1>
              <p className="text-muted-foreground mt-2">
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
          <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
            <p className="text-sm text-muted-foreground">Total Boards</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-green-500">{stats.active}</p>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
            <p className="text-sm text-muted-foreground">Archived</p>
            <p className="text-2xl font-bold text-amber-500">{stats.archived}</p>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
            <p className="text-sm text-muted-foreground">Starred</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.starred}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Search boards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-background text-foreground"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowStarred(!showStarred)}
                  className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${showStarred
                    ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500'
                    : 'bg-background border border-border text-muted-foreground hover:bg-accent'
                    }`}
                >
                  <Star size={16} className={showStarred ? 'fill-yellow-500 text-yellow-500' : ''} />
                  Starred
                </button>
                <button
                  onClick={() => setShowArchived(!showArchived)}
                  className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${showArchived
                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500'
                    : 'bg-background border border-border text-muted-foreground hover:bg-accent'
                    }`}
                >
                  <Archive size={16} />
                  Archived
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-accent text-blue-500' : 'bg-background text-muted-foreground'}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-accent text-blue-500' : 'bg-background text-muted-foreground'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Boards Display */}
        {filteredBoards.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl shadow-sm border border-border">
            <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Grid size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              {searchTerm || showArchived || showStarred ? 'No boards found' : 'No boards yet'}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
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
              <BoardCard key={board.id} board={board} onDelete={handleDeleteBoard} />
            ))}

            {/* Add New Board Card */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-1.5"
            >
              <div className={`bg-muted/50 border-2 border-dashed border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col items-center justify-center hover:border-blue-500/50 hover:bg-blue-500/5 ${viewMode === 'grid' ? 'h-full min-h-[200px]' : 'h-32'
                }`}>
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all duration-300">
                  <Plus className="w-6 h-6 text-blue-500 group-hover:text-blue-400" />
                </div>
                <span className="text-muted-foreground font-semibold group-hover:text-blue-400 transition-colors">
                  Create New Board
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Create Board Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <CreateBoard
              onCreate={handleCreateBoard}
              onClose={() => setIsModalOpen(false)}
              workspaceId={workspaces.length > 0 ? workspaces[0].id : undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}


