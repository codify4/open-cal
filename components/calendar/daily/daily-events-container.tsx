import { AnimatePresence, motion } from 'framer-motion';
import { EventCard } from '@/components/event/cards/event-card';
import type { Event } from '@/lib/store/calendar-store';
import { calculateEventStyling } from '@/lib/calendar-utils/event-styling';
import { groupEventsByTimePeriod } from '@/lib/calendar-utils/calendar-view-utils';
import { useState } from 'react';

interface DailyEventsContainerProps {
  events: Event[];
  onResizeEnd: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  updateEventTime: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
}

export const DailyEventsContainer = ({
  events,
  onResizeEnd,
  updateEventTime,
}: DailyEventsContainerProps) => {
  const timeGroups = groupEventsByTimePeriod(events);
  const [focusedEventId, setFocusedEventId] = useState<string | null>(null);

  const handleEventFocus = (eventId: string) => {
    setFocusedEventId(eventId);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setFocusedEventId(null);
    }
  };

  return (
    <div onClick={handleContainerClick} className="absolute inset-0 pointer-events-none">
      <AnimatePresence initial={false}>
        {events?.map((event: Event) => {
          let eventsInSamePeriod = 1;
          let periodIndex = 0;

          for (let i = 0; i < timeGroups.length; i++) {
            const groupIndex = timeGroups[i].findIndex((e) => e.id === event.id);
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
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="absolute flex flex-grow flex-col transition-all duration-300 pointer-events-auto"
              exit={{ opacity: 0, scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.9 }}
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
              transition={{ duration: 0.2 }}
            >
              <EventCard 
                event={event}
                onResize={(eventId, newStartDate, newEndDate) => {
                  updateEventTime(eventId, newStartDate, newEndDate);
                }}
                onResizeEnd={onResizeEnd}
                onFocus={handleEventFocus}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
