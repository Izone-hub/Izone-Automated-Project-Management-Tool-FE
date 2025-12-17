
import React, { useState } from 'react';
import { useStore, Task } from '@/store/store';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({ isOpen, onClose }: Props) {
  const { addTask, projects, user } = useStore();
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || 'p1');
  const [status, setStatus] = useState<Task['status']>('todo');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return; 

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      projectId,
      assigneeId: user?.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addTask(newTask);
    
    // Reset state and close
    setTitle('');
    setDueDate('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-blue-600">Add New Task</h2>
        <input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="Task Title (e.g., Fix homepage bug)" 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <select value={projectId} onChange={e => setProjectId(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg">
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value as Task['status'])} className="w-full p-3 border border-gray-300 rounded-lg">
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
        <select value={priority} onChange={e => setPriority(e.target.value as Task['priority'])} className="w-full p-3 border border-gray-300 rounded-lg">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg"/>
        <div className="flex justify-end space-x-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
          <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Create Task</button>
        </div>
      </form>
    </div>
  );
}


