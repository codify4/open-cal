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
  // Create 4 drop zones for 15-minute intervals within each hour
  const createDropZone = (minuteOffset: number) => {
    const { setNodeRef, isOver } = useDroppable({
      id: `${timeSlotId}-${minuteOffset}`,
      data: {
        dayIndex,
        hourIndex,
        date,
        minuteOffset,
      },
    });

    return (
      <div
        key={minuteOffset}
        ref={setNodeRef}
        className="relative w-full"
        style={{ height: '16px' }} // 64px / 4 = 16px per 15-minute slot
      >
        {isOver && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/60" />
            <div className="absolute top-0 left-0 w-2 h-0.5 bg-primary" />
            <div className="absolute top-0 right-0 w-2 h-0.5 bg-primary" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`relative z-10 h-[64px] border-border border-r border-b text-center text-muted-foreground text-sm ${className}`}
    >
      {/* Create 4 drop zones for 15-minute intervals */}
      {createDropZone(0)}   {/* 0-15 minutes */}
      {createDropZone(15)}  {/* 15-30 minutes */}
      {createDropZone(30)}  {/* 30-45 minutes */}
      {createDropZone(45)}  {/* 45-60 minutes */}
    </div>
  );
};
