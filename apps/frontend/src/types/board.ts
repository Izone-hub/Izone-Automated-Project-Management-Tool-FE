// export type BoardStatus = 'active' | 'archived';

// export interface Board {
//   id: string;
//   name: string;
//   title?: string; // For compatibility
//   description?: string;
//   color: string;
//   background?: string; // For compatibility
//   status: BoardStatus;
//   createdAt: Date;
//   updatedAt: Date;
//   createdBy: string; // User ID
//   memberCount: number;
//   taskCount: number;
//   workspaceId?: string;
//   lists?: Array<any>; // For compatibility
//   // Add other properties from your existing code
//   backgroundImage?: string;
//   isStarred?: boolean;
//   lastActivity?: Date;
// }

// export interface CreateBoardData {
//   name: string;
//   description?: string;
//   color?: string;
//   workspaceId?: string;
// }

// export interface UpdateBoardData {
//   name?: string;
//   description?: string;
//   color?: string;
//   status?: BoardStatus;
//   backgroundImage?: string;
//   isStarred?: boolean;
// }
// lib/types.ts




// lib/types.ts

export interface Board {
  id: string;
  name: string;
  title?: string;
  description?: string;
  workspace_id: string;
  background_color: string;
  color?: string;
  background?: string;
  archived: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  privacy?: "private" | "workspace" | "public";
  lists?: List[];
}

export interface List {
  id: string;
  title: string;
  board_id: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  position: number;
  cards?: Card[];
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id?: string | null;
  position: number;
  project_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  // For compatibility
  name?: string;
  list_id?: string;
  comments?: any[];
  attachments?: any[];
  checklists?: any[];
  isWatched?: boolean;
  labels?: string[];
}
