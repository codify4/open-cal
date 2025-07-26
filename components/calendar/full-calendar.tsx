"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Plus, Sparkle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SidebarTrigger } from "../ui/sidebar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Kbd } from "../ui/kbd"

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
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<ViewType>("week")
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
      // Show 7 weeks (3 before, current, 3 after) but center on today
      const today = new Date()
      for (let weekOffset = -3; weekOffset <= 3; weekOffset++) {
        const weekStart = new Date(today)
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
        // Center on current day (day 10 out of 21 days, so index 10)
        const container = containerRef.current
        const dayWidth = container.scrollWidth / 21 // 21 total days
        const centerPosition = dayWidth * 10 // Center on the 11th day (index 10)
        container.scrollLeft = centerPosition
      } else if (viewType === "week") {
        // Center on today's position in the week view
        const container = containerRef.current
        const today = new Date()
        const days = getDaysToShow()

        // Find today's index in the days array
        const todayIndex = days.findIndex((day) => day.toDateString() === today.toDateString())

        if (todayIndex !== -1) {
          const dayWidth = 240 // w-60 = 240px
          const timeColumnWidth = 96 // w-24 = 96px
          const scrollPosition = todayIndex * dayWidth - container.clientWidth / 2 + dayWidth / 2 + timeColumnWidth
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
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } else if (viewType === "week") {
      const today = new Date()
      const startOfWeek = new Date(today)
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
      <Card className="w-full h-full bg-neutral-950 border-neutral-800 text-neutral-100 flex flex-col py-0 gap-0">
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
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <TabsList className="bg-neutral-900 border border-neutral-700">
              <TabsTrigger value="day" className="capitalize w-18">Day</TabsTrigger>
              <TabsTrigger value="week" className="capitalize w-18">Week</TabsTrigger>
              <TabsTrigger value="month" className="capitalize w-18">Month</TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="flex-1 flex flex-col">
        <TabsContent value="month" className="flex-1 h-full mt-0">
          <div className="flex-1 h-full overflow-x-auto overflow-y-hidden scrollbar-hide">
            <div className="flex min-w-max">
              {Array.from({ length: 12 }, (_, monthIndex) => {
                const currentMonth = new Date().getMonth()
                const monthDate = new Date(currentDate.getFullYear(), (currentMonth + monthIndex) % 12, 1)
                return (
                  <div
                    key={monthIndex}
                    className="w-1/3 flex-shrink-0 border-r border-neutral-800 last:border-r-0"
                    onContextMenu={handleContextMenu}
                  >
                    <div className="p-1 border-b border-neutral-800 text-center font-medium">
                      {monthDate.toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                    </div>
                    <div className="grid grid-cols-7 gap-px bg-neutral-800 p-px">
                      {/* Day headers */}
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <div
                          key={day}
                          className="bg-neutral-950 p-1 text-sm font-medium text-center text-neutral-400 border-b border-neutral-800"
                        >
                          {day}
                        </div>
                      ))}
                      {/* Month days */}
                      {Array.from({ length: 35 }, (_, index) => {
                        const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
                        const startDate = new Date(firstDay)
                        const dayOfWeek = firstDay.getDay()
                        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
                        startDate.setDate(firstDay.getDate() + mondayOffset + index - 1)

                        const isCurrentMonth = startDate.getMonth() === monthDate.getMonth()
                        const isToday = startDate.toDateString() === new Date().toDateString()

                      return (
                        <div
                          key={index}
                          className={`bg-neutral-950 min-h-[120px] p-3 hover:bg-neutral-900/50 transition-colors cursor-pointer ${
                            !isCurrentMonth ? "text-neutral-600" : ""
                          } ${isToday ? "bg-neutral-900 border border-amber-400" : ""}`}
                          onContextMenu={handleContextMenu}
                        >
                          <div className={`text-sm font-medium mb-2 ${isToday ? "text-amber-400" : ""}`}>
                            {startDate.getDate()}
                          </div>
                        </div>
                      )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="day" className="flex-1 h-full mt-0">
          <div className="flex-1 h-full flex flex-col overflow-hidden">
            {/* Horizontal Scrollable Container */}
            <div
              ref={containerRef}
              className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide"
              style={{
                scrollSnapType: "x mandatory",
              }}
            >
              <div
                ref={gridRef}
                className="relative h-full min-w-max"
                onContextMenu={handleContextMenu}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Cursor Line */}
                {cursorPosition && (
                  <div
                    className="absolute w-full h-px bg-amber-400 pointer-events-none z-10"
                    style={{ top: cursorPosition.y }}
                  />
                )}

                {/* Grid Header */}
                <div className="flex sticky top-0 bg-neutral-950 border-b border-neutral-800 z-20">
                  <div className="w-16 p-2 border-r border-neutral-800 text-sm font-medium flex-shrink-0 sticky left-0 z-30 bg-neutral-950">
                    Time
                  </div>
                  {getDaysToShow().map((day, index) => {
                    const isToday = day.toDateString() === new Date().toDateString()
                    return (
                      <div
                        key={index}
                        className="flex-shrink-0 p-2 border-r border-neutral-800 text-sm font-medium text-center"
                        style={{
                          width: "calc(100vw - 96px)",
                          scrollSnapAlign: "start",
                        }}
                      >
                        {formatDate(day)}
                      </div>
                    )
                  })}
                </div>

                {/* Time Grid */}
                <div className="flex flex-col h-full">
                  {hours.map((hour) => (
                    <div key={hour} className="flex border-b border-neutral-800" style={{ height: cellHeight }}>
                      <div className="w-16 p-1 text-center border-r border-neutral-800 text-sm text-neutral-400 flex items-center justify-end flex-shrink-0 sticky left-0 z-30 bg-neutral-950">
                        {formatTime(hour)}
                      </div>
                      {getDaysToShow().map((day, dayIndex) => {
                        const isToday = day.toDateString() === new Date().toDateString()
                        return (
                          <div
                            key={`${hour}-${dayIndex}`}
                            className="flex-shrink-0 border-r border-neutral-800 hover:bg-neutral-900/50 transition-colors cursor-pointer"
                            style={{
                              width: "calc(100vw - 96px)",
                              scrollSnapAlign: "start",
                            }}
                            onContextMenu={handleContextMenu}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="week" className="flex-1 h-full mt-0">
          <div className="flex-1 h-full flex flex-col overflow-hidden">
            {/* Horizontal Scrollable Container */}
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
                onContextMenu={handleContextMenu}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Cursor Line */}
                {cursorPosition && (
                  <div
                    className="absolute w-full h-px bg-amber-400 pointer-events-none z-10"
                    style={{ top: cursorPosition.y }}
                  />
                )}

                {/* Grid Header */}
                <div className="flex sticky top-0 bg-neutral-950 border-b border-neutral-800 z-20">
                  <div className="w-16 p-2 border-r border-neutral-800 text-sm font-medium flex-shrink-0 sticky left-0 z-30 bg-neutral-950">
                    Time
                  </div>
                  {getDaysToShow().map((day, index) => {
                    const isToday = day.toDateString() === new Date().toDateString()
                    return (
                      <div
                        key={index}
                        className={`w-60 p-2 border-r border-neutral-800 text-sm font-medium text-center flex-shrink-0 ${
                          isToday ? "bg-neutral-900 text-amber-400" : ""
                        }`}
                      >
                        {formatDate(day)}
                      </div>
                    )
                  })}
                </div>

                {/* Time Grid */}
                <div className="flex flex-col h-full">
                  {hours.map((hour) => (
                    <div key={hour} className="flex border-b border-neutral-800" style={{ height: cellHeight }}>
                      <div className="w-16 p-1 text-center border-r border-neutral-800 text-sm text-neutral-400 flex items-center justify-end flex-shrink-0 sticky left-0 z-30 bg-neutral-950">
                        {formatTime(hour)}
                      </div>
                      {getDaysToShow().map((day, dayIndex) => {
                        const isToday = day.toDateString() === new Date().toDateString()
                        return (
                          <div
                            key={`${hour}-${dayIndex}`}
                            className={`w-60 border-r border-neutral-800 hover:bg-neutral-900/50 transition-colors cursor-pointer flex-shrink-0 ${
                              isToday ? "bg-neutral-900/20" : ""
                            }`}
                            onContextMenu={handleContextMenu}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
