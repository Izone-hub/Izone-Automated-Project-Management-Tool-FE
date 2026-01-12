'use client';

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CardComponent } from "./Card";
import { Card } from "@/types/card";

interface SortableCardProps {
    card: Card;
    onUpdate: (data: any) => Promise<void>;
    onDelete: () => Promise<void>;
    onClick: () => void;
}

export const SortableCard = ({ card, onUpdate, onDelete, onClick }: SortableCardProps) => {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
        data: {
            type: "Card",
            card,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={isDragging ? "opacity-50" : ""}
        >
            <CardComponent
                card={card}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onClick={onClick}
            />
        </div>
    );
};
