import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EventCard } from '@/components/event/cards/event-card';
import { Badge } from '@/components/ui/badge';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import type { Event } from '@/lib/store/calendar-store';
import { useCalendarStore, useCalendarStoreApi } from '@/providers/calendar-store-provider';
import { authClient } from '@/lib/auth-client';
import { useAction, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface TimeSlotProps {
  timeSlotId: string;
  dayIndex: number;
  hourIndex: number;
  date: Date;
}

const TimeSlot: React.FC<TimeSlotProps> = ({
  timeSlotId,
  dayIndex,
  hourIndex,
  date,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: timeSlotId,
    data: {
      dayIndex,
      hourIndex,
      date,
    },
  });

  return (
    <div
      className={`relative z-10 col-span-1 h-[64px] border-border border-r border-b text-center text-muted-foreground text-sm transition duration-300 ${isOver ? 'bg-primary/20' : ''}`}
      ref={setNodeRef}
    />
  );
};

const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  const ampm = i < 12 ? 'AM' : 'PM';
  return `${hour}:00 ${ampm}`;
});

const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.12 } },
};

const pageTransitionVariants = {
  enter: (direction: number) => ({
    opacity: 0,
  }),
  center: {
    opacity: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    transition: {
      opacity: { duration: 0.2, ease: 'easeInOut' },
    },
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
    currentDate,
    navigationDirection,
    events,
    updateEventTime,
  } = useCalendarStore((state) => state);
  const { data: session } = authClient.useSession();
  const calendarStoreApi = useCalendarStoreApi();
  const accounts = useQuery(api.google.getAccounts, {});
  const listCalendarsAction = useAction(api.google.listCalendars);
  const listEventsAction = useAction(api.google.listEvents);

  const direction = navigationDirection;
  const weekStartsOn = 'monday';

  const date =
    currentDate instanceof Date ? currentDate : new Date(currentDate);

  const getDaysInWeek = useCallback(
    (week: number, year: number) => {
      const startDay = weekStartsOn === 'monday' ? 1 : 0;
      const currentDayOfWeek = date.getDay();
      const daysToSubtract = (currentDayOfWeek - startDay + 7) % 7;
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - daysToSubtract);

      const days = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        days.push(day);
      }
      return days;
    },
    [date]
  );

  const daysOfWeek = useMemo(
    () => getDaysInWeek(1, date.getFullYear()),
    [getDaysInWeek, date]
  );

  const getWeekNumber = useCallback(
    (date: Date) => {
      const startDay = weekStartsOn === 'monday' ? 1 : 0;
      const yearStart = new Date(date.getFullYear(), 0, 1);
      const daysSinceYearStart = Math.floor(
        (date.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000)
      );
      const weekNumber = Math.floor(
        (daysSinceYearStart + yearStart.getDay() - startDay + 7) / 7
      );
      return weekNumber;
    },
    [weekStartsOn]
  );

  const getDayName = useCallback((day: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[day];
  }, []);

  const getEventsForDay = useCallback(
    (dayIndex: number) => {
      const targetDate = daysOfWeek[dayIndex];
      const source = session ? events : [];
      const dayEvents = source.filter((event) => {
        const eventDate = new Date(event.startDate);
        const eventEndDate = new Date(event.endDate);
        const matches =
          eventDate.getDate() === targetDate.getDate() &&
          eventDate.getMonth() === targetDate.getMonth() &&
          eventDate.getFullYear() === targetDate.getFullYear();
        
        const isAllDay = event.isAllDay || 
          (eventDate.getHours() === 0 && eventDate.getMinutes() === 0 &&
           eventEndDate.getHours() === 23 && eventEndDate.getMinutes() === 59) ||
          event.type === 'birthday';
        
        return matches && !isAllDay;
      });
      return dayEvents;
    },
    [events, daysOfWeek, session]
  );

  const getAllDayEventsForDay = useCallback(
    (dayIndex: number) => {
      const targetDate = daysOfWeek[dayIndex];
      const source = session ? events : [];
      const dayEvents = source.filter((event) => {
        const eventDate = new Date(event.startDate);
        const eventEndDate = new Date(event.endDate);
        const matches =
          eventDate.getDate() === targetDate.getDate() &&
          eventDate.getMonth() === targetDate.getMonth() &&
          eventDate.getFullYear() === targetDate.getFullYear();
        
        const isAllDay = event.isAllDay || 
          (eventDate.getHours() === 0 && eventDate.getMinutes() === 0 &&
           eventEndDate.getHours() === 23 && eventEndDate.getMinutes() === 59) ||
          event.type === 'birthday';
        
        return matches && isAllDay;
      });
      return dayEvents;
    },
    [events, daysOfWeek, session]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!hoursColumnRef.current) return;
      const rect = hoursColumnRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const hourHeight = rect.height / 24;
      const hour = Math.max(0, Math.min(23, Math.floor(y / hourHeight)));
      const minuteFraction = (y % hourHeight) / hourHeight;
      const minutes = Math.floor(minuteFraction * 60);

      const hour12 = hour % 12 || 12;
      const ampm = hour < 12 ? 'AM' : 'PM';
      setDetailedHour(
        `${hour12}:${Math.max(0, minutes).toString().padStart(2, '0')} ${ampm}`
      );

      const allDayRowHeight = 32;
      const adjustedY = y - allDayRowHeight;
      const position = Math.max(0, Math.min(rect.height - allDayRowHeight, Math.round(adjustedY)));
      setTimelinePosition(position + allDayRowHeight);
    },
    []
  );

  const handleContextMenuOpen = useCallback((e: React.MouseEvent) => {
    if (!hoursColumnRef.current) return;
    const rect = hoursColumnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const hourHeight = rect.height / 24;
    const hour = Math.max(0, Math.min(23, Math.floor(y / hourHeight)));
    const minuteFraction = (y % hourHeight) / hourHeight;
    const minutes = Math.floor(minuteFraction * 60);

    const hour12 = hour % 12 || 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    const timeString = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    setContextMenuTime(timeString);
  }, []);

  function handleAddEventWeek(dayIndex: number, detailedHour: string) {
    if (!session) {
      authClient.signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/calendar`,
        errorCallbackURL: `${window.location.origin}/calendar`,
        newUserCallbackURL: `${window.location.origin}/calendar`,
      });
      return;
    }
    if (!detailedHour) {
      console.error('Detailed hour not provided.');
      return;
    }

    const [timePart, ampm] = detailedHour.split(' ');
    const [hourStr, minuteStr] = timePart.split(':');
    let hours = Number.parseInt(hourStr);
    const minutes = Number.parseInt(minuteStr);

    if (ampm === 'PM' && hours < 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }

    const chosenDay = daysOfWeek[dayIndex % 7].getDate();

    if (chosenDay < 1 || chosenDay > 31) {
      console.error('Invalid day selected:', chosenDay);
      return;
    }

    const targetDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      chosenDay,
      hours,
      minutes
    );

    openEventSidebarForNewEvent(targetDate);
  }

  useEffect(() => {
    if (!session || !accounts || accounts.length === 0) return;
    const account = accounts[0];
    const timeMin = new Date(daysOfWeek[0]);
    timeMin.setHours(0, 0, 0, 0);
    const timeMax = new Date(daysOfWeek[6]);
    timeMax.setHours(23, 59, 0, 0);
    listCalendarsAction({ accountId: account._id })
      .then(async (cals) => {
        const calendars = (cals as any[]) || [];
        const allEvents: Event[] = [] as any;
        for (const cal of calendars) {
          const items = await listEventsAction({
            accountId: account._id,
            calendarId: cal.id,
            timeMin: timeMin.toISOString(),
            timeMax: timeMax.toISOString(),
          });
          allEvents.push(...((items as any[]) || []));
        }
        // Deduplicate by id
        const map: Record<string, Event> = {} as any;
        for (const ev of allEvents) map[ev.id] = ev as any;
        calendarStoreApi.setState({ events: Object.values(map) });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, accounts, daysOfWeek[0]?.toISOString(), daysOfWeek[6]?.toISOString()]);

  const groupEventsByTimePeriod = (events: Event[] | undefined) => {
    if (!events || events.length === 0) return [];

    const sortedEvents = [...events].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    const eventsOverlap = (event1: Event, event2: Event) => {
      const start1 = new Date(event1.startDate).getTime();
      const end1 = new Date(event1.endDate).getTime();
      const start2 = new Date(event2.startDate).getTime();
      const end2 = new Date(event2.endDate).getTime();

      return start1 < end2 && start2 < end1;
    };

    const graph: Record<string, Set<string>> = {};

    for (const event of sortedEvents) {
      graph[event.id] = new Set<string>();
    }

    for (let i = 0; i < sortedEvents.length; i++) {
      for (let j = i + 1; j < sortedEvents.length; j++) {
        if (eventsOverlap(sortedEvents[i], sortedEvents[j])) {
          graph[sortedEvents[i].id].add(sortedEvents[j].id);
          graph[sortedEvents[j].id].add(sortedEvents[i].id);
        }
      }
    }

    const visited = new Set<string>();
    const groups: Event[][] = [];

    for (const event of sortedEvents) {
      if (!visited.has(event.id)) {
        const group: Event[] = [];
        const stack: Event[] = [event];
        visited.add(event.id);

        while (stack.length > 0) {
          const current = stack.pop()!;
          group.push(current);

          for (const neighborId of graph[current.id]) {
            if (!visited.has(neighborId)) {
              const neighbor = sortedEvents.find((e) => e.id === neighborId);
              if (neighbor) {
                stack.push(neighbor);
                visited.add(neighborId);
              }
            }
          }
        }

        group.sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );

        groups.push(group);
      }
    }

    return groups;
  };

  const handleEventStyling = (
    event: Event,
    dayEvents: Event[],
    periodOptions?: {
      eventsInSamePeriod?: number;
      periodIndex?: number;
      adjustForPeriod?: boolean;
    }
  ) => {
    const eventsOnHour = dayEvents.filter((e) => {
      if (e.id === event.id) return false;

      const eStart =
        e.startDate instanceof Date
          ? e.startDate.getTime()
          : new Date(e.startDate).getTime();
      const eEnd =
        e.endDate instanceof Date
          ? e.endDate.getTime()
          : new Date(e.endDate).getTime();
      const eventStart =
        event.startDate instanceof Date
          ? event.startDate.getTime()
          : new Date(event.startDate).getTime();
      const eventEnd =
        event.endDate instanceof Date
          ? event.endDate.getTime()
          : new Date(event.endDate).getTime();

      return eStart < eventEnd && eEnd > eventStart;
    });

    const allEventsInRange = [event, ...eventsOnHour];

    allEventsInRange.sort((a, b) => {
      const aStart =
        a.startDate instanceof Date
          ? a.startDate.getTime()
          : new Date(a.startDate).getTime();
      const bStart =
        b.startDate instanceof Date
          ? b.startDate.getTime()
          : new Date(b.startDate).getTime();
      return aStart - bStart;
    });

    const useCustomPeriod =
      periodOptions?.adjustForPeriod &&
      periodOptions.eventsInSamePeriod !== undefined &&
      periodOptions.periodIndex !== undefined;

    let numEventsOnHour = useCustomPeriod
      ? periodOptions!.eventsInSamePeriod!
      : allEventsInRange.length;
    let indexOnHour = useCustomPeriod
      ? periodOptions!.periodIndex!
      : allEventsInRange.indexOf(event);

    if (numEventsOnHour === 0 || indexOnHour === -1) {
      numEventsOnHour = 1;
      indexOnHour = 0;
    }

    let eventHeight = 0;
    let maxHeight = 0;
    let eventTop = 0;

    const startDate =
      event.startDate instanceof Date
        ? event.startDate
        : new Date(event.startDate);
    const endDate =
      event.endDate instanceof Date ? event.endDate : new Date(event.endDate);

    if (
      startDate &&
      endDate &&
      !isNaN(startDate.getTime()) &&
      !isNaN(endDate.getTime())
    ) {
      const startTime = startDate.getHours() * 60 + startDate.getMinutes();
      const endTime = endDate.getHours() * 60 + endDate.getMinutes();

      const diffInMinutes = endTime - startTime;

      eventHeight = (diffInMinutes / 60) * 64;

      const eventStartHour = startDate.getHours() + startDate.getMinutes() / 60;

      const dayEndHour = 24;

      maxHeight = Math.max(0, (dayEndHour - eventStartHour) * 64);

      eventHeight = Math.min(eventHeight, maxHeight);

      eventTop = eventStartHour * 64;
    } else {
      return {
        height: '20px',
        top: '0px',
        zIndex: 1,
        left: '0%',
        maxWidth: '95%',
        minWidth: '95%',
      };
    }

    const widthPercentage = Math.min(95 / Math.max(numEventsOnHour, 1), 95);

    const leftPosition = indexOnHour * (widthPercentage + 1);

    const safeLeftPosition = Math.min(leftPosition, 100 - widthPercentage);

    const minimumHeight = 20;

    return {
      height: `${
        eventHeight < minimumHeight
          ? minimumHeight
          : eventHeight > maxHeight
            ? maxHeight
            : eventHeight
      }px`,
      top: `${eventTop}px`,
      zIndex: indexOnHour + 1,
      left: `${safeLeftPosition}%`,
      maxWidth: `${widthPercentage}%`,
      minWidth: `${widthPercentage}%`,
    };
  };

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
          transition={{
            opacity: { duration: 0.2 },
          }}
          variants={pageTransitionVariants}
        >
          <div className="col-span-1 flex items-center justify-center border-border border-r border-b bg-card py-2">
            <span className="font-medium text-muted-foreground text-xs">
              Time
            </span>
          </div>

          <div className="relative col-span-8 flex flex-col">
            <div
              className="sticky top-0 z-40 grid flex-grow gap-0 border-border border-b bg-card backdrop-blur"
              style={{
                gridTemplateColumns: colWidth.map((w) => `${w}fr`).join(' '),
                transition: isResizing
                  ? 'none'
                  : 'grid-template-columns 0.3s ease-in-out',
              }}
            >
              {daysOfWeek.map((day, idx) => (
                <div className="group relative flex flex-col" key={idx}>
                  <div className="flex flex-grow items-center justify-center border-border border-r bg-card py-2">
                    <div className="text-center">
                      <div
                        className={clsx(
                          'font-medium text-muted-foreground text-xs',
                          new Date().getDate() === day.getDate() &&
                            new Date().getMonth() === currentDate.getMonth() &&
                            new Date().getFullYear() ===
                              currentDate.getFullYear()
                            ? 'text-destructive'
                            : ''
                        )}
                      >
                        {getDayName(day.getDay())},{' '}
                        {day.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="grid gap-0 border-border border-b bg-card/50"
              style={{
                gridTemplateColumns: colWidth.map((w) => `${w}fr`).join(' '),
                transition: isResizing
                  ? 'none'
                  : 'grid-template-columns 0.3s ease-in-out',
              }}
            >
              {daysOfWeek.map((day, dayIndex) => {
                const allDayEvents = getAllDayEventsForDay(dayIndex);
                const maxVisibleEvents = 3;
                const hasMoreEvents = allDayEvents.length > maxVisibleEvents;
                const visibleEvents = allDayEvents.slice(0, maxVisibleEvents);

                return (
                  <div
                    className="relative min-h-[32px] border-border border-r p-1"
                    key={`allday-${dayIndex}`}
                  >
                    <div className="flex flex-col gap-1">
                      {visibleEvents.map((event, eventIndex) => (
                        <motion.div
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex-shrink-0"
                          exit={{ opacity: 0, scale: 0.9 }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          key={event.id}
                          transition={{ duration: 0.2 }}
                        >
                          <EventCard
                            event={event}
                            minimized={true}
                            onResize={(
                              eventId,
                              newStartDate,
                              newEndDate
                            ) => {
                              updateEventTime(
                                eventId,
                                newStartDate,
                                newEndDate
                              );
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

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
                transition: isResizing
                  ? 'none'
                  : 'grid-template-columns 0.3s ease-in-out',
              }}
            >
              {detailedHour && (
                <div
                  className="pointer-events-none absolute left-0 z-50 flex h-[1px] w-full rounded-full bg-primary/40"
                  style={{ top: `${timelinePosition}px` }}
                >
                  <Badge
                    className="-translate-y-1/2 absolute left-[5px] z-50 bg-card text-card-foreground text-xs"
                    variant="outline"
                  >
                    {detailedHour}
                  </Badge>
                </div>
              )}
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const dayEvents = getEventsForDay(dayIndex);

                const timeGroups = groupEventsByTimePeriod(dayEvents);

                const eventsCount = dayEvents?.length || 0;
                const maxEventsToShow = 10;
                const hasMoreEvents = eventsCount > maxEventsToShow;

                const visibleEvents = hasMoreEvents
                  ? dayEvents?.slice(0, maxEventsToShow - 1)
                  : dayEvents;

                return (
                  <ContextMenu key={`day-${dayIndex}`}>
                    <ContextMenuTrigger asChild>
                      <div
                        className="relative z-20 col-span-1 overflow-hidden border-border border-r border-b text-center text-muted-foreground text-sm transition duration-300"
                        onContextMenu={handleContextMenuOpen}
                      >
                        <AnimatePresence initial={false}>
                          {visibleEvents?.map((event, eventIndex) => {
                            let eventsInSamePeriod = 1;
                            let periodIndex = 0;

                            for (let i = 0; i < timeGroups.length; i++) {
                              const groupIndex = timeGroups[i].findIndex(
                                (e) => e.id === event.id
                              );
                              if (groupIndex !== -1) {
                                eventsInSamePeriod = timeGroups[i].length;
                                periodIndex = groupIndex;
                                break;
                              }
                            }

                            const {
                              height,
                              left,
                              maxWidth,
                              minWidth,
                              top,
                              zIndex,
                            } = handleEventStyling(event, dayEvents, {
                              eventsInSamePeriod,
                              periodIndex,
                              adjustForPeriod: true,
                            });

                            return (
                              <motion.div
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute flex flex-grow flex-col transition-all duration-1000"
                                exit={{ opacity: 0, scale: 0.9 }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                key={event.id}
                                style={{
                                  minHeight: height,
                                  height,
                                  top,
                                  left,
                                  maxWidth,
                                  minWidth,
                                  padding: '0 2px',
                                  boxSizing: 'border-box',
                                  zIndex: zIndex + 1000,
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <EventCard
                                  event={event}
                                  onResize={(
                                    eventId,
                                    newStartDate,
                                    newEndDate
                                  ) => {
                                    updateEventTime(
                                      eventId,
                                      newStartDate,
                                      newEndDate
                                    );
                                  }}
                                />
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>

                        {Array.from({ length: 24 }, (_, hourIndex) => {
                          const timeSlotId = `day-${dayIndex}-hour-${hourIndex}`;

                          return (
                            <TimeSlot
                              date={daysOfWeek[dayIndex]}
                              dayIndex={dayIndex}
                              hourIndex={hourIndex}
                              key={timeSlotId}
                              timeSlotId={timeSlotId}
                            />
                          );
                        })}
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-40 bg-popover">
                      <ContextMenuItem
                        className="cursor-pointer py-2"
                        onClick={() => {
                          const timeToUse =
                            contextMenuTime || detailedHour || '12:00 PM';
                          handleAddEventWeek(dayIndex, timeToUse);
                          setContextMenuTime(null);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Event
                      </ContextMenuItem>
                      <ContextMenuItem
                        className="cursor-pointer py-2"
                        onClick={() => {
                          if (!session) {
                            authClient.signIn.social({
                              provider: 'google',
                              callbackURL: `${window.location.origin}/calendar`,
                              errorCallbackURL: `${window.location.origin}/calendar`,
                              newUserCallbackURL: `${window.location.origin}/calendar`,
                            });
                          } else {
                            toggleChatSidebar();
                          }
                          setContextMenuTime(null);
                        }}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Ask AI
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
