'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import { CalendarTimeline } from '@/components/calendar/shared/calendar-timeline';
import { DailyEventsContainer } from '@/components/calendar/daily/daily-events-container';
import { DailyTimeGrid } from '@/components/calendar/daily/daily-time-grid';
import type { Event } from '@/lib/store/calendar-store';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { useGoogleCalendarRefresh } from '@/hooks/use-google-calendar-refresh';
import { useOptimisticEventSync } from '@/hooks/use-optimistic-event-sync';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { hours, formatTimeFromPosition, getEventsForDay } from '@/lib/calendar-utils/calendar-view-utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.12 } },
};

const pageTransitionVariants = {
  enter: () => ({ opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: () => ({
    opacity: 0,
    transition: { opacity: { duration: 0.2, ease: 'easeInOut' } },
  }),
};

export default function DailyView({
  stopDayEventSummary,
}: {
  stopDayEventSummary?: boolean;
}) {
  const hoursColumnRef = useRef<HTMLDivElement>(null);
  const [detailedHour, setDetailedHour] = useState<string | null>(null);
  const [timelinePosition, setTimelinePosition] = useState<number>(0);
  const [contextMenuTime, setContextMenuTime] = useState<string | null>(null);
  const {
    currentDate,
    navigationDirection,
    openEventSidebarForNewEvent,
    events,
    toggleChatSidebar,
    googleEvents,
    visibleCalendarIds,
    updateEventTime,
  } = useCalendarStore((state) => state);
  const { user: clerkUser, isSignedIn } = useUser();
  const { refreshEvents } = useGoogleCalendarRefresh();
  const { optimisticUpdate, commit } = useOptimisticEventSync();

  const direction = navigationDirection;
  const date = currentDate instanceof Date ? currentDate : new Date(currentDate);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoursColumnRef.current) return;
    const rect = hoursColumnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const timeString = formatTimeFromPosition(y, rect);
    setDetailedHour(timeString);

    const position = Math.max(0, Math.min(rect.height, Math.round(y)));
    setTimelinePosition(position);
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
      if (clerkUser?.id) {
        commit(updatedEvent, clerkUser.id, clerkUser.primaryEmailAddress?.emailAddress).catch(() => {
          revert();
        });
      }
    }
  }, [optimisticUpdate, commit, clerkUser]);

  useEffect(() => {
    if (clerkUser?.id && visibleCalendarIds.length > 0) {
      refreshEvents();
    }
  }, [refreshEvents, clerkUser?.id, visibleCalendarIds]);

  const allEvents = useMemo(() => {
    const localEvents = events || [];
    const googleCalEvents = googleEvents || [];
    const googleEventsMap = new Map(googleCalEvents.map(event => [event.id, event]));
    const filteredLocalEvents = localEvents.filter(event => !googleEventsMap.has(event.id));
    return [...filteredLocalEvents, ...googleCalEvents];
  }, [events, googleEvents]);

  const dayEvents = useMemo(() => getEventsForDay(allEvents, date), [allEvents, date]);

  const handleAddEventDay = useCallback((timeString: string) => {
    if (!isSignedIn) {
      return;
    }
    openEventSidebarForNewEvent(date);
  }, [isSignedIn, date, openEventSidebarForNewEvent]);

  return (
    <div className="mt-0">
      <SignedOut>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              Sign in to view your calendar
            </h3>
            <p className="text-muted-foreground">
              Connect your account to start managing your schedule
            </p>
            <SignInButton mode="modal">
              <Button>
                Sign in to Continue
              </Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
      
      <SignedIn>
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            animate="center"
            className="flex flex-col gap-4"
            custom={direction}
            exit="exit"
            initial="enter"
            key={currentDate.toISOString()}
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            variants={pageTransitionVariants}
          >
            <div className="relative rounded-md bg-default-50 transition duration-400 hover:bg-default-100">
              <motion.div
                animate="visible"
                className="relative flex rounded-xl ease-in-out"
                initial="hidden"
                onMouseLeave={() => setDetailedHour(null)}
                onMouseMove={handleMouseMove}
                ref={hoursColumnRef}
                variants={containerVariants}
              >
                <div className="flex flex-col">
                  {hours.map((hour, index) => (
                    <motion.div
                      className="h-[64px] cursor-pointer border-default-200 p-4 text-left text-muted-foreground text-sm transition duration-300"
                      key={`hour-${index}`}
                      variants={itemVariants}
                    >
                      {hour}
                    </motion.div>
                  ))}
                </div>
                <div className="relative flex flex-grow flex-col">
                  <div className="relative">
                    <DailyTimeGrid
                      contextMenuTime={contextMenuTime}
                      date={date}
                      detailedHour={detailedHour}
                      onAddEvent={handleAddEventDay}
                      onAskAI={toggleChatSidebar}
                      onContextMenuOpen={handleContextMenuOpen}
                      session={{ user: isSignedIn ? clerkUser : null }}
                      setContextMenuTime={setContextMenuTime}
                    />
                    {dayEvents && (
                      <DailyEventsContainer
                        events={dayEvents}
                        onResizeEnd={handleResizeEnd}
                        updateEventTime={updateEventTime}
                      />
                    )}
                  </div>
                </div>
              </motion.div>

              {detailedHour && (
                <CalendarTimeline
                  detailedHour={detailedHour}
                  position={timelinePosition}
                  variant="daily"
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </SignedIn>
    </div>
  );
}
