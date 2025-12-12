// hooks/useBoard.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { boardAPI } from '@/lib/api/board';
import { Board, UpdateBoardData } from '@/types/board';

export const useBoard = (boardId: string | undefined) => {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoard = useCallback(async () => {
    if (!boardId) {
      setBoard(null);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await boardAPI.getBoard(boardId);
      setBoard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch board');
      setBoard(null);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  const updateBoard = async (data: UpdateBoardData) => {
    if (!boardId) {
      throw new Error('Board ID is required to update a board');
    }
    
    try {
      const updatedBoard = await boardAPI.updateBoard(boardId, data);
      setBoard(updatedBoard);
      return updatedBoard;
    } catch (err) {
      throw err;
    }
  };

  const archiveBoard = async () => {
    if (!boardId) {
      throw new Error('Board ID is required to archive a board');
    }
    
    try {
      const updatedBoard = await boardAPI.archiveBoard(boardId);
      setBoard(updatedBoard);
      return updatedBoard;
    } catch (err) {
      throw err;
    }
  };

  const deleteBoard = async () => {
    if (!boardId) {
      throw new Error('Board ID is required to delete a board');
    }
    
    try {
      await boardAPI.deleteBoard(boardId);
      setBoard(null);
    } catch (err) {
      throw err;
    }
  };

  return {
    board,
    loading,
    error,
    fetchBoard,
    updateBoard,
    archiveBoard,
    deleteBoard
  };
};










