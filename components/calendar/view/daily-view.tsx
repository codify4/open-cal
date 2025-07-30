"use client";

import React, { useRef, useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";


import { Event } from "@/lib/store/calendar-store";
import { Badge } from "@/components/ui/badge";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { EventCard } from "@/components/event/cards/event-card";
import { Plus, Sparkles } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useDroppable } from "@dnd-kit/core";

interface TimeSlotProps {
  timeSlotId: string;
  hourIndex: number;
  date: Date;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ timeSlotId, hourIndex, date }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: timeSlotId,
    data: {
      hourIndex,
      date
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-full h-[64px] relative transition duration-300 border-b border-default-200 z-10 ${
        isOver ? 'bg-blue-500/20' : ''
      }`}
    >
    </div>
  );
};

// Generate hours in 12-hour format
const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  const ampm = i < 12 ? "AM" : "PM";
  return `${hour}:00 ${ampm}`;
});

// Animation variants
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
  enter: (direction: number) => ({
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    transition: {
      opacity: { duration: 0.2, ease: "easeInOut" },
    },
  }),
};

// Precise time-based event grouping function
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
  
  const buildOverlapGraph = (events: Event[]) => {
    const graph: Record<string, string[]> = {};
    
    events.forEach(event => {
      graph[event.id] = [];
    });
    
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        if (eventsOverlap(events[i], events[j])) {
          graph[events[i].id].push(events[j].id);
          graph[events[j].id].push(events[i].id);
        }
      }
    }
    
    return graph;
  };
  
  const findConnectedComponents = (graph: Record<string, string[]>, events: Event[]) => {
    const visited: Record<string, boolean> = {};
    const components: Event[][] = [];
    
    const dfs = (nodeId: string, component: string[]) => {
      visited[nodeId] = true;
      component.push(nodeId);
      
      for (const neighbor of graph[nodeId]) {
        if (!visited[neighbor]) {
          dfs(neighbor, component);
        }
      }
    };
    
    for (const event of events) {
      if (!visited[event.id]) {
        const component: string[] = [];
        dfs(event.id, component);
        components.push(component.map(id => events.find(e => e.id === id)!));
      }
    }
    
    return components;
  };
  
  const graph = buildOverlapGraph(sortedEvents);
  return findConnectedComponents(graph, sortedEvents);
};

export default function DailyView({ stopDayEventSummary }: { stopDayEventSummary?: boolean }) {
  const hoursColumnRef = useRef<HTMLDivElement>(null);
  const [detailedHour, setDetailedHour] = useState<string | null>(null);
  const [timelinePosition, setTimelinePosition] = useState<number>(0);
  const [contextMenuTime, setContextMenuTime] = useState<string | null>(null);
  const { currentDate, navigationDirection, openEventSidebarForNewEvent, events, toggleChatSidebar } = useCalendarStore((state) => state);

  // Use Zustand store data instead of mock data
  const direction = navigationDirection;

  // Ensure currentDate is a Date object
  const date = currentDate instanceof Date ? currentDate : new Date(currentDate);

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
      const ampm = hour < 12 ? "AM" : "PM";
      setDetailedHour(
        `${hour12}:${Math.max(0, minutes).toString().padStart(2, "0")} ${ampm}`
      );

      const position = Math.max(0, Math.min(rect.height, Math.round(y)));
      setTimelinePosition(position);
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
    const ampm = hour < 12 ? "AM" : "PM";
    const timeString = `${hour12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    setContextMenuTime(timeString);
  }, []);

  // Function to get events for day
  const getEventsForDay = useCallback((day: number, currentDate: Date) => {
    const dayEvents = events.filter((event: Event) => {
      const eventDate = new Date(event.startDate)
      const matches = eventDate.getDate() === day && 
             eventDate.getMonth() === currentDate.getMonth() && 
             eventDate.getFullYear() === currentDate.getFullYear()
      return matches
    })
    return dayEvents
  }, [events])

  const dayEvents = getEventsForDay(
    date.getDate(),
    date
  );
  
  const timeGroups = groupEventsByTimePeriod(dayEvents);

  function handleAddEventDay(detailedHour: string) {
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

    const targetDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes
    );

    openEventSidebarForNewEvent(targetDate);
  }

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

    if (event.startDate instanceof Date && event.endDate instanceof Date) {
      const startTime =
        event.startDate.getHours() * 60 + event.startDate.getMinutes();
      const endTime =
        event.endDate.getHours() * 60 + event.endDate.getMinutes();

      const diffInMinutes = endTime - startTime;

      eventHeight = (diffInMinutes / 60) * 64;

      const eventStartHour =
        event.startDate.getHours() + event.startDate.getMinutes() / 60;

      const dayEndHour = 24;

      maxHeight = Math.max(0, (dayEndHour - eventStartHour) * 64);

      eventHeight = Math.min(eventHeight, maxHeight);

      eventTop = eventStartHour * 64;
    } else {
      console.error("Invalid event or missing start/end dates.");
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
    <div className="mt-0">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentDate.toISOString()}
          custom={direction}
          variants={pageTransitionVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="flex flex-col gap-4"
        >

          <div className="relative rounded-md bg-default-50 hover:bg-default-100 transition duration-400">
            <motion.div
              className="relative rounded-xl flex ease-in-out"
              ref={hoursColumnRef}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setDetailedHour(null)}
            >
              <div className="flex  flex-col">
                {hours.map((hour, index) => (
                  <motion.div
                    key={`hour-${index}`}
                    variants={itemVariants}
                    className="cursor-pointer   transition duration-300  p-4 h-[64px] text-left text-sm text-muted-foreground border-default-200"
                  >
                    {hour}
                  </motion.div>
                ))}
              </div>
              <div className="flex relative flex-grow flex-col ">
                {Array.from({ length: 24 }).map((_, index) => {
                   const timeSlotId = `hour-${index}`;
                   
                   return (
                     <ContextMenu key={`hour-${index}`}>
                       <ContextMenuTrigger asChild>
                         <div
                           onContextMenu={handleContextMenuOpen}
                         >
                           <TimeSlot
                             timeSlotId={timeSlotId}
                             hourIndex={index}
                             date={date}
                           />
                         </div>
                       </ContextMenuTrigger>
                       <ContextMenuContent className="bg-neutral-950 w-40">
                         <ContextMenuItem
                           className="cursor-pointer py-2"
                           onClick={() => {
                             const timeToUse = contextMenuTime || detailedHour || "12:00 PM";
                             handleAddEventDay(timeToUse);
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
                <AnimatePresence initial={false}>
                  {dayEvents && dayEvents?.length
                    ? dayEvents?.map((event: Event, eventIndex: number) => {
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
                        
                        const {
                          height,
                          left,
                          maxWidth,
                          minWidth,
                          top,
                          zIndex,
                        } = handleEventStyling(
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
                              top: top,
                              left: left,
                              maxWidth: maxWidth,
                              minWidth: minWidth,
                              padding: "0 2px",
                              boxSizing: "border-box",
                              zIndex: zIndex + 1000, // Ensure events are above time slots
                            }}
                            className="flex transition-all duration-1000 flex-grow flex-col absolute"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                          >
                            <EventCard 
                              event={event}
                            />
                          </motion.div>
                        );
                      })
                    : ""}
                </AnimatePresence>
              </div>
            </motion.div>

            {detailedHour && (
              <div
                className="absolute left-[100px] w-[calc(100%-53px)] h-[2px] bg-primary/40 rounded-full pointer-events-none"
                style={{ top: `${timelinePosition}px` }}
              >
                <Badge
                  variant="outline"
                  className="absolute -translate-y-1/2 bg-neutral-800 z-50 left-[5px] text-xs text-white"
                >
                  {detailedHour}
                </Badge>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
