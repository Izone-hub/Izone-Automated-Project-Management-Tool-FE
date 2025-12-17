// src/store/useStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Project, User, UpdateTaskData } from '../types/task';

interface Store {
  tasks: Task[];
  projects: Project[];
  user: User | null;
  
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: UpdateTaskData) => void;
  deleteTask: (taskId: string) => void;
  addProject: (project: Project) => void;
  setUser: (user: User) => void;
}

// Initial data
const initialProjects: Project[] = [
  { id: '1', name: 'Website Redesign', color: '#3B82F6', status: 'active' },
  { id: '2', name: 'Mobile App', color: '#10B981', status: 'active' },
  { id: '3', name: 'Marketing Campaign', color: '#F59E0B', status: 'active' },
];

const initialUser: User = {
  id: 'user1',
  name: 'John Doe',
  email: 'john@example.com'
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      tasks: [],
      projects: initialProjects,
      user: initialUser,

      addTask: (task: Task) => {
        set((state) => ({
          tasks: [...state.tasks, task]
        }));
      },

      updateTask: (taskId: string, updates: UpdateTaskData) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          )
        }));
      },

      deleteTask: (taskId: string) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId)
        }));
      },

      addProject: (project: Project) => {
        set((state) => ({
          projects: [...state.projects, project]
        }));
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'task-management-storage',
    }
  )
);


