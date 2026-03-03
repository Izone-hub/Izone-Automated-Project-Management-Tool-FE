// components/board/Card/Card.tsx
'use client';

import { useState } from 'react';
import { Card as CardType } from '@/types/card';
import { Calendar, AlertCircle, Clock, Edit2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CardComponentProps {
  card: CardType;
  onUpdate: (data: any) => Promise<void>;
  onDelete: () => Promise<void>;
  onClick?: () => void;
}

export const CardComponent: React.FC<CardComponentProps> = ({
  card,
  onUpdate,
  onDelete,
  onClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(card.title);
  const [showActions, setShowActions] = useState(false);

  const handleTitleUpdate = async () => {
    if (tempTitle.trim() && tempTitle !== card.title) {
      try {
        await onUpdate({ title: tempTitle.trim() });
      } catch (error) {
        console.error('Failed to update card:', error);
        setTempTitle(card.title);
      }
    } else {
      setTempTitle(card.title);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await onDelete();
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  };

  const getPriorityColor = () => {
    switch (card.priority) {
      case 'high': return 'bg-red-500/10 text-red-600 dark:text-red-400 dark:bg-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 dark:bg-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-600 dark:text-green-400 dark:bg-green-500/20';
      case 'urgent': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 dark:bg-purple-500/20';
      default: return 'bg-secondary text-muted-foreground';
    }
  };

  const getDueDateStatus = () => {
    if (!card.due_date) return null;

    const dueDate = new Date(card.due_date);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600 dark:text-red-400' };
    if (diffDays === 0) return { text: 'Today', color: 'text-orange-600 dark:text-orange-400' };
    if (diffDays === 1) return { text: 'Tomorrow', color: 'text-yellow-600 dark:text-yellow-400' };
    if (diffDays <= 7) return { text: 'This week', color: 'text-blue-600 dark:text-blue-400' };
    return null;
  };

  const dueStatus = getDueDateStatus();

  return (
    <div
      className="bg-card rounded-lg shadow-sm border border-border p-3 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onClick?.()}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleTitleUpdate}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleUpdate()}
            className="w-full px-2 py-1 border border-input rounded text-sm bg-background text-foreground"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleTitleUpdate}
              className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setTempTitle(card.title);
              }}
              className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-2">
            <p className="font-medium text-foreground text-sm flex-1">{card.title}</p>

            {showActions && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="p-1 hover:bg-muted rounded"
                >
                  <Edit2 className="w-3 h-3 text-muted-foreground" />
                </button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this card?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the card.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete();
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          {/* Card Details */}
          <div className="space-y-2">
            {card.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {card.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {/* Priority Badge */}
              {card.priority && card.priority !== 'medium' && (
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor()}`}>
                  {card.priority.charAt(0).toUpperCase() + card.priority.slice(1)}
                </span>
              )}

              {/* Due Date */}
              {card.due_date && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(card.due_date).toLocaleDateString()}</span>
                  {dueStatus && (
                    <span className={`${dueStatus.color} font-medium ml-1`}>
                      • {dueStatus.text}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};