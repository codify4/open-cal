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
import { authClient } from '@/lib/auth-client';
import { useGoogleCalendarRefresh } from '@/hooks/use-google-calendar-refresh';
import { toast } from 'sonner';

interface EventCardProps {
  event: Event;
  className?: string;
  minimized?: boolean;
  onResize?: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  onWidthResize?: (eventId: string, newWidth: number) => void;
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
  onWidthResize,
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
  const cardRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const horizontalResizeHandleRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const { refreshEvents } = useGoogleCalendarRefresh();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEventSidebarForEdit(event);
  };

  const handleDelete = async () => {
    try {
      if (event.googleEventId) {
        const { data: session } = await authClient.getSession();
        if (session?.user?.id) {
          const accessToken = await authClient.getAccessToken({
            providerId: 'google',
            userId: session.user.id,
          });
          const token = accessToken?.data?.accessToken;
          if (token) {
            const calendarId = event.googleCalendarId || event.calendar || 'primary';
            const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(event.googleEventId)}?sendUpdates=none`;
            const resp = await fetch(url, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
              },
            });
            if (!resp.ok && resp.status !== 404) {
              const errText = await resp.text();
              toast.error('Failed to delete event');
            }
          }
        }
      }
    } catch (_) {
      toast.error('Failed to delete event');
    } finally {
      deleteEvent(event.id);
      await refreshEvents();
    }
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
      // Primary colors
      blue: 'bg-blue-500/20 border-blue-500/30 text-blue-700 dark:bg-blue-500/40 dark:text-blue-100',
      green: 'bg-green-500/20 border-green-500/30 text-green-700 dark:bg-green-500/40 dark:text-green-100',
      red: 'bg-red-500/20 border-red-500/30 text-red-700 dark:bg-red-500/40 dark:text-red-100',
      yellow: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-700 dark:bg-yellow-500/40 dark:text-yellow-100',
      purple: 'bg-purple-500/20 border-purple-500/30 text-purple-700 dark:bg-purple-500/40 dark:text-purple-100',
      orange: 'bg-orange-500/20 border-orange-500/30 text-orange-700 dark:bg-orange-500/40 dark:text-orange-100',
      pink: 'bg-pink-500/20 border-pink-500/30 text-pink-700 dark:bg-pink-500/40 dark:text-pink-100',
      gray: 'bg-gray-500/20 border-gray-500/30 text-gray-700 dark:bg-gray-500/40 dark:text-gray-100',
      
      // Extended colors
      indigo: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-700 dark:bg-indigo-500/40 dark:text-indigo-100',
      teal: 'bg-teal-500/20 border-teal-500/30 text-teal-700 dark:bg-teal-500/40 dark:text-teal-100',
      cyan: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-700 dark:bg-cyan-500/40 dark:text-cyan-100',
      lime: 'bg-lime-500/20 border-lime-500/30 text-lime-700 dark:bg-lime-500/40 dark:text-lime-100',
      amber: 'bg-amber-500/20 border-amber-500/30 text-amber-700 dark:bg-amber-500/40 dark:text-amber-100',
      emerald: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-700 dark:bg-emerald-500/40 dark:text-emerald-100',
      violet: 'bg-violet-500/20 border-violet-500/30 text-violet-700 dark:bg-violet-500/40 dark:text-violet-100',
      rose: 'bg-rose-500/20 border-rose-500/30 text-rose-700 dark:bg-rose-500/40 dark:text-rose-100',
      slate: 'bg-slate-500/20 border-slate-500/30 text-slate-700 dark:bg-slate-500/40 dark:text-slate-100',
      zinc: 'bg-zinc-500/20 border-zinc-500/30 text-zinc-700 dark:bg-zinc-500/40 dark:text-zinc-100',
      neutral: 'bg-neutral-500/20 border-neutral-500/30 text-neutral-700 dark:bg-neutral-500/40 dark:text-neutral-100',
      stone: 'bg-stone-500/20 border-stone-500/30 text-stone-700 dark:bg-stone-500/40 dark:text-stone-100',
      sky: 'bg-sky-500/20 border-sky-500/30 text-sky-700 dark:bg-sky-500/40 dark:text-sky-100',
      fuchsia: 'bg-fuchsia-500/20 border-fuchsia-500/30 text-fuchsia-700 dark:bg-fuchsia-500/40 dark:text-fuchsia-100',
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
            getColorClasses(event.color),
            event.isAllDay && 'border-l-4',
            isClient && isDragging && 'opacity-50',
            minimized && 'max-h-[40px] min-h-[20px] overflow-hidden',
            isDragging && 'z-[9998]',
            className
          )}
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
                  <Cake className="h-3 w-3" />
                ) : (
                  <Calendar className="h-3 w-3" />
                )}
                <h4 className="truncate font-medium">
                  {event.title || 'Untitled Event'}
                </h4>
              </div>
              {!minimized && (
                <p className="mt-1 truncate text-xs opacity-80">
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
