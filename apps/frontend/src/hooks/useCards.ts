'use client';

import { useState, useCallback } from 'react';
import { Card, CreateCardData, UpdateCardData } from '@/types/card';
import { mockCards, mockLists } from '@/lib/mockData';

export function useCard() {
  const [isLoading, setIsLoading] = useState(false);

  const createCard = async (data: CreateCardData): Promise<Card> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newCard: Card = {
        id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: data.title,
        description: '',
        position: data.position,
        listId: data.listId,
        labels: [],
        attachments: [],
        assignedMembers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCards.push(newCard);
      
      // Add card to list's cards array
      const listIndex = mockLists.findIndex(list => list.id === data.listId);
      if (listIndex !== -1) {
        mockLists[listIndex].cards.push(newCard.id);
      }

      return newCard;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCard = async (id: string, data: UpdateCardData): Promise<Card> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const cardIndex = mockCards.findIndex(card => card.id === id);
      if (cardIndex === -1) {
        throw new Error('Card not found');
      }

      const updatedCard: Card = {
        ...mockCards[cardIndex],
        ...data,
        updatedAt: new Date(),
      };

      mockCards[cardIndex] = updatedCard;
      return updatedCard;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCard = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const cardIndex = mockCards.findIndex(card => card.id === id);
      if (cardIndex !== -1) {
        const card = mockCards[cardIndex];
        mockCards.splice(cardIndex, 1);
        
        // Remove card from list's cards array
        const listIndex = mockLists.findIndex(list => list.id === card.listId);
        if (listIndex !== -1) {
          mockLists[listIndex].cards = mockLists[listIndex].cards.filter(
            cardId => cardId !== id
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createCard,
    updateCard,
    deleteCard,
  };
}


// 'use client';

// import { useState, useCallback } from 'react';
// import { Card, CreateCardData, UpdateCardData } from '@/types';
// import { mockCards, mockLists } from '@/lib/mockData';

// export function useCard() {
//   const [isLoading, setIsLoading] = useState(false);

//   const createCard = async (data: CreateCardData): Promise<Card> => {
//     setIsLoading(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 300));
      
//       const newCard: Card = {
//         id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//         title: data.title,
//         description: '',
//         position: data.position,
//         listId: data.listId,
//         labels: [],
//         attachments: [],
//         assignedMembers: [],
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };

//       mockCards.push(newCard);
      
//       // Add card to list's cards array
//       const listIndex = mockLists.findIndex(list => list.id === data.listId);
//       if (listIndex !== -1) {
//         mockLists[listIndex].cards.push(newCard.id);
//       }

//       return newCard;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateCard = async (id: string, data: UpdateCardData): Promise<Card> => {
//     setIsLoading(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 300));
      
//       const cardIndex = mockCards.findIndex(card => card.id === id);
//       if (cardIndex === -1) {
//         throw new Error('Card not found');
//       }

//       const updatedCard: Card = {
//         ...mockCards[cardIndex],
//         ...data,
//         updatedAt: new Date(),
//       };

//       mockCards[cardIndex] = updatedCard;
//       return updatedCard;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deleteCard = async (id: string): Promise<void> => {
//     setIsLoading(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 300));
      
//       const cardIndex = mockCards.findIndex(card => card.id === id);
//       if (cardIndex !== -1) {
//         const card = mockCards[cardIndex];
//         mockCards.splice(cardIndex, 1);
        
//         // Remove card from list's cards array
//         const listIndex = mockLists.findIndex(list => list.id === card.listId);
//         if (listIndex !== -1) {
//           mockLists[listIndex].cards = mockLists[listIndex].cards.filter(
//             cardId => cardId !== id
//           );
//         }
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     isLoading,
//     createCard,
//     updateCard,
//     deleteCard,
//   };
// }



