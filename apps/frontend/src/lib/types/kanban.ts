// lib/types/kanban.ts
export interface Label {
  id: string;
  name: string;
  color: string;
  type: string;
}

export interface Assignee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'member';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'inProgress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  labels: Label[];
  assignees: Assignee[];
  attachments: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  name: string;
  type: Task['status'];
  tasks: Task[];
}

export interface Board {
  id: string;
  name: string;
  description: string;
  columns: Column[];
  createdAt: string;
  updatedAt: string;
}

// export interface Task {
//   id: string;
//   title: string;
//   description?: string; // ✅ Now included
//   status: 'backlog' | 'todo' | 'inProgress' | 'review' | 'done';
//   priority: 'low' | 'medium' | 'high';
//   dueDate: string;
//   labels: Label[];
//   assignees: Member[];
//   attachments: number;
//   comments: number;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Label {
//   id: string;
//   name: string;
//   color: string;
//   type: 'design' | 'research' | 'writing' | 'documentation' | 'content' | 'planning';
// }

// export interface Column {
//   id: string;
//   name: string;
//   type: 'backlog' | 'todo' | 'inProgress' | 'review' | 'done';
//   position: number;
//   tasks: Task[];
// }

// export interface Member {
//   id: string;
//   name: string;
//   email: string;
//   avatar?: string;
//   role: 'admin' | 'member' | 'guest';
// }

// // Alias for Assignee to match your CardSidebar
// export type Assignee = Member;

