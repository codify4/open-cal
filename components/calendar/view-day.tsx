import React, { useRef, useEffect, useCallback } from "react"
import { useAtom } from "jotai"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, useDroppable } from "@dnd-kit/core"
import { EventCard } from "../event/cards/event-card"
import { eventsAtom, draggedEventAtom, Event } from "@/lib/atoms/event-atom"

type DayViewProps = {
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
      className={`flex-shrink-0 border-r border-neutral-800 hover:bg-neutral-900/50 transition-colors cursor-pointer relative ${
        isOver ? 'bg-blue-500/20' : ''
      }`}
      style={{
        width: "calc(100vw - 48px)",
        minWidth: "280px",
      }}
    >
      {children}
    </div>
  )
}

const DayView: React.FC<DayViewProps> = ({ currentDate, setCurrentDate, onContextMenu }) => {
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

  const getDaysToShow = useCallback(() => {
    const days = []
    const baseDate = new Date(currentDate)
    
    for (let i = -365; i <= 365; i++) {
      const day = new Date(baseDate)
      day.setDate(baseDate.getDate() + i)
      days.push(day)
    }
    
    return days
  }, [currentDate])

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current
      const days = getDaysToShow()
      
      const selectedIndex = days.findIndex((day) => day.toDateString() === currentDate.toDateString())
      
      if (selectedIndex !== -1) {
        const dayWidth = container.scrollWidth / 730
        const containerWidth = container.clientWidth
        const centerPosition = (dayWidth * selectedIndex) - (containerWidth / 2)
        container.scrollLeft = Math.max(0, centerPosition)
      }
    }
  }, [currentDate, getDaysToShow])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`
  }

  const getEventsForTimeSlot = (day: Date, hour: number) => {
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.startDate)
      const eventHour = event.startTime ? parseInt(event.startTime.split(':')[0]) : 0
      const isSameDay = eventDate.toDateString() === day.toDateString()
      const isSameHour = eventHour === hour
            
      return isSameDay && isSameHour
    })
    
    return filteredEvents
  }

  const handleDragStart = (event: DragStartEvent) => {
    const eventId = event.active.id as string
    const eventToDrag = events.find(e => e.id === eventId)
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

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        <div
          ref={containerRef}
          className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide"
        >
          <div
            ref={gridRef}
            className="relative h-full min-w-max"
            onContextMenu={onContextMenu}
          >
            <div className="flex sticky top-0 bg-neutral-900 border-b border-neutral-800 z-20">
              <div className="w-12 sm:w-16 p-1 sm:p-2 border-r border-neutral-800 text-xs sm:text-sm font-medium flex-shrink-0 sticky left-0 z-30 bg-neutral-900">
                Time
              </div>
              {getDaysToShow().map((day, index) => {
                const isToday = day.toDateString() === new Date().toDateString()
                return (
                  <div
                    key={index}
                    className="flex-shrink-0 p-1 sm:p-2 text-xs sm:text-sm font-medium text-center"
                    style={{
                      width: "calc(100vw - 48px)",
                      minWidth: "280px",
                    }}
                  >
                    <div className="hidden sm:block">{formatDate(day)}</div>
                    <div className="sm:hidden">
                      {day.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col h-full">
              {hours.map((hour) => (
                <div key={hour} className="flex border-b bg-neutral-900 border-neutral-800" style={{ height: "calc((100vh - 200px) / 20)" }}>
                  <div className="w-12 sm:w-16 p-1 text-center border-r border-neutral-800 text-xs sm:text-sm text-neutral-400 flex items-center justify-end flex-shrink-0 sticky left-0 z-30 bg-neutral-900">
                    {formatTime(hour)}
                  </div>
                  {getDaysToShow().map((day, dayIndex) => {
                    const isToday = day.toDateString() === new Date().toDateString()
                    const timeSlotEvents = getEventsForTimeSlot(day, hour)
                    
                    return (
                      <DroppableTimeSlot key={`${hour}-${dayIndex}`} dayIndex={dayIndex} hour={hour}>
                        {timeSlotEvents.map((event) => (
                          <div key={event.id} className="absolute inset-0 p-1">
                            <EventCard event={event} />
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

export default DayView;