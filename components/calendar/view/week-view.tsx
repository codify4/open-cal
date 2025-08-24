import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { CalendarTimeline } from '@/components/calendar/shared/calendar-timeline';
import { WeekDayColumn } from '@/components/calendar/week/week-day-column';
import { WeekHeader } from '@/components/calendar/week/week-header';
import { Button } from '@/components/ui/button';
import { useGoogleCalendarRefresh } from '@/hooks/use-google-calendar-refresh';
import { useOptimisticEventSync } from '@/hooks/use-optimistic-event-sync';
import { handleAddEvent } from '@/lib/calendar-utils/calendar-event-handlers';
import {
  formatTimeFromPosition,
  getAllDayEventsForDay,
  getDaysInWeek,
  getTimedEventsForDay,
  hours,
} from '@/lib/calendar-utils/calendar-view-utils';
import { useCalendarStore } from '@/providers/calendar-store-provider';

export default function WeeklyView() {
  const hoursColumnRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [detailedHour, setDetailedHour] = useState<string | null>(null);
  const [timelinePosition, setTimelinePosition] = useState<number>(0);
  const [colWidth, setColWidth] = useState<number[]>(Array(7).fill(1));
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [contextMenuTime, setContextMenuTime] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const hasRefreshedRef = useRef(false);
  
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
    setGoogleEvents,
  } = useCalendarStore((state) => state);
  const { user: clerkUser, isSignedIn } = useUser();
  const { refreshEvents } = useGoogleCalendarRefresh();
  const { optimisticUpdate, commit } = useOptimisticEventSync();

  const direction = navigationDirection;
  const date =
    currentDate instanceof Date ? currentDate : new Date(currentDate);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (clerkUser?.id && visibleCalendarIds.length > 0 && !hasRefreshedRef.current) {
      hasRefreshedRef.current = true;
      refreshEvents();
    } else if (visibleCalendarIds.length === 0) {
      setGoogleEvents([]);
    }
  }, [refreshEvents, clerkUser?.id, visibleCalendarIds, setGoogleEvents]);

  useEffect(() => {
    hasRefreshedRef.current = false;
  }, [visibleCalendarIds]);

  useEffect(() => {
    if (isMobile && scrollContainerRef.current) {
      const currentDayIndex = new Date().getDay();
      const dayWidth = scrollContainerRef.current.scrollWidth / 7;
      const scrollPosition = dayWidth * currentDayIndex - (scrollContainerRef.current.clientWidth / 2) + (dayWidth / 2);
      
      scrollContainerRef.current.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  }, [isMobile]);

  const allEvents = useMemo(() => {
    const localEvents = events || [];
    const googleCalEvents = googleEvents || [];
    
    const filteredGoogleEvents = googleCalEvents.filter((event) => {
      return event.googleCalendarId && visibleCalendarIds.includes(event.googleCalendarId);
    });
    
    const googleEventsMap = new Map(
      filteredGoogleEvents.map((event) => [event.id, event])
    );
    const filteredLocalEvents = localEvents.filter(
      (event) => !googleEventsMap.has(event.id)
    );
    
    return [...filteredLocalEvents, ...filteredGoogleEvents];
  }, [events, googleEvents, visibleCalendarIds, optimisticUpdateCounter]);

  const daysOfWeek = useMemo(() => getDaysInWeek(date), [date]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoursColumnRef.current) return;
    const rect = hoursColumnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const timeString = formatTimeFromPosition(y, rect);
    setDetailedHour(timeString);

    const allDayRowHeight = 32;
    const adjustedY = y - allDayRowHeight;
    
    const hourHeight = 64;
    const hourIndex = Math.floor(adjustedY / hourHeight);
    const minuteOffset = adjustedY % hourHeight;
    const quarterHourHeight = hourHeight / 4;
    const quarterHourIndex = Math.floor(minuteOffset / quarterHourHeight);
    const snappedMinuteOffset = quarterHourIndex * quarterHourHeight;
    
    const position = Math.max(
      0,
      Math.min(rect.height - allDayRowHeight, hourIndex * hourHeight + snappedMinuteOffset)
    );
    setTimelinePosition(position + allDayRowHeight);
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

  const handleAddEventWeek = useCallback(
    async (dayIndex: number, timeString: string) => {
      const targetDate = daysOfWeek[dayIndex % 7];
      
      if (!clerkUser) {
        return;
      }
      
      if (visibleCalendarIds.length === 0) {
        toast.error('Please wait for calendars to load before creating events');
        return;
      }
      
      await handleAddEvent(
        targetDate,
        timeString,
        visibleCalendarIds,
        saveEvent,
        openEventSidebarForEdit,
        openEventSidebarForNewEvent,
        refreshEvents,
        clerkUser
      );
    },
    [
      daysOfWeek,
      clerkUser,
      visibleCalendarIds,
      saveEvent,
      openEventSidebarForEdit,
      openEventSidebarForNewEvent,
      refreshEvents,
    ]
  );

  const getEventsForDay = useCallback(
    (dayIndex: number) => {
      return getTimedEventsForDay(allEvents, daysOfWeek[dayIndex]);
    },
    [allEvents, daysOfWeek]
  );

  const getAllDayEventsForDayIndex = useCallback(
    (dayIndex: number) => {
      return getAllDayEventsForDay(allEvents, daysOfWeek[dayIndex]);
    },
    [allEvents, daysOfWeek]
  );

  return (
    <div className="flex flex-col gap-4">
      <SignedOut>
        <div className="flex h-96 items-center justify-center">
          <div className="space-y-4 text-center">
            <h3 className="font-medium text-foreground text-lg">
              Sign in to view your calendar
            </h3>
            <p className="text-muted-foreground">
              Connect your account to start managing your schedule
            </p>
            <SignInButton mode="modal">
              <Button>Sign in to Continue</Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="w-full">
          {isMobile ? (
            <div className="overflow-x-auto" ref={scrollContainerRef}>
              <div className="grid grid-cols-9 gap-0 min-w-[1200px]">
                <div className="col-span-1 flex items-center justify-center border-border border-r border-b bg-card py-2">
                  <span className="font-medium text-muted-foreground text-xs">
                    GMT {new Date().getTimezoneOffset() > 0 ? '-' : '+'}
                    {Math.abs(new Date().getTimezoneOffset() / 60)}
                  </span>
                </div>

                <WeekHeader
                  colWidth={colWidth}
                  currentDate={date}
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
                      <div
                        className={`flex h-[64px] cursor-pointer items-start justify-center border-border px-3 py-2 text-left text-muted-foreground text-xs ${
                          index < hours.length - 1 ? 'border-b' : ''
                        }`}
                        key={`hour-${index}`}
                      >
                        {hour}
                      </div>
                    ))}
                  </div>

                  <div
                    className="col-span-8 grid h-full"
                    style={{
                      gridTemplateColumns: colWidth.map((w) => `${w}fr`).join(' '),
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
                          session={{ user: isSignedIn ? clerkUser : null }}
                          setContextMenuTime={setContextMenuTime}
                          updateEventTime={updateEventTime}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="grid grid-cols-9 gap-0"
              key={currentDate.toISOString()}
            >
              <div className="col-span-1 flex items-center justify-center border-border border-r border-b bg-card py-2">
                <span className="font-medium text-muted-foreground text-xs">
                  GMT {new Date().getTimezoneOffset() > 0 ? '-' : '+'}
                  {Math.abs(new Date().getTimezoneOffset() / 60)}
                </span>
              </div>

              <WeekHeader
                colWidth={colWidth}
                currentDate={date}
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
                    <div
                      className={`flex h-[64px] cursor-pointer items-start justify-center border-border px-3 py-2 text-left text-muted-foreground text-xs ${
                        index < hours.length - 1 ? 'border-b' : ''
                      }`}
                      key={`hour-${index}`}
                    >
                      {hour}
                    </div>
                  ))}
                </div>

                <div
                  className="col-span-8 grid h-full"
                  style={{
                    gridTemplateColumns: colWidth.map((w) => `${w}fr`).join(' '),
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
                        session={{ user: isSignedIn ? clerkUser : null }}
                        setContextMenuTime={setContextMenuTime}
                        updateEventTime={updateEventTime}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </SignedIn>
    </div>
  );
}
