'use client';

import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DailyEventsContainer } from '@/components/calendar/daily/daily-events-container';
import { DailyTimeGrid } from '@/components/calendar/daily/daily-time-grid';
import { CalendarTimeline } from '@/components/calendar/shared/calendar-timeline';
import { Button } from '@/components/ui/button';
import { useGoogleCalendarRefresh } from '@/hooks/use-google-calendar-refresh';
import { useOptimisticEventSync } from '@/hooks/use-optimistic-event-sync';
import {
  formatTimeFromPosition,
  getEventsForDay,
  hours,
} from '@/lib/calendar-utils/calendar-view-utils';
import { useCalendarStore } from '@/providers/calendar-store-provider';

export default function DailyView({
  stopDayEventSummary,
}: {
  stopDayEventSummary?: boolean;
}) {
  const hasRefreshedRef = useRef(false);
  const hoursColumnRef = useRef<HTMLDivElement>(null);
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
    setGoogleEvents,
  } = useCalendarStore((state) => state);
  const { user: clerkUser, isSignedIn } = useUser();
  const { refreshEvents } = useGoogleCalendarRefresh();
  const { optimisticUpdate, commit } = useOptimisticEventSync();

  const direction = navigationDirection;
  const date =
    currentDate instanceof Date ? currentDate : new Date(currentDate);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoursColumnRef.current) return;
    const rect = hoursColumnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const timeString = formatTimeFromPosition(y, rect);
    setContextMenuTime(timeString);
  }, []);

  const handleContextMenuOpen = useCallback((e: React.MouseEvent) => {
    if (!hoursColumnRef.current) return;
    const rect = hoursColumnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const timeString = formatTimeFromPosition(y, rect);
    setContextMenuTime(timeString);
  }, []);

  const handleResizeEnd = useCallback(
    (eventId: string, newStartDate: Date, newEndDate: Date) => {
      const result = optimisticUpdate(eventId, newStartDate, newEndDate);
      if (result) {
        const { updatedEvent, revert } = result;
        if (clerkUser?.id) {
          commit(
            updatedEvent,
            clerkUser.id,
            clerkUser.primaryEmailAddress?.emailAddress
          ).catch(() => {
            revert();
          });
        }
      }
    },
    [optimisticUpdate, commit, clerkUser]
  );

  useEffect(() => {
    if (clerkUser?.id && visibleCalendarIds.length > 0 && !hasRefreshedRef.current) {
      hasRefreshedRef.current = true;
      refreshEvents();
    } else if (visibleCalendarIds.length === 0) {
      // Clear events when no calendars are visible
      setGoogleEvents([]);
    }
  }, [refreshEvents, clerkUser?.id, visibleCalendarIds, setGoogleEvents]);

  // Reset refresh flag when calendar IDs change
  useEffect(() => {
    hasRefreshedRef.current = false;
  }, [visibleCalendarIds.join(',')]);

  const allEvents = useMemo(() => {
    const localEvents = events || [];
    const googleCalEvents = googleEvents || [];
    
    // Filter Google Calendar events based on visible calendars
    const filteredGoogleEvents = googleCalEvents.filter((event) => {
      // Check if the event's calendar is in the visible calendars
      return event.googleCalendarId && visibleCalendarIds.includes(event.googleCalendarId);
    });
    
    const googleEventsMap = new Map(
      filteredGoogleEvents.map((event) => [event.id, event])
    );
    const filteredLocalEvents = localEvents.filter(
      (event) => !googleEventsMap.has(event.id)
    );
    
    return [...filteredLocalEvents, ...filteredGoogleEvents];
  }, [events, googleEvents, visibleCalendarIds]);

  const dayEvents = useMemo(
    () => getEventsForDay(allEvents, date),
    [allEvents, date]
  );

  const handleAddEventDay = useCallback(
    (timeString: string) => {
      if (!isSignedIn) {
        return;
      }
      openEventSidebarForNewEvent(date);
    },
    [isSignedIn, date, openEventSidebarForNewEvent]
  );

  return (
    <div className="mt-0">
      <SignedIn>
        <div>
          <div
            className="flex flex-col gap-4"
            key={currentDate.toISOString()}
          >
            <div className="relative rounded-md bg-default-50 transition duration-400 hover:bg-default-100">
              <div
                className="relative flex rounded-xl ease-in-out"
                // onMouseLeave={() => setDetailedHour(null)} // This line is removed
                onMouseMove={handleMouseMove}
                ref={hoursColumnRef}
              >
                <div className="flex flex-col">
                  {hours.map((hour, index) => (
                    <div
                      className="h-[64px] cursor-pointer border-default-200 p-4 text-left text-muted-foreground text-sm transition duration-300"
                      key={`hour-${index}`}
                    >
                      {hour}
                    </div>
                  ))}
                </div>
                <div className="relative flex flex-grow flex-col">
                  <CalendarTimeline variant="daily" currentDate={date} />
                  <div className="relative">
                    <DailyTimeGrid
                      contextMenuTime={contextMenuTime}
                      date={date}
                      detailedHour={null}
                      onAddEvent={handleAddEventDay}
                      onAskAI={toggleChatSidebar}
                      onContextMenuOpen={handleContextMenuOpen}
                      session={{ user: isSignedIn ? clerkUser : null }}
                      setContextMenuTime={setContextMenuTime}
                    />
                    {dayEvents && (
                      <DailyEventsContainer
                        events={dayEvents}
                        onResize={updateEventTime}
                        onResizeEnd={handleResizeEnd}
                        updateEventTime={updateEventTime}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
