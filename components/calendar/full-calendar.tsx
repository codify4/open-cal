"use client"

import { useAtom } from "jotai"
import { currentDateAtom, viewTypeAtom } from "@/lib/atoms/cal-atoms"
import { useRef } from "react"
import { SchedulerProvider } from "@/providers/schedular-provider"
import SchedulerWrapper from "./schedule/_components/wrapper/schedular-wrapper"
import { Event } from "@/types"

export default function StyledFullCalendar() {
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom)
  const [viewType, setViewType] = useAtom(viewTypeAtom)
  const calendarRef = useRef<any>(null)

  // Add some sample events for testing
  const sampleEvents: Event[] = [
    {
      id: "1",
      title: "Team Meeting",
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
      startTime: "10:00",
      endTime: "11:00",
      description: "Weekly team sync",
      location: "Conference Room A",
      color: "blue",
      isAllDay: false,
      type: "event",
      visibility: "default",
      repeat: "none",
      availability: "busy",
      reminders: ["10 minutes before"],
      attendees: ["John Doe", "Jane Smith"],
    },
    {
      id: "2", 
      title: "Lunch with Client",
      startDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
      endDate: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours later
      startTime: "12:00",
      endTime: "13:00",
      description: "Discuss project requirements",
      location: "Downtown Restaurant",
      color: "green",
      isAllDay: false,
      type: "event",
      visibility: "default",
      repeat: "none",
      availability: "busy",
      reminders: ["30 minutes before"],
      attendees: ["Client Name"],
    },
    {
      id: "3",
      title: "Birthday Party",
      startDate: new Date(),
      endDate: new Date(),
      startTime: "",
      endTime: "",
      description: "Annual celebration",
      location: "Home",
      color: "pink",
      isAllDay: true,
      type: "birthday",
      visibility: "default",
      repeat: "none",
      availability: "busy",
      reminders: ["1 day before"],
      attendees: ["Family", "Friends"],
    }
  ]

  // Use sample events if no events exist
  const displayEvents = sampleEvents

  const calendarEvents = displayEvents.map(event => ({
    id: event.id,
    title: event.title,
    start: event.startDate,
    end: event.endDate,
    allDay: event.isAllDay,
    backgroundColor: getEventColor(event.color),
    borderColor: getEventColor(event.color),
    textColor: '#ffffff',
    extendedProps: {
      description: event.description,
      location: event.location,
      attendees: event.attendees,
      type: event.type,
      visibility: event.visibility,
      repeat: event.repeat,
      availability: event.availability,
      reminders: event.reminders,
    }
  }))

  function getEventColor(color: string) {
    const colorMap: Record<string, string> = {
      blue: '#3b82f6',
      green: '#10b981',
      red: '#ef4444',
      yellow: '#f59e0b',
      purple: '#8b5cf6',
      pink: '#ec4899',
      orange: '#f97316',
      indigo: '#6366f1',
    }
    return colorMap[color] || '#3b82f6'
  }

  return (
    <div className="flex flex-col gap-6 p-2">
      <SchedulerProvider weekStartsOn="monday" initialState={sampleEvents}>
        <SchedulerWrapper />
      </SchedulerProvider>
    </div>
  )
}