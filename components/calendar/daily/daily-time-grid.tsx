import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/components/ui/context-menu';
import { CalendarContextMenuItems } from '@/components/calendar/shared/context-menu-items';
import { TimeSlot } from '@/components/calendar/shared/time-slot';

interface DailyTimeGridProps {
  date: Date;
  onContextMenuOpen: (e: React.MouseEvent) => void;
  onAddEvent: (timeString: string) => void;
  onAskAI: () => void;
  session: { user: any } | null;
  contextMenuTime: string | null;
  detailedHour: string | null;
  setContextMenuTime: (time: string | null) => void;
}

export const DailyTimeGrid = ({
  date,
  onContextMenuOpen,
  onAddEvent,
  onAskAI,
  session,
  contextMenuTime,
  detailedHour,
  setContextMenuTime,
}: DailyTimeGridProps) => {
  return (
    <>
      {Array.from({ length: 24 }).map((_, index) => {
        const timeSlotId = `hour-${index}`;

        return (
          <ContextMenu key={`hour-${index}`}>
            <ContextMenuTrigger asChild>
              <div onContextMenu={onContextMenuOpen}>
                <TimeSlot
                  className="w-full border-default-200"
                  date={date}
                  hourIndex={index}
                  timeSlotId={timeSlotId}
                />
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-40 bg-neutral-950">
              <CalendarContextMenuItems
                onAddEvent={() => {
                  const timeToUse = contextMenuTime || detailedHour || '12:00 PM';
                  onAddEvent(timeToUse);
                }}
                onAskAI={onAskAI}
                onClose={() => setContextMenuTime(null)}
                session={session}
              />
            </ContextMenuContent>
          </ContextMenu>
        );
      })}
    </>
  );
};
