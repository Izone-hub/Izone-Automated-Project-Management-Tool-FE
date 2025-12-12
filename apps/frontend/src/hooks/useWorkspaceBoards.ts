// hooks/useWorkspaceBoards.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { boardAPI } from '@/lib/api/board';
import { Board, CreateBoardData, UpdateBoardData } from '@/types/board';

export const useWorkspaceBoards = (workspaceId: string | undefined) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoards = useCallback(async () => {
    if (!workspaceId) {
      setBoards([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await boardAPI.getWorkspaceBoards(workspaceId);
      setBoards(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch boards');
      setBoards([]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const createBoard = async (data: Omit<CreateBoardData, 'workspace_id'>) => {
    if (!workspaceId) {
      throw new Error('Workspace ID is required to create a board');
    }
    
    try {
      const newBoard = await boardAPI.createBoard({
        ...data,
        workspace_id: workspaceId
      });
      setBoards(prev => [newBoard, ...prev]);
      return newBoard;
    } catch (err) {
      throw err;
    }
  };

  const updateBoard = async (boardId: string, data: UpdateBoardData) => {
    try {
      const updatedBoard = await boardAPI.updateBoard(boardId, data);
      setBoards(prev => 
        prev.map(board => board.id === boardId ? updatedBoard : board)
      );
      return updatedBoard;
    } catch (err) {
      throw err;
    }
  };

  const deleteBoard = async (boardId: string) => {
    try {
      await boardAPI.deleteBoard(boardId);
      setBoards(prev => prev.filter(board => board.id !== boardId));
    } catch (err) {
      throw err;
    }
  };

  const archiveBoard = async (boardId: string) => {
    try {
      const updatedBoard = await boardAPI.archiveBoard(boardId);
      setBoards(prev => 
        prev.map(board => board.id === boardId ? updatedBoard : board)
      );
      return updatedBoard;
    } catch (err) {
      throw err;
    }
  };

  // Helper to get a single board from the cached list
  const getBoard = (boardId: string): Board | undefined => {
    return boards.find(board => board.id === boardId);
  };

  // Filter boards
  const getActiveBoards = () => boards.filter(board => !board.archived);
  const getArchivedBoards = () => boards.filter(board => board.archived);

  return {
    boards,
    loading,
    error,
    fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard,
    archiveBoard,
    getBoard,
    getActiveBoards,
    getArchivedBoards
  };
};








