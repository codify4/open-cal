import clsx from 'clsx';
import { EventCard } from '@/components/event/cards/event-card';
import type { Event } from '@/lib/store/calendar-store';
import { cn } from '@/lib/utils';

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
        }}
      >
        {daysOfWeek.map((day, idx) => (
          <div className="group relative flex flex-col" key={idx}>
            <div className="flex flex-grow items-center justify-center border-border border-r bg-card py-2">
              <div className="text-center">
                <div
                  className={cn(
                    'font-medium text-muted-foreground text-xs',
                    new Date().getDate() === day.getDate() &&
                      new Date().getMonth() === currentDate.getMonth() &&
                      new Date().getFullYear() === currentDate.getFullYear()
                      ? ''
                      : ''
                  )}
                >
                  {getDayName(day.getDay())}{' '}
                  <span className={cn(
                    'text-xs',
                    new Date().getDate() === day.getDate() &&
                      new Date().getMonth() === currentDate.getMonth() &&
                      new Date().getFullYear() === currentDate.getFullYear()
                      ? 'bg-destructive rounded-[5px] p-0.5 text-white'
                      : ''
                  )}>
                    {day.toLocaleDateString('en-US', {
                      day: 'numeric',
                    })}
                  </span>
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
                  <div
                    className="flex-shrink-0"
                    key={event.id}
                  >
                    <EventCard
                      event={event}
                      minimized={true}
                      onResizeEnd={onResizeEnd}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
