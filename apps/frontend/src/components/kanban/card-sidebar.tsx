'use client';

import { Task, Label, Assignee } from '@/lib/types/kanban';
import { X, Calendar, User, Tag, MessageSquare, Paperclip, Edit2, Trash2, Save } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface CardSidebarProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

// Mock data for dropdowns (you can replace with your actual data)
const mockLabels: Label[] = [
  { id: '1', name: 'Design', color: '#8B5CF6', type: 'design' },
  { id: '2', name: 'Writing', color: '#10B981', type: 'writing' },
  { id: '3', name: 'Research', color: '#3B82F6', type: 'research' },
  { id: '4', name: 'Documentation', color: '#6B7280', type: 'documentation' },
  { id: '5', name: 'Planning', color: '#EC4899', type: 'planning' },
  { id: '6', name: 'Content', color: '#F59E0B', type: 'content' },
];

const mockAssignees: Assignee[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '', role: 'admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '', role: 'member' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '', role: 'member' },
];

export function CardSidebar({ task, isOpen, onClose, onTaskUpdate, onTaskDelete }: CardSidebarProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate || '');
  const [editedPriority, setEditedPriority] = useState(task.priority);
  const [showLabelsDropdown, setShowLabelsDropdown] = useState(false);
  const [showAssigneesDropdown, setShowAssigneesDropdown] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<Label[]>(task.labels);
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>(task.assignees);

  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setEditedTitle(task.title);
      setEditedDescription(task.description || '');
      setEditedDueDate(task.dueDate || '');
      setEditedPriority(task.priority);
      setSelectedLabels(task.labels);
      setSelectedAssignees(task.assignees);
    }
  }, [isOpen, task]);

  useEffect(() => {
    if (isEditingTitle && titleTextareaRef.current) {
      titleTextareaRef.current.focus();
      titleTextareaRef.current.select();
    }
  }, [isEditingTitle]);

  const handleSave = () => {
    const updatedTask: Task = {
      ...task,
      title: editedTitle,
      description: editedDescription,
      dueDate: editedDueDate,
      priority: editedPriority,
      labels: selectedLabels,
      assignees: selectedAssignees,
      updatedAt: new Date().toISOString(),
    };
    onTaskUpdate(updatedTask);
    onClose();
  };

  const handleLabelToggle = (label: Label) => {
    setSelectedLabels(prev => 
      prev.some(l => l.id === label.id)
        ? prev.filter(l => l.id !== label.id)
        : [...prev, label]
    );
  };

  const handleAssigneeToggle = (assignee: Assignee) => {
    setSelectedAssignees(prev =>
      prev.some(a => a.id === assignee.id)
        ? prev.filter(a => a.id !== assignee.id)
        : [...prev, assignee]
    );
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      onTaskDelete(task.id);
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-300 text-gray-700';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-2xl h-full shadow-xl p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            {isEditingTitle ? (
              <textarea
                ref={titleTextareaRef}
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    setIsEditingTitle(false);
                  }
                }}
                className="w-full text-2xl font-bold resize-none border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            ) : (
              <h2 
                className="text-2xl font-bold cursor-text hover:bg-gray-50 rounded p-2"
                onClick={() => setIsEditingTitle(true)}
              >
                {task.title}
              </h2>
            )}
            <p className="text-gray-500 text-sm mt-2">
              in list <span className="font-medium">{task.status}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Edit2 className="w-5 h-5" />
                <h3 className="font-semibold">Description</h3>
              </div>
              <textarea
                ref={descriptionTextareaRef}
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Add a more detailed description..."
                className="w-full min-h-[100px] p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Attachments & Comments */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                <Paperclip className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">{task.attachments}</p>
                  <p className="text-sm text-gray-600">Attachments</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">{task.comments}</p>
                  <p className="text-sm text-gray-600">Comments</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Add to card</h3>

            {/* Members */}
            <div className="relative">
              <button
                onClick={() => setShowAssigneesDropdown(!showAssigneesDropdown)}
                className="w-full flex items-center gap-2 p-2 text-left hover:bg-gray-50 rounded"
              >
                <User className="w-5 h-5" />
                <span>Members</span>
              </button>
              {showAssigneesDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-2">
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {mockAssignees.map(assignee => (
                      <label key={assignee.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAssignees.some(a => a.id === assignee.id)}
                          onChange={() => handleAssigneeToggle(assignee)}
                          className="rounded"
                        />
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-medium text-white">
                          {assignee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="flex-1">{assignee.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Labels */}
            <div className="relative">
              <button
                onClick={() => setShowLabelsDropdown(!showLabelsDropdown)}
                className="w-full flex items-center gap-2 p-2 text-left hover:bg-gray-50 rounded"
              >
                <Tag className="w-5 h-5" />
                <span>Labels</span>
              </button>
              {showLabelsDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-2">
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {mockLabels.map(label => (
                      <label key={label.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedLabels.some(l => l.id === label.id)}
                          onChange={() => handleLabelToggle(label)}
                          className="rounded"
                        />
                        <div 
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: label.color }}
                        ></div>
                        <span>{label.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Due Date */}
            <div>
              <button className="w-full flex items-center gap-2 p-2 text-left hover:bg-gray-50 rounded">
                <Calendar className="w-5 h-5" />
                <span>Due Date</span>
              </button>
              <div className="mt-2">
                <input
                  type="date"
                  value={editedDueDate}
                  onChange={(e) => setEditedDueDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={editedPriority}
                onChange={(e) => setEditedPriority(e.target.value as Task['priority'])}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Selected Labels Preview */}
            {selectedLabels.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Labels</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedLabels.map(label => (
                    <span
                      key={label.id}
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: label.color }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Members Preview */}
            {selectedAssignees.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Members</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedAssignees.map(assignee => (
                    <div
                      key={assignee.id}
                      className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-medium text-white"
                      title={assignee.name}
                    >
                      {assignee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Task
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
