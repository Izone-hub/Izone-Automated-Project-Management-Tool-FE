'use client';

import { BoardWithDetails } from '@/types';
import { ListComponent } from './List';
import { useList } from '@/hooks/useLists';
import { AddList } from './AddList';

interface ListContainerProps {
  board: BoardWithDetails;
  onRefresh?: () => Promise<void> | void;
}

export function ListContainer({ board, onRefresh }: ListContainerProps) {
  const { createList } = useList();
  const visibleLists = board.lists ? board.lists.filter(l => !l.isDefault) : [];

  const handleCreateList = async (title: string) => {
    try {
      await createList({
        title: title.trim(),
        boardId: board.id,
        position: visibleLists.length,
      });
      
      if (onRefresh) {
        try { 
          await onRefresh(); 
        } catch (e) { 
          console.error('Refresh failed:', e);
        }
      }
    } catch (err) {
      console.error('Failed to create list:', err);
      throw err;
    }
  };

  return (
    <div className="flex-1 overflow-x-auto w-full">
      <div className="flex items-start gap-4 px-6 py-6 min-h-[calc(100vh-6rem)] min-w-max">
        {/* Always show existing lists first */}
        {visibleLists.map((list) => (
          <ListComponent key={list.id} list={list} onRefresh={onRefresh} />
        ))}
        
        {/* AddList stays on the right - full width when empty, pill when lists exist */}
        <div className="shrink-0">
          <AddList
            fullWidth={visibleLists.length === 0}
            onCreateList={handleCreateList}
          />
        </div>
      </div>
    </div>
  );
}




