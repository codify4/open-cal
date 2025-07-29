import React, { useRef, useState, useCallback, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import { EventCard } from "@/components/event/cards/event-card";
import { Maximize, Plus, Sparkles } from "lucide-react";
import clsx from "clsx";
import { Event } from "@/lib/store/calendar-store";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { useDroppable } from "@dnd-kit/core";

const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  const ampm = i < 12 ? "AM" : "PM";
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
      opacity: { duration: 0.2, ease: "easeInOut" },
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
  const { toggleChatSidebar, openEventSidebarForNewEvent, currentDate, navigationDirection, events } = useCalendarStore((state) => state);

  const direction = navigationDirection;
  const weekStartsOn = "monday";

  // Ensure currentDate is a Date object
  const date = currentDate instanceof Date ? currentDate : new Date(currentDate);

  // Function to get days in week
  const getDaysInWeek = useCallback((week: number, year: number) => {
    const startDay = weekStartsOn === "monday" ? 0 : 1;
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
  }, [date]);

  const daysOfWeek = useMemo(() => getDaysInWeek(1, date.getFullYear()), [getDaysInWeek, date]);

  // Function to get week number
  const getWeekNumber = useCallback((date: Date) => {
    const startDay = weekStartsOn === "monday" ? 0 : 1;
    const yearStart = new Date(date.getFullYear(), 0, 1);
    const daysSinceYearStart = Math.floor((date.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.floor((daysSinceYearStart + yearStart.getDay() - startDay + 7) / 7);
    return weekNumber;
  }, [weekStartsOn]);

  // Function to get day name
  const getDayName = useCallback((day: number) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day];
  }, []);

  // Mock events for display
  const mockEvents: Event[] = [];

  // Function to get events for day
  const getEventsForDay = useCallback((day: number, currentDate: Date) => {
    
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.startDate)
      const matches = eventDate.getDate() === day && 
             eventDate.getMonth() === currentDate.getMonth() && 
             eventDate.getFullYear() === currentDate.getFullYear()
      return matches
    })
    return dayEvents
  }, [events])

  // Remove the problematic useEffect that was causing the infinite loop
  // useEffect(() => {
  //   setColWidth(Array(7).fill(1));
  // }, [currentDate]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!hoursColumnRef.current) return;
    const rect = hoursColumnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const hourHeight = rect.height / 24;
    const hour = Math.max(0, Math.min(23, Math.floor(y / hourHeight)));
    const minuteFraction = (y % hourHeight) / hourHeight;
    const minutes = Math.floor(minuteFraction * 60);
    
    const hour12 = hour % 12 || 12;
    const ampm = hour < 12 ? "AM" : "PM";
    const timeString = `${hour12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    setDetailedHour(timeString);
    
    const headerOffset = 83;
    const position = Math.max(0, Math.min(rect.height, Math.round(y))) + headerOffset;
    setTimelinePosition(position);
  }, []);

  const handleContextMenuOpen = useCallback((e: React.MouseEvent) => {
    if (!hoursColumnRef.current) return;
    const rect = hoursColumnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const hourHeight = rect.height / 24;
    const hour = Math.max(0, Math.min(23, Math.floor(y / hourHeight)));
    const minuteFraction = (y % hourHeight) / hourHeight;
    const minutes = Math.floor(minuteFraction * 60);
    
    const hour12 = hour % 12 || 12;
    const ampm = hour < 12 ? "AM" : "PM";
    const timeString = `${hour12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    setContextMenuTime(timeString);
  }, []);



  function handleAddEventWeek(dayIndex: number, detailedHour: string) {
    if (!detailedHour) {
      console.error("Detailed hour not provided.");
      return;
    }

    const [timePart, ampm] = detailedHour.split(" ");
    const [hourStr, minuteStr] = timePart.split(":");
    let hours = parseInt(hourStr);
    const minutes = parseInt(minuteStr);
    
    if (ampm === "PM" && hours < 12) {
      hours += 12;
    } else if (ampm === "AM" && hours === 12) {
      hours = 0;
    }

    const chosenDay = daysOfWeek[dayIndex % 7].getDate();

    if (chosenDay < 1 || chosenDay > 31) {
      console.error("Invalid day selected:", chosenDay);
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

  // Group events by time period to prevent splitting spaces within same time blocks
  const groupEventsByTimePeriod = (events: Event[] | undefined) => {
    if (!events || events.length === 0) return [];
    
    const sortedEvents = [...events].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    
    const eventsOverlap = (event1: Event, event2: Event) => {
      const start1 = new Date(event1.startDate).getTime();
      const end1 = new Date(event1.endDate).getTime();
      const start2 = new Date(event2.startDate).getTime();
      const end2 = new Date(event2.endDate).getTime();
      
      return (start1 < end2 && start2 < end1);
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
              const neighbor = sortedEvents.find(e => e.id === neighborId);
              if (neighbor) {
                stack.push(neighbor);
                visited.add(neighborId);
              }
            }
          }
        }
        
        group.sort((a, b) => 
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
        
        groups.push(group);
      }
    }
    
    return groups;
  };

  // Mock event styling function
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
      
      const eStart = e.startDate instanceof Date ? e.startDate.getTime() : new Date(e.startDate).getTime();
      const eEnd = e.endDate instanceof Date ? e.endDate.getTime() : new Date(e.endDate).getTime();
      const eventStart = event.startDate instanceof Date ? event.startDate.getTime() : new Date(event.startDate).getTime();
      const eventEnd = event.endDate instanceof Date ? event.endDate.getTime() : new Date(event.endDate).getTime();
      
      return (eStart < eventEnd && eEnd > eventStart);
    });

    const allEventsInRange = [event, ...eventsOnHour];

    allEventsInRange.sort((a, b) => {
      const aStart = a.startDate instanceof Date ? a.startDate.getTime() : new Date(a.startDate).getTime();
      const bStart = b.startDate instanceof Date ? b.startDate.getTime() : new Date(b.startDate).getTime();
      return aStart - bStart;
    });

    const useCustomPeriod = periodOptions?.adjustForPeriod && 
                           periodOptions.eventsInSamePeriod !== undefined && 
                           periodOptions.periodIndex !== undefined;
                           
    let numEventsOnHour = useCustomPeriod ? periodOptions!.eventsInSamePeriod! : allEventsInRange.length;
    let indexOnHour = useCustomPeriod ? periodOptions!.periodIndex! : allEventsInRange.indexOf(event);

    if (numEventsOnHour === 0 || indexOnHour === -1) {
      numEventsOnHour = 1;
      indexOnHour = 0;
    }

    let eventHeight = 0;
    let maxHeight = 0;
    let eventTop = 0;

    const startDate = event.startDate instanceof Date ? event.startDate : new Date(event.startDate);
    const endDate = event.endDate instanceof Date ? event.endDate : new Date(event.endDate);

    if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
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
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentDate.toISOString()}
          custom={direction}
          variants={pageTransitionVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            opacity: { duration: 0.2 },
          }}
          className={`grid use-automation-zoom-in grid-cols-8 gap-0`}
        >
          <div className="sticky top-0 left-0 z-30 bg-default-100 rounded-tl-lg h-full border-0 flex items-center justify-center bg-primary/10">
            <span className="text-xl tracking-tight font-semibold ">
              Week {getWeekNumber(currentDate)}
            </span>
          </div>

          <div className="col-span-7 flex flex-col relative">
            <div 
              className="grid gap-0 flex-grow bg-primary/10 rounded-r-lg" 
              style={{ 
                gridTemplateColumns: colWidth.map(w => `${w}fr`).join(' '),
                transition: isResizing ? 'none' : 'grid-template-columns 0.3s ease-in-out'
              }}
            >
              {daysOfWeek.map((day, idx) => (
                <div key={idx} className="relative group flex flex-col">
                  <div className="sticky bg-default-100 top-0 z-20 flex-grow flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="text-lg font-semibold">
                        {getDayName(day.getDay())}
                      </div>
                      <div
                        className={clsx(
                          "text-lg font-semibold",
                          new Date().getDate() === day.getDate() &&
                            new Date().getMonth() === currentDate.getMonth() &&
                            new Date().getFullYear() === currentDate.getFullYear()
                            ? "text-secondary-500"
                            : ""
                        )}
                      >
                        {day.getDate()}
                      </div>
                      
                      <div 
                        className="absolute top-5 right-10 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          
                          const selectedDay = new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            day.getDate()
                          );
                          
                          const dayEvents = getEventsForDay(
                            day.getDate(),
                            currentDate
                          );
                        }}
                      >
                        <Maximize size={16} className="text-muted-foreground hover:text-primary" />
                      </div>
                      
                    </div>
                  </div>
                  <div className="absolute top-12 right-0 w-px h-[calc(100%-3rem)]"></div>
                </div>
              ))}
            </div>

            {detailedHour && (
              <div
                className="absolute flex z-50 left-0 w-full h-[2px] bg-primary/40 rounded-full pointer-events-none"
                style={{ top: `${timelinePosition}px` }}
              >
                <Badge
                  variant="outline"
                  className="absolute -translate-y-1/2 bg-white z-50 left-[5px] text-xs text-black"
                >
                  {detailedHour}
                </Badge>
              </div>
            )}
          </div>

          <div
            ref={hoursColumnRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setDetailedHour(null)}
            className="relative grid grid-cols-8 col-span-8"
          >
            <div className="col-span-1 bg-default-50 hover:bg-default-100 transition duration-400">
              {hours.map((hour, index) => (
                <motion.div
                  key={`hour-${index}`}
                  variants={itemVariants}
                  className="cursor-pointer border-b border-default-200 p-[16px] h-[64px] text-center text-sm text-muted-foreground border-r"
                >
                  {hour}
                </motion.div>
              ))}
            </div>

            <div 
              className="col-span-7 bg-default-50 grid h-full" 
              style={{ 
                gridTemplateColumns: colWidth.map(w => `${w}fr`).join(' '),
                transition: isResizing ? 'none' : 'grid-template-columns 0.3s ease-in-out'
              }}
            >
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const dayEvents = getEventsForDay(
                  daysOfWeek[dayIndex % 7].getDate(),
                  currentDate
                );

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
                        className="col-span-1 border-default-200 z-20 relative transition duration-300 border-r border-b text-center text-sm text-muted-foreground overflow-hidden"
                        onContextMenu={handleContextMenuOpen}
                      >
                        <AnimatePresence initial={false}>
                          {visibleEvents?.map((event, eventIndex) => {
                            let eventsInSamePeriod = 1;
                            let periodIndex = 0;
                            
                            for (let i = 0; i < timeGroups.length; i++) {
                              const groupIndex = timeGroups[i].findIndex(e => e.id === event.id);
                              if (groupIndex !== -1) {
                                eventsInSamePeriod = timeGroups[i].length;
                                periodIndex = groupIndex;
                                break;
                              }
                            }
                            
                            const { height, left, maxWidth, minWidth, top, zIndex } =
                              handleEventStyling(
                                event, 
                                dayEvents, 
                                {
                                  eventsInSamePeriod,
                                  periodIndex,
                                  adjustForPeriod: true
                                }
                              );

                            return (
                              <motion.div
                                key={event.id}
                                style={{
                                  minHeight: height,
                                  height,
                                  top: top,
                                  left: left,
                                  maxWidth: maxWidth,
                                  minWidth: minWidth,
                                  padding: '0 2px',
                                  boxSizing: 'border-box',
                                }}
                                className="flex transition-all duration-1000 flex-grow flex-col z-50 absolute"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                              >
                                <EventCard
                                  event={event}
                                  minimized={true}
                                />
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                        
                        {Array.from({ length: 24 }, (_, hourIndex) => {
                          const timeSlotId = `day-${dayIndex}-hour-${hourIndex}`;
                          const { setNodeRef, isOver } = useDroppable({
                            id: timeSlotId,
                            data: {
                              dayIndex,
                              hourIndex,
                              date: daysOfWeek[dayIndex]
                            }
                          });

                          return (
                            <div
                              ref={setNodeRef}
                              key={timeSlotId}
                              className={`col-span-1 border-default-200 h-[64px] relative transition duration-300 border-r border-b text-center text-sm text-muted-foreground ${
                                isOver ? 'bg-blue-500/20' : ''
                              }`}
                            >
                            </div>
                          );
                        })}
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="bg-neutral-950 w-40">
                      <ContextMenuItem
                        className="cursor-pointer py-2"
                        onClick={() => {
                          const timeToUse = contextMenuTime || detailedHour || "12:00 PM";
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
                          toggleChatSidebar();
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
