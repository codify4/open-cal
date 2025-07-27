"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useAtom } from "jotai"
import { ChevronLeft, ChevronRight, Plus, Sparkle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SidebarTrigger } from "../ui/sidebar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Kbd } from "../ui/kbd"
import { currentDateAtom, viewTypeAtom } from "@/lib/atoms/cal-atoms"
import { isChatSidebarOpenAtom } from "@/lib/atoms/chat-atom"
import AddEvent from "../event/add-event-sidebar"
import DayView from "./view-day"
import WeekView from "./view-week"
import MonthView from "./view-month"
import { 
  isEventSidebarOpenAtom, 
  eventCreationContextAtom,
  eventsAtom,
  selectedEventAtom,
  Event 
} from "@/lib/atoms/event-atom"

type ViewType = "day" | "week" | "month"

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
  onCreateEvent: () => void
  onAskAI: () => void
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onCreateEvent, onAskAI }) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-neutral-900 border border-neutral-700 rounded-md shadow-xl p-1 min-w-[160px]"
      style={{ left: x, top: y }}
    >
      <Button
        variant="ghost" 
        onClick={onCreateEvent}
        className="w-full rounded-sm px-3 py-2 text-white hover:text-white hover:bg-neutral-800 flex items-center justify-between transition-colors"
      >
        <span>Create Event</span>
        <Kbd variant={'outline'} className="bg-neutral-950 p-1 rounded-[5px] text-xs" size={'xs'}>c</Kbd>
      </Button>
      <Button
        variant="ghost" 
        onClick={onAskAI}
        className="w-full rounded-sm px-3 py-2 text-white hover:text-white hover:bg-neutral-800 flex items-center justify-between transition-colors"
      >
        <span>Ask Agent</span>
        <Sparkle size={16} className="text-white" />
      </Button>
    </div>
  )
}

export default function FullCalendar() {
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom)
  const [viewType, setViewType] = useAtom(viewTypeAtom)
  const [, setIsChatSidebarOpen] = useAtom(isChatSidebarOpenAtom)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [isEventSidebarOpen, setIsEventSidebarOpen] = useAtom(isEventSidebarOpenAtom)
  const [, setEventCreationContext] = useAtom(eventCreationContextAtom)
  const [events, setEvents] = useAtom(eventsAtom)
  const [, setSelectedEvent] = useAtom(selectedEventAtom)

  const containerRef = useRef<HTMLDivElement>(null)

  // Generate extended days for horizontal scrolling
  const getDaysToShow = useCallback(() => {
    const days = []
    const baseDate = new Date(currentDate)

    if (viewType === "day") {
      // Show 21 days (10 before, current, 10 after) for scrolling
      for (let i = -10; i <= 10; i++) {
        const day = new Date(baseDate)
        day.setDate(baseDate.getDate() + i)
        days.push(day)
      }
    } else if (viewType === "week") {
      // Show 7 weeks (3 before, current, 3 after) but center on selected date
      for (let weekOffset = -3; weekOffset <= 3; weekOffset++) {
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
    }

    return days
  }, [currentDate, viewType])

  useEffect(() => {
    if (containerRef.current) {
      if (viewType === "month") {
        // Scroll to current month (first month is always current month, so scroll to 0)
        const container = containerRef.current
        container.scrollLeft = 0
      } else if (viewType === "day") {
        // Center on selected date in day view
        const container = containerRef.current
        const days = getDaysToShow()
        
        // Find the selected date's index in the days array
        const selectedIndex = days.findIndex((day) => day.toDateString() === currentDate.toDateString())
        
        if (selectedIndex !== -1) {
          const dayWidth = container.scrollWidth / 21 // 21 total days
          const centerPosition = dayWidth * selectedIndex
          container.scrollLeft = centerPosition
        }
      } else if (viewType === "week") {
        // Center on selected date in week view
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
    }
  }, [viewType, currentDate, getDaysToShow])

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)

    if (viewType === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    } else if (viewType === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    } else if (viewType === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    }

    setCurrentDate(newDate)
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

  const toggleEventSidebar = () => {
    const newState = !isEventSidebarOpen;
    setIsEventSidebarOpen(newState);
    localStorage.setItem('isEventSidebarOpen', JSON.stringify(newState));
  }

  const handleCreateEvent = () => {
    if (contextMenu) {
      setEventCreationContext({
        clickPosition: { x: contextMenu.x, y: contextMenu.y },
        targetDate: currentDate
      })
      
      toggleEventSidebar()
      setContextMenu(null)
    }
  }

  const handleAskAI = () => {
    setIsChatSidebarOpen(true)
    localStorage.setItem('isChatSidebarOpen', 'true')
    setContextMenu(null)
  }

  return (
    <Tabs value={viewType} onValueChange={(value) => setViewType(value as ViewType)} className="w-full h-full">
      <Card className="w-full h-full bg-neutral-900 border-neutral-800 text-neutral-100 flex flex-col py-0 gap-0 rounded-xl">
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-neutral-800">
          <div className="flex items-center gap-2 sm:gap-4">
            <SidebarTrigger />
            <h1 className="text-lg sm:text-xl font-semibold truncate max-w-[120px] sm:max-w-none">{getViewTitle()}</h1>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate("prev")}
                className="hidden sm:block text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 p-1 sm:p-2"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate("next")}
                className="hidden sm:block text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 p-1 sm:p-2"
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-2">
            <Button 
              variant="outline" 
              className="block sm:hidden bg-muted rounded-sm sm:w-20 h-8 font-semibold text-xs sm:text-sm"
              onClick={() => {
                const today = new Date()
                setCurrentDate(today)
              }}
            >
              {new Date().getDate()}
            </Button>
            <Button 
              variant="outline" 
              className="hidden sm:flex bg-muted rounded-sm w-20 h-8 text-sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <TabsList className="bg-neutral-900 border border-neutral-700 h-8">
              <TabsTrigger value="day" className="capitalize w-12 sm:w-18 text-xs sm:text-sm">Day</TabsTrigger>
              <TabsTrigger value="week" className="capitalize w-12 sm:w-18 text-xs sm:text-sm">Week</TabsTrigger>
              <TabsTrigger value="month" className="capitalize w-12 sm:w-18 text-xs sm:text-sm">Month</TabsTrigger>
            </TabsList>
            <Button variant="default" className="rounded-sm h-8 text-xs sm:text-sm" onClick={toggleEventSidebar}>
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <TabsContent value="month" className="flex-1 h-full mt-0">
            <MonthView
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              onContextMenu={handleContextMenu}
            />
          </TabsContent>

          <TabsContent value="day" className="flex-1 h-full mt-0">
            <DayView
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              onContextMenu={handleContextMenu}
            />
          </TabsContent>

          <TabsContent value="week" className="flex-1 h-full mt-0">
            <WeekView
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              onContextMenu={handleContextMenu}
            />
          </TabsContent>
        </div>

        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onCreateEvent={handleCreateEvent}
            onAskAI={handleAskAI}
          />
        )}
      </Card>
    </Tabs>
  )
}
