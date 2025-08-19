import { Cake, Calendar } from 'lucide-react';
import type { DummyEvent } from '@/constants/sample-events';
import { cn } from '@/lib/utils';

interface DummyEventCardProps {
  event: DummyEvent;
  className?: string;
  minimized?: boolean;
}

export function DummyEventCard({
  event,
  className = '',
  minimized = false,
}: DummyEventCardProps) {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500/40 border-blue-600',
      green: 'bg-green-500/40 border-green-600',
      purple: 'bg-purple-500/40 border-purple-600',
      orange: 'bg-orange-500/40 border-orange-600',
      red: 'bg-red-500/40 border-red-600',
      pink: 'bg-pink-500/40 border-pink-600',
      yellow: 'bg-yellow-500/40 border-yellow-600',
      gray: 'bg-gray-500/40 border-gray-600',
    };
    return colorMap[color] || colorMap.blue;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const hour12 = hours % 12 || 12;
    const ampm = hours < 12 ? 'AM' : 'PM';
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const timeDisplay = `${formatTime(event.startDate)}–${formatTime(event.endDate)}`;

  return (
    <div
      className={cn(
        'group relative rounded-sm border p-2 text-xs transition-all duration-200 hover:shadow-md',
        getColorClasses(event.color),
        event.isAllDay ? 'border-l-4' : '',
        minimized ? 'max-h-[40px] min-h-[20px] overflow-hidden' : '',
        className
      )}
    >
      <div className="relative z-10 flex flex-row gap-2">
        <div
          className={cn(
            'w-[2px]',
            getColorClasses(event.color),
            minimized ? 'min-h-[20px]' : 'min-h-[30px]'
          )}
        />
        <div className="flex flex-col items-start justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-1">
            {event.type === 'birthday' ? (
              <Cake className="h-3 w-3 text-white" />
            ) : (
              <Calendar className="h-3 w-3 text-white" />
            )}
            <h4 className="truncate font-medium text-white">
              {event.title || 'Untitled Event'}
            </h4>
          </div>
          {!minimized && (
            <p className="mt-1 truncate text-white/80 text-xs">{timeDisplay}</p>
          )}
        </div>
      </div>
    </div>
  );
}
