import { Card } from "@/lib/api/cards";
import { Clock, MessageSquare, Paperclip, CheckSquare } from "lucide-react";

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

export const CardItem = ({
  boardId,
  listId,
  card,
  onClick,
}: {
  boardId: string;
  listId: string;
  card: Card,
  onClick?: () => void,
}) => {
  // Add null check
  if (!card) {
    console.error("CardItem received null/undefined card");
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isDueSoon = () => {
    if (!card.due_date) return false;
    const dueDate = new Date(card.due_date);
    const today = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  };

  const isOverdue = () => {
    if (!card.due_date) return false;
    return new Date(card.due_date) < new Date();
  };

  const labels = (card as any).labels || [];
  const comments = (card as any).comments || [];
  const attachments = (card as any).attachments || [];
  const checklists = (card as any).checklists || [];
  const checklistTotal = checklists.reduce((acc: number, cl: any) => acc + (cl.items?.length || 0), 0);
  const checklistDone = checklists.reduce((acc: number, cl: any) => acc + (cl.items?.filter((i: any) => i.completed)?.length || 0), 0);

  return (
    <div
      onClick={() => onClick?.()}
      className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300 cursor-pointer transition-all duration-150"
    >
      {/* Priority indicator bar */}
      {card.priority && card.priority !== 'medium' && (
        <div className={`h-1.5 w-10 rounded-full mx-3 mt-3 mb-1 ${priorityColors[card.priority]}`} />
      )}

      <div className="p-3 pt-2">
        {/* Labels row */}
        {labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {labels.slice(0, 4).map((label: string, idx: number) => (
              <span
                key={idx}
                className="h-2 w-10 rounded-full bg-blue-500"
                title={label}
              />
            ))}
          </div>
        )}

        <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          {card.title}
        </h3>

        {/* Card Metadata/Badges */}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-gray-500">
          {/* Due Date */}
          {card.due_date && (
            <div className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${isOverdue() ? 'bg-red-50 text-red-600' :
              isDueSoon() ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-100'
              }`}>
              <Clock className="w-3 h-3" />
              <span>{formatDate(card.due_date)}</span>
            </div>
          )}

          {/* Description Indicator */}
          {card.description && (
            <div className="flex items-center gap-1 text-xs" title="Has description">
              <div className="w-3 h-0.5 bg-gray-400 rounded-full shadow-sm" />
            </div>
          )}

          {/* Comments Count */}
          {card.comment_count > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <MessageSquare className="w-3 h-3" />
              <span>{card.comment_count}</span>
            </div>
          )}

          {/* Attachments Count */}
          {attachments.length > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <Paperclip className="w-3 h-3" />
              <span>{attachments.length}</span>
            </div>
          )}

          {/* Checklist Progress */}
          {checklistTotal > 0 && (
            <div className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${checklistDone === checklistTotal ? 'bg-green-50 text-green-600' : 'hover:bg-gray-100'
              }`}>
              <CheckSquare className="w-3 h-3" />
              <span>{checklistDone}/{checklistTotal}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
