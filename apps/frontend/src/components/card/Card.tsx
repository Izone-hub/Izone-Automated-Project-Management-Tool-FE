'use client';

import { Card as CardType } from '@/types';

interface CardProps {
  card: CardType;
}

export function CardComponent({ card }: CardProps) {
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <h4 className="text-sm font-medium text-gray-800 mb-2">{card.title}</h4>
      
      {card.dueDate && (
        <div className="flex items-center gap-1 mb-2">
          <span className="text-xs text-gray-500">
            Due {card.dueDate.toLocaleDateString()}
          </span>
        </div>
      )}
      
      {card.labels.length > 0 && (
        <div className="flex gap-1 mb-2">
          {card.labels.map((label, index) => (
            <span
              key={index}
              className="w-10 h-2 rounded-full bg-blue-500"
              title={label}
            />
          ))}
        </div>
      )}
      
      {card.assignedMembers.length > 0 && (
        <div className="flex justify-end">
          <div className="w-6 h-6 bg-gray-300 rounded-full text-xs flex items-center justify-center">
            {card.assignedMembers.length}
          </div>
        </div>
      )}
    </div>
  );
}

