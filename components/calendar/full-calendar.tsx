"use client"

import { useAtom } from "jotai"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { eventsAtom, Event } from "@/lib/atoms/event-atom"
import { currentDateAtom, viewTypeAtom } from "@/lib/atoms/cal-atoms"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { SidebarTrigger } from "../ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRef } from "react"

export default function StyledFullCalendar() {
  const [events, setEvents] = useAtom(eventsAtom)
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom)
  const [viewType, setViewType] = useAtom(viewTypeAtom)
  const calendarRef = useRef<any>(null)

  // Add some sample events for testing
  const sampleEvents = [
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
      visibility: "public",
      repeat: "weekly",
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
      visibility: "private",
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
      visibility: "public",
      repeat: "yearly",
      availability: "available",
      reminders: ["1 day before"],
      attendees: ["Family", "Friends"],
    }
  ]

  // Use sample events if no events exist
  const displayEvents = events.length > 0 ? events : sampleEvents

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

  const handleEventDrop = (info: any) => {
    const { event } = info
    setEvents(prev => prev.map(e => {
      if (e.id === event.id) {
        return {
          ...e,
          startDate: event.start,
          endDate: event.end || event.start
        }
      }
      return e
    }))
  }

  const handleDateSelect = (selectInfo: any) => {
    console.log('Date selected:', selectInfo.start)
  }

  const handleEventClick = (clickInfo: any) => {
    console.log('Event clicked:', clickInfo.event)
  }

  const getViewType = () => {
    switch (viewType) {
      case 'day':
        return 'timeGridDay'
      case 'week':
        return 'timeGridWeek'
      case 'month':
        return 'dayGridMonth'
      default:
        return 'timeGridWeek'
    }
  }

  const handleViewChange = (newViewType: string) => {
    switch (newViewType) {
      case 'timeGridDay':
        setViewType('day')
        break
      case 'timeGridWeek':
        setViewType('week')
        break
      case 'dayGridMonth':
        setViewType('month')
        break
    }
  }

  const changeView = (newViewType: 'day' | 'week' | 'month') => {
    setViewType(newViewType)
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      const viewMap = {
        day: 'timeGridDay',
        week: 'timeGridWeek',
        month: 'dayGridMonth'
      }
      calendarApi.changeView(viewMap[newViewType])
    }
  }
  
  const getViewTitle = () => {
    if (viewType === "day") {
      return (
        <>
          <span className="hidden sm:inline">
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="sm:hidden">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
            })}
          </span>
        </>
      )
    } else if (viewType === "week") {
      const startOfWeek = new Date(currentDate)
      const dayOfWeek = startOfWeek.getDay()
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
      startOfWeek.setDate(startOfWeek.getDate() + mondayOffset)

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      return (
        <>
          <span className="hidden sm:inline">
            {`${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
          </span>
          <span className="sm:hidden">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
            })}
          </span>
        </>
      )
    } else {
      return (
        <>
          <span className="hidden sm:inline">
            {currentDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </span>
          <span className="sm:hidden">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
            })}
          </span>
        </>
      )
    }
  }

  return (
    <Tabs defaultValue="week" className="w-full h-full">
      <Card className="w-full h-full bg-neutral-900 border-neutral-800 text-neutral-100 flex flex-col py-0 gap-0 rounded-xl">
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-neutral-800">
          <div className="flex items-center gap-2 sm:gap-4">
            <SidebarTrigger />
            <h1 className="text-lg sm:text-xl font-semibold truncate max-w-[120px] sm:max-w-none">{getViewTitle()}</h1>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newDate = new Date(currentDate)
                  if (viewType === 'day') {
                    newDate.setDate(newDate.getDate() - 1)
                  } else if (viewType === 'week') {
                    newDate.setDate(newDate.getDate() - 7)
                  } else if (viewType === 'month') {
                    newDate.setMonth(newDate.getMonth() - 1)
                  }
                  setCurrentDate(newDate)
                  if (calendarRef.current) {
                    calendarRef.current.getApi().prev()
                  }
                }}
                className="hidden sm:block text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 p-1 sm:p-2"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newDate = new Date(currentDate)
                  if (viewType === 'day') {
                    newDate.setDate(newDate.getDate() + 1)
                  } else if (viewType === 'week') {
                    newDate.setDate(newDate.getDate() + 7)
                  } else if (viewType === 'month') {
                    newDate.setMonth(newDate.getMonth() + 1)
                  }
                  setCurrentDate(newDate)
                  if (calendarRef.current) {
                    calendarRef.current.getApi().next()
                  }
                }}
                className="hidden sm:block text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 p-1 sm:p-2"
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="block sm:hidden bg-muted rounded-sm sm:w-20 h-8 font-semibold text-xs sm:text-sm"
              onClick={() => {
                setCurrentDate(new Date())
                if (calendarRef.current) {
                  calendarRef.current.getApi().today()
                }
              }}
            >
              {new Date().getDate()}
            </Button>
            <Button 
              variant="outline" 
              className="hidden sm:flex bg-muted rounded-sm w-20 h-8 text-sm"
              onClick={() => {
                setCurrentDate(new Date())
                if (calendarRef.current) {
                  calendarRef.current.getApi().today()
                }
              }}
            >
              Today
            </Button>
            <TabsList className="bg-neutral-900 border border-neutral-700 h-8">
              <TabsTrigger 
                value="day"
                className="capitalize w-12 sm:w-18 text-xs sm:text-sm"
                onClick={() => changeView('day')}
              >
                Day
              </TabsTrigger>
              <TabsTrigger 
                value="week"
                className="capitalize w-12 sm:w-18 text-xs sm:text-sm"
                onClick={() => changeView('week')}
              >
                Week
              </TabsTrigger>
              <TabsTrigger 
                value="month"
                className="capitalize w-12 sm:w-18 text-xs sm:text-sm"
                onClick={() => changeView('month')}
              >
                Month
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="flex-1 h-full">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={getViewType()}
            initialDate={currentDate}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={calendarEvents}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            height="100%" 
            headerToolbar={false}
            viewDidMount={(info) => {
              handleViewChange(info.view.type)
            }}
            // Custom styling classes
            eventClassNames="rounded-md border-0 text-xs font-medium"
            dayCellClassNames="bg-neutral-900 border-r border-neutral-800 z-10"
            // Custom CSS variables for dark theme
            eventContent={(arg) => {
              return (
                <div className="p-1 h-full w-full overflow-hidden">
                  <div className="font-medium text-xs truncate">
                    {arg.event.title}
                  </div>
                </div>
              )
            }}
          />
        </div>
      </Card>
    </Tabs>
  )
}