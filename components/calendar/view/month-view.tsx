'use client';

import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo } from 'react';
import { MonthDayCell } from '@/components/calendar/month/month-day-cell';
import { EventCard } from '@/components/event/cards/event-card';
import { Button } from '@/components/ui/button';
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

const pageTransitionVariants = {
  enter: () => ({ opacity: 0 }),
  center: { opacity: 1 },
  exit: () => ({
    opacity: 0,
    transition: { opacity: { duration: 0.2, ease: 'easeInOut' } },
  }),
};

export default function MonthView() {
  const {
    currentDate,
    navigationDirection,
    openEventSidebarForNewEvent,
    events,
    toggleChatSidebar,
    googleEvents,
    visibleCalendarIds,
    setGoogleEvents,
  } = useCalendarStore((state) => state);
  const { user: clerkUser, isSignedIn } = useUser();
  const { refreshEvents } = useGoogleCalendarRefresh();
  const [selectedEvents, setSelectedEvents] = React.useState<Event[]>([]);
  const [isEventsDialogOpen, setIsEventsDialogOpen] = React.useState(false);
  const direction = navigationDirection;
  const weekStartsOn = 'sunday' as 'sunday' | 'monday';

  const date =
    currentDate instanceof Date ? currentDate : new Date(currentDate);
  const daysInMonthArray = getDaysInMonth(date.getMonth(), date.getFullYear());

  useEffect(() => {
    if (clerkUser?.id) {
      if (visibleCalendarIds.length > 0) {
        refreshEvents();
      } else {
        // Clear events when no calendars are visible
        setGoogleEvents([]);
      }
    }
  }, [refreshEvents, clerkUser?.id, visibleCalendarIds, setGoogleEvents]);

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

  const daysOfWeek =
    weekStartsOn === 'monday'
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const startOffset =
    (firstDayOfMonth.getDay() - (weekStartsOn === 'monday' ? 1 : 0) + 7) % 7;
  const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  const lastDateOfPrevMonth = new Date(
    prevMonth.getFullYear(),
    prevMonth.getMonth() + 1,
    0
  ).getDate();

  return (
    <div>
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
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            animate="center"
            className="grid grid-cols-7 gap-1 sm:gap-2"
            custom={direction}
            exit="exit"
            initial="enter"
            key={`${date.getFullYear()}-${date.getMonth()}`}
            variants={{
              ...pageTransitionVariants,
              center: {
                ...pageTransitionVariants.center,
                transition: {
                  opacity: { duration: 0.2 },
                  staggerChildren: 0.02,
                },
              },
            }}
          >
            {daysOfWeek.map((day, idx) => (
              <div
                className="my-8 text-left font-medium text-4xl tracking-tighter"
                key={idx}
              >
                {day}
              </div>
            ))}

            {Array.from({ length: startOffset }).map((_, idx) => (
              <div className="h-[150px] opacity-50" key={`offset-${idx}`}>
                <div className="relative mb-1 font-semibold text-3xl">
                  {lastDateOfPrevMonth - startOffset + idx + 1}
                </div>
              </div>
            ))}

            {daysInMonthArray.map((day) => {
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
                />
              );
            })}
          </motion.div>
        </AnimatePresence>

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
