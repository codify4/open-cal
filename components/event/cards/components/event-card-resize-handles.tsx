import { GripHorizontal, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EventCardResizeHandlesProps } from '../types/event-card-types';

export const EventCardResizeHandles = ({
  event,
  minimized = false,
  isResizing,
  resizeType,
  onVerticalResizeStart,
  onHorizontalResizeStart,
}: EventCardResizeHandlesProps) => {
  if (minimized || event.isAllDay) return null;

  return (
    <>
      <div
        className={cn(
          '-translate-x-1/2 absolute bottom-0 left-1/2 h-2 w-8 transform cursor-ns-resize rounded-b-md bg-gradient-to-t from-foreground/20 to-transparent transition-all duration-200 hover:from-foreground/30 hover:to-foreground/5',
          isResizing && resizeType === 'vertical'
            ? 'from-foreground/40 opacity-100'
            : 'opacity-0 group-hover:opacity-60',
          'z-20 flex items-end justify-center pb-0.5'
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseDown={onVerticalResizeStart}
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <GripVertical className="h-2 w-2 opacity-60" />
      </div>

      <div
        className={cn(
          '-translate-y-1/2 absolute top-1/2 right-0 h-8 w-2 transform cursor-ew-resize rounded-r-md bg-gradient-to-l from-foreground/20 to-transparent transition-all duration-200 hover:from-foreground/30 hover:to-foreground/5',
          isResizing && resizeType === 'horizontal'
            ? 'from-foreground/40 opacity-100'
            : 'opacity-0 group-hover:opacity-60',
          'z-20 flex items-center justify-center pr-0.5'
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseDown={onHorizontalResizeStart}
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <GripHorizontal className="h-2 w-2 opacity-60" />
      </div>
    </>
  );
};
