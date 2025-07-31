'use client';

import { useDraggable } from '@dnd-kit/core';
import { Cake, Calendar, GripVertical } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import type { Event } from '@/lib/store/calendar-store';
import { ensureDate } from '@/lib/utils';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { GraphicDoodle } from './graphics';

interface EventCardProps {
  event: Event;
  className?: string;
  minimized?: boolean;
  onResize?: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
}

export const EventCard = ({
  event,
  className = '',
  minimized = false,
  onResize,
}: EventCardProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartY, setResizeStartY] = useState(0);
  const [originalStartDate, setOriginalStartDate] = useState<Date | null>(null);
  const [originalEndDate, setOriginalEndDate] = useState<Date | null>(null);
  const [resizeEdge, setResizeEdge] = useState<'top' | 'bottom' | null>(null);
  const [previewEndDate, setPreviewEndDate] = useState<Date | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: event.id,
      data: event,
    });

  const { openEventSidebarForEdit, deleteEvent, updateEventTime, saveEvent } =
    useCalendarStore((state) => state);

  const handleEdit = () => {
    openEventSidebarForEdit(event);
  };

  const handleDelete = () => {
    deleteEvent(event.id);
  };

  const handleDuplicate = () => {
    const startDate = ensureDate(event.startDate);
    const endDate = ensureDate(event.endDate);

    const duplicatedEvent: Event = {
      ...event,
      id: `event-${Date.now()}`,
      title: `${event.title} (Copy)`,
      startDate: new Date(startDate.getTime() + 60 * 60 * 1000), // 1 hour later
      endDate: new Date(endDate.getTime() + 60 * 60 * 1000),
    };
    saveEvent(duplicatedEvent);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(event, null, 2));
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500/40 border-blue-600',
      green: 'bg-green-500/40 border-green-600',
      purple: 'bg-purple-500/40 border-purple-600',
      orange: 'bg-orange-500/40 border-orange-600',
      red: 'bg-red-500/40 border-red-600',
      pink: 'bg-pink-500/40 border-pink-600',
      yellow: 'bg-yellow-500/40 border-yellow-600',
      gray: 'bg-gray-500/40 border-gray-600',
    };
    return colorMap[color] || colorMap.blue;
  };

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return 'Invalid time';
    }
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const hour12 = hours % 12 || 12;
    const ampm = hours < 12 ? 'AM' : 'PM';
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const timeDisplay = `${formatTime(event.startDate)}–${formatTime(event.endDate)}`;

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleResizeStart = (
    e: React.MouseEvent,
    edge: 'top' | 'bottom' = 'bottom'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStartY(e.clientY);
    const startDate = ensureDate(event.startDate);
    const endDate = ensureDate(event.endDate);
    setOriginalStartDate(new Date(startDate));
    setOriginalEndDate(new Date(endDate));
    setResizeEdge(edge);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!(isResizing && originalStartDate && originalEndDate)) return;

    const deltaY = e.clientY - resizeStartY;
    const minutesPerPixel = 15; // 15 minutes per pixel
    const deltaMinutes =
      Math.round((deltaY * minutesPerPixel) / 15) * 15 * 60 * 1000; // Snap to 15-min increments
    const minDuration = 15 * 60 * 1000; // 15 minutes

    if (resizeEdge === 'top') {
      const newStartDate = new Date(originalStartDate.getTime() + deltaMinutes);
      if (newStartDate.getTime() <= originalEndDate.getTime() - minDuration) {
        setPreviewEndDate(originalEndDate);
        updateEventTime(event.id, newStartDate, originalEndDate);
        onResize?.(event.id, newStartDate, originalEndDate);
      }
    } else {
      const newEndDate = new Date(originalEndDate.getTime() + deltaMinutes);
      if (newEndDate.getTime() >= originalStartDate.getTime() + minDuration) {
        setPreviewEndDate(newEndDate);
        updateEventTime(event.id, originalStartDate, newEndDate);
        onResize?.(event.id, originalStartDate, newEndDate);
      }
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeStartY(0);
    setOriginalStartDate(null);
    setOriginalEndDate(null);
    setResizeEdge(null);
    setPreviewEndDate(null);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [
    isResizing,
    resizeStartY,
    originalStartDate,
    originalEndDate,
    resizeEdge,
  ]);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={isClient ? setNodeRef : undefined}
          style={isClient ? style : undefined}
          {...(isClient ? listeners : {})}
          {...(isClient ? attributes : {})}
          className={`group relative cursor-pointer rounded-sm border p-2 text-xs transition-all duration-200 hover:shadow-md ${getColorClasses(event.color)} ${event.isAllDay ? 'border-l-4' : ''} ${isClient && isDragging ? 'opacity-50' : ''} ${minimized ? 'max-h-[40px] min-h-[20px] overflow-hidden' : 'min-h-[60px]'} ${isDragging ? 'z-[9998]' : ''} ${className} `}
          onClick={handleEdit}
        >
          <div className={'-right-0 absolute top-0 size-12 overflow-hidden'}>
            <GraphicDoodle color={event.color} size="md" />
          </div>

          <div className="flex flex-col items-start justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-1">
              {event.type === 'birthday' ? (
                <Cake className="h-3 w-3 text-white" />
              ) : (
                <Calendar className="h-3 w-3 text-white" />
              )}
              <h4 className="truncate font-medium text-white">
                {event.title || 'Untitled Event'}
              </h4>
            </div>
            {!minimized && (
              <p className="mt-1 truncate text-white/80 text-xs">
                {isResizing && previewEndDate
                  ? `${formatTime(event.startDate)}–${formatTime(previewEndDate)}`
                  : timeDisplay}
              </p>
            )}
          </div>

          {!(minimized || event.isAllDay) && (
            <>
              <div
                className="absolute top-0 right-0 left-0 h-1 cursor-ns-resize rounded-t-md bg-white/20 opacity-0 transition-opacity hover:bg-white/40 group-hover:opacity-100"
                onMouseDown={(e) => handleResizeStart(e, 'top')}
              >
                <div className="flex justify-center">
                  <GripVertical className="h-2 w-2 text-white" />
                </div>
              </div>
              <div
                className="absolute right-0 bottom-0 left-0 h-1 cursor-ns-resize rounded-b-md bg-white/20 opacity-0 transition-opacity hover:bg-white/40 group-hover:opacity-100"
                onMouseDown={(e) => handleResizeStart(e, 'bottom')}
                ref={resizeHandleRef}
              >
                <div className="flex justify-center">
                  <GripVertical className="h-2 w-2 text-white" />
                </div>
              </div>
            </>
          )}
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="border-neutral-700 bg-neutral-900">
        <ContextMenuItem
          className="cursor-pointer text-white hover:bg-neutral-800"
          onClick={handleEdit}
        >
          Edit
        </ContextMenuItem>
        <ContextMenuItem
          className="cursor-pointer text-white hover:bg-neutral-800"
          onClick={handleDuplicate}
        >
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem
          className="cursor-pointer text-white hover:bg-neutral-800"
          onClick={handleCopy}
        >
          Copy
        </ContextMenuItem>
        <ContextMenuItem
          className="cursor-pointer text-red-400 hover:bg-red-900/20"
          onClick={handleDelete}
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
