import { KanbanBoard } from '@/components/kanban/kanban-board';

export default function DashboardPage() {
  return (
    <div className="flex-1">
      {/* Remove the header since KanbanBoard has its own header */}
      <KanbanBoard />
    </div>
  );
}
