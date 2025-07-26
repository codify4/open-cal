"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useAtom } from "jotai"
import { ChevronLeft, ChevronRight, Sparkle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SidebarTrigger } from "../ui/sidebar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Kbd } from "../ui/kbd"
import { currentDateAtom, viewTypeAtom } from "@/lib/atoms/cal-atoms"
import dynamic from "next/dynamic"
import { startTransition } from "react"
import AddEvent from "../event/add-event"

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

const DayView = dynamic(() => import("@/components/calendar/view-day"), { ssr: false })
const WeekView = dynamic(() => import("@/components/calendar/view-week"), { ssr: false })
const MonthView = dynamic(() => import("@/components/calendar/view-month"), { ssr: false })

export default function FullCalendar() {
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom)
  const [viewType, setViewType] = useAtom(viewTypeAtom)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null)

  const gridRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate hours array (24 hours)
  const hours = Array.from({ length: 24 }, (_, i) => i)

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

  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`
  }

  const formatDate = (date: Date) => {
    if (viewType === "day") {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    }
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gridRef.current && viewType !== "month") {
      const rect = gridRef.current.getBoundingClientRect()
      setCursorPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseLeave = () => {
    setCursorPosition(null)
  }

  const navigateDate = (direction: "prev" | "next") => {
    startTransition(() => {
      const newDate = new Date(currentDate)

      if (viewType === "day") {
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
      } else if (viewType === "week") {
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
      } else if (viewType === "month") {
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
      }

      setCurrentDate(newDate)
    })
  }

  const getViewTitle = () => {
    if (viewType === "day") {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } else if (viewType === "week") {
      const startOfWeek = new Date(currentDate)
      const dayOfWeek = startOfWeek.getDay()
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
      startOfWeek.setDate(startOfWeek.getDate() + mondayOffset)

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      return `${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    } else {
      return currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    }
  }

  // Calculate cell height to fit all hours in viewport
  const cellHeight = viewType !== "month" ? "calc((100vh - 200px) / 20)" : "auto"

  // Get day column width based on view type
  const getDayColumnWidth = () => {
    if (viewType === "day") return "calc(100vw - 96px)" // Full width minus time column
    if (viewType === "week") return "w-60" // Bigger for week view
    return "w-48"
  }

  return (
    <Tabs value={viewType} onValueChange={(value) => setViewType(value as ViewType)} className="w-full h-full">
      <Card className="w-full h-full bg-neutral-900 border-neutral-800 text-neutral-100 flex flex-col py-0 gap-0">
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-neutral-800">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">{getViewTitle()}</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate("prev")}
                className="text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate("next")}
                className="text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="bg-muted rounded-sm w-20 h-8 text-sm"
              onClick={() => {
                const today = new Date()
                setCurrentDate(today)
              }}
            >
              Today
            </Button>
            <TabsList className="bg-neutral-900 border border-neutral-700">
              <TabsTrigger value="day" className="capitalize w-18">Day</TabsTrigger>
              <TabsTrigger value="week" className="capitalize w-18">Week</TabsTrigger>
              <TabsTrigger value="month" className="capitalize w-18">Month</TabsTrigger>
            </TabsList>
            <AddEvent />
          </div>
        </div>

        {/* Calendar Content */}
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

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onCreateEvent={() => {
            console.log("Create Event clicked")
            setContextMenu(null)
          }}
          onAskAI={() => {
            console.log("Ask AI clicked")
            setContextMenu(null)
          }}
        />
      )}
    </Card>
  </Tabs>
  )
}
