import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { CalendarTimeline } from '@/components/calendar/shared/calendar-timeline';
import { WeekHeader } from '@/components/calendar/week/week-header';
import { WeekDayColumn } from '@/components/calendar/week/week-day-column';
import type { Event } from '@/lib/store/calendar-store';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { useGoogleCalendarRefresh } from '@/hooks/use-google-calendar-refresh';
import { useOptimisticEventSync } from '@/hooks/use-optimistic-event-sync';
import { authClient } from '@/lib/auth-client';
import { 
  hours, 
  getDaysInWeek, 
  formatTimeFromPosition, 
  getTimedEventsForDay, 
  getAllDayEventsForDay 
} from '@/lib/calendar-utils/calendar-view-utils';
import { handleAddEvent } from '@/lib/calendar-utils/calendar-event-handlers';

const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.12 } },
};

const pageTransitionVariants = {
  enter: () => ({ opacity: 0 }),
  center: { opacity: 1 },
  exit: () => ({
    opacity: 0,
    transition: { opacity: { duration: 0.2, ease: 'easeInOut' } },
  }),
};

export default function WeeklyView() {
  const hoursColumnRef = useRef<HTMLDivElement>(null);
  const [detailedHour, setDetailedHour] = useState<string | null>(null);
  const [timelinePosition, setTimelinePosition] = useState<number>(0);
  const [colWidth, setColWidth] = useState<number[]>(Array(7).fill(1));
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [contextMenuTime, setContextMenuTime] = useState<string | null>(null);
  const {
    toggleChatSidebar,
    openEventSidebarForNewEvent,
    openEventSidebarForEdit,
    saveEvent,
    currentDate,
    navigationDirection,
    events,
    updateEventTime,
    googleEvents,
    visibleCalendarIds,
    optimisticUpdateCounter,
  } = useCalendarStore((state) => state);
  const { data: session } = authClient.useSession();
  const { refreshEvents } = useGoogleCalendarRefresh();
  const { optimisticUpdate, commit } = useOptimisticEventSync();

  const direction = navigationDirection;
  const date = currentDate instanceof Date ? currentDate : new Date(currentDate);

  useEffect(() => {
    if (session?.user?.id && visibleCalendarIds.length > 0) {
      refreshEvents();
    }
  }, [refreshEvents, session?.user?.id, visibleCalendarIds]);

  const allEvents = useMemo(() => {
    const localEvents = events || [];
    const googleCalEvents = googleEvents || [];
    const googleEventsMap = new Map(googleCalEvents.map(event => [event.id, event]));
    const filteredLocalEvents = localEvents.filter(event => !googleEventsMap.has(event.id));
    return [...filteredLocalEvents, ...googleCalEvents];
  }, [events, googleEvents, optimisticUpdateCounter]);

  const daysOfWeek = useMemo(() => getDaysInWeek(date), [date]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoursColumnRef.current) return;
    const rect = hoursColumnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const timeString = formatTimeFromPosition(y, rect);
    setDetailedHour(timeString);

    const allDayRowHeight = 32;
    const adjustedY = y - allDayRowHeight;
    const position = Math.max(0, Math.min(rect.height - allDayRowHeight, Math.round(adjustedY)));
    setTimelinePosition(position + allDayRowHeight);
  }, []);

  const handleContextMenuOpen = useCallback((e: React.MouseEvent) => {
    if (!hoursColumnRef.current) return;
    const rect = hoursColumnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const timeString = formatTimeFromPosition(y, rect);
    setContextMenuTime(timeString);
  }, []);

  const handleResizeEnd = useCallback((eventId: string, newStartDate: Date, newEndDate: Date) => {
    const result = optimisticUpdate(eventId, newStartDate, newEndDate);
    if (result) {
      const { updatedEvent, revert } = result;
      commit(updatedEvent).catch(() => {
        revert();
      });
    }
  }, [optimisticUpdate, commit]);

  const handleAddEventWeek = useCallback(async (dayIndex: number, timeString: string) => {
    const targetDate = daysOfWeek[dayIndex % 7];
    await handleAddEvent(
      targetDate,
      timeString,
      session,
      visibleCalendarIds,
      saveEvent,
      openEventSidebarForEdit,
      openEventSidebarForNewEvent,
      refreshEvents
    );
  }, [daysOfWeek, session, visibleCalendarIds, saveEvent, openEventSidebarForEdit, openEventSidebarForNewEvent, refreshEvents]);

  const getEventsForDay = useCallback((dayIndex: number) => {
    return getTimedEventsForDay(allEvents, daysOfWeek[dayIndex]);
  }, [allEvents, daysOfWeek]);

  const getAllDayEventsForDayIndex = useCallback((dayIndex: number) => {
    return getAllDayEventsForDay(allEvents, daysOfWeek[dayIndex]);
  }, [allEvents, daysOfWeek]);

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence custom={direction} initial={false} mode="wait">
        <motion.div
          animate="center"
          className="grid grid-cols-9 gap-0"
          custom={direction}
          exit="exit"
          initial="enter"
          key={currentDate.toISOString()}
          transition={{ opacity: { duration: 0.2 } }}
          variants={pageTransitionVariants}
        >
          <div className="col-span-1 flex items-center justify-center border-border border-r border-b bg-card py-2">
            <span className="font-medium text-muted-foreground text-xs">Time</span>
          </div>

          <WeekHeader
            currentDate={date}
            colWidth={colWidth}
            daysOfWeek={daysOfWeek}
            getAllDayEventsForDay={getAllDayEventsForDayIndex}
            isResizing={isResizing}
            onResizeEnd={handleResizeEnd}
          />

          <div
            className="relative col-span-9 grid grid-cols-9"
            onMouseLeave={() => setDetailedHour(null)}
            onMouseMove={handleMouseMove}
            ref={hoursColumnRef}
          >
            <div className="col-span-1 border-border border-r bg-card">
              {hours.map((hour, index) => (
                <motion.div
                  className="flex h-[64px] cursor-pointer items-start justify-center border-border border-b px-3 py-2 text-left text-muted-foreground text-xs"
                  key={`hour-${index}`}
                  variants={itemVariants}
                >
                  {hour}
                </motion.div>
              ))}
            </div>

            <div
              className="col-span-8 grid h-full"
              style={{
                gridTemplateColumns: colWidth.map((w) => `${w}fr`).join(' '),
                transition: isResizing ? 'none' : 'grid-template-columns 0.3s ease-in-out',
              }}
            >
              {detailedHour && (
                <CalendarTimeline
                  detailedHour={detailedHour}
                  position={timelinePosition}
                  variant="week"
                />
              )}
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const dayEvents = getEventsForDay(dayIndex);
                return (
                  <WeekDayColumn
                    contextMenuTime={contextMenuTime}
                    dayEvents={dayEvents}
                    dayIndex={dayIndex}
                    daysOfWeek={daysOfWeek}
                    detailedHour={detailedHour}
                    key={`day-${dayIndex}`}
                    onAddEvent={handleAddEventWeek}
                    onAskAI={toggleChatSidebar}
                    onContextMenuOpen={handleContextMenuOpen}
                    onResizeEnd={handleResizeEnd}
                    session={session}
                    setContextMenuTime={setContextMenuTime}
                    updateEventTime={updateEventTime}
                  />
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
