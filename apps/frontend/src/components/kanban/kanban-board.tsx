'use client';

import { useState, useEffect } from 'react';
import { ClientKanbanBoard } from './client-kanban-board';
import { OnboardingWizard } from '../onboarding/onboarding-wizard';
import { Rocket } from 'lucide-react';
import { useWorkspace } from '@/hooks/kanban/use-workspace';
import { BoardWithDetails } from '@/types';

export function KanbanBoard() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { currentBoard: board, isLoading, refetch, updateBoard } = useWorkspace();

  // Show onboarding if no board exists
  useEffect(() => {
    if (!isLoading && !board) {
      setShowOnboarding(true);
    }
  }, [isLoading, board]);

  const handleOnboardingComplete = () => setShowOnboarding(false);
  const handleReopenOnboarding = () => setShowOnboarding(true);

  // Background helpers
  const getBackgroundStyle = () => {
    if (!board?.background) return '';
    if (board.background.includes('gradient')) {
      // Example: linear gradient, adjust based on your function
      return `linear-gradient(135deg, #667eea, #764ba2)`; 
    }
    return board.background; // solid color
  };

  return (
    <div
      className="min-h-screen w-full fixed top-0 left-0"
      style={{
        background: getBackgroundStyle(),
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Onboarding modal */}
      {showOnboarding && (
        <OnboardingWizard 
          isOpen={showOnboarding} 
          onClose={() => setShowOnboarding(false)} 
          onComplete={handleOnboardingComplete} 
        />
      )}

      {/* Main board layout */}
      {board && (
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0">
            <BoardHeader 
              board={board} 
              onUpdateBackground={async (bg: string) => {
                if (updateBoard && board.id) await updateBoard(board.id, { background: bg });
              }} 
            />
          </div>

          {/* Horizontal scrollable list container */}
          <div className="flex flex-1 w-full overflow-x-auto pb-6">
            <ListContainer board={board as BoardWithDetails} onRefresh={refetch} />
          </div>
        </div>
      )}

      {/* Floating help button */}
      {!showOnboarding && board && (
        <button
          onClick={handleReopenOnboarding}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
          title="Open tutorial"
        >
          <Rocket className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

export default KanbanBoard;

// import { useState, useEffect } from 'react';
// import { ClientKanbanBoard } from './client-kanban-board';
// import { OnboardingWizard } from '../onboarding/onboarding-wizard';
// import { Rocket } from 'lucide-react';
// import { useWorkspace } from '@/hooks/kanban/use-workspace';

// export function KanbanBoard() {
//   const [showOnboarding, setShowOnboarding] = useState(false);
//   const { currentBoard, isLoading } = useWorkspace();

//   // Show onboarding if no board exists
//   useEffect(() => {
//     if (!isLoading && !currentBoard) {
//       setShowOnboarding(true);
//     }
//   }, [isLoading, currentBoard]);

//   const handleOnboardingComplete = () => {
//     setShowOnboarding(false);
//   };

//   const handleReopenOnboarding = () => {
//     setShowOnboarding(true);
//   };

//   return (
//     <>
//       {showOnboarding && (
//         <OnboardingWizard 
//           isOpen={showOnboarding}
//           onClose={() => setShowOnboarding(false)}
//           onComplete={handleOnboardingComplete}
//         />
//       )}
      
//       <ClientKanbanBoard />
      
//       {/* Floating help button to reopen onboarding */}
//       {!showOnboarding && currentBoard && (
//         <button
//           onClick={handleReopenOnboarding}
//           className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
//           title="Open tutorial"
//         >
//           <Rocket className="w-6 h-6" />
//         </button>
//       )}
//     </>
//   );
// }

// export default KanbanBoard;

