'use client';

import { Task } from '@/lib/types/kanban';
import { MessageSquare, Paperclip, Calendar, Edit2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { CardSidebar } from './card-sidebar';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onStatusChange: (newStatus: Task['status']) => void;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete?: (taskId: string) => void;
}

export function TaskCard({ task, onStatusChange, onTaskUpdate, onTaskDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [showSidebar, setShowSidebar] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Auto-focus and adjust height when editing
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      adjustTextareaHeight();
    }
  }, [isEditing]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedTitle(e.target.value);
    adjustTextareaHeight();
  };

  const handleTitleBlur = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      onTaskUpdate({ ...task, title: editedTitle.trim() });
    } else {
      setEditedTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setEditedTitle(task.title);
      setIsEditing(false);
    }
  };

  const handleCardClick = () => {
    setShowSidebar(true);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <>
      {/* Draggable Task Card */}
      <div 
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`
          bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group relative
          ${isDragging ? 'opacity-50 rotate-6 scale-105 z-50' : ''}
        `}
        onClick={handleCardClick}
      >
        {/* Priority Indicator */}
        <div className="flex items-center justify-between mb-2">
          <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
          <button 
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Edit2 className="w-3 h-3 text-gray-400" />
          </button>
        </div>

        {/* Task Title - Editable */}
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editedTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleKeyPress}
            className="w-full p-1 border border-blue-300 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-medium text-gray-900 mb-2"
            rows={1}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 className="font-medium text-gray-900 text-sm mb-2 leading-tight">
            {task.title}
          </h3>
        )}

        {/* Labels */}
        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {task.labels.map((label) => (
              <span
                key={label.id}
                className="px-2 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: label.color }}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        {/* Task Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            {/* Due Date */}
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
                <Calendar className="w-3 h-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}

            {/* Attachments */}
            {task.attachments > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="w-3 h-3" />
                <span>{task.attachments}</span>
              </div>
            )}

            {/* Comments */}
            {task.comments > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                <span>{task.comments}</span>
              </div>
            )}
          </div>

          {/* Assignees */}
          {task.assignees.length > 0 && (
            <div className="flex -space-x-1">
              {task.assignees.slice(0, 2).map((assignee, index) => (
                <div
                  key={assignee.id}
                  className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
                  title={assignee.name}
                >
                  {assignee.name.split(' ').map(n => n[0]).join('')}
                </div>
              ))}
              {task.assignees.length > 2 && (
                <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                  +{task.assignees.length - 2}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Sidebar - Enhanced Version */}
      <CardSidebar
        task={task}
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        onTaskUpdate={onTaskUpdate}
        onTaskDelete={onTaskDelete || (() => {})}
      />
    </>
  );
}

export default TaskCard;

