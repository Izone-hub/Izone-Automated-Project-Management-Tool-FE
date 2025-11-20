// components/kanban/column.tsx
'use client';

import { Column as ColumnType, Task } from '@/lib/types/kanban';
import { TaskCard } from './task-card';
import { Plus, MoreHorizontal, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface ColumnProps {
  column: ColumnType;
  onTaskMove: (taskId: string, newStatus: ColumnType['type']) => void;
  onTaskAdd: (taskData: { title: string }, columnType: ColumnType['type']) => void;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onColumnDelete?: (columnId: string) => void;
}

export function Column({ column, onTaskMove, onTaskAdd, onTaskUpdate, onTaskDelete, onColumnDelete }: ColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { setNodeRef } = useDroppable({
    id: column.type,
  });

  const getColumnColor = (type: ColumnType['type']) => {
    switch (type) {
      case 'backlog': return 'bg-gray-100 border-gray-300';
      case 'todo': return 'bg-blue-50 border-blue-200';
      case 'inProgress': return 'bg-yellow-50 border-yellow-200';
      case 'review': return 'bg-purple-50 border-purple-200';
      case 'done': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  useEffect(() => {
    if (isAddingTask && textareaRef.current) {
      textareaRef.current.focus();
      adjustTextareaHeight();
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowColumnMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAddingTask]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onTaskAdd({ title: newTaskTitle.trim() }, column.type);
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleCancel = () => {
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTask();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTaskTitle(e.target.value);
    adjustTextareaHeight();
  };

  const handlePlusClick = () => {
    setIsAddingTask(true);
    setNewTaskTitle('');
  };

  const handleDeleteColumn = () => {
    if (onColumnDelete && confirm(`Are you sure you want to delete the "${column.name}" column?`)) {
      onColumnDelete(column.id);
    }
    setShowColumnMenu(false);
  };

  return (
    <div className="flex-shrink-0 w-80">
      {/* Column Header */}
      <div className={`flex items-center justify-between p-4 rounded-t-lg border ${getColumnColor(column.type)} relative`}>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">{column.name}</h3>
          <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600">
            {column.tasks.length}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
            onClick={handlePlusClick}
            title="Add card"
          >
            <Plus className="w-4 h-4" />
          </button>
          
          <div className="relative" ref={menuRef}>
            <button 
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
              onClick={() => setShowColumnMenu(!showColumnMenu)}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {showColumnMenu && (
              <div className="absolute right-0 top-8 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 min-w-32">
                <button 
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowColumnMenu(false)}
                >
                  Edit column
                </button>
                <button 
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={handleDeleteColumn}
                >
                  Delete column
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Column Content */}
      <div 
        ref={setNodeRef}
        className="bg-gray-100 rounded-b-lg min-h-96 flex flex-col"
      >
        <SortableContext 
          items={column.tasks.map(task => task.id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]">
            {column.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={(newStatus) => onTaskMove(task.id, newStatus)}
                onTaskUpdate={onTaskUpdate}
                onTaskDelete={onTaskDelete}
              />
            ))}
          </div>
        </SortableContext>

        {/* Add Card Section */}
        <div className="p-3 pt-0">
          {isAddingTask && (
            <div className="bg-white rounded-lg shadow-sm p-3 space-y-3 mb-2">
              <textarea
                ref={textareaRef}
                value={newTaskTitle}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyPress}
                placeholder="Enter a title for this card..."
                className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-h-[60px]"
                rows={1}
              />
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddTask}
                  disabled={!newTaskTitle.trim()}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add card
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {!isAddingTask && column.tasks.length === 0 && (
            <button
              onClick={handlePlusClick}
              className="w-full flex items-center gap-2 p-3 text-gray-600 hover:bg-gray-200 rounded transition-colors group"
            >
              <Plus className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
              <span className="text-sm">Add a card</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}



// 'use client';

// import { Column as ColumnType, Task } from '@/lib/types/kanban';
// import { TaskCard } from './task-card';
// import { Plus, MoreHorizontal, X } from 'lucide-react';
// import { useState, useRef, useEffect } from 'react';
// import { useDroppable } from '@dnd-kit/core';
// import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

// interface ColumnProps {
//   column: ColumnType;
//   onTaskMove: (taskId: string, newStatus: ColumnType['type']) => void;
//   onTaskAdd: (taskData: { title: string }, columnType: ColumnType['type']) => void;
//   onTaskUpdate: (updatedTask: Task) => void;
//   onTaskDelete: (taskId: string) => void;
// }

// export function Column({ column, onTaskMove, onTaskAdd, onTaskUpdate, onTaskDelete }: ColumnProps) {
//   const [isAddingTask, setIsAddingTask] = useState(false);
//   const [showColumnMenu, setShowColumnMenu] = useState(false);
//   const [newTaskTitle, setNewTaskTitle] = useState('');
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const menuRef = useRef<HTMLDivElement>(null);

//   const { setNodeRef } = useDroppable({
//     id: column.type,
//   });

//   const getColumnColor = (type: ColumnType['type']) => {
//     switch (type) {
//       case 'backlog': return 'bg-gray-100 border-gray-300';
//       case 'todo': return 'bg-blue-50 border-blue-200';
//       case 'inProgress': return 'bg-yellow-50 border-yellow-200';
//       case 'review': return 'bg-purple-50 border-purple-200';
//       case 'done': return 'bg-green-50 border-green-200';
//       default: return 'bg-gray-100 border-gray-300';
//     }
//   };

//   // Auto-focus and close menu when clicking outside
//   useEffect(() => {
//     if (isAddingTask && textareaRef.current) {
//       textareaRef.current.focus();
//       adjustTextareaHeight();
//     }

//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setShowColumnMenu(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [isAddingTask]);

//   const adjustTextareaHeight = () => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = 'auto';
//       textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//     }
//   };

//   const handleAddTask = () => {
//     if (newTaskTitle.trim()) {
//       onTaskAdd({ title: newTaskTitle.trim() }, column.type);
//       setNewTaskTitle('');
//       setIsAddingTask(false);
//     }
//   };

//   const handleCancel = () => {
//     setNewTaskTitle('');
//     setIsAddingTask(false);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleAddTask();
//     } else if (e.key === 'Escape') {
//       handleCancel();
//     }
//   };

//   const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setNewTaskTitle(e.target.value);
//     adjustTextareaHeight();
//   };

//   const handlePlusClick = () => {
//     setIsAddingTask(true);
//     setNewTaskTitle('');
//   };

//   return (
//     <div className="flex-shrink-0 w-80">
//       {/* Column Header - PLUS BUTTON ALWAYS VISIBLE */}
//       <div className={`flex items-center justify-between p-4 rounded-t-lg border ${getColumnColor(column.type)} relative`}>
//         <div className="flex items-center gap-2">
//           <h3 className="font-semibold text-gray-900">{column.name}</h3>
//           <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600">
//             {column.tasks.length}
//           </span>
//         </div>
        
//         {/* PLUS BUTTON AND THREE DOTS - ALWAYS VISIBLE */}
//         <div className="flex items-center gap-1">
//           {/* PLUS BUTTON - ALWAYS IN HEADER (TRELLO STYLE) */}
//           <button 
//             className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
//             onClick={handlePlusClick}
//             title="Add card"
//           >
//             <Plus className="w-4 h-4" />
//           </button>
          
//           {/* THREE DOTS MENU - ALWAYS IN HEADER (TRELLO STYLE) */}
//           <div className="relative" ref={menuRef}>
//             <button 
//               className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
//               onClick={() => setShowColumnMenu(!showColumnMenu)}
//             >
//               <MoreHorizontal className="w-4 h-4" />
//             </button>
            
//             {/* Dropdown Menu */}
//             {showColumnMenu && (
//               <div className="absolute right-0 top-8 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 min-w-32">
//                 <button 
//                   className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   onClick={() => {
//                     setShowColumnMenu(false);
//                   }}
//                 >
//                   Edit column
//                 </button>
//                 <button 
//                   className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
//                   onClick={() => {
//                     setShowColumnMenu(false);
//                   }}
//                 >
//                   Delete column
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Column Content - Droppable Area */}
//       <div 
//         ref={setNodeRef}
//         className="bg-gray-100 rounded-b-lg min-h-96 flex flex-col"
//       >
//         <SortableContext 
//           items={column.tasks.map(task => task.id)} 
//           strategy={verticalListSortingStrategy}
//         >
//           {/* Task Cards Area - Scrollable */}
//           <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]">
//             {column.tasks.map((task) => (
//               <TaskCard
//                 key={task.id}
//                 task={task}
//                 onStatusChange={(newStatus) => onTaskMove(task.id, newStatus)}
//                 onTaskUpdate={onTaskUpdate}
//                 onTaskDelete={onTaskDelete}
//               />
//             ))}
//           </div>
//         </SortableContext>

//         {/* BOTTOM SECTION - FORM APPEARS HERE (TRELLO STYLE) */}
//         <div className="p-3 pt-0">
//           {/* ADD CARD FORM - APPEARS AT BOTTOM WHEN PLUS IS CLICKED */}
//           {isAddingTask && (
//             <div className="bg-white rounded-lg shadow-sm p-3 space-y-3 mb-2">
//               {/* Textarea - Exactly like Trello */}
//               <textarea
//                 ref={textareaRef}
//                 value={newTaskTitle}
//                 onChange={handleTextareaChange}
//                 onKeyDown={handleKeyPress}
//                 placeholder="Enter a title for this card..."
//                 className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-h-[60px]"
//                 rows={1}
//               />
              
//               {/* Action Buttons - Exactly like Trello */}
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={handleAddTask}
//                   disabled={!newTaskTitle.trim()}
//                   className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
//                 >
//                   Add card
//                 </button>
//                 <button
//                   onClick={handleCancel}
//                   className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* EXTRA "ADD A CARD" BUTTON - SHOWS WHEN COLUMN IS EMPTY (TRELLO STYLE) */}
//           {!isAddingTask && column.tasks.length === 0 && (
//             <button
//               onClick={handlePlusClick}
//               className="w-full flex items-center gap-2 p-3 text-gray-600 hover:bg-gray-200 rounded transition-colors group"
//             >
//               <Plus className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
//               <span className="text-sm">Add a card</span>
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Column;
