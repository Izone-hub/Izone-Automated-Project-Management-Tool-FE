'use client';

import { useState, useCallback } from 'react';
import { List, CreateListData, UpdateListData } from '@/types/list';
import { mockLists, mockCards } from '@/lib/mockData';

export function useList() {
  const [isLoading, setIsLoading] = useState(false);

  const createList = async (data: CreateListData): Promise<List> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newList: List = {
        id: `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: data.title,
        position: data.position,
        boardId: data.boardId,
        cards: [],
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockLists.push(newList);
      return newList;
    } finally {
      setIsLoading(false);
    }
  };

  const updateList = async (id: string, data: UpdateListData): Promise<List> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const listIndex = mockLists.findIndex(list => list.id === id);
      if (listIndex === -1) {
        throw new Error('List not found');
      }

      const updatedList: List = {
        ...mockLists[listIndex],
        ...data,
        updatedAt: new Date(),
      };

      mockLists[listIndex] = updatedList;
      return updatedList;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteList = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const listIndex = mockLists.findIndex(list => list.id === id);
      if (listIndex !== -1) {
        mockLists.splice(listIndex, 1);
        
        // Also delete all cards in this list
        const cardsToDelete = mockCards.filter(card => card.listId === id);
        cardsToDelete.forEach(card => {
          const cardIndex = mockCards.findIndex(c => c.id === card.id);
          if (cardIndex !== -1) {
            mockCards.splice(cardIndex, 1);
          }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createList,
    updateList,
    deleteList,
  };
}