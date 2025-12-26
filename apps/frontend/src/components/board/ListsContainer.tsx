// components/board/ListsContainer.tsx - UPDATED WITH CORRECT EXPORT
'use client';

import { useState, useEffect } from 'react';
import { listsAPI, List } from '@/lib/api/lists'; // Import List from API
import { cardsAPI } from '@/lib/api/cards';
import { ListComponent } from './List/List';
import { AddListButton } from './List/AddListButton';

interface ListsContainerProps {
  projectId: string;  // This is your boardId
}

export const ListsContainer: React.FC<ListsContainerProps> = ({ projectId }) => {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLists();
  }, [projectId]);

  const fetchLists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Log the projectId for debugging
      console.log('Fetching lists for project:', projectId, 'Type:', typeof projectId);
      
      // Fetch lists from API
      const listsData = await listsAPI.getProjectLists(projectId);
      
      // Fetch cards for each list
      const listsWithCards = await Promise.all(
        listsData.map(async (list: List) => {
          try {
            const cards = await cardsAPI.getListCards(list.id);
            return { ...list, cards };
          } catch (error) {
            console.error(`Error fetching cards for list ${list.id}:`, error);
            return { ...list, cards: [] };
          }
        })
      );
      
      // Sort lists by position
      const sortedLists = listsWithCards.sort((a, b) => a.position - b.position);
      setLists(sortedLists);
      
      console.log('Fetched lists:', sortedLists.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load lists';
      setError(errorMessage);
      console.error('Error fetching lists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddList = async (title: string) => {
    try {
      setError(null);
      console.log('Creating list with:', {
        projectId,
        projectIdType: typeof projectId,
        title,
        currentListsCount: lists.length
      });
      
      const newList = await listsAPI.createList(projectId, {
        title: title.trim(),
        position: lists.length,
        description: "",
        color: "#CCCCCC"
      });
      
      console.log('Successfully created list:', newList);
      
      // Add the new list with empty cards array
      setLists(prev => [...prev, { ...newList, cards: [] }]);
      
      return newList;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create list';
      console.error('Error creating list:', {
        error: err,
        message: err.message,
        stack: err.stack
      });
      
      // Specific error handling
      if (errorMessage.includes('401') || errorMessage.includes('Session expired')) {
        setError('Session expired. Please login again.');
      } else if (errorMessage.includes('Failed to fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(errorMessage);
      }
      
      throw err;
    }
  };

  const handleUpdateList = async (listId: string, data: { title?: string; position?: number }) => {
    try {
      setError(null);
      const updatedList = await listsAPI.updateList(projectId, listId, data);
      
      setLists(lists.map(list => 
        list.id === listId 
          ? { ...list, ...updatedList, cards: list.cards || [] }
          : list
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update list';
      setError(errorMessage);
      console.error('Error updating list:', err);
      throw err;
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!confirm('Are you sure you want to delete this list? All cards in this list will also be deleted.')) return;
    
    try {
      setError(null);
      await listsAPI.deleteList(projectId, listId);
      setLists(lists.filter(list => list.id !== listId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete list';
      setError(errorMessage);
      console.error('Error deleting list:', err);
    }
  };

  const handleAddCard = async (listId: string, title: string) => {
    try {
      setError(null);
      const newCard = await cardsAPI.createCard(listId, {
        title: title.trim(),
        position: (lists.find(l => l.id === listId)?.cards?.length || 0),
      });
      
      setLists(lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: [...(list.cards || []), newCard],
          };
        }
        return list;
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create card';
      setError(errorMessage);
      console.error('Error creating card:', err);
      throw err;
    }
  };

  const handleUpdateCard = async (listId: string, cardId: string, data: any) => {
    try {
      setError(null);
      const updatedCard = await cardsAPI.updateCard(listId, cardId, data);
      
      setLists(lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: (list.cards || []).map(card =>
              card.id === cardId ? updatedCard : card
            ),
          };
        }
        return list;
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update card';
      setError(errorMessage);
      console.error('Error updating card:', err);
      throw err;
    }
  };

  const handleDeleteCard = async (listId: string, cardId: string) => {
    try {
      setError(null);
      await cardsAPI.deleteCard(listId, cardId);
      
      setLists(lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: (list.cards || []).filter(card => card.id !== cardId),
          };
        }
        return list;
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete card';
      setError(errorMessage);
      console.error('Error deleting card:', err);
      throw err;
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchLists();
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-72 bg-gray-100 rounded-lg p-4 animate-pulse flex-shrink-0">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 font-medium">Error: {error}</p>
              <p className="text-red-500 text-sm mt-1">
                Project ID: {projectId} (Type: {typeof projectId})
              </p>
            </div>
            <button
              onClick={handleRetry}
              className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-300px)]">
        {lists.map((list) => (
          <ListComponent
            key={list.id}
            list={list}
            onAddCard={(title) => handleAddCard(list.id, title)}
            onUpdateCard={(cardId, data) => handleUpdateCard(list.id, cardId, data)}
            onDeleteCard={(cardId) => handleDeleteCard(list.id, cardId)}
            onUpdateList={(data) => handleUpdateList(list.id, data)}
            onDeleteList={() => handleDeleteList(list.id)}
          />
        ))}
        
        <AddListButton onAddList={handleAddList} />
      </div>
    </div>
  );
};