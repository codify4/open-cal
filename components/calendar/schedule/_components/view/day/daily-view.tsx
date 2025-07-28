"use client";

import React, { useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { useAtom } from "jotai";
import { 
  isEventSidebarOpenAtom, 
  eventCreationContextAtom,
  selectedEventAtom
} from "@/lib/atoms/event-atom";
import { useScheduler } from "@/providers/schedular-provider";
import { useModal } from "@/providers/modal-context";
import AddEventModal from "@/components/calendar/schedule/_modals/add-event-modal";
import EventStyled from "../event-component/event-styled";
import { CustomEventModal, Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      staggerChildren: 0.05, // Stagger effect between children
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
  
  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  
  // Precise time overlap checking function
  const eventsOverlap = (event1: Event, event2: Event) => {
    const start1 = new Date(event1.startDate).getTime();
    const end1 = new Date(event1.endDate).getTime();
    const start2 = new Date(event2.startDate).getTime();
    const end2 = new Date(event2.endDate).getTime();
    
    // Strict time overlap - one event starts before the other ends
    return (start1 < end2 && start2 < end1);
  };
  
  // Use a graph-based approach to find connected components (overlapping event groups)
  const buildOverlapGraph = (events: Event[]) => {
    // Create adjacency list
    const graph: Record<string, string[]> = {};
    
    // Initialize graph
    events.forEach(event => {
      graph[event.id] = [];
    });
    
    // Build connections
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
  
  // Find connected components using DFS
  const findConnectedComponents = (graph: Record<string, string[]>, events: Event[]) => {
    const visited: Record<string, boolean> = {};
    const components: Event[][] = [];
    
    // DFS function to traverse the graph
    const dfs = (nodeId: string, component: string[]) => {
      visited[nodeId] = true;
      component.push(nodeId);
      
      for (const neighbor of graph[nodeId]) {
        if (!visited[neighbor]) {
          dfs(neighbor, component);
        }
      }
    };
    
    // Find all connected components
    for (const event of events) {
      if (!visited[event.id]) {
        const component: string[] = [];
        dfs(event.id, component);
        
        // Map IDs back to events
        const eventGroup = component.map(id => 
          events.find(e => e.id === id)!
        );
        
        components.push(eventGroup);
      }
    }
    
    return components;
  };
  
  // Build the overlap graph
  const graph = buildOverlapGraph(sortedEvents);
  
  // Find connected components (groups of overlapping events)
  const timeGroups = findConnectedComponents(graph, sortedEvents);
  
  // Sort events within each group by start time
  return timeGroups.map(group => 
    group.sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
  );
};

export default function DailyView({
  CustomEventComponent,
  CustomEventModal,
  stopDayEventSummary,
  classNames,
}: {
  CustomEventComponent?: React.FC<Event>;
  CustomEventModal?: CustomEventModal;
  stopDayEventSummary?: boolean;
  classNames?: { prev?: string; next?: string; addEvent?: string };
}) {
  const hoursColumnRef = useRef<HTMLDivElement>(null);
  const [detailedHour, setDetailedHour] = useState<string | null>(null);
  const [timelinePosition, setTimelinePosition] = useState<number>(0);
  const { setOpen } = useModal();
  const { getters, handlers } = useScheduler();
  
  // Sidebar state management
  const [isEventSidebarOpen, setIsEventSidebarOpen] = useAtom(isEventSidebarOpenAtom);
  const [eventCreationContext, setEventCreationContext] = useAtom(eventCreationContextAtom);
  const [selectedEvent, setSelectedEvent] = useAtom(selectedEventAtom);
  
  // Get current date and direction from scheduler provider
  const currentDate = getters.getCurrentDate ? getters.getCurrentDate() : new Date();
  const direction = getters.getDirection ? getters.getDirection() : 0;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!hoursColumnRef.current) return;
      const rect = hoursColumnRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const hourHeight = rect.height / 24;
      const hour = Math.max(0, Math.min(23, Math.floor(y / hourHeight)));
      const minuteFraction = (y % hourHeight) / hourHeight;
      const minutes = Math.floor(minuteFraction * 60);

      // Format in 12-hour format
      const hour12 = hour % 12 || 12;
      const ampm = hour < 12 ? "AM" : "PM";
      setDetailedHour(
        `${hour12}:${Math.max(0, minutes).toString().padStart(2, "0")} ${ampm}`
      );

      // Ensure timelinePosition is never negative and is within bounds
      const position = Math.max(0, Math.min(rect.height, Math.round(y)));
      setTimelinePosition(position);
    },
    []
  );

  const dayEvents = getters.getEventsForDay(
    currentDate?.getDate() || 0,
    currentDate
  );
  
  // Calculate time groups once for all events
  const timeGroups = groupEventsByTimePeriod(dayEvents);

  function handleAddEvent(event?: Event) {
    // Create the modal content with the provided event data or defaults
    const startDate = event?.startDate || new Date();
    const endDate = event?.endDate || new Date();

    // Open the modal with the content

    setOpen(
      <AddEventModal
        CustomAddEventModal={
          CustomEventModal?.CustomAddEventModal?.CustomForm
        }
      />,
      async () => {
        return {
          ...event,
          startDate,
          endDate,
        };
      }
    );
  }

  function handleAddEventDay(detailedHour: string) {
    if (!detailedHour) {
      console.error("Detailed hour not provided.");
      return;
    }

    // Parse the 12-hour format time
    const [timePart, ampm] = detailedHour.split(" ");
    const [hourStr, minuteStr] = timePart.split(":");
    let hours = parseInt(hourStr);
    const minutes = parseInt(minuteStr);

    // Convert to 24-hour format for Date object
    if (ampm === "PM" && hours < 12) {
      hours += 12;
    } else if (ampm === "AM" && hours === 12) {
      hours = 0;
    }

    const chosenDay = currentDate.getDate();

    // Ensure day is valid
    if (chosenDay < 1 || chosenDay > 31) {
      console.error("Invalid day selected:", chosenDay);
      return;
    }

    const targetDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      chosenDay,
      hours,
      minutes
    );

    // Format time for the sidebar (HH:MM format)
    const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const endTime = `${(hours + 1).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    // Set the event creation context for the sidebar
    setEventCreationContext({
      targetDate,
      clickPosition: {
        x: 0, // We'll get this from the context menu event if needed
        y: 0
      }
    });

    // Create a new event with the correct time information for the sidebar
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title: "",
      description: "",
      startDate: targetDate,
      endDate: new Date(targetDate.getTime() + 60 * 60 * 1000), // 1 hour later
      startTime: startTime,
      endTime: endTime,
      isAllDay: false,
      color: "blue",
      type: "event",
      location: "",
      attendees: [],
      reminders: [],
      repeat: "none",
      availability: "busy",
      visibility: "default"
    };

    // Add the event to the scheduler provider
    handlers.handleAddEvent(newEvent);

    // Set the selected event for editing in sidebar
    setSelectedEvent(newEvent);

    // Open the sidebar
    setIsEventSidebarOpen(true);
    localStorage.setItem('isEventSidebarOpen', 'true');
  }

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
          {!stopDayEventSummary && (
            <div className="all-day-events">
              <AnimatePresence initial={false}>
                {dayEvents && dayEvents?.length
                  ? dayEvents?.map((event, eventIndex) => {
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="mb-2"
                        >
                          <EventStyled
                            event={{
                              ...event,
                              CustomEventComponent,
                              minmized: false,
                            }}
                            CustomEventModal={CustomEventModal}
                          />
                        </motion.div>
                      );
                    })
                  : "No events for today"}
              </AnimatePresence>
            </div>
          )}

          <div className="relative rounded-md bg-default-50 hover:bg-default-100 transition duration-400">
            <motion.div
              className="relative rounded-xl flex ease-in-out"
              ref={hoursColumnRef}
              variants={containerVariants}
              initial="hidden" // Ensure initial state is hidden
              animate="visible" // Trigger animation to visible state
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
                {Array.from({ length: 24 }).map((_, index) => (
                  <div
                    onClick={() => {
                      handleAddEventDay(detailedHour as string);
                    }}
                    key={`hour-${index}`}
                    className="cursor-pointer w-full relative border-b  hover:bg-default-200/50  transition duration-300  p-4 h-[64px] text-left text-sm text-muted-foreground border-default-200"
                  >
                    <div className="absolute bg-accent flex items-center justify-center text-xs opacity-0 transition left-0 top-0 duration-250 hover:opacity-100 w-full h-full">
                      Add Event
                    </div>
                  </div>
                ))}
                <AnimatePresence initial={false}>
                  {dayEvents && dayEvents?.length
                    ? dayEvents?.map((event, eventIndex) => {
                        // Find which time group this event belongs to
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
                        } = handlers.handleEventStyling(
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
                            }}
                            className="flex transition-all duration-1000 flex-grow flex-col z-50 absolute"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                          >
                            <EventStyled
                              event={{
                                ...event,
                                CustomEventComponent,
                                minmized: true,
                              }}
                              CustomEventModal={CustomEventModal}
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
                className="absolute left-[50px] w-[calc(100%-53px)] h-[2px] bg-primary/40 rounded-full pointer-events-none"
                style={{ top: `${timelinePosition}px` }}
              >
                <Badge
                  variant="outline"
                  className="absolute -translate-y-1/2 bg-white z-50 left-[-20px] text-xs"
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
