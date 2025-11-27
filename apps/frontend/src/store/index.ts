import { create } from 'zustand';
import { User, Project, Task, List, ProjectWithDetails, Workspace } from '../types';

// ✅ Remove the circular import and define storage directly in the store
const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} to localStorage:`, error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },
};

// ... rest of your store code continues here
interface AppState {
  user: User | null;
  workspaces: Workspace[];
  projects: Project[];
  tasks: Task[];
  lists: List[];
  
  // ... all your store actions
}

// Background options (Trello-like)
const BACKGROUND_OPTIONS = [
  { id: 'blue', color: '#3B82F6', class: 'bg-blue-500' },
  { id: 'green', color: '#10B981', class: 'bg-green-500' },
  // ... rest of your BACKGROUND_OPTIONS
];

// ... rest of your store implementation

export const useStore = create<AppState>((set, get) => ({
  // Your store implementation
}));

export { BACKGROUND_OPTIONS };