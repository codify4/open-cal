import { useDraggable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import type { Event } from '@/lib/store/calendar-store';

export const useEventCardDrag = (event: Event) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: event.id, data: event });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - dragStartPos.x,
      y: e.clientY - dragStartPos.y,
    });
  };

  const handleDragEnd = () => {
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging, dragStartPos]);

  return {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    position,
    setDragStartPos,
  };
};
