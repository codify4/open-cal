import React, { useRef, useState, useEffect, useCallback } from "react";
import { useScheduler } from "@/providers/schedular-provider";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import { useModal } from "@/providers/modal-context";
import AddEventModal from "@/components/calendar/schedule/_modals/add-event-modal";
import EventStyled from "../event-component/event-styled";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Maximize, Plus } from "lucide-react";
import clsx from "clsx";
import { Event, CustomEventModal } from "@/types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useAtom } from "jotai";
import { 
  isEventSidebarOpenAtom, 
  eventCreationContextAtom,
  selectedEventAtom
} from "@/lib/atoms/event-atom";

const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  const ampm = i < 12 ? "AM" : "PM";
  return `${hour}:00 ${ampm}`;
});

interface ChipData {
  id: number;
  color: "primary" | "warning" | "danger";
  title: string;
  description: string;
}

const chipData: ChipData[] = [
  {
    id: 1,
    color: "primary",
    title: "Ads Campaign Nr1",
    description: "Day 1 of 5: Google Ads, Target Audience: SMB-Alpha",
  },
  {
    id: 2,
    color: "warning",
    title: "Ads Campaign Nr2",
    description:
      "All Day: Day 2 of 5: AdSense + FB, Target Audience: SMB2-Delta3",
  },
  {
    id: 3,
    color: "danger",
    title: "Critical Campaign Nr3",
    description: "Day 3 of 5: High-Impact Ads, Target: E-Commerce Gamma",
  },
  {
    id: 4,
    color: "primary",
    title: "Ads Campaign Nr4",
    description: "Day 4 of 5: FB Ads, Audience: Retailers-Zeta",
  },
  {
    id: 5,
    color: "warning",
    title: "Campaign Ending Soon",
    description: "Final Day: Monitor closely, Audience: Delta2-Beta",
  },
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger children animations
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
    opacity: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    transition: {
      opacity: { duration: 0.2, ease: "easeInOut" },
    },
  }),
};

export default function WeeklyView({
  CustomEventComponent,
  CustomEventModal,
  classNames,
}: {
  CustomEventComponent?: React.FC<Event>;
  CustomEventModal?: CustomEventModal;
  classNames?: { prev?: string; next?: string; addEvent?: string };
}) {
  const { getters, handlers } = useScheduler();
  const hoursColumnRef = useRef<HTMLDivElement>(null);
  const [detailedHour, setDetailedHour] = useState<string | null>(null);
  const [timelinePosition, setTimelinePosition] = useState<number>(0);
  const [colWidth, setColWidth] = useState<number[]>(Array(7).fill(1)); // Equal width columns by default
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [contextMenuTime, setContextMenuTime] = useState<string | null>(null);
  const { setOpen } = useModal();

  // Sidebar state management
  const [isEventSidebarOpen, setIsEventSidebarOpen] = useAtom(isEventSidebarOpenAtom);
  const [eventCreationContext, setEventCreationContext] = useAtom(eventCreationContextAtom);
  const [selectedEvent, setSelectedEvent] = useAtom(selectedEventAtom);

  // Get current date and direction from scheduler provider
  const currentDate = getters.getCurrentDate ? getters.getCurrentDate() : new Date();
  const direction = getters.getDirection ? getters.getDirection() : 0;

  const daysOfWeek = getters?.getDaysInWeek(
    1, // Week number is not used in the new implementation
    currentDate.getFullYear()
  );
  


  // Reset column widths when the date changes
  useEffect(() => {
    setColWidth(Array(7).fill(1));
  }, [currentDate]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
    const timeString = `${hour12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    setDetailedHour(timeString);
    
    // Ensure timelinePosition is never negative and is within bounds
    // 83px offset accounts for the header height
    const headerOffset = 83;
    const position = Math.max(0, Math.min(rect.height, Math.round(y))) + headerOffset;
    setTimelinePosition(position);
  }, []);

  const handleContextMenuOpen = useCallback((e: React.MouseEvent) => {
    // Capture the mouse position when context menu opens
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
    const timeString = `${hour12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    setContextMenuTime(timeString);
  }, []);

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

  function handleAddEventWeek(dayIndex: number, detailedHour: string) {
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

    const chosenDay = daysOfWeek[dayIndex % 7].getDate();

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


  // Group events by time period to prevent splitting spaces within same time blocks
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
    
    // First, create a graph where events are vertices and edges represent overlaps
    const graph: Record<string, Set<string>> = {};
    
    // Initialize graph
    for (const event of sortedEvents) {
      graph[event.id] = new Set<string>();
    }
    
    // Build connections - only connect events that truly overlap in time
    for (let i = 0; i < sortedEvents.length; i++) {
      for (let j = i + 1; j < sortedEvents.length; j++) {
        // Only consider events that actually overlap in time
        if (eventsOverlap(sortedEvents[i], sortedEvents[j])) {
          graph[sortedEvents[i].id].add(sortedEvents[j].id);
          graph[sortedEvents[j].id].add(sortedEvents[i].id);
        }
      }
    }
    
    // Use DFS to find connected components (groups of overlapping events)
    const visited = new Set<string>();
    const groups: Event[][] = [];
    
    for (const event of sortedEvents) {
      if (!visited.has(event.id)) {
        // Start a new component/group
        const group: Event[] = [];
        const stack: Event[] = [event];
        visited.add(event.id);
        
        // DFS traversal
        while (stack.length > 0) {
          const current = stack.pop()!;
          group.push(current);
          
          // Visit neighbors (overlapping events)
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
        
        // Sort this group by start time
        group.sort((a, b) => 
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
        
        groups.push(group);
      }
    }
    
    return groups;
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
              Week {getters.getWeekNumber(currentDate)}
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
                        {getters.getDayName(day.getDay())}
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
                      
                      {/* Fullscreen icon that appears on hover */}
                      <div 
                        className="absolute top-5 right-10 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          
                          // Set the selected day
                          const selectedDay = new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            day.getDate()
                          );
                          
                          // Get events for the selected day
                          const dayEvents = getters.getEventsForDay(
                            day.getDate(),
                            currentDate
                          );
                          
                          setOpen(
                            <>
                              <div className="flex flex-col space-y-4 p-4">
                                <div className="flex items-center mb-4">
                                  <ChevronLeft 
                                    className="cursor-pointer hover:text-primary mr-2" 
                                    onClick={() => setOpen(null)}
                                  />
                                  <h2 className="text-2xl font-bold">{selectedDay.toDateString()}</h2>
                                </div>
                                
                                {dayEvents && dayEvents.length > 0 ? (
                                  <div className="space-y-4">
                                    {/* Timeline view */}
                                    <div className="relative bg-default-50 rounded-lg p-4 min-h-[500px]">
                                      <div className="grid grid-cols-[100px_1fr] h-full">
                                        {/* Hours column */}
                                        <div className="flex flex-col">
                                          {hours.map((hour, index) => (
                                            <div
                                              key={`hour-${index}`}
                                              className="h-16 p-2 text-sm text-muted-foreground border-r border-b border-default-200"
                                            >
                                              {hour}
                                            </div>
                                          ))}
                                        </div>
                                        
                                        {/* Events column */}
                                        <div className="relative">
                                          {/* Hour grid lines */}
                                          {Array.from({ length: 24 }).map((_, index) => (
                                            <div
                                              key={`grid-${index}`}
                                              className="h-16 border-b border-default-200"
                                            />
                                          ))}
                                          
                                          {/* Display events */}
                                          {dayEvents.map((event) => {
                                            // Calculate time groups
                                            const timeGroups = groupEventsByTimePeriod(dayEvents);
                                            
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
                                            
                                            // Get styling for this event
                                            const { height, top, left, maxWidth, minWidth } = handlers.handleEventStyling(
                                              event,
                                              dayEvents,
                                              {
                                                eventsInSamePeriod,
                                                periodIndex,
                                                adjustForPeriod: true
                                              }
                                            );
                                            
                                            return (
                                              <div
                                                key={event.id}
                                                style={{
                                                  position: 'absolute',
                                                  height,
                                                  top,
                                                  left,
                                                  maxWidth,
                                                  minWidth,
                                                  padding: '0 2px',
                                                  boxSizing: 'border-box',
                                                }}
                                              >
                                                <EventStyled
                                                  event={{
                                                    ...event,
                                                    CustomEventComponent,
                                                    minmized: true,
                                                  }}
                                                  CustomEventModal={CustomEventModal}
                                                />
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Event list */}
                                    <div className="bg-card rounded-lg p-4">
                                      <h3 className="text-lg font-semibold mb-4">All Events</h3>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {dayEvents.map(event => (
                                          <div 
                                            key={event.id} 
                                            className={`p-4 rounded-lg shadow-sm border-l-4 border-${event.color} hover:shadow-md transition-shadow`}
                                          >
                                            <EventStyled
                                              event={{
                                                ...event,
                                                CustomEventComponent,
                                                minmized: false,
                                              }}
                                              CustomEventModal={CustomEventModal}
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center py-10 text-muted-foreground">
                                    <p>No events scheduled for this day</p>
                                    <Button 
                                      variant="outline" 
                                      className="mt-4"
                                      onClick={() => {
                                        setOpen(null);
                                        handleAddEventWeek(idx, detailedHour || "12:00 PM");
                                      }}
                                    >
                                      Add Event
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </>
                          );
                        }}
                      >
                        <Maximize size={16} className="text-muted-foreground hover:text-primary" />
                      </div>
                      
                      {/* Resize handle */}
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
                  className="absolute -translate-y-1/2 bg-white z-50 left-[5px] text-xs"
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
                const dayEvents = getters.getEventsForDay(
                  daysOfWeek[dayIndex % 7].getDate(),
                  currentDate
                );

                // Calculate time groups once for this day's events
                const timeGroups = groupEventsByTimePeriod(dayEvents);
                
                // Get the count of events to determine if we need to show a "more" button
                const eventsCount = dayEvents?.length || 0;
                const maxEventsToShow = 10; // Limit the number of events to display before showing "more"
                const hasMoreEvents = eventsCount > maxEventsToShow;
                
                // Only show a subset of events if there are too many
                const visibleEvents = hasMoreEvents 
                  ? dayEvents?.slice(0, maxEventsToShow - 1) 
                  : dayEvents;

                return (
                  <ContextMenu key={`day-${dayIndex}`}>
                    <ContextMenuTrigger asChild>
                      <div
                        className="col-span-1 border-default-200 z-20 relative transition duration-300 cursor-pointer border-r border-b text-center text-sm text-muted-foreground overflow-hidden"
                        onContextMenu={handleContextMenuOpen}
                      >
                    <AnimatePresence initial={false}>
                      {visibleEvents?.map((event, eventIndex) => {
                        // For better spacing, consider if this event is part of a time group
                        let eventsInSamePeriod = 1;
                        let periodIndex = 0;
                        
                        // Find which time group this event belongs to
                        for (let i = 0; i < timeGroups.length; i++) {
                          const groupIndex = timeGroups[i].findIndex(e => e.id === event.id);
                          if (groupIndex !== -1) {
                            eventsInSamePeriod = timeGroups[i].length;
                            periodIndex = groupIndex;
                            break;
                          }
                        }
                        
                        // Customize styling parameters for events in the same time period
                        const { height, left, maxWidth, minWidth, top, zIndex } =
                          handlers.handleEventStyling(
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
                      })}
                      
                      {/* Show "more events" button if there are too many */}
                      {hasMoreEvents && (
                        <motion.div
                          key={`more-events-${dayIndex}`}
                          style={{
                            bottom: '10px',
                            right: '10px',
                            position: 'absolute',
                          }}
                          className="z-50"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <Badge 
                            variant="secondary"
                            className="cursor-pointer hover:bg-accent"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Show a modal with all events for this day
                              setOpen(
                                <>
                                  <div className="space-y-2 p-2 max-h-[80vh] overflow-y-auto">
                                    {dayEvents?.map((event) => (
                                      <EventStyled
                                        key={event.id}
                                        event={{
                                          ...event,
                                          CustomEventComponent,
                                          minmized: false,
                                        }}
                                        CustomEventModal={CustomEventModal}
                                      />
                                    ))}
                                  </div>
                                </>
                              );
                            }}
                          >
                            +{eventsCount - (maxEventsToShow - 1)} more
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Render hour slots */}
                    {Array.from({ length: 24 }, (_, hourIndex) => (
                      <div
                        key={`day-${dayIndex}-hour-${hourIndex}`}
                        className="col-span-1 border-default-200 h-[64px] relative transition duration-300 cursor-pointer border-r border-b text-center text-sm text-muted-foreground"
                      >
                      </div>
                    ))}
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={() => {
                          // Use the captured context menu time, fallback to detailedHour, then default
                          const timeToUse = contextMenuTime || detailedHour || "12:00 PM";
                          handleAddEventWeek(dayIndex, timeToUse);
                          // Clear the context menu time after use
                          setContextMenuTime(null);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Event
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
