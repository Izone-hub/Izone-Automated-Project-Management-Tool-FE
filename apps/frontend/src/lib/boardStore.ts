'use client';

import { Board } from '@/types/board';

// Centralized store for boards
class BoardStore {
  private boards: Board[] = [];
  private listeners: ((boards: Board[]) => void)[] = [];
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.isInitialized) return;
    
    this.loadFromStorage();
    this.isInitialized = true;
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      const saved = localStorage.getItem('boards');
      if (saved) {
        const parsedBoards = JSON.parse(saved);
        // Ensure we have valid board data
        this.boards = Array.isArray(parsedBoards) ? parsedBoards : [];
        console.log('Loaded boards from storage:', this.boards.length);
      } else {
        this.boards = [];
        console.log('No boards found in storage, initializing empty array');
      }
    } catch (error) {
      console.error('Error loading boards from localStorage:', error);
      this.boards = [];
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('boards', JSON.stringify(this.boards));
      console.log('Saved boards to storage:', this.boards.length);
    } catch (error) {
      console.error('Error saving boards to localStorage:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.boards]));
  }

  subscribe(listener: (boards: Board[]) => void) {
    this.listeners.push(listener);
    // Immediately notify with current state
    listener([...this.boards]);
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getBoards(): Board[] {
    return [...this.boards];
  }

  getBoard(id: string): Board | undefined {
    return this.boards.find(board => board.id === id);
  }

  createBoard(boardData: Partial<Board>): Board {
    const newBoard: Board = {
      id: boardData.id || `board-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: boardData.title || 'New Board',
      name: boardData.name || boardData.title || 'New Board',
      description: boardData.description || '',
      workspaceId: boardData.workspaceId || '',
      background: boardData.background || 'blue',
      lists: boardData.lists || [],
      createdAt: boardData.createdAt || new Date().toISOString(),
      isArchived: false
    };

    console.log('Creating new board:', newBoard);
    
    this.boards.push(newBoard);
    this.saveToStorage();
    this.notifyListeners();
    return newBoard;
  }

  updateBoard(id: string, updates: Partial<Board>): Board | undefined {
    const index = this.boards.findIndex(board => board.id === id);
    if (index === -1) {
      console.warn('Board not found for update:', id);
      return undefined;
    }

    this.boards[index] = { ...this.boards[index], ...updates };
    this.saveToStorage();
    this.notifyListeners();
    
    console.log('Updated board:', id, updates);
    return this.boards[index];
  }

  addListToBoard(boardId: string, listData: { name: string }) {
    console.log('Adding list to board:', boardId, listData);
    const board = this.getBoard(boardId);
    if (!board) {
      console.error('Board not found in store:', boardId);
      console.log('Available boards:', this.boards.map(b => ({ id: b.id, name: b.name })));
      return;
    }

    const newList = {
      id: `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: listData.name,
      cards: []
    };

    const updatedLists = [...(board.lists || []), newList];
    const updatedBoard = this.updateBoard(boardId, { lists: updatedLists });
    
    console.log('Added list, board now has:', updatedBoard?.lists?.length, 'lists');
    return newList;
  }

  addCardToList(boardId: string, listId: string, cardData: any) {
    console.log('Adding card to list:', boardId, listId, cardData);
    const board = this.getBoard(boardId);
    if (!board) {
      console.error('Board not found:', boardId);
      return;
    }

    const updatedLists = (board.lists || []).map(list => {
      if (list.id === listId) {
        const newCard = {
          id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: cardData.title,
          description: cardData.description || '',
          labels: cardData.labels || [],
          dueDate: cardData.dueDate || null,
          attachments: cardData.attachments || [],
          createdAt: new Date().toISOString()
        };
        return {
          ...list,
          cards: [...(list.cards || []), newCard]
        };
      }
      return list;
    });

    this.updateBoard(boardId, { lists: updatedLists });
    return updatedLists.find(list => list.id === listId)?.cards.slice(-1)[0];
  }

  updateCard(boardId: string, listId: string, cardId: string, updates: any) {
    console.log('Updating card:', boardId, listId, cardId, updates);
    const board = this.getBoard(boardId);
    if (!board) {
      console.error('Board not found:', boardId);
      return;
    }

    const updatedLists = (board.lists || []).map(list => {
      if (list.id === listId) {
        return {
          ...list,
          cards: (list.cards || []).map(card =>
            card.id === cardId ? { ...card, ...updates } : card
          )
        };
      }
      return list;
    });

    this.updateBoard(boardId, { lists: updatedLists });
  }

  toggleCardLabel(boardId: string, listId: string, cardId: string, label: string) {
    console.log('Toggling label:', boardId, listId, cardId, label);
    const board = this.getBoard(boardId);
    if (!board) return;

    const list = board.lists?.find(l => l.id === listId);
    const card = list?.cards?.find(c => c.id === cardId);

    if (!card) return;

    const hasLabel = card.labels.includes(label);
    const updatedLabels = hasLabel
      ? card.labels.filter(l => l !== label)
      : [...card.labels, label];

    this.updateCard(boardId, listId, cardId, { labels: updatedLabels });
  }

  // Method to check if storage is working
  debugStorage() {
    console.log('Current boards in store:', this.boards);
    console.log('LocalStorage boards:', localStorage.getItem('boards'));
  }
}

// Singleton instance
export const boardStore = new BoardStore();



