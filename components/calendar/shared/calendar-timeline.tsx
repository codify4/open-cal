import { Badge } from '@/components/ui/badge';

interface CalendarTimelineProps {
  position: number;
  detailedHour: string;
  variant?: 'week' | 'daily';
}

export const CalendarTimeline = ({ position, detailedHour, variant = 'week' }: CalendarTimelineProps) => {
  const leftPosition = variant === 'week' ? '5px' : '100px';
  const width = variant === 'week' ? 'w-full' : 'w-[calc(100%-53px)]';

  return (
    <div
      className={`pointer-events-none absolute left-0 z-50 flex h-[1px] ${width} rounded-full bg-primary/40`}
      style={{ top: `${position}px` }}
    >
      <Badge
        className="-translate-y-1/2 absolute z-50 bg-card text-card-foreground text-xs"
        style={{ left: leftPosition }}
        variant="outline"
      >
        {detailedHour}
      </Badge>
    </div>
  );
};
