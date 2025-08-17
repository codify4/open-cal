'use client';

import { useDraggable } from '@dnd-kit/core';
import { Cake, Calendar, GripVertical, GripHorizontal } from 'lucide-react';
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
import { useUser } from '@clerk/nextjs';
import { useGoogleCalendarRefresh } from '@/hooks/use-google-calendar-refresh';
import { toast } from 'sonner';
import { getCardColor, getCalendarColor } from '@/lib/calendar-utils/calendar-color-utils';
import { useCalendarManagement } from '@/hooks/use-calendar-management';
import { deleteGoogleEvent } from '@/lib/calendar-utils/google-calendar';

interface EventCardProps {
  event: Event;
  className?: string;
  minimized?: boolean;
  onResize?: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  onResizeEnd?: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  onWidthResize?: (eventId: string, newWidth: number) => void;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  onDuplicate?: (event: Event) => void;
  onFocus?: (eventId: string) => void;
}

const ensureDate = (date: Date | string): Date => {
  return typeof date === 'string' ? new Date(date) : date;
};

export const EventCard = ({
  event,
  className = '',
  minimized = false,
  onResize,
  onResizeEnd,
  onWidthResize,
  onFocus,
}: EventCardProps) => {
  const { openEventSidebarForEdit, deleteEvent, saveEvent } = useCalendarStore(
    (state) => state
  );
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: event.id, data: event });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState<'vertical' | 'horizontal' | null>(null);
  const [resizeStartY, setResizeStartY] = useState(0);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [originalStartDate, setOriginalStartDate] = useState<Date | null>(null);
  const [originalEndDate, setOriginalEndDate] = useState<Date | null>(null);
  const [initialHeight, setInitialHeight] = useState(0);
  const [initialWidth, setInitialWidth] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const horizontalResizeHandleRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const { refreshEvents } = useGoogleCalendarRefresh();
  const { user: clerkUser } = useUser();
  const { fetchedCalendars } = useCalendarManagement();

  useEffect(() => {
    setIsClient(true);
  }, []);



  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFocused(true);
    
    if (onFocus) {
      onFocus(event.id);
    }
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    }
  }, [isFocused]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEventSidebarForEdit(event);
  };

  const handleDelete = async () => {
    try {
      if (event.googleEventId && clerkUser) {
        const calendarId = event.googleCalendarId || 'primary';
        const result = await deleteGoogleEvent(event.googleEventId, calendarId);
        
        if (!result.success) {
          if (result.error === 'unauthorized') {
            toast.error('Access token expired. Please reconnect your Google account.');
            return;
          }
          if (result.error === 'not_found') {
            toast.info('Event not found in Google Calendar, deleting locally');
          } else {
            toast.error('Failed to delete from Google Calendar');
            return;
          }
        }
      }
    } catch (error) {
      toast.error('Failed to delete event');
      return;
    }
    
    deleteEvent(event.id);
    await refreshEvents();
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

  const getAccountColor = (calendarId: string) => {
    const calendar = fetchedCalendars?.find((cal: any) => cal.id === calendarId);
    if (calendar && calendar.backgroundColor) {
      return calendar.backgroundColor;
    }
    // Fallback to event color if calendar not found
    return getCardColor(event.color, isFocused);
  };



  const formatTime = (date: Date | string, showAMPM = true) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return 'Invalid time';
    }
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const hour12 = hours % 12 || 12;
    const ampm = hours < 12 ? 'AM' : 'PM';
    const timeStr = `${hour12}${minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''}`;
    return showAMPM ? `${timeStr} ${ampm}` : timeStr;
  };

  const timeDisplay = `${formatTime(event.startDate, false)}–${formatTime(event.endDate, true)}`;

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

  // Vertical resize functionality
  const handleVerticalResizeStart = (e: React.MouseEvent) => {
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

  // Horizontal resize functionality
  const handleHorizontalResizeStart = (e: React.MouseEvent) => {
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

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing || !cardRef.current) return;

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

      if (onResize) {
        onResize(event.id, originalStartDate, roundedEndTime);
      }
    } else if (resizeType === 'horizontal') {
      const deltaX = e.clientX - resizeStartX;
      const newWidth = Math.max(120, initialWidth + deltaX);
      cardRef.current.style.width = `${newWidth}px`;

      if (onWidthResize) {
        onWidthResize(event.id, newWidth);
      }
    }
  };

  const handleResizeEnd = (e: MouseEvent) => {
    e.preventDefault();

    // Calculate final times and call onResizeEnd if vertical resize occurred
    if (resizeType === 'vertical' && originalStartDate && onResizeEnd && cardRef.current) {
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
        onResizeEnd(event.id, originalStartDate, roundedEndTime);
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
    resizeType,
    resizeStartY,
    resizeStartX,
    originalStartDate,
    originalEndDate,
    initialHeight,
    initialWidth,
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
          className={cn(
            'group relative rounded-sm border p-2 text-xs transition-all duration-200 hover:shadow-md',
            getCardColor(event.color, isFocused),
            event.isAllDay && 'border-l-4',
            isClient && isDragging && 'opacity-50',
            minimized && 'max-h-[40px] min-h-[20px] overflow-hidden',
            isDragging && 'z-[9998]',
            isFocused ? 'opacity-100' : 'opacity-80',
            className
          )}
          ref={cardRef}
          style={cardStyle}
          onClick={handleCardClick}
        >
          <div
            className={
              'absolute top-1 right-1 pointer-events-none size-8 overflow-hidden opacity-50'
            }
          >
            <GraphicDoodle color={event.color} size="sm" />
          </div>

          <div
            className="relative z-10 flex cursor-grab flex-row gap-2"
            ref={isClient ? setNodeRef : undefined}
            {...(isClient ? listeners : {})}
            {...(isClient ? attributes : {})}
          >
            <div
              className={cn(
                'w-[2px] rounded-sm',
                minimized ? 'min-h-[20px]' : 'min-h-[30px]'
              )}
              style={{
                backgroundColor: event.calendar ? getAccountColor(event.calendar) : getCardColor(event.color, isFocused)
              }}
            />
            <div className="flex flex-col items-start justify-between">
              <div className="flex min-w-0 flex-1 items-center gap-1">
                {event.type === 'birthday' ? (
                  <Cake className="h-3 w-3" />
                ) : (
                  null
                )}
                <p className="font-medium text-xs leading-tight break-words text-start flex-1">
                  {event.title || 'Untitled Event'}
                </p>
              </div>
              {!minimized && (
                <p className="mt-0.5 text-[11px] opacity-80 leading-tight break-words">
                  {timeDisplay}
                </p>
              )}
            </div>
          </div>

          {/* Vertical Resize Handle - Only show for non-all-day events and non-minimized */}
          {!(minimized || event.isAllDay) && (
            <div
              className={cn(
                'absolute bottom-0 left-1/2 h-2 w-8 -translate-x-1/2 transform cursor-ns-resize rounded-b-md bg-gradient-to-t from-foreground/20 to-transparent transition-all duration-200 hover:from-foreground/30 hover:to-foreground/5',
                isResizing && resizeType === 'vertical' ? 'from-foreground/40 opacity-100' : 'opacity-0 group-hover:opacity-60',
                'flex z-20 items-end justify-center pb-0.5'
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={handleVerticalResizeStart}
              ref={resizeHandleRef}
            >
              <GripVertical className="h-2 w-2 opacity-60" />
            </div>
          )}

          {/* Horizontal Resize Handle - Right side */}
          {!(minimized || event.isAllDay) && (
            <div
              className={cn(
                'absolute right-0 top-1/2 h-8 w-2 -translate-y-1/2 transform cursor-ew-resize rounded-r-md bg-gradient-to-l from-foreground/20 to-transparent transition-all duration-200 hover:from-foreground/30 hover:to-foreground/5',
                isResizing && resizeType === 'horizontal' ? 'from-foreground/40 opacity-100' : 'opacity-0 group-hover:opacity-60',
                'flex z-20 items-center justify-center pr-0.5'
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={handleHorizontalResizeStart}
              ref={horizontalResizeHandleRef}
            >
              <GripHorizontal className="h-2 w-2 opacity-60" />
            </div>
          )}

          {isResizing && (
            <div className="pointer-events-none absolute inset-0 rounded-sm border-2 border-foreground/50" />
          )}
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="bg-popover">
        <ContextMenuItem
          className="cursor-pointer"
          onClick={handleEdit}
        >
          Edit
        </ContextMenuItem>
        <ContextMenuItem
          className="cursor-pointer"
          onClick={handleDuplicate}
        >
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem
          className="cursor-pointer"
          onClick={handleCopy}
        >
          Copy
        </ContextMenuItem>
        <ContextMenuItem
          className="cursor-pointer text-destructive"
          onClick={handleDelete}
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
