import React, { useRef, useEffect, useCallback } from "react"

type WeekViewProps = {
  currentDate: Date
  setCurrentDate: (date: Date) => void
  onContextMenu: (e: React.MouseEvent) => void
}

const hours = Array.from({ length: 24 }, (_, i) => i)

const WeekView: React.FC<WeekViewProps> = ({ currentDate, setCurrentDate, onContextMenu }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

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

  return (
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
            <div className="w-16 p-2 border-r border-neutral-800 text-sm font-medium flex-shrink-0 sticky left-0 z-30 bg-neutral-900">
              Time
            </div>
            {getDaysToShow().map((day, index) => {
              const isToday = day.toDateString() === new Date().toDateString()
              return (
                <div
                  key={index}
                  className={`w-60 p-2 text-sm font-medium text-center flex-shrink-0 ${
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
              <div key={hour} className="flex border-b border-neutral-800" style={{ height: "calc((100vh - 200px) / 20)" }}>
                <div className="w-16 p-1 text-center border-r border-neutral-800 text-sm text-neutral-400 flex items-center justify-end flex-shrink-0 sticky left-0 z-30 bg-neutral-900">
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
                      onContextMenu={onContextMenu}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeekView; 