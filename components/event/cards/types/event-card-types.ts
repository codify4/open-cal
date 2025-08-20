import type { Event } from '@/lib/store/calendar-store';

export interface EventCardProps {
  event: Event;
  className?: string;
  minimized?: boolean;
  onResize?: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  onResizeEnd?: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  onWidthResize?: (eventId: string, newWidth: number) => void;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  onDuplicate?: (event: Event) => void;
  onFocus?: (eventId: string) => void;
}

export interface ResizeHandlers {
  onResize?: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  onResizeEnd?: (eventId: string, newStartDate: Date, newEndDate: Date) => void;
  onWidthResize?: (eventId: string, newWidth: number) => void;
}

export interface EventCardContentProps {
  event: Event;
  minimized?: boolean;
}

export interface EventCardResizeHandlesProps {
  event: Event;
  minimized?: boolean;
  isResizing: boolean;
  resizeType: 'vertical' | 'horizontal' | null;
  onVerticalResizeStart: (e: React.MouseEvent) => void;
  onHorizontalResizeStart: (e: React.MouseEvent) => void;
}

export interface EventCardContextMenuProps {
  event: Event;
  children: React.ReactNode;
  onEdit: (e: React.MouseEvent, event: Event) => void;
  onDelete: (event: Event) => void;
  onDuplicate: (event: Event) => void;
  onCopy: (event: Event) => void;
}
