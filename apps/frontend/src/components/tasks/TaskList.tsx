// components/tasks/TaskList.tsx
'use client'; // Required for using hooks (useState, useStore)

import React, { useState } from 'react';
import { useStore } from '@/store/store';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';

export default function TaskList() {
  const { tasks, projects } = useStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({ project: 'all', status: 'all', priority: 'all' });

  const filteredTasks = tasks.filter(task => {
    if (filters.project !== 'all' && task.projectId !== filters.project) return false;
    if (filters.status !== 'all' && task.status !== filters.status) return false;
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    return true;
  });

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">🚀 Task Manager</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
        >
          ➕ New Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-lg border grid grid-cols-1 md:grid-cols-3 gap-4">
        <select 
          className="p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          value={filters.project} 
          onChange={e => setFilters({...filters, project: e.target.value})}
        >
          <option value="all">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select 
          className="p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          value={filters.status} 
          onChange={e => setFilters({...filters, status: e.target.value})}
        >
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
        <select 
          className="p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          value={filters.priority} 
          onChange={e => setFilters({...filters, priority: e.target.value})}
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Tasks */}
      <div className="space-y-4">
        {filteredTasks.map(task => <TaskCard key={task.id} task={task} />)}
        {filteredTasks.length === 0 && <p className="text-gray-500 text-center py-10 bg-white rounded-xl shadow-md">🎉 No tasks match the current filters.</p>}
      </div>

      <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}


