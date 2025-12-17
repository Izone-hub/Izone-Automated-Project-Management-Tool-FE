// src/lib/types.ts
export type Privacy = "workspace" | "private" | "public";

export interface Card {
  id: string;
  title: string;
  description?: string;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
  position?: number;
}

export interface Board {
  id: string;
  name: string;
  privacy: Privacy;
  background: string;
  description?: string;
  lists: List[]; // REQUIRED
  createdAt: string;
  updatedAt: string;
}


