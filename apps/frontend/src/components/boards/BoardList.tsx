'use client';

import { useBoardStore } from "@/store/boardStore";
import { AddList } from "./AddList";
import { CardItem } from "./CardItem";
import CardModal from "./CardModal";
import { AddCard } from "./AddCard";
import { Plus } from "lucide-react";
import { useState } from "react";

export const BoardList = ({ boardId }: { boardId: string }) => {
  const board = useBoardStore((state) =>
    state.boards.find(b => b.id === boardId)
  );

  const [activeAddCardListId, setActiveAddCardListId] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<{ listId: string; card: any } | null>(null);

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
              className="min-w-72 bg-gray-50 rounded-lg shadow-sm flex flex-col h-fit border flex-shrink-0"
            >
              {/* List Header */}
              <div className="p-3 bg-gray-100 rounded-t-lg flex items-center justify-between">
                <h3 className="font-medium text-gray-800">{list.title || "Untitled List"}</h3>
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                  {cards.length} cards
                </span>
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
    </div>
  );
};










