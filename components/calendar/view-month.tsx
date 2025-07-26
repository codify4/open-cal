import React, { useRef, useEffect, useCallback } from "react"

type MonthViewProps = {
  currentDate: Date
  setCurrentDate: (date: Date) => void
  onContextMenu: (e: React.MouseEvent) => void
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate, setCurrentDate, onContextMenu }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate extended months for horizontal scrolling (1 year past + 1 year future)
  const getMonthsToShow = useCallback(() => {
    const months = []
    const baseDate = new Date(currentDate)
    
    // Generate 24 months (1 year past + 1 year future)
    for (let monthOffset = -12; monthOffset <= 12; monthOffset++) {
      const monthDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, 1)
      months.push(monthDate)
    }
    
    return months
  }, [currentDate])

  // Scroll to center on selected month
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current
      const months = getMonthsToShow()
      
      // Find the selected month's index
      const selectedIndex = months.findIndex((month) => 
        month.getMonth() === currentDate.getMonth() && 
        month.getFullYear() === currentDate.getFullYear()
      )
      
      if (selectedIndex !== -1) {
        const monthWidth = container.scrollWidth / 24 // 24 total months
        const centerPosition = monthWidth * selectedIndex
        container.scrollLeft = centerPosition
      }
    }
  }, [currentDate, getMonthsToShow])

  return (
    <div 
      ref={containerRef}
      className="flex-1 h-full overflow-x-auto overflow-y-hidden scrollbar-hide"
    >
      <div className="flex min-w-max">
        {getMonthsToShow().map((monthDate, monthIndex) => (
          <div key={monthIndex} className="w-1/4 flex-shrink-0 border-r border-neutral-800 last:border-r-0" onContextMenu={onContextMenu}>
            <div className="p-1 border-b border-neutral-800 text-center font-medium">
              {monthDate.toLocaleDateString("en-US", { year: "numeric", month: "long" })}
            </div>
            <div className="grid grid-cols-7 gap-px bg-neutral-800 p-px">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="bg-neutral-900 p-1 text-sm font-medium text-center text-neutral-400 border-b border-neutral-800">
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
                  <div key={index} className={`bg-neutral-900 min-h-[120px] p-1 hover:bg-neutral-900/50 transition-colors cursor-pointer ${!isCurrentMonth ? "text-neutral-600" : ""} ${isToday ? "bg-neutral-900 border border-red-400" : ""}`} onContextMenu={onContextMenu}>
                    <div className={`text-sm font-medium mb-2 ${isToday ? "text-red-400" : ""}`}>{startDate.getDate()}</div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MonthView; 