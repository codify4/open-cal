import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import type { Event } from '@/lib/store/calendar-store';
import type { ResizeHandlers } from '../types/event-card-types';

export const useEventCardResize = (event: Event, handlers: ResizeHandlers) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState<'vertical' | 'horizontal' | null>(null);
  const [resizeStartY, setResizeStartY] = useState(0);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [originalStartDate, setOriginalStartDate] = useState<Date | null>(null);
  const [originalEndDate, setOriginalEndDate] = useState<Date | null>(null);
  const [initialHeight, setInitialHeight] = useState(0);
  const [initialWidth, setInitialWidth] = useState(0);

  const ensureDate = (date: Date | string): Date => {
    return typeof date === 'string' ? new Date(date) : date;
  };

  const handleVerticalResizeStart = (e: React.MouseEvent, cardRef: RefObject<HTMLDivElement | null>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    setResizeType('vertical');
    setResizeStartY(e.clientY);

    const startDate = ensureDate(event.startDate);
    const endDate = ensureDate(event.endDate);
    setOriginalStartDate(new Date(startDate));
    setOriginalEndDate(new Date(endDate));

    if (cardRef.current) {
      setInitialHeight(cardRef.current.offsetHeight);
    }

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ns-resize';
  };

  const handleHorizontalResizeStart = (e: React.MouseEvent, cardRef: RefObject<HTMLDivElement | null>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    setResizeType('horizontal');
    setResizeStartX(e.clientX);

    if (cardRef.current) {
      setInitialWidth(cardRef.current.offsetWidth);
    }

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ew-resize';
  };

  const handleResizeMove = (e: MouseEvent, cardRef: RefObject<HTMLDivElement | null>) => {
    if (!(isResizing && cardRef.current)) return;

    if (resizeType === 'vertical' && originalStartDate) {
      const deltaY = e.clientY - resizeStartY;
      const newHeight = Math.max(40, initialHeight + deltaY);
      cardRef.current.style.height = `${newHeight}px`;

      const pixelsPerHour = 64;
      const hoursChanged = newHeight / pixelsPerHour;
      const millisecondsChanged = hoursChanged * 60 * 60 * 1000;

      const newEndTime = new Date(
        originalStartDate.getTime() + millisecondsChanged
      );

      const roundedEndTime = new Date(
        Math.round(newEndTime.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000)
      );

      const minimumDuration = 15 * 60 * 1000;
      const earliestEndTime = new Date(
        originalStartDate.getTime() + minimumDuration
      );
      if (roundedEndTime < earliestEndTime) return;

      if (handlers.onResize) {
        handlers.onResize(event.id, originalStartDate, roundedEndTime);
      }
    } else if (resizeType === 'horizontal') {
      const deltaX = e.clientX - resizeStartX;
      const newWidth = Math.max(120, initialWidth + deltaX);
      cardRef.current.style.width = `${newWidth}px`;

      if (handlers.onWidthResize) {
        handlers.onWidthResize(event.id, newWidth);
      }
    }
  };

  const handleResizeEnd = (e: MouseEvent, cardRef: RefObject<HTMLDivElement | null>) => {
    e.preventDefault();

    if (
      resizeType === 'vertical' &&
      originalStartDate &&
      handlers.onResizeEnd &&
      cardRef.current
    ) {
      const newHeight = cardRef.current.offsetHeight;
      const pixelsPerHour = 64;
      const hoursChanged = newHeight / pixelsPerHour;
      const millisecondsChanged = hoursChanged * 60 * 60 * 1000;

      const newEndTime = new Date(
        originalStartDate.getTime() + millisecondsChanged
      );

      const roundedEndTime = new Date(
        Math.round(newEndTime.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000)
      );

      const minimumDuration = 15 * 60 * 1000;
      const earliestEndTime = new Date(
        originalStartDate.getTime() + minimumDuration
      );

      if (roundedEndTime >= earliestEndTime) {
        handlers.onResizeEnd(event.id, originalStartDate, roundedEndTime);
      }
    }

    setIsResizing(false);
    setResizeType(null);
    setResizeStartY(0);
    setResizeStartX(0);
    setOriginalStartDate(null);
    setOriginalEndDate(null);
    setInitialHeight(0);
    setInitialWidth(0);

    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    if (isResizing) {
      const handleMouseMove = (e: MouseEvent) => handleResizeMove(e, { current: null });
      const handleMouseUp = (e: MouseEvent) => handleResizeEnd(e, { current: null });

      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: false });

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, resizeType, resizeStartY, resizeStartX, originalStartDate, originalEndDate, initialHeight, initialWidth]);

  return {
    isResizing,
    resizeType,
    handleVerticalResizeStart,
    handleHorizontalResizeStart,
    handleResizeMove,
    handleResizeEnd,
  };
};
