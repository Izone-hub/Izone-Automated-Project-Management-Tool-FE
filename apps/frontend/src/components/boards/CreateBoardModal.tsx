'use client';

import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { Board } from '@/store/board.store';

type Props = {
  onClose: () => void;
  onCreate: (board: Board) => void;
};

export default function CreateBoardModal({ onClose, onCreate }: Props) {
  const [title, setTitle] = useState('');
  const [workspace, setWorkspace] = useState('Workspace 1');
  const [visibility, setVisibility] = useState<'Private' | 'Workspace' | 'Public'>('Private');
  const [background, setBackground] = useState('#1e90ff');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!title) return;

    const newBoard: Board = {
      id: nanoid(),
      title,
      workspaceId: workspace,
      visibility,
      background,
      description,
      lists: [], // start empty
    };

    onCreate(newBoard); // pass board to parent
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Create Board</h2>
        <input
          type="text"
          placeholder="Board Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <select
          value={workspace}
          onChange={(e) => setWorkspace(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="Workspace 1">Workspace 1</option>
          <option value="Workspace 2">Workspace 2</option>
        </select>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as any)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="Private">Private</option>
          <option value="Workspace">Workspace</option>
          <option value="Public">Public</option>
        </select>
        <label className="block mb-4">
          Background:
          <input
            type="color"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="ml-2 w-10 h-10 p-0 border-0"
          />
        </label>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
