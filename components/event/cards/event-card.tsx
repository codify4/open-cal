'use client';

import { useEffect, useState } from 'react';
import { useCalendarManagement } from '@/hooks/use-calendar-management';
import { getCardColor } from '@/lib/calendar-utils/calendar-color-utils';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/providers/chat-store-provider';
import { convertEventToReference } from '@/lib/store/chat-store';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { GraphicDoodle } from './graphics';
import { EventCardContent } from './components/event-card-content';
import { EventCardResizeHandles } from './components/event-card-resize-handles';
import { EventCardContextMenu } from './components/event-card-context-menu';
import { useEventCardDrag } from './hooks/use-event-card-drag';
import { useEventCardResize } from './hooks/use-event-card-resize';
import { useEventCardFocus } from './hooks/use-event-card-focus';
import { useEventCardActions } from './hooks/use-event-card-actions';
import { calculateEventHeight, useEventCardColor } from './utils/event-card-utils';
import type { EventCardProps } from './types/event-card-types';
import { useSession } from '@clerk/nextjs';

export const EventCard = ({
  event,
  className = '',
  minimized = false,
  onResize,
  onResizeEnd,
  onWidthResize,
  onFocus,
}: EventCardProps) => {
  const [isClient, setIsClient] = useState(false);
  const { fetchedCalendars } = useCalendarManagement();
  const addEventReference = useChatStore((state) => state.addEventReference);
  const toggleChatSidebar = useCalendarStore((state) => state.toggleChatSidebar);
  const sessionCalendars = useCalendarStore((state) => state.sessionCalendars);
  const isMobile = useIsMobile();
  const { session } = useSession();

  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
    isLongPress,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseUp,
  } = useEventCardDrag(event);

  const {
    isResizing,
    resizeType,
    handleVerticalResizeStart,
    handleHorizontalResizeStart,
  } = useEventCardResize(event, { onResize, onResizeEnd, onWidthResize });

  const { isFocused, cardRef, handleCardClick } = useEventCardFocus(onFocus);
  const { handleEdit, handleDelete, handleDuplicate } = useEventCardActions();

  const handleAskAI = (event: any) => {
    const eventReference = convertEventToReference(event);
    addEventReference(eventReference);
    toggleChatSidebar();
  };

  const handleCardTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isLongPress) {
      if (isMobile) {
        handleCardClick(e as React.MouseEvent, event.id);
        handleEdit(e as React.MouseEvent, event);
      }
    }
  };

  const indicatorColor = useEventCardColor(event, sessionCalendars, isFocused, session?.id);
  const calculatedHeight = calculateEventHeight(event.startDate, event.endDate);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const cardStyle = {
    height: minimized ? undefined : `${calculatedHeight}px`,
    userSelect: isDragging ? 'none' as const : 'auto' as const,
  };

  return (
    <EventCardContextMenu
      event={event}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onDuplicate={handleDuplicate}
      onAskAI={handleAskAI}
    >
      <div
        className={cn(
          'event-card group flex flex-row relative rounded-sm border-2 p-2 text-xs hover:shadow-md',
          getCardColor(event.color, isFocused),
          event.isAllDay && 'border-l-4',
          isClient && isDragging && 'opacity-50',
          minimized && 'max-h-[24px] min-h-[20px] overflow-hidden p-1 border rounded-[8px] flex items-center justify-start mx-2 truncate',
          isDragging && 'z-[9998]',
          isFocused ? 'opacity-100' : 'opacity-80',
          isLongPress && 'cursor-grabbing',
          !isLongPress && 'cursor-pointer',
          isDragging && 'select-none',
          className
        )}
        onClick={handleCardTap}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={cardRef}
        style={cardStyle}
      >
        <div
          className={cn(
            'w-[2px] rounded-sm',
            minimized ? 'min-h-[16px]' : 'min-h-[30px]'
          )}
          style={{ backgroundColor: indicatorColor }}
        />
        
        {!minimized && (
          <div className="pointer-events-none absolute top-1 right-1 size-8 overflow-hidden opacity-50">
            <GraphicDoodle color={event.color} size="sm" />
          </div>
        )}

        <div
          className={cn(
            'relative z-10 flex flex-col gap-2',
            minimized && 'gap-0',
            isLongPress ? 'cursor-grabbing' : 'cursor-pointer'
          )}
          ref={isClient ? setNodeRef : undefined}
          {...(isClient ? listeners : {})}
          {...(isClient ? attributes : {})}
        >
          <EventCardContent event={event} minimized={minimized} />
        </div>

        {!minimized && (
          <EventCardResizeHandles
            event={event}
            minimized={minimized}
            isResizing={isResizing}
            resizeType={resizeType}
            onVerticalResizeStart={(e) => handleVerticalResizeStart(e, cardRef)}
            onHorizontalResizeStart={(e) => handleHorizontalResizeStart(e, cardRef)}
          />
        )}

        {isResizing && (
          <div className="pointer-events-none absolute inset-0 rounded-sm border-2 border-foreground/50" />
        )}
      </div>
    </EventCardContextMenu>
  );
};
