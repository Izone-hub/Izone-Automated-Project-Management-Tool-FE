'use client';

import { useState } from 'react';
import { BoardWithDetails } from '@/types';
import { BoardBackground } from './BoardBackground';

interface BoardHeaderProps {
  board: BoardWithDetails;
  onUpdateBackground?: (background: string) => Promise<void> | void;
}

export function BoardHeader({ board, onUpdateBackground }: BoardHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(board.title);
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);

  const handleSave = () => {
    // TODO: Implement update board title/description via provided API
    setIsEditing(false);
  };

  const handleBackgroundChange = (bg: string) => {
    if (onUpdateBackground) {
      const res = onUpdateBackground(bg);
      if (res instanceof Promise) {
        res.then(() => setShowBackgroundPicker(false)).catch(() => {});
      } else {
        setShowBackgroundPicker(false);
      }
    }
  };

  return (
    <div className="p-4 bg-black bg-opacity-30 text-white relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              className="text-2xl font-bold bg-transparent border-b border-white outline-none"
              autoFocus
            />
          ) : (
            <h1 
              className="text-2xl font-bold cursor-pointer hover:bg-white hover:bg-opacity-20 rounded px-2 py-1"
              onClick={() => setIsEditing(true)}
            >
              {board.title}
            </h1>
          )}
          {board.description && (
            <p className="text-gray-300">{board.description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition">
            Share
          </button>
          <div className="relative">
            <button
              onClick={() => setShowBackgroundPicker((v) => !v)}
              className="px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition"
            >
              Background
            </button>

            {showBackgroundPicker && (
              <div className="absolute right-0 mt-2 w-64 z-40">
                <div className="bg-white rounded-md shadow-lg overflow-hidden">
                  <BoardBackground board={board} onUpdateBackground={handleBackgroundChange} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}







// 'use client';

// import React, { useState } from 'react';
// // Assume BoardWithDetails and BACKGROUND_OPTIONS are defined in your project
// import { BoardWithDetails } from '@/types/board';
// import { BACKGROUND_OPTIONS } from '@/store';

// interface BoardHeaderProps {
//   board?: BoardWithDetails;
//   // New prop to handle title updates (e.g., calling an API to save to the database)
//   onUpdateTitle?: (title: string) => void; 
//   onUpdateBackground?: (background: string) => void;
// }

// export function BoardHeader({ board, onUpdateTitle, onUpdateBackground }: BoardHeaderProps) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editableTitle, setEditableTitle] = useState('');
//   const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);

//   if (!board) {
//     return (
//       <div className="p-4 bg-black bg-opacity-20 text-white">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold">Loading Board...</h1>
//         </div>
//       </div>
//     );
//   }

//   const handleSave = () => {
//     // --- THIS IS THE KEY CHANGE ---
//     // Check if the title actually changed and if the update function exists
//     if (editableTitle.trim() !== '' && editableTitle !== board.title) {
//         // Call the external function provided via props to handle data persistence (e.g., API call)
//         onUpdateTitle?.(editableTitle.trim()); 
//     }
//     setIsEditing(false);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleSave();
//     } else if (e.key === 'Escape') {
//       setIsEditing(false);
//       setEditableTitle(board.title); // Revert to original title on escape
//     }
//   };

//   const startEditing = () => {
//     setEditableTitle(board.title); // Set to current board title before editing starts
//     setIsEditing(true);
//   };

//   return (
//     <div className="p-4 bg-black bg-opacity-20 text-white">
//       <div className="flex items-center justify-between max-w-full">
//         <div className="flex items-center space-x-4">
//           {isEditing ? (
//             <input
//               type="text"
//               value={editableTitle}
//               onChange={(e) => setEditableTitle(e.target.value)}
//               onBlur={handleSave} // Save when user clicks away
//               onKeyDown={handleKeyPress}
//               className="text-2xl font-bold bg-white bg-opacity-20 rounded px-3 py-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
//               autoFocus
//             />
//           ) : (
//             <h1 
//               className="text-2xl font-bold cursor-pointer hover:bg-white hover:bg-opacity-20 rounded px-3 py-1 transition-colors"
//               onClick={startEditing} // Start editing when title is clicked
//             >
//               {board.title} {/* ✅ Displays the current board name (e.g., "Bekele") */}
//             </h1>
//           )}
          
//           {board.description && (
//             <p className="text-white text-opacity-80 hidden md:block">{board.description}</p>
//           )}
//         </div>
        
//         <div className="flex items-center space-x-2">
//           <button className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors text-sm font-medium">
//             Share
//           </button>
          
//           <div className="relative">
//             <button
//               onClick={() => setShowBackgroundPicker(!showBackgroundPicker)}
//               className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors text-sm font-medium"
//             >
//               Background
//             </button>

//             {showBackgroundPicker && (
//               <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg z-50 p-4 text-gray-800">
//                 <h3 className="font-semibold mb-3">Change Background</h3>
//                 <div className="grid grid-cols-4 gap-3">
//                   {BACKGROUND_OPTIONS.map((bg) => (
//                     <button
//                       key={bg.id}
//                       onClick={() => {
//                         onUpdateBackground?.(bg.id);
//                         setShowBackgroundPicker(false);
//                       }}
//                       className={`aspect-video rounded-lg border-2 ${
//                         board.background === bg.id 
//                           ? 'border-blue-500 ring-2 ring-blue-200' 
//                           : 'border-gray-300 hover:border-gray-400'
//                       } ${bg.class} transition-all hover:scale-105`}
//                       title={bg.id}
//                     >
//                       <span className="sr-only">{bg.id}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
