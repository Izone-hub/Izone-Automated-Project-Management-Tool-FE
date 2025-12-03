// components/boards/CreateBoardForm.tsx
'use client';

import { useState } from 'react';

interface CreateBoardFormProps {
  onSubmit: (data: { name: string; description?: string }) => void;
  onCancel: () => void;
}

export const CreateBoardForm = ({ onSubmit, onCancel }: CreateBoardFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Board Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Product Launch Tasks"
          className="w-full p-2 border rounded"
          required
          autoFocus
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's this board about?"
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>
      
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          Create Board
        </button>
      </div>
    </form>
  );
};








// 'use client';

// import { useState } from "react";
// import { useBoardStore } from "@/store/boardStore";
// import { Board } from "@/lib/types";

// export const CreateBoard = ({ onClose }: { onClose?: () => void }) => {
//   const [name, setName] = useState("");
//   const [privacy, setPrivacy] = useState<Board["privacy"]>("workspace");
//   const [background, setBackground] = useState("#4f46e5");
//   const addBoard = useBoardStore((state) => state.addBoard); // CORRECT: addBoard not createBoard

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!name.trim()) return;
    
//     const newBoardData = {
//       name,
//       privacy,
//       background,
//       lists: [], // CRITICAL: Include empty lists array
//     };
    
//     addBoard(newBoardData);
//     setName("");
//     onClose?.();
//   };

//   return (
//     <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//       <h2 className="text-xl font-bold mb-4">Create Board</h2>
      
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Board Name *
//         </label>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="e.g., Event Planning"
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           required
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Privacy
//         </label>
//         <select
//           value={privacy}
//           onChange={(e) => setPrivacy(e.target.value as Board["privacy"])}
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//         >
//           <option value="workspace">Workspace</option>
//           <option value="private">Private</option>
//           <option value="public">Public</option>
//         </select>
//       </div>

//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Background Color
//         </label>
//         <input
//           type="color"
//           value={background}
//           onChange={(e) => setBackground(e.target.value)}
//           className="w-full h-10 cursor-pointer rounded border border-gray-300"
//         />
//       </div>

//       <div className="flex gap-3">
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex-1"
//         >
//           Create Board
//         </button>
//         {onClose && (
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//           >
//             Cancel
//           </button>
//         )}
//       </div>
//     </form>
//   );
// };




