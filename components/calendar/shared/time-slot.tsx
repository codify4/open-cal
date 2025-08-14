import { useDroppable } from '@dnd-kit/core';
import type React from 'react';

interface TimeSlotProps {
  timeSlotId: string;
  dayIndex?: number;
  hourIndex: number;
  date: Date;
  className?: string;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({
  timeSlotId,
  dayIndex,
  hourIndex,
  date,
  className = '',
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: timeSlotId,
    data: {
      dayIndex,
      hourIndex,
      date,
    },
  });

  return (
    <div
      className={`relative z-10 h-[64px] border-border border-r border-b text-center text-muted-foreground text-sm transition duration-300 ${
        isOver ? 'bg-primary/20' : ''
      } ${className}`}
      ref={setNodeRef}
    />
  );
};
