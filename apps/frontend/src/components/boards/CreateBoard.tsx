'use client';

import { useState } from "react";
import { useBoardStore } from "@/store/boardStore";
import { Board } from "@/lib/types";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export const CreateBoard = ({ onClose }: { onClose?: () => void }) => {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const router = useRouter();

  const [name, setName] = useState("");
  const [privacy, setPrivacy] = useState<Board["privacy"]>("workspace");
  const [background, setBackground] = useState("#4f46e5");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addBoard = useBoardStore((state) => state.addBoard);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const newBoardData = {
        name,
        privacy,
        background,
        workspaceId,
        lists: [],
      };

      // Show loading state
      await addBoard(newBoardData);

      setName("");
      onClose?.();

    } catch (error: any) {
      console.error("Failed to create board:", error);
      setError(error.message || "Failed to create board");

      // Check if it's an auth error
      if (error.message.includes("login") || error.message.includes("authenticated")) {
        // Redirect to login or show auth modal
        alert("Please login to create a board");
        router.push("/login"); // Adjust based on your routes
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">Create Board</h2>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <p className="text-sm font-medium">{error}</p>
          <p className="text-xs mt-1">Check console for details</p>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Board Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Event Planning"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          disabled={isLoading}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Privacy
        </label>
        <select
          value={privacy}
          onChange={(e) => setPrivacy(e.target.value as Board["privacy"])}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        >
          <option value="workspace">Workspace</option>
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Background Color
        </label>
        <input
          type="color"
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          className="w-full h-10 cursor-pointer rounded border border-gray-300"
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading || !name.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : (
            "Create Board"
          )}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};