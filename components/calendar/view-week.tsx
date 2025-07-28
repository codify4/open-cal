import React, { useRef, useEffect, useCallback } from "react"
import { useAtom } from "jotai"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, useDroppable } from "@dnd-kit/core"
import { EventCard } from "../event/cards/event-card"
import { Event, eventsAtom, draggedEventAtom } from "@/lib/atoms/event-atom"

type WeekViewProps = {
  currentDate: Date
  setCurrentDate: (date: Date) => void
  onContextMenu: (e: React.MouseEvent) => void
}

const hours = Array.from({ length: 24 }, (_, i) => i)

const DroppableTimeSlot: React.FC<{ dayIndex: number; hour: number; children: React.ReactNode }> = ({ dayIndex, hour, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${dayIndex}-${hour}`,
  })

  return (
    <div
      ref={setNodeRef}
      className={`w-40 sm:w-60 border-r border-neutral-800 hover:bg-neutral-900/50 transition-colors cursor-pointer flex-shrink-0 relative ${
        isOver ? 'bg-blue-500/20' : ''
      }`}
    >
      {children}
    </div>
  )
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate, setCurrentDate, onContextMenu }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [events, setEvents] = useAtom(eventsAtom)
  const [draggedEvent, setDraggedEvent] = useAtom(draggedEventAtom)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )
  
  // Sample events for demonstration
  const sampleEvents: Event[] = [
    {
      id: "1",
      title: "Team Meeting",
      startDate: new Date("2025-07-28T10:00:00"),
      endDate: new Date("2025-07-28T11:00:00"),
      startTime: "10:00",
      endTime: "11:00",
      description: "Weekly team sync meeting",
      location: "Conference Room A",
      color: "blue",
      isAllDay: false,
      type: "event",
      visibility: "public",
      repeat: "weekly",
      availability: "available",
      reminders: ["10 minutes before"],
      attendees: ["John Doe", "Jane Smith", "Mike Johnson"],
      position: { x: 0, y: 0 },
    },
    {
      id: "2",
      title: "Lunch with Client",
      startDate: new Date("2025-07-29T12:30:00"),
      endDate: new Date("2025-07-29T13:30:00"),
      startTime: "12:30",
      endTime: "13:30",
      description: "Discuss project requirements",
      location: "Downtown Restaurant",
      color: "green",
      isAllDay: false,
      type: "event",
      visibility: "private",
      repeat: "none",
      availability: "busy",
      reminders: ["30 minutes before"],
      attendees: ["Client Name"],
      position: { x: 0, y: 0 },
    },
    {
      id: "3",
      title: "All Day Conference",
      startDate: new Date("2025-07-30T00:00:00"),
      endDate: new Date("2025-07-30T23:59:59"),
      startTime: "00:00",
      endTime: "23:59",
      description: "Tech conference downtown",
      location: "Convention Center",
      color: "purple",
      isAllDay: true,
      type: "event",
      visibility: "public",
      repeat: "none",
      availability: "busy",
      reminders: ["1 day before"],
      attendees: ["Team Members"],
      position: { x: 0, y: 0 },
    },
    {
      id: "4",
      title: "Birthday Party",
      startDate: new Date("2025-07-31T18:00:00"),
      endDate: new Date("2025-07-31T20:00:00"),
      startTime: "18:00",
      endTime: "20:00",
      description: "Sarah's birthday celebration",
      location: "Home",
      color: "pink",
      isAllDay: false,
      type: "birthday",
      visibility: "private",
      repeat: "yearly",
      availability: "available",
      reminders: ["1 hour before"],
      attendees: ["Family", "Friends"],
      position: { x: 0, y: 0 },
    },
    {
      id: "5",
      title: "Quick Call",
      startDate: new Date("2025-08-01T15:00:00"),
      endDate: new Date("2025-08-01T15:30:00"),
      startTime: "15:00",
      endTime: "15:30",
      description: "Quick status update",
      location: "Zoom",
      color: "orange",
      isAllDay: false,
      type: "event",
      visibility: "public",
      repeat: "none",
      availability: "available",
      reminders: ["5 minutes before"],
      attendees: ["Manager"],
      position: { x: 0, y: 0 },
    }
  ]

  // Use sample events for now, later will use real events
  const displayEvents = events.length > 0 ? events : sampleEvents

  // Generate extended days for horizontal scrolling (1 year past + 1 year future)
  const getDaysToShow = useCallback(() => {
    const days = []
    const baseDate = new Date(currentDate)
    
    // Generate 104 weeks (1 year past + 1 year future)
    for (let weekOffset = -52; weekOffset <= 52; weekOffset++) {
      const weekStart = new Date(baseDate)
      const dayOfWeek = weekStart.getDay()
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
      weekStart.setDate(weekStart.getDate() + mondayOffset + weekOffset * 7)

      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart)
        day.setDate(weekStart.getDate() + i)
        days.push(day)
      }
    }
    
    return days
  }, [currentDate])

  // Scroll to center on selected date
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current
      const days = getDaysToShow()

      // Find the selected date's index in the days array
      const selectedIndex = days.findIndex((day) => day.toDateString() === currentDate.toDateString())

      if (selectedIndex !== -1) {
        const dayWidth = 240 // w-60 = 240px
        const timeColumnWidth = 96 // w-24 = 96px
        const scrollPosition = selectedIndex * dayWidth - container.clientWidth / 2 + dayWidth / 2 + timeColumnWidth
        container.scrollLeft = Math.max(0, scrollPosition)
      }
    }
  }, [currentDate, getDaysToShow])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`
  }

  // Helper function to get events for a specific day and hour
  const getEventsForTimeSlot = (day: Date, hour: number) => {
    return displayEvents.filter(event => {
      const eventDate = new Date(event.startDate)
      const eventHour = eventDate.getHours()
      return eventDate.toDateString() === day.toDateString() && eventHour === hour
    })
  }

  // Helper function to get all-day events for a specific day
  const getAllDayEventsForDay = (day: Date) => {
    return displayEvents.filter(event => {
      const eventDate = new Date(event.startDate)
      return eventDate.toDateString() === day.toDateString() && event.isAllDay
    })
  }

  const handleDragStart = (event: DragStartEvent) => {
    const eventId = event.active.id as string
    const eventToDrag = displayEvents.find(e => e.id === eventId)
    if (eventToDrag) {
      setDraggedEvent(eventToDrag)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedEvent(null)
    
    const { active, over } = event
    if (!over) return

    const eventId = active.id as string
    const targetTimeSlot = over.id as string
    
    const [dayIndex, hour] = targetTimeSlot.split('-').map(Number)
    const days = getDaysToShow()
    const targetDate = days[dayIndex]
    
    if (targetDate) {
      setEvents(prev => prev.map(event => {
        if (event.id === eventId) {
          const newStartTime = `${hour.toString().padStart(2, '0')}:00`
          const newEndTime = `${(hour + 1).toString().padStart(2, '0')}:00`
          
          return {
            ...event,
            startDate: targetDate,
            endDate: targetDate,
            startTime: newStartTime,
            endTime: newEndTime
          }
        }
        return event
      }))
    }
  }

  const handleEventContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent parent context menu from opening
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        <div
          ref={containerRef}
          className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{
            scrollSnapType: "none",
          }}
        >
          <div
            ref={gridRef}
            className="relative h-full min-w-max"
            onContextMenu={onContextMenu}
          >
            {/* Grid Header */}
            <div className="flex sticky top-0 bg-neutral-900 border-b border-neutral-800 z-20">
              <div className="w-12 sm:w-16 p-1 sm:p-2 border-r border-neutral-800 text-xs sm:text-sm font-medium flex-shrink-0 sticky left-0 z-30 bg-neutral-900">
                Time
              </div>
              {getDaysToShow().map((day, index) => {
                const isToday = day.toDateString() === new Date().toDateString()
                const allDayEvents = getAllDayEventsForDay(day)
                return (
                  <div
                    key={index}
                    className={`w-40 sm:w-60 p-1 sm:p-2 text-xs sm:text-sm font-medium text-center flex-shrink-0 ${
                      isToday ? "bg-neutral-900 text-red-400" : ""
                    }`}
                  >
                    <div className="hidden sm:block">{formatDate(day)}</div>
                    <div className="sm:hidden">
                      {day.toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Time Grid */}
            <div className="flex flex-col h-full">
              {hours.map((hour) => (
                <div key={hour} className="flex border-b border-neutral-800 relative" style={{ height: "calc((100vh - 200px) / 20)" }}>
                  <div className="w-12 sm:w-16 p-1 text-center border-r border-neutral-800 text-xs sm:text-sm text-neutral-400 flex items-center justify-end flex-shrink-0 sticky left-0 z-30 bg-neutral-900">
                    {formatTime(hour)}
                  </div>
                  {getDaysToShow().map((day, dayIndex) => {
                    const isToday = day.toDateString() === new Date().toDateString()
                    const timeSlotEvents = getEventsForTimeSlot(day, hour)
                    
                    return (
                      <DroppableTimeSlot key={`${hour}-${dayIndex}`} dayIndex={dayIndex} hour={hour}>
                        {timeSlotEvents.map((event) => (
                          <div key={event.id} className="absolute inset-1 z-10" onContextMenu={handleEventContextMenu}>
                            <div className="h-full w-full resize both overflow-hidden rounded-md border-2 border-transparent hover:border-white/20 transition-colors">
                              <EventCard
                                event={event}
                                className="text-xs h-full w-full"
                              />
                            </div>
                          </div>
                        ))}
                      </DroppableTimeSlot>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {draggedEvent ? <EventCard event={draggedEvent} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

export default WeekView;