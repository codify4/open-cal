import { Badge } from '@/components/ui/badge';
import { useEffect, useState, useRef } from 'react';

interface CalendarTimelineProps {
  variant?: 'week' | 'daily';
  currentDate?: Date;
}

export const CalendarTimeline = ({
  variant = 'week',
  currentDate,
}: CalendarTimelineProps) => {
  const leftPosition = variant === 'week' ? '43px' : '100px';
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [position, setPosition] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const hourHeight = rect.height / 24;
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      const calculatedPosition = (hours * hourHeight) + (minutes * hourHeight / 60);
      setPosition(calculatedPosition);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isCurrentDay = () => {
    if (!currentDate) return false;
    const today = new Date();
    return today.toDateString() === currentDate.toDateString();
  };

  return (
    <div ref={containerRef} className="h-full pointer-events-none absolute left-0 z-50 w-full">
      <div
        className="pointer-events-none absolute left-0 z-50 w-full bg-red-500 h-[0.1px]"
        style={{ top: `${position}px` }}
      />
      <Badge
        className="-translate-y-1/2 absolute z-50 bg-red-500 text-white text-xs border-0 py-0.5 px-1.5 rounded"
        style={{ left: leftPosition, top: `${position}px` }}
      >
        {formatTime(currentTime)}
      </Badge>
    </div>
  );
};