import { Cake } from 'lucide-react';
import type { EventCardContentProps } from '../types/event-card-types';
import { getTimeDisplay } from '../utils/event-card-utils';

export const EventCardContent = ({ event, minimized = false }: EventCardContentProps) => {
  const timeDisplay = getTimeDisplay(event.startDate, event.endDate);

  if (minimized) {
    return (
      <div className="relative z-10 flex cursor-grab flex-row items-center gap-1 ml-2 select-none min-w-0">
        {event.type === 'birthday' ? (
          <Cake className="h-3 w-3 flex-shrink-0" />
        ) : null}
        <p className="flex-1 break-words text-start font-medium text-xs truncate">
          {event.title || 'Untitled Event'}
        </p>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex cursor-grab flex-col gap-2 ml-2 select-none">
      <div className="flex flex-col items-start justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          {event.type === 'birthday' ? (
            <Cake className="h-3 w-3" />
          ) : null}
          <p className="flex-1 break-words text-start font-medium text-xs leading-tight">
            {event.title || 'Untitled Event'}
          </p>
        </div>
        <p className="mt-0.5 break-words text-[11px] leading-tight opacity-80">
          {timeDisplay}
        </p>
      </div>
    </div>
  );
};
