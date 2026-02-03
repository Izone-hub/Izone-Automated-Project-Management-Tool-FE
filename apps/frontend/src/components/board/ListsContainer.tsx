// components/board/ListsContainer.tsx - UPDATED WITH DND-KIT
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { listsAPI, List } from '@/lib/api/lists'; // Import List from API
import { cardsAPI } from '@/lib/api/cards';
import { ListComponent } from './List/List';
import { AddListButton } from './List/AddListButton';
import { CardComponent } from './Card/Card';
import { Card } from '@/types/card';
import { createPortal } from 'react-dom';

import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

interface ListsContainerProps {
  projectId: string;  // This is your boardId
}

export const ListsContainer: React.FC<ListsContainerProps> = ({ projectId }) => {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // DND States
  const [activeColumn, setActiveColumn] = useState<List | null>(null);
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    // Delete validation is now handled by AlertDialog in ListHeader
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

      // If card moved to a different list, update both lists
      const newListId = data.list_id || listId;
      const movedToDifferentList = newListId !== listId;

      setLists(lists.map(list => {
        if (movedToDifferentList) {
          // Remove card from old list
          if (list.id === listId) {
            return {
              ...list,
              cards: (list.cards || []).filter(card => card.id !== cardId),
            };
          }
          // Add card to new list at the correct position
          if (list.id === newListId) {
            const newCards = [...(list.cards || [])];
            const insertPosition = data.position !== undefined ? data.position : newCards.length;
            // Insert at the correct position, or append if position is out of bounds
            newCards.splice(Math.min(insertPosition, newCards.length), 0, updatedCard);
            return {
              ...list,
              cards: newCards,
            };
          }
        } else {
          // Update card in same list
          if (list.id === listId) {
            return {
              ...list,
              cards: (list.cards || []).map(card =>
                card.id === cardId ? updatedCard : card
              ),
            };
          }
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

  // --- DND HANDLERS ---

  const prevListsRef = useRef<List[] | null>(null);

  function onDragStart(event: DragStartEvent) {
    // Keep a snapshot of lists before dragging so we can revert if persistence fails
    prevListsRef.current = JSON.parse(JSON.stringify(lists)); // Deep copy

    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.list);
      return;
    }

    if (event.active.data.current?.type === "Card") {
      setActiveCard(event.active.data.current.card);
      return;
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === "Card";
    const isOverACard = over.data.current?.type === "Card";
    const isOverAColumn = over.data.current?.type === "Column";

    if (!isActiveACard) return;

    // Dropping a Card over another Card
    if (isActiveACard && isOverACard) {
      const activeListIndex = lists.findIndex(list => list.cards?.some(c => c.id === activeId));
      const overListIndex = lists.findIndex(list => list.cards?.some(c => c.id === overId));

      if (activeListIndex !== -1 && overListIndex !== -1) {
        setLists(lists => {
          const activeList = lists[activeListIndex];
          const overList = lists[overListIndex];

          if (!activeList || !overList) return lists;

          const activeCardIndex = activeList.cards!.findIndex(c => c.id === activeId);
          const overCardIndex = overList.cards!.findIndex(c => c.id === overId);

          let newLists = [...lists];

          if (activeListIndex === overListIndex) {
            // Reordering within the same list
            const newCards = arrayMove(activeList.cards!, activeCardIndex, overCardIndex);
            newLists[activeListIndex] = { ...activeList, cards: newCards };
          } else {
            // Moving to another list
            const newActiveCards = [...activeList.cards!];
            const [movedCard] = newActiveCards.splice(activeCardIndex, 1);
            const newOverCards = [...overList.cards!];

            // Insert at the position of the hovered card
            // If dragging down, insert after. If dragging up, insert before.
            // Using logic relative to arrays
            let insertionIndex;
            if (active.rect.current.translated && over.rect.top > active.rect.current.translated.top) {
              insertionIndex = overCardIndex + 1;
            } else {
              insertionIndex = overCardIndex;
            }

            // Simple approach: Insert precisely at overCardIndex
            newOverCards.splice(overCardIndex, 0, movedCard);

            newLists[activeListIndex] = { ...activeList, cards: newActiveCards };
            newLists[overListIndex] = { ...overList, cards: newOverCards };
          }

          return newLists;
        });
      }
    }

    // Dropping a Card over a Column (Empty list case)
    if (isActiveACard && isOverAColumn) {
      const activeListIndex = lists.findIndex(list => list.cards?.some(c => c.id === activeId));
      const overListIndex = lists.findIndex(list => list.id === overId);

      if (activeListIndex !== -1 && overListIndex !== -1 && activeListIndex !== overListIndex) {
        setLists(lists => {
          const activeList = lists[activeListIndex];
          const overList = lists[overListIndex];

          if (!activeList || !overList) return lists;

          const activeCardIndex = activeList.cards!.findIndex(c => c.id === activeId);
          const newActiveCards = [...activeList.cards!];
          const [movedCard] = newActiveCards.splice(activeCardIndex, 1);

          const newOverCards = [...(overList.cards || []), movedCard];

          let newLists = [...lists];
          newLists[activeListIndex] = { ...activeList, cards: newActiveCards };
          newLists[overListIndex] = { ...overList, cards: newOverCards };

          return newLists;
        });
      }
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      setActiveColumn(null);
      setActiveCard(null);
      prevListsRef.current = null;
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) {
      setActiveColumn(null);
      setActiveCard(null);
      prevListsRef.current = null;
      return;
    }

    const isActiveAColumn = active.data.current?.type === "Column";

    // If a column was dragged, persist the new order for lists
    if (isActiveAColumn) {
      const oldIndex = lists.findIndex(list => list.id === activeId);
      const newIndex = lists.findIndex(list => list.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newLists = arrayMove(lists, oldIndex, newIndex);
        setLists(newLists);
        // Here is where you would call the backend to update list positions
        // updateListPositions(newLists)
      }

      setActiveColumn(null);
      prevListsRef.current = null;
      return;
    }

    // Handle card moves (persist position and list change)
    const isActiveACard = active.data.current?.type === "Card";
    console.log('🔍 onDragEnd - isActiveACard:', isActiveACard, 'active.data.current:', active.data.current);

    if (isActiveACard) {
      // Find the original list the card was in (before drag)
      const activeIdStr = String(activeId);
      console.log('🔍 Looking for card with ID:', activeIdStr);
      console.log('🔍 prevListsRef.current:', prevListsRef.current?.map(l => ({ id: l.id, cardIds: l.cards?.map(c => c.id) })));
      console.log('🔍 current lists:', lists.map(l => ({ id: l.id, cardIds: l.cards?.map(c => c.id) })));

      const originalListIndex = prevListsRef.current?.findIndex(list =>
        list.cards?.some(c => c.id === activeIdStr)
      ) ?? -1;

      // Find the target list the card ended up in (after drag)
      const targetListIndex = lists.findIndex(list => list.cards?.some(c => c.id === activeIdStr));

      console.log('🔍 originalListIndex:', originalListIndex, 'targetListIndex:', targetListIndex);

      if (targetListIndex === -1) {
        // shouldn't happen, revert
        console.log('❌ targetListIndex is -1, reverting');
        if (prevListsRef.current) setLists(prevListsRef.current);
        setActiveCard(null);
        prevListsRef.current = null;
        return;
      }

      const targetList = lists[targetListIndex];
      const newPosition = targetList.cards!.findIndex(c => c.id === activeIdStr);

      // Always prepare update data with position and list_id
      // This ensures the backend always gets the current state
      const updateData: any = {
        position: newPosition,
        list_id: targetList.id  // Always include list_id
      };

      console.log('🔍 About to persist card move');
      console.log('🔍 updateData:', updateData);
      console.log('🔍 targetList.id:', targetList.id);

      // Get the ORIGINAL list ID (where the card was before dragging)
      const originalListId = prevListsRef.current?.[originalListIndex]?.id || targetList.id;
      console.log('🔍 originalListId:', originalListId);

      // Persist change for the moved card
      (async () => {
        const toastId = toast.loading('Moving card...');
        try {
          console.log('🔍 Calling handleUpdateCard with:', { originalListId, activeIdStr, updateData });
          await handleUpdateCard(originalListId, activeIdStr, updateData);
          console.log('✅ handleUpdateCard succeeded');

          // Re-fetch to ensure server canonical ordering and reflect the move
          await fetchLists();
          console.log('✅ fetchLists succeeded');
          toast.success('Card moved successfully!', { id: toastId });
        } catch (err) {
          console.error('❌ Failed to persist card move', err);
          // Revert to previous state
          if (prevListsRef.current) setLists(prevListsRef.current);
          toast.error('Failed to move card: ' + (err instanceof Error ? err.message : 'Unknown error'), { id: toastId });
        } finally {
          setActiveCard(null);
          prevListsRef.current = null;
        }
      })();

      return;
    }

    // Fallback cleanup
    setActiveColumn(null);
    setActiveCard(null);
    prevListsRef.current = null;
  }

  const listsIds = useMemo(() => lists.map((list) => list.id), [lists]);

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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-300px)] items-start">
          <SortableContext items={listsIds} strategy={horizontalListSortingStrategy}>
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
          </SortableContext>
          <AddListButton onAddList={handleAddList} />
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ListComponent
                list={activeColumn}
                onAddCard={async () => { }}
                onUpdateCard={async () => { }}
                onDeleteCard={async () => { }}
                onUpdateList={async () => { }}
                onDeleteList={async () => { }}
              />
            )}
            {activeCard && (
              <CardComponent
                card={activeCard}
                onUpdate={async () => { }}
                onDelete={async () => { }}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};
