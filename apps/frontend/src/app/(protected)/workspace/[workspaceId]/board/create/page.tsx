'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBoardStore } from '@/store/boardStore';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateBoardPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;
  
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const createBoard = useBoardStore((state) => state.createBoard);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Board name is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create board with workspaceId
      const boardId = createBoard({
        name: name.trim(),
        workspaceId: workspaceId, // ← THIS LINKS BOARD TO WORKSPACE
      });
      
      // Redirect to the new board
      router.push(`/workspace/${workspaceId}/board/${boardId}`);
    } catch (err) {
      setError('Failed to create board');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/workspace/${workspaceId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workspace
        </Link>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Board</h1>
          <p className="text-gray-600 mb-6">Create a board inside this workspace</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Board Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Development Tasks, Marketing Campaign"
                autoFocus
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Link
                href={`/workspace/${workspaceId}`}
                className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!name.trim() || isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Board'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}










// 'use client';

// import { useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { mockWorkspaces } from '@/lib/mockData';

// const BOARD_BACKGROUNDS = [
//   { id: 'blue', name: 'Blue', class: 'bg-blue-500' },
//   { id: 'green', name: 'Green', class: 'bg-green-500' },
//   { id: 'red', name: 'Red', class: 'bg-red-500' },
//   { id: 'purple', name: 'Purple', class: 'bg-purple-500' },
//   { id: 'orange', name: 'Orange', class: 'bg-orange-500' },
//   { id: 'pink', name: 'Pink', class: 'bg-pink-500' },
// ];

// export default function CreateBoardPage() {
//   const params = useParams();
//   const router = useRouter();
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [selectedBackground, setSelectedBackground] = useState('blue');
//   const [isLoading, setIsLoading] = useState(false);

//   const workspace = mockWorkspaces.find(ws => ws.id === params.workspaceId);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title.trim()) return;

//     setIsLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       // In a real app, you would create the board via API
//       const newBoardId = `board-${Date.now()}`;
//       router.push(`/workspace/${params.workspaceId}/board/${newBoardId}`);
//     }, 1000);
//   };

//   if (!workspace) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">Workspace Not Found</h1>
//           <Link 
//             href="/dashboard" 
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Back to Dashboard
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <Link 
//             href={`/workspace/${params.workspaceId}`}
//             className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
//           >
//             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//             Back to {workspace.name}
//           </Link>
//           <h1 className="text-3xl font-bold text-gray-900">Create New Board</h1>
//           <p className="text-gray-600 mt-2">Create a new board in {workspace.name} workspace</p>
//         </div>

//         {/* Form */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Board Title */}
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//                 Board Title *
//               </label>
//               <input
//                 id="title"
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="e.g., Project Tasks, Marketing Campaign, Web Development"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                 required
//                 autoFocus
//               />
//             </div>

//             {/* Board Description */}
//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//                 Description <span className="text-gray-500">(optional)</span>
//               </label>
//               <textarea
//                 id="description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Describe what this board will be used for..."
//                 rows={3}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
//               />
//             </div>

//             {/* Background Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-3">
//                 Board Background
//               </label>
//               <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
//                 {BOARD_BACKGROUNDS.map((bg) => (
//                   <button
//                     key={bg.id}
//                     type="button"
//                     onClick={() => setSelectedBackground(bg.id)}
//                     className={`aspect-video rounded-lg border-2 ${
//                       selectedBackground === bg.id 
//                         ? 'border-blue-500 ring-2 ring-blue-200' 
//                         : 'border-gray-300 hover:border-gray-400'
//                     } ${bg.class} transition-all`}
//                   >
//                     <span className="sr-only">{bg.name}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Preview */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Preview
//               </label>
//               <div className={`${BOARD_BACKGROUNDS.find(bg => bg.id === selectedBackground)?.class} rounded-lg p-4 aspect-video flex items-center justify-center`}>
//                 <span className="text-white font-semibold text-lg">
//                   {title || 'Your Board Title'}
//                 </span>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex gap-3 pt-4">
//               <Link
//                 href={`/workspace/${params.workspaceId}`}
//                 className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-center"
//               >
//                 Cancel
//               </Link>
//               <button
//                 type="submit"
//                 disabled={!title.trim() || isLoading}
//                 className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
//               >
//                 {isLoading ? 'Creating...' : 'Create Board'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }