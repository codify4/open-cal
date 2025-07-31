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
import { cn } from '@/lib/utils';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { GraphicDoodle } from './graphics';

interface EventCardProps {
  event: Event;
  className?: string;
  minimized?: boolean;
  onResize?: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  onDuplicate?: (event: Event) => void;
}

const ensureDate = (date: Date | string): Date => {
  return typeof date === 'string' ? new Date(date) : date;
};

export const EventCard = ({
  event,
  className = '',
  minimized = false,
  onResize,
}: EventCardProps) => {
  const { openEventSidebarForEdit, deleteEvent, saveEvent } = useCalendarStore(
    (state) => state
  );
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: event.id, data: event });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartY, setResizeStartY] = useState(0);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [originalStartDate, setOriginalStartDate] = useState<Date | null>(null);
  const [originalEndDate, setOriginalEndDate] = useState<Date | null>(null);
  const [initialHeight, setInitialHeight] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEventSidebarForEdit(event);
  };

  const handleDelete = () => {
    deleteEvent(event.id);
  };

  const handleDuplicate = () => {
    const startDate = ensureDate(event.startDate);
    const endDate = ensureDate(event.endDate);

    const duplicatedEvent = {
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

  const getAccountColor = (account: string) => {
    const accountMap: Record<string, string> = {
      'john.doe@gmail.com': 'bg-red-500',
      'jane.smith@outlook.com': 'bg-blue-500',
      'work@company.com': 'bg-green-500',
      'personal@icloud.com': 'bg-purple-500',
    };
    return accountMap[account] || getColorClasses(event.color);
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

  // Calculate height based on event duration
  const startDate = ensureDate(event.startDate);
  const endDate = ensureDate(event.endDate);
  const durationMs = endDate.getTime() - startDate.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  const pixelsPerHour = 64;
  const calculatedHeight = Math.max(40, durationHours * pixelsPerHour);

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

  // Resize functionality
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    setResizeStartY(e.clientY);

    const startDate = ensureDate(event.startDate);
    const endDate = ensureDate(event.endDate);
    setOriginalStartDate(new Date(startDate));
    setOriginalEndDate(new Date(endDate));

    // Get initial height of the card
    if (cardRef.current) {
      setInitialHeight(cardRef.current.offsetHeight);
    }

    // Prevent text selection and set cursor
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ns-resize';
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!(isResizing && originalStartDate && cardRef.current)) return;

    const deltaY = e.clientY - resizeStartY;
    const newHeight = Math.max(40, initialHeight + deltaY); // min height
    cardRef.current.style.height = `${newHeight}px`;

    const pixelsPerHour = 64;
    const hoursChanged = newHeight / pixelsPerHour;
    const millisecondsChanged = hoursChanged * 60 * 60 * 1000;

    const newEndTime = new Date(
      originalStartDate.getTime() + millisecondsChanged
    );

    // Snap to nearest 15 minutes
    const roundedEndTime = new Date(
      Math.round(newEndTime.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000)
    );

    // Minimum 15-minute duration
    const minimumDuration = 15 * 60 * 1000;
    const earliestEndTime = new Date(
      originalStartDate.getTime() + minimumDuration
    );
    if (roundedEndTime < earliestEndTime) return;

    if (onResize) {
      onResize(event.id, originalStartDate, roundedEndTime);
    }
  };

  const handleResizeEnd = (e: MouseEvent) => {
    e.preventDefault();

    // Don't reset the height immediately - let the new duration determine it
    setIsResizing(false);
    setResizeStartY(0);
    setOriginalStartDate(null);
    setOriginalEndDate(null);
    setInitialHeight(0);

    // Reset cursor and text selection
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  // Mouse event listeners
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

  useEffect(() => {
    if (isResizing) {
      const handleMouseMove = (e: MouseEvent) => handleResizeMove(e);
      const handleMouseUp = (e: MouseEvent) => handleResizeEnd(e);

      document.addEventListener('mousemove', handleMouseMove, {
        passive: false,
      });
      document.addEventListener('mouseup', handleMouseUp, { passive: false });

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [
    isResizing,
    resizeStartY,
    originalStartDate,
    originalEndDate,
    initialHeight,
  ]);

  const cardStyle = {
    transform: isDragging
      ? `translate(${position.x}px, ${position.y}px)`
      : undefined,
    zIndex: isDragging ? 1000 : isResizing ? 999 : undefined,
    height: minimized ? undefined : `${calculatedHeight}px`,
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={`group relative rounded-sm border p-2 text-xs transition-all duration-200 hover:shadow-md ${getColorClasses(event.color)} ${event.isAllDay ? 'border-l-4' : ''} ${isClient && isDragging ? 'opacity-50' : ''} ${minimized ? 'max-h-[40px] min-h-[20px] overflow-hidden' : ''} ${isDragging ? 'z-[9998]' : ''} ${className} `}
          ref={cardRef}
          style={cardStyle}
        >
          <div
            className={
              '-right-0 pointer-events-none absolute top-0 size-12 overflow-hidden'
            }
          >
            <GraphicDoodle color={event.color} size="md" />
          </div>

          <div
            className="relative z-10 flex cursor-grab flex-row gap-2"
            ref={isClient ? setNodeRef : undefined}
            {...(isClient ? listeners : {})}
            {...(isClient ? attributes : {})}
          >
            <div
              className={cn(
                'w-[2px]',
                event.account
                  ? getAccountColor(event.account)
                  : getColorClasses(event.color),
                minimized ? 'min-h-[20px]' : 'min-h-[30px]'
              )}
            />
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
                  {timeDisplay}
                </p>
              )}
            </div>
          </div>

          {/* Resize Handle - Only show for non-all-day events and non-minimized */}
          {!(minimized || event.isAllDay) && (
            <div
              className={`-translate-x-1/2 absolute bottom-0 left-1/2 h-2 w-8 transform cursor-ns-resize rounded-b-md bg-gradient-to-t from-white/30 to-transparent transition-all duration-200 hover:from-white/50 hover:to-white/10 ${isResizing ? 'from-white/60 opacity-100' : 'opacity-0 group-hover:opacity-100'}flex z-20 items-end justify-center pb-0.5 `}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={handleResizeStart}
              ref={resizeHandleRef}
            >
              <GripVertical className="h-2 w-2 text-white/80" />
            </div>
          )}

          {isResizing && (
            <div className="pointer-events-none absolute inset-0 rounded-sm border-2 border-white/50" />
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
