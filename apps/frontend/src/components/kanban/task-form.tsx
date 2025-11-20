'use client';

import { Task, Label } from '@/lib/types/kanban';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Calendar, User } from 'lucide-react';

interface TaskFormProps {
  columnType: Task['status'];
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const LABEL_OPTIONS: Label[] = [
  { id: '1', name: 'Design', color: '#8B5CF6', type: 'design' },
  { id: '2', name: 'Research', color: '#3B82F6', type: 'research' },
  { id: '3', name: 'Writing', color: '#10B981', type: 'writing' },
  { id: '4', name: 'Documentation', color: '#6B7280', type: 'documentation' },
  { id: '5', name: 'Content', color: '#F59E0B', type: 'content' },
  { id: '6', name: 'Planning', color: '#EC4899', type: 'planning' },
];

const MOCK_USERS = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '', role: 'admin' as const },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '', role: 'member' as const },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '', role: 'member' as const },
];

export function TaskForm({ columnType, onSubmit, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    labels: [] as Label[],
    assignees: [] as typeof MOCK_USERS,
  });

  const toggleLabel = (label: Label) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.find(l => l.id === label.id)
        ? prev.labels.filter(l => l.id !== label.id)
        : [...prev.labels, label]
    }));
  };

  const toggleAssignee = (user: typeof MOCK_USERS[0]) => {
    setFormData(prev => ({
      ...prev,
      assignees: prev.assignees.find(a => a.id === user.id)
        ? prev.assignees.filter(a => a.id !== user.id)
        : [...prev.assignees, user]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title,
      description: formData.description,
      status: columnType,
      priority: 'medium',
      dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
      labels: formData.labels,
      assignees: formData.assignees,
      attachments: 0,
      comments: 0,
    };

    onSubmit(newTask);
    setFormData({ title: '', description: '', dueDate: '', labels: [], assignees: [] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Title Input */}
      <Input
        placeholder="Task title"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        className="font-medium"
        autoFocus
      />

      {/* Description Input */}
      <Textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        rows={2}
      />

      {/* Labels */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-700">Labels</div>
        <div className="flex flex-wrap gap-1">
          {LABEL_OPTIONS.map((label) => (
            <button
              key={label.id}
              type="button"
              onClick={() => toggleLabel(label)}
              className={`px-2 py-1 rounded-full text-xs font-medium border transition-colors ${
                formData.labels.find(l => l.id === label.id)
                  ? 'bg-purple-100 text-purple-800 border-purple-200'
                  : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
              }`}
            >
              {label.name}
            </button>
          ))}
        </div>
      </div>

      {/* Due Date */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-700">Due Date</div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            className="pl-10"
          />
        </div>
      </div>

      {/* Assignees */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-700">Assign To</div>
        <div className="space-y-1">
          {MOCK_USERS.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => toggleAssignee(user)}
              className={`flex items-center gap-2 w-full p-2 rounded text-sm transition-colors ${
                formData.assignees.find(a => a.id === user.id)
                  ? 'bg-blue-50 text-blue-700'
                  : 'hover:bg-gray-50'
              }`}
            >
              <User className="w-3 h-3" />
              <span>{user.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-2 pt-2">
        <Button type="submit" size="sm" className="flex-1">
          Add Task
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
