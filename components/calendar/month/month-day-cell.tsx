import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import { CalendarContextMenuItems } from '@/components/calendar/shared/context-menu-items';
import { EventCard } from '@/components/event/cards/event-card';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import type { Event } from '@/lib/store/calendar-store';

interface MonthDayCellProps {
  cellDate: Date;
  dayNumber: number;
  dayEvents: Event[];
  isToday: boolean;
  sessionPresent: boolean;
  onAddEvent: (day: number) => void;
  onContextMenuAddEvent: (day: number) => void;
  onAskAI: () => void;
}

export function MonthDayCell({
  cellDate,
  dayNumber,
  dayEvents,
  isToday,
  sessionPresent,
  onAddEvent,
  onContextMenuAddEvent,
  onAskAI,
}: MonthDayCellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `month-day-${cellDate.getFullYear()}-${cellDate.getMonth()}-${dayNumber}`,
    data: {
      date: cellDate,
    },
  });

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className="group flex h-[150px] flex-col rounded border-none hover:z-50"
        >
          <Card
            className={clsx(
              'relative flex h-full cursor-pointer overflow-hidden border p-4 shadow-md transition-colors',
              isOver ? 'bg-default-100' : undefined
            )}
            onClick={() => onAddEvent(dayNumber)}
            ref={setNodeRef}
          >
            <div
              className={clsx(
                'relative mb-1 font-semibold text-3xl',
                dayEvents.length > 0
                  ? 'text-primary-600'
                  : 'text-muted-foreground',
                isToday ? 'text-secondary-500' : ''
              )}
            >
              {dayNumber}
            </div>
            <div className="flex w-full flex-grow flex-col gap-2">
              {dayEvents?.length > 0 && dayEvents[0] && (
                <div key={dayEvents[0].id}>
                  <EventCard event={dayEvents[0]} minimized={true} />
                </div>
              )}
              {dayEvents.length > 1 && (
                <Badge
                  className="absolute top-2 right-2 cursor-pointer text-xs hover:bg-default-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddEvent(dayNumber);
                  }}
                  variant="outline"
                >
                  {dayEvents.length > 1 ? `+${dayEvents.length - 1}` : ' '}
                </Badge>
              )}
            </div>
          </Card>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-40 bg-neutral-950">
        <CalendarContextMenuItems
          onAddEvent={() => onContextMenuAddEvent(dayNumber)}
          onAskAI={() => {
            if (sessionPresent) {
              onAskAI();
            } else {
              onAddEvent(dayNumber);
            }
          }}
          session={{ user: sessionPresent ? {} : null }}
        />
      </ContextMenuContent>
    </ContextMenu>
  );
}
