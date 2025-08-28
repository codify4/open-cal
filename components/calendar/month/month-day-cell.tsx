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
  isLastInRow?: boolean;
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
  isLastInRow = false,
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
          className={clsx(
            "group flex h-[150px] flex-col border-r border-b border-border",
            isLastInRow && "border-r-0"
          )}
        >
          <div
            className={clsx(
              'relative flex h-full overflow-hidden p-2 transition-colors hover:bg-muted/30',
              isOver ? 'bg-muted/50' : undefined
            )}
            ref={setNodeRef}
          >
            <div
              className={clsx(
                'relative mb-2 font-medium text-sm',
                dayEvents.length > 0
                  ? 'text-primary-600'
                  : 'text-muted-foreground',
                isToday ? 'text-white bg-destructive h-6 w-6 p-0.5 flex items-center justify-center rounded-[5px] font-normal' : ''
              )}
            >
              {dayNumber}
            </div>
            <div className="flex w-full flex-grow flex-col gap-1">
              {dayEvents?.slice(0, 3).map((event, index) => (
                <div key={event.id} className="min-h-0">
                  <EventCard event={event} minimized={true} />
                </div>
              ))}
              {dayEvents.length > 3 && (
                <Badge
                  className="cursor-pointer text-xs hover:bg-muted/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddEvent(dayNumber);
                  }}
                  variant="outline"
                >
                  +{dayEvents.length - 3}
                </Badge>
              )}
            </div>
          </div>
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
