import clsx from 'clsx';
import { motion } from 'framer-motion';
import { EventCard } from '@/components/event/cards/event-card';
import type { Event } from '@/lib/store/calendar-store';

interface WeekHeaderProps {
  daysOfWeek: Date[];
  currentDate: Date;
  colWidth: number[];
  isResizing: boolean;
  getAllDayEventsForDay: (dayIndex: number) => Event[];
  onResizeEnd: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
}

const getDayName = (day: number) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[day];
};

export const WeekHeader = ({
  daysOfWeek,
  currentDate,
  colWidth,
  isResizing,
  getAllDayEventsForDay,
  onResizeEnd,
}: WeekHeaderProps) => {
  return (
    <div className="relative col-span-8 flex flex-col">
      <div
        className="sticky top-0 z-40 grid flex-grow gap-0 border-border border-b bg-card backdrop-blur"
        style={{
          gridTemplateColumns: colWidth.map((w) => `${w}fr`).join(' '),
          transition: isResizing
            ? 'none'
            : 'grid-template-columns 0.3s ease-in-out',
        }}
      >
        {daysOfWeek.map((day, idx) => (
          <div className="group relative flex flex-col" key={idx}>
            <div className="flex flex-grow items-center justify-center border-border border-r bg-card py-2">
              <div className="text-center">
                <div
                  className={clsx(
                    'font-medium text-muted-foreground text-xs',
                    new Date().getDate() === day.getDate() &&
                      new Date().getMonth() === currentDate.getMonth() &&
                      new Date().getFullYear() === currentDate.getFullYear()
                      ? 'text-destructive'
                      : ''
                  )}
                >
                  {getDayName(day.getDay())},{' '}
                  {day.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="grid gap-0 border-border border-b bg-card/50"
        style={{
          gridTemplateColumns: colWidth.map((w) => `${w}fr`).join(' '),
          transition: isResizing
            ? 'none'
            : 'grid-template-columns 0.3s ease-in-out',
        }}
      >
        {daysOfWeek.map((day, dayIndex) => {
          const allDayEvents = getAllDayEventsForDay(dayIndex);
          const maxVisibleEvents = 3;
          const visibleEvents = allDayEvents.slice(0, maxVisibleEvents);

          return (
            <div
              className="relative min-h-[32px] border-border border-r p-1"
              key={`allday-${dayIndex}`}
            >
              <div className="flex flex-col gap-1">
                {visibleEvents.map((event) => (
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-shrink-0"
                    exit={{ opacity: 0, scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    key={event.id}
                    transition={{ duration: 0.2 }}
                  >
                    <EventCard
                      event={event}
                      minimized={true}
                      onResizeEnd={onResizeEnd}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
