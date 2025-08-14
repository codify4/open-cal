import { AnimatePresence, motion } from 'framer-motion';
import { EventCard } from '@/components/event/cards/event-card';
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/components/ui/context-menu';
import { CalendarContextMenuItems } from '@/components/calendar/shared/context-menu-items';
import { TimeSlot } from '@/components/calendar/shared/time-slot';
import type { Event } from '@/lib/store/calendar-store';
import { calculateEventStyling } from '@/lib/calendar-utils/event-styling';
import { groupEventsByTimePeriod } from '@/lib/calendar-utils/calendar-view-utils';

interface WeekDayColumnProps {
  dayIndex: number;
  dayEvents: Event[];
  daysOfWeek: Date[];
  onContextMenuOpen: (e: React.MouseEvent) => void;
  onAddEvent: (dayIndex: number, timeString: string) => void;
  onAskAI: () => void;
  session: any;
  contextMenuTime: string | null;
  detailedHour: string | null;
  setContextMenuTime: (time: string | null) => void;
  onResizeEnd: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  updateEventTime: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
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

  return (
    <ContextMenu key={`day-${dayIndex}`}>
      <ContextMenuTrigger asChild>
        <div
          className="relative z-20 col-span-1 overflow-hidden border-border border-r border-b text-center text-muted-foreground text-sm transition duration-300"
          onContextMenu={onContextMenuOpen}
        >
          <AnimatePresence initial={false}>
            {visibleEvents?.map((event) => {
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

              const styling = calculateEventStyling(event, dayEvents, {
                eventsInSamePeriod,
                periodIndex,
                adjustForPeriod: true,
              });

              return (
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute flex flex-grow flex-col transition-all duration-1000"
                  exit={{ opacity: 0, scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0.9 }}
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
                  transition={{ duration: 0.2 }}
                >
                  <EventCard
                    event={event}
                    onResize={(eventId, newStartDate, newEndDate) => {
                      updateEventTime(eventId, newStartDate, newEndDate);
                    }}
                    onResizeEnd={onResizeEnd}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>

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
      <ContextMenuContent className="w-40 bg-popover">
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
