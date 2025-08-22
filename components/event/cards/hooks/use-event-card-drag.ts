import { useDraggable } from '@dnd-kit/core';
import type { Event } from '@/lib/store/calendar-store';

export const useEventCardDrag = (event: Event) => {
  const { attributes, listeners, setNodeRef, isDragging } =
    useDraggable({ id: event.id, data: event });

  return {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  };
};
