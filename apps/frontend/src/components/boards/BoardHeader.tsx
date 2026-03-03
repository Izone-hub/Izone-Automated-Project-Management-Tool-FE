// src/components/boards/BoardHeader.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Board } from "@/lib/api/boards";
import { useBoardStore } from '@/store/boardStore';
import { useWorkspaces } from '@/hooks/useWorkspace';
import { ChevronRight, Layout, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export const BoardHeader = ({ board }: { board: Board }) => {
  const { updateBoard } = useBoardStore();
  const { getWorkspaceById } = useWorkspaces();

  // Use the board's actual workspace_id, not the URL param
  const realWorkspaceId = board?.workspace_id;
  const workspace = realWorkspaceId ? getWorkspaceById(realWorkspaceId) : null;

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(board?.name || 'Untitled Board');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (board?.name) {
      setTitle(board.name);
    }
  }, [board?.name]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (title !== board.name) {
      updateBoard(board.id, { name: title });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setTitle(board.name);
      setIsEditing(false);
    }
  };

  // Safe defaults
  const safeBoard = board || { name: 'Untitled Board', lists: [] };
  const lists = safeBoard.lists || [];

  const totalCards = lists.reduce((total, list) =>
    total + (list.cards?.length || 0),
    0
  );

  return (
    <div className="bg-background shadow-sm border-b border-border text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-3">
        {/* Breadcrumb Navigation - Workspace Link Only */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          {realWorkspaceId && (
            <Link
              href={`/workspace/${realWorkspaceId}`}
              className="hover:text-foreground hover:bg-accent px-2 py-0.5 rounded transition-colors flex items-center gap-1.5 font-medium"
            >
              <Layout size={14} />
              {workspace?.name || 'Workspace'}
            </Link>
          )}
          <ChevronRight size={14} className="text-muted-foreground/50" />
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="text-2xl md:text-3xl font-bold bg-accent border-none rounded px-1 -ml-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-foreground w-full max-w-lg"
            />
          ) : (
            <h1
              onClick={handleTitleClick}
              className="text-2xl md:text-3xl font-bold hover:bg-accent cursor-pointer px-1 -ml-1 rounded transition-colors truncate max-w-full"
            >
              {title}
            </h1>
          )}

          {/* Back to Workspace Link - Use real workspace ID */}
          <Link
            href={realWorkspaceId ? `/workspace/${realWorkspaceId}` : '/dashboard'}
            className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1.5 text-xs font-medium min-w-fit whitespace-nowrap ml-2"
          >
            <ArrowLeft size={14} />
            Back to Workspace
          </Link>

          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground border-l border-border pl-3 ml-1 h-6">
            <span className="bg-accent px-2 py-0.5 rounded border border-border">{lists.length} lists</span>
            <span className="bg-accent px-2 py-0.5 rounded border border-border">{totalCards} cards</span>
          </div>
        </div>

        {safeBoard.description && (
          <p className="text-muted-foreground mt-1 text-sm max-w-2xl line-clamp-1">{safeBoard.description}</p>
        )}
      </div>
    </div>
  );
};









