'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { CalendarTimeline } from '@/components/calendar/shared/calendar-timeline';
import { WeekDayColumn } from '@/components/calendar/week/week-day-column';
import { WeekHeader } from '@/components/calendar/week/week-header';
import { MonthDayCell } from '@/components/calendar/month/month-day-cell';
import { DailyTimeGrid } from '@/components/calendar/daily/daily-time-grid';
import {
  getDaysInMonth,
  getDaysInWeek,
  hours,
} from '@/lib/calendar-utils/calendar-view-utils';
import { useCalendarStore } from '@/providers/calendar-store-provider';

interface SignedOutCalendarGridProps {
  viewType: 'day' | 'week' | 'month';
}

export function SignedOutCalendarGrid({ viewType }: SignedOutCalendarGridProps) {
  const { currentDate, weekStartsOn } = useCalendarStore((state) => state);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const date = currentDate instanceof Date ? currentDate : new Date(currentDate);
  const daysOfWeek = useMemo(() => getDaysInWeek(date, weekStartsOn), [date, weekStartsOn]);
  const daysInMonthArray = getDaysInMonth(date.getMonth(), date.getFullYear());
  
  const startOffset = (new Date(date.getFullYear(), date.getMonth(), 1).getDay() - (weekStartsOn === 'monday' ? 1 : 0) + 7) % 7;
  const lastDateOfPrevMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  
  const daysOfWeekLabels = weekStartsOn === 'monday'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  const daysInNextMonth = new Date(
    nextMonth.getFullYear(),
    nextMonth.getMonth() + 1,
    0
  ).getDate();

  const totalCells = 42; // 6 weeks * 7 days
  const nextMonthDaysNeeded = totalCells - startOffset - daysInMonthArray.length;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && scrollContainerRef.current) {
      const today = new Date();
      const currentDayOfWeek = today.getDay();
      const startDay = weekStartsOn === 'monday' ? 1 : 0;
      const adjustedDayIndex = (currentDayOfWeek - startDay + 7) % 7;
      const dayWidth = scrollContainerRef.current.scrollWidth / 7;
      const scrollPosition = adjustedDayIndex * dayWidth - (scrollContainerRef.current.clientWidth / 2) + (dayWidth / 2);
      
      scrollContainerRef.current.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  }, [isMobile, weekStartsOn]);

  if (viewType === 'day') {
    return (
      <div className="mt-0">
        <div className="flex flex-col gap-4">
          <div className="relative rounded-md bg-default-50 transition duration-400 hover:bg-default-100">
            <div className="relative flex rounded-xl ease-in-out">
              <div className="flex flex-col">
                {hours.map((hour, index) => (
                  <div
                    className="h-[64px] cursor-pointer border-default-200 p-4 text-left text-muted-foreground text-sm transition duration-300"
                    key={`hour-${index}`}
                  >
                    {hour}
                  </div>
                ))}
              </div>
              <div className="relative flex flex-grow flex-col">
                <CalendarTimeline variant="daily" currentDate={date} />
                <div className="relative">
                  <DailyTimeGrid
                    contextMenuTime={null}
                    date={date}
                    detailedHour={null}
                    onAddEvent={() => {}}
                    onAskAI={() => {}}
                    onContextMenuOpen={() => {}}
                    session={{ user: null }}
                    setContextMenuTime={() => {}}
                  />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    );
  }

  if (viewType === 'week') {
    return (
      <div className="w-full">
        <div className="grid grid-cols-9 gap-0">
          <div className="col-span-1 flex items-center justify-center border-border border-r border-b bg-card py-2">
            <span className="font-medium text-muted-foreground text-xs">
              GMT {new Date().getTimezoneOffset() > 0 ? '-' : '+'}
              {Math.abs(new Date().getTimezoneOffset() / 60)}
            </span>
          </div>

          <WeekHeader
            colWidth={Array(7).fill(1)}
            currentDate={date}
            daysOfWeek={daysOfWeek}
            getAllDayEventsForDay={() => []}
            isResizing={false}
            onResizeEnd={() => {}}
          />

          <div className="relative col-span-9 grid grid-cols-9">
            <div className="col-span-1 border-border border-r bg-card">
              {hours.map((hour, index) => (
                <div
                  className={`flex h-[64px] cursor-pointer items-start justify-center border-border px-3 py-2 text-left text-muted-foreground text-xs ${
                    index < hours.length - 1 ? 'border-b' : ''
                  }`}
                  key={`hour-${index}`}
                >
                  {hour}
                </div>
              ))}
            </div>

            <div className="col-span-8 grid h-full" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
              <CalendarTimeline variant="week" currentDate={date} />
              {Array.from({ length: 7 }, (_, dayIndex) => (
                <WeekDayColumn
                  contextMenuTime={null}
                  dayEvents={[]}
                  dayIndex={dayIndex}
                  daysOfWeek={daysOfWeek}
                  detailedHour={null}
                  key={`day-${dayIndex}`}
                  onAddEvent={() => {}}
                  onAskAI={() => {}}
                  onContextMenuOpen={() => {}}
                  onResizeEnd={() => {}}
                  session={{ user: null }}
                  setContextMenuTime={() => {}}
                  updateEventTime={() => {}}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewType === 'month') {
    return (
      <div className='lg:h-screen'>
        <div className='h-full'>
          {isMobile ? (
            <div className="overflow-x-auto h-full" ref={scrollContainerRef}>
              <div className="grid grid-cols-7 min-w-[1500px]">
                {daysOfWeekLabels.map((day, idx) => (
                  <div
                    className="p-3 text-center font-medium text-sm tracking-tight border-b border-border bg-muted/30"
                    key={idx}
                  >
                    {day}
                  </div>
                ))}

                {Array.from({ length: startOffset }).map((_, idx) => (
                  <div className="h-[120px] opacity-80 border-r border-border last:border-r-0" key={`offset-${idx}`}>
                    <div className="relative p-2 font-medium text-sm text-muted-foreground">
                      {lastDateOfPrevMonth - startOffset + idx + 1}
                    </div>
                  </div>
                ))}

                {daysInMonthArray.map((day, dayIndex) => {
                  const cellDate = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    day
                  );
                  const isToday =
                    new Date().getDate() === day &&
                    new Date().getMonth() === date.getMonth() &&
                    new Date().getFullYear() === date.getFullYear();
                  const isLastInRow = (dayIndex + startOffset + 1) % 7 === 0;
                  return (
                    <MonthDayCell
                      cellDate={cellDate}
                      dayEvents={[]}
                      dayNumber={day}
                      isToday={isToday}
                      key={`day-${day}`}
                      onAddEvent={() => {}}
                      onAskAI={() => {}}
                      onContextMenuAddEvent={() => {}}
                      sessionPresent={false}
                      isLastInRow={isLastInRow}
                    />
                  );
                })}

                {Array.from({ length: nextMonthDaysNeeded }).map((_, idx) => (
                  <div className="h-[150px] opacity-80 border-b border-r border-border last:border-r-0" key={`next-month-${idx}`}>
                    <div className="relative p-2 font-medium text-sm text-muted-foreground">
                      {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="grid grid-cols-7 overflow-hidden h-full"
              key={`${date.getFullYear()}-${date.getMonth()}`}
            >
              {daysOfWeekLabels.map((day, idx) => (
                <div
                  className="max-h-[50px] p-2 text-center font-medium text-sm tracking-tight border-b border-border bg-muted/30 last:border-r-0"
                  key={idx}
                >
                  {day}
                </div>
              ))}

              {Array.from({ length: startOffset }).map((_, idx) => (
                <div className="h-[150px] opacity-80 border-b border-r border-border last:border-b-0 last:border-r-0" key={`offset-${idx}`}>
                  <div className="relative p-2 font-medium text-sm text-muted-foreground">
                    {lastDateOfPrevMonth - startOffset + idx + 1}
                  </div>
                </div>
              ))}

              {daysInMonthArray.map((day, dayIndex) => {
                const cellDate = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  day
                );
                const isToday =
                  new Date().getDate() === day &&
                  new Date().getMonth() === date.getMonth() &&
                  new Date().getFullYear() === date.getFullYear();
                const isLastInRow = (dayIndex + startOffset + 1) % 7 === 0;
                return (
                  <MonthDayCell
                    cellDate={cellDate}
                    dayEvents={[]}
                    dayNumber={day}
                    isToday={isToday}
                    key={`day-${day}`}
                    onAddEvent={() => {}}
                    onAskAI={() => {}}
                    onContextMenuAddEvent={() => {}}
                    sessionPresent={false}
                    isLastInRow={isLastInRow}
                  />
                );
              })}

              {Array.from({ length: nextMonthDaysNeeded }).map((_, idx) => (
                <div className="h-[150px] opacity-80 border-b border-r border-border last:border-b-0 last:border-r-0" key={`next-month-${idx}`}>
                  <div className="relative p-2 font-medium text-sm text-muted-foreground">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
