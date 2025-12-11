"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBoardStore } from "@/store/boardStore";
import { Plus, ArrowLeft } from "lucide-react";

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.boardId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [newListTitle, setNewListTitle] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);

  // Get data from store
  const boards = useBoardStore((state) => state.boards);
  const addList = useBoardStore((state) => state.addList);
  const addCard = useBoardStore((state) => state.addCard);
  const removeCard = useBoardStore((state) => state.removeCard);

  useEffect(() => {
    if (boardId) setIsLoading(false);
  }, [boardId]);

  // Find the board
  const board = boards.find((b) => b.id === boardId);

  if (!board) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Board not found</h2>
        <button
          onClick={() => router.push("/boards")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Go to Boards
        </button>
      </div>
    </div>
  );

  const lists = Array.isArray(board.lists) ? board.lists : [];

  // Handle createdAt safely (works with Date or Firebase timestamp)
  const createdAt = board.createdAt instanceof Date
    ? board.createdAt
    : board.createdAt?.seconds
    ? new Date(board.createdAt.seconds * 1000)
    : new Date();

  const handleAddList = () => {
    if (newListTitle.trim()) {
      addList(boardId, newListTitle.trim());
      setNewListTitle("");
      setIsAddingList(false);
    }
  };

  const handleAddCard = (listId: string) => {
    const cardTitle = prompt("Enter card title:");
    if (cardTitle?.trim()) addCard(boardId, listId, cardTitle.trim());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{board.name || "Untitled Board"}</h1>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
        <p className="text-gray-500">
          {lists.length} lists • Created {createdAt.toLocaleDateString()}
        </p>
      </div>

      {/* Lists */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {lists.map((list) => (
          <div key={list.id} className="min-w-64 bg-gray-100 rounded-lg p-4 flex-shrink-0">
            <h3 className="font-medium mb-3">{list.title || "Untitled List"}</h3>

            {/* Cards */}
            <div className="space-y-2 mb-4">
              {(Array.isArray(list.cards) ? list.cards : []).map((card) => (
                <div key={card.id} className="bg-white p-3 rounded border">
                  <div className="flex justify-between">
                    <span>{card.title || "Untitled Card"}</span>
                    <button
                      onClick={() => {
                        if (confirm("Delete this card?")) removeCard(boardId, list.id, card.id);
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleAddCard(list.id)}
              className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <Plus size={16} />
              Add a card
            </button>
          </div>
        ))}

        {/* Add List Button */}
        <div className="flex-shrink-0">
          {isAddingList ? (
            <div className="min-w-64 bg-white rounded-lg p-4 border">
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="List title"
                className="w-full px-3 py-2 border rounded mb-3"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddList}
                  className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
                >
                  Add
                </button>
                <button
                  onClick={() => { setIsAddingList(false); setNewListTitle(""); }}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingList(true)}
              className="min-w-64 h-full min-h-[200px] bg-gray-100 hover:bg-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center"
            >
              <Plus size={24} className="mb-2" />
              <span>Add list</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}









