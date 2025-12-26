// export interface Card {
//   id: string;
//   title: string;
//   description?: string;
//   position: number;
//   listId: string;
//   dueDate?: Date;
//   labels: string[];
//   attachments: string[];
//   assignedMembers: string[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface CreateCardData {
//   title: string;
//   listId: string;
//   position: number;
// }

// export interface UpdateCardData {
//   title?: string;
//   description?: string;
//   position?: number;
//   dueDate?: Date;
//   labels?: string[];
// }


// // export interface Card {
// //   id: string;
// //   title: string;
// //   description?: string;
// //   position: number;
// //   listId: string;
// //   dueDate?: Date;
// //   labels: string[];
// //   attachments: string[];
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // export interface CreateCardData {
// //   title: string;
// //   description?: string;
// //   position: number;
// //   listId: string;
// //   dueDate?: Date;
// //   labels?: string[];
// // }

// // export interface UpdateCardData {
// //   title?: string;
// //   description?: string;
// //   position?: number;
// //   listId?: string;
// //   dueDate?: Date;
// //   labels?: string[];
// //   attachments?: string[];
// // }



// types/card.ts
export interface Card {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id?: string | null;
  position: number;
  list_id: string;      // Cards belong to lists
  board_id?: string;    // Optional reference to board
  created_by: string;
  created_at: string;
  updated_at: string;
  
  // Optional fields
  name?: string;
  comments?: any[];
  attachments?: any[];
  checklists?: any[];
  isWatched?: boolean;
  labels?: string[];
}

export interface CreateCardData {
  title: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  position?: number;
}

export interface UpdateCardData {
  title?: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  position?: number;
  status?: 'todo' | 'in-progress' | 'review' | 'done';
  assignee_id?: string | null;
}