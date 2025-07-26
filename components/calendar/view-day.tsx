import React, { useRef, useEffect, useCallback } from "react"

type DayViewProps = {
  currentDate: Date
  setCurrentDate: (date: Date) => void
  onContextMenu: (e: React.MouseEvent) => void
}

const hours = Array.from({ length: 24 }, (_, i) => i)

const DayView: React.FC<DayViewProps> = ({ currentDate, setCurrentDate, onContextMenu }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Generate extended days for horizontal scrolling (1 year past + 1 year future)
  const getDaysToShow = useCallback(() => {
    const days = []
    const baseDate = new Date(currentDate)
    
    // Generate 730 days (1 year past + 1 year future)
    for (let i = -365; i <= 365; i++) {
      const day = new Date(baseDate)
      day.setDate(baseDate.getDate() + i)
      days.push(day)
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
        const dayWidth = container.scrollWidth / 730 // 730 total days
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

  return (
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
          {/* Grid Header */}
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

          {/* Time Grid */}
          <div className="flex flex-col h-full">
            {hours.map((hour) => (
              <div key={hour} className="flex border-b bg-neutral-900 border-neutral-800" style={{ height: "calc((100vh - 200px) / 20)" }}>
                <div className="w-12 sm:w-16 p-1 text-center border-r border-neutral-800 text-xs sm:text-sm text-neutral-400 flex items-center justify-end flex-shrink-0 sticky left-0 z-30 bg-neutral-900">
                  {formatTime(hour)}
                </div>
                {getDaysToShow().map((day, dayIndex) => {
                  const isToday = day.toDateString() === new Date().toDateString()
                  return (
                    <div
                      key={`${hour}-${dayIndex}`}
                      className="flex-shrink-0 border-r border-neutral-800 hover:bg-neutral-900/50 transition-colors cursor-pointer"
                      style={{
                        width: "calc(100vw - 48px)",
                        minWidth: "280px",
                      }}
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

export default DayView;