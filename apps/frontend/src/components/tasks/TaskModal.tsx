
'use client';

import React, { useState, useEffect } from 'react';
import { Task, useStore } from '@/store/store';

interface Props {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskModal({ task, isOpen, onClose }: Props) {
  const { updateTask, deleteTask, projects } = useStore();
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [projectId, setProjectId] = useState(task.projectId);
  // Format the date string to YYYY-MM-DD for the input type="date"
  const [dueDate, setDueDate] = useState(task.dueDate?.split('T')[0] || '');

  // Sync internal state when the external task object changes (important when editing tasks)
  useEffect(() => {
    if (isOpen) {
        setTitle(task.title);
        setStatus(task.status);
        setPriority(task.priority);
        setProjectId(task.projectId);
        setDueDate(task.dueDate?.split('T')[0] || '');
    }
  }, [task, isOpen]);

  const handleSave = () => {
    updateTask(task.id, { 
        title, 
        status, 
        priority, 
        projectId, 
        // Only update dueDate if it has a value
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined, 
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
        deleteTask(task.id);
        onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-5 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800">Edit Task: {task.id}</h2>
        <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border rounded-lg"/>
        
        <select value={projectId} onChange={e => setProjectId(e.target.value)} className="w-full p-3 border rounded-lg">
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        
        <select value={status} onChange={e => setStatus(e.target.value as Task['status'])} className="w-full p-3 border rounded-lg">
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
        
        <select value={priority} onChange={e => setPriority(e.target.value as Task['priority'])} className="w-full p-3 border rounded-lg">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-3 border rounded-lg"/>
        
        <div className="flex justify-between pt-4">
          <button onClick={handleDelete} className="px-5 py-2 border rounded-lg text-red-600 hover:bg-red-50 transition">🗑️ Delete</button>
          <div className="space-x-3">
            <button onClick={onClose} className="px-5 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
            <button onClick={handleSave} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">💾 Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}


