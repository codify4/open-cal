'use client';

import { SignedIn, useUser } from '@clerk/nextjs';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MonthDayCell } from '@/components/calendar/month/month-day-cell';
import { EventCard } from '@/components/event/cards/event-card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGoogleCalendarRefresh } from '@/hooks/use-google-calendar-refresh';
import {
  getDaysInMonth,
  getEventsForDay,
} from '@/lib/calendar-utils/calendar-view-utils';
import type { Event } from '@/lib/store/calendar-store';
import { useCalendarStore } from '@/providers/calendar-store-provider';

export default function MonthView() {
  const hasRefreshedRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const {
    currentDate,
    openEventSidebarForNewEvent,
    events,
    toggleChatSidebar,
    googleEvents,
    visibleCalendarIds,
    setGoogleEvents,
    weekStartsOn,
  } = useCalendarStore((state) => state);
  const { user: clerkUser, isSignedIn } = useUser();
  const { refreshEvents } = useGoogleCalendarRefresh();
  const [selectedEvents, setSelectedEvents] = React.useState<Event[]>([]);
  const [isEventsDialogOpen, setIsEventsDialogOpen] = React.useState(false);

  const date = currentDate instanceof Date ? currentDate : new Date(currentDate);
  const daysInMonthArray = getDaysInMonth(date.getMonth(), date.getFullYear());

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
  }, [visibleCalendarIds.join(',')]);

  useEffect(() => {
    if (isMobile && scrollContainerRef.current) {
      const today = new Date();
      const currentDayOfWeek = today.getDay();
      const startDay = weekStartsOn === 'monday' ? 1 : 0;
      const adjustedDayIndex = (currentDayOfWeek - startDay + 7) % 7;
      const dayWidth = scrollContainerRef.current.scrollWidth / 7;
      const scrollPosition = adjustedDayIndex * dayWidth - (scrollContainerRef.current.clientWidth / 2) + (dayWidth / 2);
      
      scrollContainerRef.current.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  }, [isMobile, weekStartsOn]);

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
  }, [events, googleEvents, visibleCalendarIds]);

  const getStartOffset = () => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    return (firstDayOfMonth.getDay() - (weekStartsOn === 'monday' ? 1 : 0) + 7) % 7;
  };

  const getEventsForDayNumber = (day: number): Event[] => {
    const targetDate = new Date(date.getFullYear(), date.getMonth(), day);
    return getEventsForDay(allEvents, targetDate);
  };

  const handleAddEvent = (selectedDay: number) => {
    if (!isSignedIn) {
      return;
    }
    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      selectedDay,
      0,
      0,
      0
    );
    openEventSidebarForNewEvent(startDate);
  };

  const handleContextMenuAddEvent = (selectedDay: number) => {
    if (!isSignedIn) {
      return;
    }
    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      selectedDay,
      12,
      0,
      0
    );
    openEventSidebarForNewEvent(startDate);
  };

  const daysOfWeek = weekStartsOn === 'monday'
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const startOffset = getStartOffset();
  const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  const lastDateOfPrevMonth = new Date(
    prevMonth.getFullYear(),
    prevMonth.getMonth() + 1,
    0
  ).getDate();

  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  const daysInNextMonth = new Date(
    nextMonth.getFullYear(),
    nextMonth.getMonth() + 1,
    0
  ).getDate();

  const totalCells = 42; // 6 weeks * 7 days
  const nextMonthDaysNeeded = totalCells - startOffset - daysInMonthArray.length;

  return (
    <div className=''>
      <SignedIn>
        <div className='h-full'>
          {isMobile ? (
            <div className="overflow-x-auto h-full" ref={scrollContainerRef}>
              <div className="grid grid-cols-7 min-w-[1500px]">
                {daysOfWeek.map((day, idx) => (
                  <div
                    className="sticky top-0 z-10 p-3 text-center font-medium text-sm tracking-tight border-b border-border bg-muted/30"
                    key={idx}
                  >
                    {day}
                  </div>
                ))}

                {Array.from({ length: startOffset }).map((_, idx) => (
                  <div className="h-[120px] opacity-80 border-r border-border last:border-r-0" key={`offset-${idx}`}>
                    <div className="relative p-2 font-medium text-sm text-muted-foreground">
                      {lastDateOfPrevMonth - startOffset + idx + 1}
                    </div>
                  </div>
                ))}

                {daysInMonthArray.map((day, dayIndex) => {
                  const dayEventsForCell = getEventsForDayNumber(day);
                  const cellDate = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    day
                  );
                  const isToday =
                    new Date().getDate() === day &&
                    new Date().getMonth() === date.getMonth() &&
                    new Date().getFullYear() === date.getFullYear();
                  const isLastInRow = (dayIndex + startOffset + 1) % 7 === 0;
                  return (
                    <MonthDayCell
                      cellDate={cellDate}
                      dayEvents={dayEventsForCell}
                      dayNumber={day}
                      isToday={isToday}
                      key={`day-${day}`}
                      onAddEvent={handleAddEvent}
                      onAskAI={() => toggleChatSidebar()}
                      onContextMenuAddEvent={handleContextMenuAddEvent}
                      sessionPresent={isSignedIn!}
                      isLastInRow={isLastInRow}
                    />
                  );
                })}

                {Array.from({ length: nextMonthDaysNeeded }).map((_, idx) => (
                    <div className="h-[150px] opacity-80 border-b border-r border-border last:border-r-0" key={`next-month-${idx}`}>
                        <div className="relative p-2 font-medium text-sm text-muted-foreground">
                            {idx + 1}
                        </div>
                    </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="grid grid-cols-7 overflow-hidden h-full"
              key={`${date.getFullYear()}-${date.getMonth()}`}
            >
              {daysOfWeek.map((day, idx) => (
                <div
                  className="sticky top-0 z-10 max-h-[50px] p-2 text-center font-medium text-sm tracking-tight border-b border-border bg-muted/30 last:border-r-0"
                  key={idx}
                >
                  {day}
                </div>
              ))}

              {Array.from({ length: startOffset }).map((_, idx) => (
                <div className="h-[150px] opacity-80 border-b border-r border-border last:border-b-0 last:border-r-0" key={`offset-${idx}`}>
                  <div className="relative p-2 font-medium text-sm text-muted-foreground">
                    {lastDateOfPrevMonth - startOffset + idx + 1}
                  </div>
                </div>
              ))}

              {daysInMonthArray.map((day, dayIndex) => {
                const dayEventsForCell = getEventsForDayNumber(day);
                const cellDate = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  day
                );
                const isToday =
                  new Date().getDate() === day &&
                  new Date().getMonth() === date.getMonth() &&
                  new Date().getFullYear() === date.getFullYear();
                const isLastInRow = (dayIndex + startOffset + 1) % 7 === 0;
                return (
                  <MonthDayCell
                    cellDate={cellDate}
                    dayEvents={dayEventsForCell}
                    dayNumber={day}
                    isToday={isToday}
                    key={`day-${day}`}
                    onAddEvent={handleAddEvent}
                    onAskAI={() => toggleChatSidebar()}
                    onContextMenuAddEvent={handleContextMenuAddEvent}
                    sessionPresent={isSignedIn!}
                    isLastInRow={isLastInRow}
                  />
                );
              })}

              {Array.from({ length: nextMonthDaysNeeded }).map((_, idx) => (
                <div className="h-[150px] opacity-80 border-b border-r border-border last:border-b-0 last:border-r-0" key={`next-month-${idx}`}>
                  <div className="relative p-2 font-medium text-sm text-muted-foreground">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Dialog onOpenChange={setIsEventsDialogOpen} open={isEventsDialogOpen}>
          <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto bg-neutral-950">
            <DialogHeader>
              <DialogTitle>
                Events for{' '}
                {selectedEvents.length > 0 &&
                  new Date(selectedEvents[0].startDate).toLocaleDateString(
                    'en-US',
                    {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              {selectedEvents.map((event) => (
                <EventCard event={event} key={event.id} />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </SignedIn>
    </div>
  );
}
