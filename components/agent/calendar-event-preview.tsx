'use client';

import { useState, useEffect } from 'react';

import {
    AlertTriangle,
  Cake,
  Calendar,
  Check,
  Clock,
  MapPin,
  Pencil,
  Users,
  X,
} from 'lucide-react';
import { GraphicDoodle } from '@/components/event/cards/graphics';
import { Button } from '@/components/ui/button';
import type { Event } from '@/lib/store/calendar-store';
import { cn, ensureDate } from '@/lib/utils';
import { useCalendarStore } from '@/providers/calendar-store-provider';

interface CalendarEventPreviewProps {
  event: Event;
  onAccept: () => void;
  onDecline: () => void;
  onEdit: () => void;
}

export function CalendarEventPreview({
  event,
  onAccept,
  onDecline,
  onEdit,
}: CalendarEventPreviewProps) {
  const { saveEvent, openEventSidebarForEdit, setCurrentDate } =
    useCalendarStore((state) => state);
  
  const [hasConflicts, setHasConflicts] = useState(false);
  const [conflictingEvents, setConflictingEvents] = useState<any[]>([]);

  // Check for conflicts when component mounts
  useEffect(() => {
    const checkConflicts = async () => {
      try {
        const response = await fetch('/api/calendar/check-conflicts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startDate: ensureDate(event.startDate).toISOString(),
            endDate: ensureDate(event.endDate).toISOString(),
            excludeEventId: event.id,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.hasConflicts) {
            setHasConflicts(true);
            setConflictingEvents(result.events);
          }
        }
      } catch (error) {
        console.error('Error checking conflicts:', error);
      }
    };

    checkConflicts();
  }, [event.startDate, event.endDate, event.id]);

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500/20 border-blue-500/30 text-blue-700 dark:bg-blue-500/40 dark:text-blue-100',
      green:
        'bg-green-500/20 border-green-500/30 text-green-700 dark:bg-green-500/40 dark:text-green-100',
      purple:
        'bg-purple-500/20 border-purple-500/30 text-purple-700 dark:bg-purple-500/40 dark:text-purple-100',
      orange:
        'bg-orange-500/20 border-orange-500/30 text-orange-700 dark:bg-orange-500/40 dark:text-orange-100',
      red: 'bg-red-500/20 border-red-500/30 text-red-700 dark:bg-red-500/40 dark:text-red-100',
      pink: 'bg-pink-500/20 border-pink-500/30 text-pink-700 dark:bg-pink-500/40 dark:text-pink-100',
      yellow:
        'bg-yellow-500/20 border-yellow-500/30 text-yellow-700 dark:bg-yellow-500/40 dark:text-yellow-100',
      gray: 'bg-gray-500/20 border-gray-500/30 text-gray-700 dark:bg-gray-500/40 dark:text-gray-100',
    };
    return colorMap[color] || colorMap.blue;
  };

  const handleAccept = () => {
    // Ensure dates are properly converted to Date objects
    const eventWithProperDates = {
      ...event,
      startDate: ensureDate(event.startDate),
      endDate: ensureDate(event.endDate),
    };

    // Save the event (conflicts are already shown in the UI above)
    saveEvent(eventWithProperDates);
    setCurrentDate(eventWithProperDates.startDate);
    onAccept();
  };

  const handleEdit = () => {
    // Ensure dates are properly converted to Date objects
    const eventWithProperDates = {
      ...event,
      startDate: ensureDate(event.startDate),
      endDate: ensureDate(event.endDate),
    };

    openEventSidebarForEdit(eventWithProperDates);
    onEdit();
  };

  const handleDecline = () => {
    onDecline();
  };

  const timeDisplay = `${formatTime(event.startDate)}–${formatTime(event.endDate)}`;

  return (
    <div className="space-y-2">
      {hasConflicts && (
        <div className="rounded-md bg-orange-50 border border-orange-200 p-3 text-sm text-orange-800 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span className="font-medium">Scheduling Conflict Detected</span>
          </div>
          <p className="text-xs opacity-80">
            This event conflicts with {conflictingEvents.length} existing event(s). You can edit it to resolve the conflict.
          </p>
        </div>
      )}
      
      <div
        className={cn(
          'group relative rounded-sm border p-2 text-xs transition-all duration-200 hover:shadow-md',
          getColorClasses(event.color),
          event.isAllDay && 'border-l-4'
        )}
      >
      <div className="-right-0 pointer-events-none absolute top-0 size-12 overflow-hidden">
        <GraphicDoodle color={event.color} size="md" />
      </div>

      <div className="relative z-10 flex flex-row gap-2">
        <div className={cn('w-[2px]', getColorClasses(event.color))} />
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
          <p className="mt-1 truncate text-xs opacity-80">{timeDisplay}</p>
        </div>
      </div>

      <div className="mt-2 flex justify-end gap-2 pt-3">
        <Button
          className="bg-white text-black hover:bg-gray-50 h-7 rounded-[10px]"
          onClick={handleAccept}
          size="sm"
        >
          <Check className="h-4 w-4" />
          Accept
        </Button>
        <Button
          className="h-7 rounded-[10px] border-blue-200 text-blue-700 bg-transparent hover:bg-blue-50 hover:text-blue-800 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/30"
          onClick={handleDecline}
          size="sm"
          variant="outline"
        >
          <X className="h-4 w-4" />
          Decline
        </Button>
      </div>
    </div>
  </div>
  );
}
