import { useState } from 'react';
import { EventCard } from '@/components/event/cards/event-card';
import { groupEventsByTimePeriod } from '@/lib/calendar-utils/calendar-view-utils';
import { calculateEventStyling } from '@/lib/calendar-utils/event-styling';
import type { Event } from '@/lib/store/calendar-store';

interface DailyEventsContainerProps {
  events: Event[];
  onResize: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  onResizeEnd: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  updateEventTime: (
    eventId: string,
    newStartDate: Date,
    newEndDate: Date
  ) => void;
}

export const DailyEventsContainer = ({
  events,
  onResize,
  onResizeEnd,
  updateEventTime,
}: DailyEventsContainerProps) => {
  const timeGroups = groupEventsByTimePeriod(events);
  const [focusedEventId, setFocusedEventId] = useState<string | null>(null);
  const [dropPreview, setDropPreview] = useState<{ y: number; height: number; width: number; left: number } | null>(null);

  const handleEventFocus = (eventId: string) => {
    setFocusedEventId(eventId);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
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
    <div
      className="pointer-events-none absolute inset-0"
      onClick={handleContainerClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {events?.map((event: Event) => {
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

        const styling = calculateEventStyling(event, events, {
          eventsInSamePeriod,
          periodIndex,
          adjustForPeriod: true,
          focusedEventId: focusedEventId || undefined,
        });

        return (
          <div
            className="pointer-events-auto absolute flex flex-grow flex-col"
            key={event.id}
            style={{
              minHeight: styling.height,
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
    </div>
  );
};
