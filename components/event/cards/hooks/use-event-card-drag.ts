import { useDraggable } from '@dnd-kit/core';
import { useRef, useState, useCallback } from 'react';
import type { Event } from '@/lib/store/calendar-store';

export const useEventCardDrag = (event: Event) => {
  const { attributes, listeners, setNodeRef, isDragging } =
    useDraggable({ id: event.id, data: event });

  const [isLongPress, setIsLongPress] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isTouchDeviceRef = useRef<boolean>(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isTouchDeviceRef.current = true;
    const touch = e.touches[0];
    touchStartTimeRef.current = Date.now();
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPress(true);
    }, 300);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPosRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartPosRef.current.y);
    
    if (deltaX > 5 || deltaY > 5) {
      setIsLongPress(false);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    const touchDuration = Date.now() - touchStartTimeRef.current;
    if (touchDuration < 300) {
      setIsLongPress(false);
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    if (!isTouchDeviceRef.current) {
      setIsLongPress(true);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isTouchDeviceRef.current) {
      setIsLongPress(false);
    }
  }, []);

  const isDraggingEnabled = isLongPress;

  return {
    attributes,
    listeners: isDraggingEnabled ? listeners : {},
    setNodeRef,
    isDragging,
    isLongPress,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseUp,
  };
};
