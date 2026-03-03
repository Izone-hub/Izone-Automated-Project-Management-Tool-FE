'use client';

import { useState } from "react";
import { Board } from "@/lib/api/boards";
import { Lock, Globe, Users, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BoardCardProps {
  board: Board;
  onDelete?: (boardId: string) => Promise<void>;
}

export const BoardCard = ({ board, onDelete }: BoardCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getPrivacyIcon = () => {
    switch (board.privacy) {
      case "private": return <Lock className="w-4 h-4" />;
      case "workspace": return <Users className="w-4 h-4" />;
      case "public": return <Globe className="w-4 h-4" />;
    }
  };

  const getPrivacyText = () => {
    switch (board.privacy) {
      case "private": return "Private";
      case "workspace": return "Workspace";
      case "public": return "Public";
    }
  };

  const lists = Array.isArray(board.lists) ? board.lists : [];

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(board.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="relative group rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-40 cursor-pointer">
        {/* Delete button — visible on hover */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
            className="absolute top-2 right-2 z-10 p-1.5 bg-black/40 hover:bg-red-600 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 text-white"
            title="Delete board"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        <Link href={`/workspace/1/board/${board.id}`} className="block h-full">
          <div
            className="h-full"
            style={{ backgroundColor: board.background || "#333" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative h-full p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white drop-shadow-md">
                  {board.name || "Untitled Board"}
                </h3>
                <div className="flex items-center gap-1 mt-2">
                  {getPrivacyIcon()}
                  <span className="text-xs text-white/90">{getPrivacyText()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-white/80">{lists.length} lists</span>
                <span className="text-xs text-white/80">
                  {lists.reduce((total, list) => total + (Array.isArray(list.cards) ? list.cards.length : 0), 0)} cards
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Board</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>&quot;{board.name || "this board"}&quot;</strong>?
              This will permanently delete the board and all its lists and cards. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Board"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
