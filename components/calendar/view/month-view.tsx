"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

import { EventCard } from "@/components/event/cards/event-card";
import { Event } from "@/lib/store/calendar-store";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { Plus, Sparkles } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

export default function MonthView() {
  
  const { currentDate, navigationDirection, openEventSidebarForNewEvent, events, toggleChatSidebar } = useCalendarStore((state) => state);
  const [selectedEvents, setSelectedEvents] = React.useState<Event[]>([]);
  const [isEventsDialogOpen, setIsEventsDialogOpen] = React.useState(false);
  const direction = navigationDirection;
  const weekStartsOn = "sunday" as "sunday" | "monday";

  // Ensure currentDate is a Date object
  const date = currentDate instanceof Date ? currentDate : new Date(currentDate);

  // Function to get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return Array.from(
      { length: new Date(year, month + 1, 0).getDate() },
      (_, index) => ({
        day: index + 1,
        events: [],
      })
    );
  };

  const daysInMonth = getDaysInMonth(
    date.getMonth(),
    date.getFullYear()
  );

  // Function to get events for day
  const getEventsForDay = (day: number, currentDate: Date): Event[] => {
    const dayEvents = events.filter((event: Event) => {
      const eventDate = new Date(event.startDate)
      const matches = eventDate.getDate() === day && 
             eventDate.getMonth() === currentDate.getMonth() && 
             eventDate.getFullYear() === currentDate.getFullYear()
      return matches
    })
    return dayEvents
  };

  function handleAddEvent(selectedDay: number) {
    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      selectedDay,
      0,
      0,
      0
    );

    const endDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      selectedDay,
      23,
      59,
      59
    );

    openEventSidebarForNewEvent(startDate);
  }

  function handleContextMenuAddEvent(selectedDay: number) {
    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      selectedDay,
      12,
      0,
      0
    );

    openEventSidebarForNewEvent(startDate);
  }

  function handleShowAllEvents(events: Event[]) {
    setSelectedEvents(events);
    setIsEventsDialogOpen(true);
  }

  const itemVariants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const daysOfWeek =
    weekStartsOn === "monday"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDayOfMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  );

  const startOffset =
    (firstDayOfMonth.getDay() - (weekStartsOn === "monday" ? 1 : 0) + 7) % 7;

  const prevMonth = new Date(
    date.getFullYear(),
    date.getMonth() - 1,
    1
  );
  const lastDateOfPrevMonth = new Date(
    prevMonth.getFullYear(),
    prevMonth.getMonth() + 1,
    0
  ).getDate();
  return (
    <div>
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={`${date.getFullYear()}-${date.getMonth()}`}
          custom={direction}
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
          initial="enter"
          animate="center"
          exit="exit"
          className="grid grid-cols-7 gap-1 sm:gap-2"
        >
          {daysOfWeek.map((day, idx) => (
            <div
              key={idx}
              className="text-left my-8 text-4xl tracking-tighter font-medium"
            >
              {day}
            </div>
          ))}

          {Array.from({ length: startOffset }).map((_, idx) => (
            <div key={`offset-${idx}`} className="h-[150px] opacity-50">
              <div className={clsx("font-semibold relative text-3xl mb-1")}>
                {lastDateOfPrevMonth - startOffset + idx + 1}
              </div>
            </div>
          ))}

          {daysInMonth.map((dayObj) => {
            const dayEvents = getEventsForDay(dayObj.day, date);

            return (
              <ContextMenu key={`day-${dayObj.day}`}>
                <ContextMenuTrigger asChild>
                  <motion.div
                    className="hover:z-50 border-none h-[150px] rounded group flex flex-col"
                    variants={itemVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <Card
                      className="shadow-md cursor-pointer overflow-hidden relative flex p-4 border h-full"
                      onClick={() => handleAddEvent(dayObj.day)}
                    >
                  <div
                    className={clsx(
                      "font-semibold relative text-3xl mb-1",
                      dayEvents.length > 0
                        ? "text-primary-600"
                        : "text-muted-foreground",
                      new Date().getDate() === dayObj.day &&
                        new Date().getMonth() === date.getMonth() &&
                        new Date().getFullYear() === date.getFullYear()
                        ? "text-secondary-500"
                        : ""
                    )}
                  >
                    {dayObj.day}
                  </div>
                  <div className="flex-grow flex flex-col gap-2 w-full">
                    <AnimatePresence mode="wait">
                      {dayEvents?.length > 0 && dayEvents[0] && (
                        <motion.div
                          key={dayEvents[0].id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <EventCard
                            event={dayEvents[0]}
                            minimized={true}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                     {dayEvents.length > 1 && (
                       <Badge
                         onClick={(e) => {
                           e.stopPropagation();
                           handleShowAllEvents(dayEvents);
                         }}
                         variant="outline"
                         className="hover:bg-default-200 absolute right-2 text-xs top-2 transition duration-300 cursor-pointer"
                       >
                         {dayEvents.length > 1
                           ? `+${dayEvents.length - 1}`
                           : " "}
                       </Badge>
                     )}
                  </div>
                </Card>
              </motion.div>
            </ContextMenuTrigger>
            <ContextMenuContent className="bg-neutral-950 w-40">
              <ContextMenuItem
                className="cursor-pointer py-2"
                onClick={() => {
                  handleContextMenuAddEvent(dayObj.day);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </ContextMenuItem>
              <ContextMenuItem
                className="cursor-pointer py-2"
                onClick={() => {
                  toggleChatSidebar();
                }}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Ask AI
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        );
      })}
        </motion.div>
      </AnimatePresence>
      
      <Dialog open={isEventsDialogOpen} onOpenChange={setIsEventsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-neutral-950">
          <DialogHeader>
            <DialogTitle>
              Events for {selectedEvents.length > 0 && (
                new Date(selectedEvents[0].startDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            {selectedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
