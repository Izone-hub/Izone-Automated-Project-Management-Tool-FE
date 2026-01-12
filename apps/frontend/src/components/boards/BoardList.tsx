'use client';

import { useBoardStore } from "@/store/boardStore";
import { AddList } from "./AddList";
import { CardItem } from "./CardItem";
import CardModal from "./CardModal";
import { AddCard } from "./AddCard";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
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

export const BoardList = ({ boardId }: { boardId: string }) => {
  const board = useBoardStore((state) =>
    state.boards.find(b => b.id === boardId)
  );
  const deleteList = useBoardStore((state) => state.deleteList);

  const [activeAddCardListId, setActiveAddCardListId] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<{ listId: string; card: any } | null>(null);
  const [listToDelete, setListToDelete] = useState<string | null>(null);

  const handleDeleteList = async () => {
    if (listToDelete) {
      await deleteList(boardId, listToDelete);
      setListToDelete(null);
    }
  };

  if (!board) {
    return (
      <div className="p-4 text-center text-gray-500">
        No board found
      </div>
    );
  }

  const lists = board.lists || [];

  return (
    <div className="p-4">
      <div className="flex gap-4 overflow-x-auto min-h-[calc(100vh-200px)] pb-4">
        {lists.map((list) => {
          if (!list) return null;

          const cards = list.cards || [];

          return (
            <div
              key={list.id}
              className="min-w-72 bg-gray-50 rounded-lg shadow-sm flex flex-col h-fit border flex-shrink-0 group/list"
            >
              {/* List Header */}
              <div className="p-3 bg-gray-100 rounded-t-lg flex items-center justify-between group-hover/list:bg-gray-200 transition-colors">
                <h3 className="font-medium text-gray-800">{list.title || "Untitled List"}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                    {cards.length} cards
                  </span>
                  <button
                    onClick={() => setListToDelete(list.id)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover/list:opacity-100 transition-all"
                    title="Delete list"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cards */}
              <div className="p-2 flex-1 min-h-[100px] space-y-2">
                {cards.map((card) => (
                  <CardItem
                    key={card.id}
                    boardId={boardId}
                    listId={list.id}
                    card={card}
                    onClick={() => setActiveCard({ listId: list.id, card })}
                  />
                ))}
              </div>

              {/* Add Card Section */}
              <div className="p-2">
                {activeAddCardListId === list.id ? (
                  <AddCard
                    boardId={boardId}
                    listId={list.id}
                    onClose={() => setActiveAddCardListId(null)}
                  />
                ) : (
                  <button
                    onClick={() => setActiveAddCardListId(list.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add a card
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <AddList boardId={boardId} />
      </div>

      {activeCard && (
        <CardModal
          boardId={boardId}
          listId={activeCard.listId}
          card={activeCard.card}
          onClose={() => setActiveCard(null)}
        />
      )}

      <AlertDialog open={!!listToDelete} onOpenChange={(open) => !open && setListToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this list and all cards contained within it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteList} className="bg-red-600 hover:bg-red-700">
              Delete List
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};










