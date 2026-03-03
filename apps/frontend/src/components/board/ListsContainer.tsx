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

  const fetchLists = async (options: { silent?: boolean } = {}) => {
    const { silent = false } = options;
    try {
      if (!silent) setLoading(true);
      setError(null);

      // Log the projectId for debugging
      console.log('Fetching lists for project:', projectId, 'Type:', typeof projectId, 'Silent:', silent);

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
      if (!silent) setLoading(false);
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
      const movedToDifferentList = String(newListId) !== String(listId);

      setLists(prevLists => prevLists.map(list => {
        if (movedToDifferentList) {
          if (list.id === listId) {
            return {
              ...list,
              cards: (list.cards || []).filter(card => card.id !== cardId),
            };
          }
          if (list.id === newListId) {
            const newCards = [...(list.cards || [])];
            // If the card is already there (e.g. from optimistic update), don't add it again
            if (newCards.some(c => c.id === cardId)) {
              return {
                ...list,
                cards: newCards.map(c => c.id === cardId ? updatedCard : c)
              };
            }
            const insertPosition = data.position !== undefined ? data.position : newCards.length;
            newCards.splice(Math.min(insertPosition, newCards.length), 0, updatedCard);
            return {
              ...list,
              cards: newCards,
            };
          }
        } else {
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
      return updatedCard;
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

  const handleDuplicateCard = async (listId: string, cardId: string) => {
    try {
      setError(null);
      const duplicatedCard = await cardsAPI.duplicateCard(listId, cardId);

      setLists(lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: [...(list.cards || []), duplicatedCard],
          };
        }
        return list;
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate card';
      setError(errorMessage);
      console.error('Error duplicating card:', err);
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
    console.log('🚀 onDragStart triggered', event);
    // Keep a snapshot of lists before dragging so we can revert if persistence fails
    prevListsRef.current = JSON.parse(JSON.stringify(lists)); // Deep copy

    if (event.active.data.current?.type === "Column") {
      console.log('📦 Dragging Column:', event.active.data.current.list.id);
      setActiveColumn(event.active.data.current.list);
      return;
    }

    if (event.active.data.current?.type === "Card") {
      console.log('📇 Dragging Card:', event.active.data.current.card.id);
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
    console.log('🛑 onDragEnd triggered', event);
    const { active, over } = event;
    if (!over) {
      console.log('🛑 Dropped outside any valid target (over is null)');
      setActiveColumn(null);
      setActiveCard(null);
      prevListsRef.current = null;
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    const isActiveAColumn = active.data.current?.type === "Column";
    const isActiveACard = active.data.current?.type === "Card" || !!activeCard;

    console.log('🔍 onDragEnd diagnostics:', {
      isActiveAColumn,
      isActiveACard,
      activeType: active.data.current?.type,
      hasActiveCard: !!activeCard
    });

    // If a column was dragged, persist the new order for lists
    if (isActiveAColumn) {
      if (activeId === overId) {
        console.log('🛑 Column dropped on same position');
        setActiveColumn(null);
        prevListsRef.current = null;
        return;
      }
      console.log('🏗️ Processing Column move');
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
    if (isActiveACard) {
      console.log('📇 Processing Card move');
      const activeIdStr = String(activeId);

      // Find where exactly the card was BEFORE the drag started
      const originalListIndex = prevListsRef.current?.findIndex(list =>
        list.cards?.some(c => c.id === activeIdStr)
      ) ?? -1;
      const originalList = prevListsRef.current?.[originalListIndex];
      const originalPosition = originalList?.cards?.findIndex(c => c.id === activeIdStr) ?? -1;

      // Find where the card is NOW in the local state (already updated by onDragOver)
      const targetListIndex = lists.findIndex(list => list.cards?.some(c => c.id === activeIdStr));
      const targetList = lists[targetListIndex];

      if (!targetList) {
        console.log('❌ Card not found in any list after drop');
        if (prevListsRef.current) setLists(prevListsRef.current);
        setActiveCard(null);
        prevListsRef.current = null;
        return;
      }

      const newPosition = targetList.cards!.findIndex(c => c.id === activeIdStr);

      console.log('📊 Change Detection:', {
        cardId: activeIdStr,
        original: { listId: originalList?.id, pos: originalPosition },
        current: { listId: targetList.id, pos: newPosition }
      });

      const hasMoved = (originalList?.id !== targetList.id) || (originalPosition !== newPosition);

      if (!hasMoved) {
        console.log('ℹ️ Card did not actually move (original === current)');
        setActiveCard(null);
        prevListsRef.current = null;
        return;
      }

      // Prepare update data
      const updateData: any = {
        position: newPosition,
        list_id: targetList.id
      };

      const originalListId = originalList?.id || targetList.id;

      // Persist change
      (async () => {
        console.log('🔄 Starting card persistence. originalListId:', originalListId, 'activeIdStr:', activeIdStr, 'updateData:', updateData);
        try {
          // We call the API directly to avoid another redundant state update cycle 
          // because onDragOver already updated the 'lists' state visually.
          console.log('🚀 API Call: cardsAPI.updateCard(', originalListId, activeIdStr, updateData, ')');
          const result = await cardsAPI.updateCard(originalListId, activeIdStr, updateData);
          console.log('✅ Card persistence successful. Server response:', result);

          toast.success('Position saved');

          // Re-fetch to ensure server canonical ordering and reflect the move
          // This is critical because the backend might have reordered other cards
          // We do it SILENTLY to avoid the jarring loading skeleton
          console.log('🔄 Re-fetching lists to sync with server (SILENT)...');
          await fetchLists({ silent: true });
          console.log('✅ Sync complete');
        } catch (err) {
          console.error('❌ Failed to persist card move', err);
          if (prevListsRef.current) {
            console.log('🔄 Reverting to previous state due to error');
            setLists(prevListsRef.current);
          }
          toast.error('Failed to save position: ' + (err instanceof Error ? err.message : 'Unknown error'));
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
                onDuplicateCard={(cardId) => handleDuplicateCard(list.id, cardId)}
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
                onDuplicateCard={async () => { }}
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
