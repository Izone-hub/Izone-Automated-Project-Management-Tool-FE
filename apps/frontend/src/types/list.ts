// import { Card } from './card';

import { Card } from "./card";

// export interface List {
//   id: string;
//   title: string;
//   position: number;
//   boardId: string;
//   cards: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   // mark lists that are auto-created as defaults (e.g., To Do/Doing/Done)
//   isDefault?: boolean;
// }

// export interface ListWithCards extends Omit<List, 'cards'> {
//   cards: Card[];
// }

// export interface CreateListData {
//   title: string;
//   boardId: string;
//   position: number;
// }

// export interface UpdateListData {
//   title?: string;
//   position?: number;
// }





// types/list.ts - CORRECTED
export interface List {
  id: string;
  title: string;           // Backend uses 'title'
  board_id: string;        // Alias for project_id
  project_id?: string;     // Same as board_id
  status?: 'todo' | 'in-progress' | 'review' | 'done'; // Optional if not used
  position: number;
  description?: string;
  color?: string;
  cards?: Card[];
  created_at: string;
  updated_at: string;
}

export interface CreateListData {
  title: string;           // REQUIRED
  position?: number;
  description?: string;
  color?: string;
}

export interface UpdateListData {
  title?: string;
  position?: number;
  description?: string;
  color?: string;
  status?: 'todo' | 'in-progress' | 'review' | 'done';
}