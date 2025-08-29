import { useState } from 'react';
import { CalendarContextMenuItems } from '@/components/calendar/shared/context-menu-items';
import { TimeSlot } from '@/components/calendar/shared/time-slot';
import { EventCard } from '@/components/event/cards/event-card';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { groupEventsByTimePeriod } from '@/lib/calendar-utils/calendar-view-utils';
import { calculateEventStyling } from '@/lib/calendar-utils/event-styling';
import type { Event } from '@/lib/store/calendar-store';

interface WeekDayColumnProps {
  dayIndex: number;
  dayEvents: Event[];
  daysOfWeek: Date[];
  onContextMenuOpen: (e: React.MouseEvent) => void;
  onAddEvent: (dayIndex: number, timeString: string) => void;
  onAskAI: () => void;
  session: { user: any } | null;
  contextMenuTime: string | null;
  detailedHour: string | null;
  setContextMenuTime: (time: string | null) => void;
  onResizeEnd: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  updateEventTime: (
    eventId: string,
    newStartDate: Date,
    newEndDate: Date
  ) => void;
}

export const WeekDayColumn = ({
  dayIndex,
  dayEvents,
  daysOfWeek,
  onContextMenuOpen,
  onAddEvent,
  onAskAI,
  session,
  contextMenuTime,
  detailedHour,
  setContextMenuTime,
  onResizeEnd,
  updateEventTime,
}: WeekDayColumnProps) => {
  const timeGroups = groupEventsByTimePeriod(dayEvents);
  const maxEventsToShow = 10;
  const visibleEvents = dayEvents?.slice(0, maxEventsToShow);
  const [focusedEventId, setFocusedEventId] = useState<string | null>(null);
  const [dropPreview, setDropPreview] = useState<{ y: number; height: number; width: number; left: number } | null>(null);

  const handleEventFocus = (eventId: string) => {
    setFocusedEventId(eventId);
  };

  const handleColumnClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setFocusedEventId(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const x = e.clientX - rect.left;
    const hourHeight = 64;
    const hourIndex = Math.floor(y / hourHeight);
    const minuteOffset = y % hourHeight;
    
    // Calculate preview position with 15-minute precision
    const quarterHourHeight = hourHeight / 4; // 16px per 15 minutes
    const quarterHourIndex = Math.floor(minuteOffset / quarterHourHeight);
    const snappedMinuteOffset = quarterHourIndex * quarterHourHeight;
    
    const previewY = hourIndex * hourHeight + snappedMinuteOffset;
    
    // Use the actual event dimensions for a realistic preview
    const previewHeight = 60; // 1 hour default height
    const previewWidth = 120; // Default width for single column
    const previewLeft = Math.max(2, Math.min(x - previewWidth / 2, rect.width - previewWidth - 2));
    
    setDropPreview({ y: previewY, height: previewHeight, width: previewWidth, left: previewLeft });
  };

  const handleDragLeave = () => {
    setDropPreview(null);
  };

  return (
    <ContextMenu key={`day-${dayIndex}`}>
      <ContextMenuTrigger asChild>
        <div
          className={`relative z-20 col-span-1 overflow-hidden border-none text-center text-muted-foreground text-sm ${
            dayIndex < 6 ? 'border-r' : ''
          }`}
          onClick={handleColumnClick}
          onContextMenu={onContextMenuOpen}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {visibleEvents?.map((event) => {
            let eventsInSamePeriod = 1;
            let periodIndex = 0;

            for (let i = 0; i < timeGroups.length; i++) {
              const groupIndex = timeGroups[i].findIndex(
                (e) => e.id === event.id
              );
              if (groupIndex !== -1) {
                eventsInSamePeriod = timeGroups[i].length;
                periodIndex = groupIndex;
                break;
              }
            }

            const styling = calculateEventStyling(event, dayEvents, {
              eventsInSamePeriod,
              periodIndex,
              adjustForPeriod: true,
              focusedEventId: focusedEventId || undefined,
            });

            return (
              <div
                className="absolute flex flex-grow flex-col"
                key={event.id}
                style={{
                  minHeight: styling.height,
                  height: styling.height,
                  top: styling.top,
                  left: styling.left,
                  maxWidth: styling.maxWidth,
                  minWidth: styling.minWidth,
                  padding: '0 2px',
                  boxSizing: 'border-box',
                  zIndex: styling.zIndex + 1000,
                }}
              >
                <EventCard
                  event={event}
                  onFocus={handleEventFocus}
                  onResize={(eventId, newStartDate, newEndDate) => {
                    updateEventTime(eventId, newStartDate, newEndDate);
                  }}
                  onResizeEnd={onResizeEnd}
                />
              </div>
            );
          })}

          {/* Drop Preview Indicator */}
          {dropPreview && (
            <div
              className="absolute pointer-events-none z-[9999]"
              style={{
                top: `${dropPreview.y}px`,
                height: `${dropPreview.height}px`,
                width: `${dropPreview.width}px`,
                left: `${dropPreview.left}px`,
              }}
            >
              <div className="h-full w-full border-2 border-dashed border-primary/60 bg-primary/5 rounded-sm" />
            </div>
          )}

          {Array.from({ length: 24 }, (_, hourIndex) => {
            const timeSlotId = `day-${dayIndex}-hour-${hourIndex}`;

            return (
              <TimeSlot
                date={daysOfWeek[dayIndex]}
                dayIndex={dayIndex}
                hourIndex={hourIndex}
                key={timeSlotId}
                timeSlotId={timeSlotId}
              />
            );
          })}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="bg-popover">
        <CalendarContextMenuItems
          onAddEvent={() => {
            const timeToUse = contextMenuTime || detailedHour || '12:00 PM';
            onAddEvent(dayIndex, timeToUse);
          }}
          onAskAI={onAskAI}
          onClose={() => setContextMenuTime(null)}
          session={session}
        />
      </ContextMenuContent>
    </ContextMenu>
  );
};
