// components/board/List/List.tsx
'use client';

import { useState, useMemo } from 'react';
import { List } from '@/types';
import { Card } from '@/types/card';
import { ListHeader } from './ListHeader';
import { AddCardForm } from './AddCardForm';
import { SortableCard } from '../Card/SortableCard'; // Use SortableCard instead
import { CardModal } from '../Card/CardModal';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface ListComponentProps {
  list: any; // Using any for now to avoid deep type conflicts between API and components
  onAddCard: (title: string) => Promise<any>;
  onUpdateCard: (cardId: string, data: any) => Promise<any>;
  onDeleteCard: (cardId: string) => Promise<void>;
  onUpdateList: (data: { title?: string; position?: number }) => Promise<any>;
  onDeleteList: () => Promise<void>;
}

export const ListComponent: React.FC<ListComponentProps> = ({
  list,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onUpdateList,
  onDeleteList,
}) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(list.title);
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  // dnd-kit sortable hook for the COLUMN/LIST itself
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: "Column",
      list,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleTitleUpdate = async () => {
    if (tempTitle.trim() && tempTitle !== list.title) {
      try {
        await onUpdateList({ title: tempTitle.trim() });
      } catch (error) {
        console.error('Failed to update list title:', error);
        setTempTitle(list.title); // Revert on error
      }
    } else {
      setTempTitle(list.title); // Revert if empty or same
    }
    setEditingTitle(false);
  };

  const handleAddCard = async (title: string) => {
    try {
      await onAddCard(title);
      setIsAddingCard(false);
    } catch (error) {
      console.error('Failed to add card:', error);
    }
  };

  const handleCardUpdate = async (cardId: string, data: any) => {
    // Handle special delete flag
    if (data._delete) {
      await onDeleteCard(cardId);
      setActiveCard(null);
      return;
    }
    await onUpdateCard(cardId, data);
  };

  const sortedCards = useMemo(() => {
    const cards = [...(list.cards || [])];
    // Only sort if positions are actually set and distinct
    return cards.sort((a, b) => (a.position || 0) - (b.position || 0));
  }, [list.cards]);

  const cardsIds = useMemo(() => sortedCards.map((c) => c.id), [sortedCards]);

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="w-72 bg-gray-50 rounded-lg shadow-sm flex flex-col h-fit border border-gray-200 flex-shrink-0"
      >
        {/* List Header - This is the drag handle for the list */}
        <div
          {...attributes}
          {...listeners}
          className="p-3 bg-gray-100 rounded-t-lg cursor-grab active:cursor-grabbing"
        >
          {editingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleUpdate}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleUpdate()}
                className="flex-1 px-2 py-1 border rounded text-sm font-medium"
                autoFocus
                onClick={(e) => e.stopPropagation()} // Prevent drag start when clicking input
                onPointerDown={(e) => e.stopPropagation()}
              />
              <button
                onClick={handleTitleUpdate}
                className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
              >
                Save
              </button>
            </div>
          ) : (
            <ListHeader
              title={list.title}
              cardCount={list.cards?.length || 0}
              onEditTitle={() => setEditingTitle(true)}
              onDeleteList={onDeleteList}
            />
          )}
        </div>

        {/* Cards Container */}
        <div className="p-2 flex-1 min-h-[100px] space-y-2 overflow-y-auto max-h-[calc(100vh-300px)]">
          <SortableContext items={cardsIds} strategy={verticalListSortingStrategy}>
            {sortedCards.length === 0 ? (
              <div className="text-center py-4 text-gray-400 text-sm">
                No cards yet
              </div>
            ) : (
              sortedCards.map((card) => (
                <SortableCard
                  key={card.id}
                  card={card}
                  onUpdate={(data) => onUpdateCard(card.id, data)}
                  onDelete={() => onDeleteCard(card.id)}
                  onClick={() => setActiveCard(card)}
                />
              ))
            )}
          </SortableContext>
        </div>

        {/* Add Card Section */}
        <div className="p-2 border-t">
          {isAddingCard ? (
            <AddCardForm
              onAddCard={handleAddCard}
              onCancel={() => setIsAddingCard(false)}
            />
          ) : (
            <button
              onClick={() => setIsAddingCard(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add a card
            </button>
          )}
        </div>
      </div>

      {/* Card Modal - Opens when a card is clicked */}
      {activeCard && (
        <CardModal
          card={activeCard}
          onUpdate={(data) => handleCardUpdate(activeCard.id, data)}
          onClose={() => setActiveCard(null)}
        />
      )}
    </>
  );
};