



// Project = Board (Trello model)
export interface Project {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'archived';
  background: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
  // Trello-like properties
  isFavorite: boolean;
  visibility: 'private' | 'workspace' | 'public';
  lastActivity: string;
}

// List = Column (Trello model)
export interface List {
  id: string;
  title: string;
  projectId: string;  // Belongs to a project/board
  position: number;
  createdAt: string;
  updatedAt: string;
}

// Task = Card (Trello model)
export interface Task {
  id: string;
  title: string;
  description?: string;
  listId: string;     // Belongs to a list/column
  projectId: string;  // Also track which project/board it belongs to
  position: number;
  labels: string[];
  dueDate?: string;
  assigneeId?: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'member' | 'guest';
}

// For detailed project/board view
export interface ProjectWithDetails extends Project {
  lists: List[];
  tasks: Task[];
}