'use client';

import { useMemo } from 'react';
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
  const { currentDate } = useCalendarStore((state) => state);
  
  const date = currentDate instanceof Date ? currentDate : new Date(currentDate);
  const daysOfWeek = useMemo(() => getDaysInWeek(date), [date]);
  const daysInMonthArray = getDaysInMonth(date.getMonth(), date.getFullYear());
  
  const weekStartsOn = 'sunday' as 'sunday' | 'monday';
  const startOffset = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const lastDateOfPrevMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  
  const daysOfWeekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
      <div className="w-full">
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {daysOfWeekLabels.map((day, idx) => (
            <div
              className="my-8 text-left font-medium text-4xl tracking-tighter"
              key={idx}
            >
              {day}
            </div>
          ))}

          {Array.from({ length: startOffset }).map((_, idx) => (
            <div className="h-[150px] opacity-50" key={`offset-${idx}`}>
              <div className="relative mb-1 font-semibold text-3xl">
                {lastDateOfPrevMonth - startOffset + idx + 1}
              </div>
            </div>
          ))}

          {daysInMonthArray.map((day) => {
            const cellDate = new Date(
              date.getFullYear(),
              date.getMonth(),
              day
            );
            const isToday =
              new Date().getDate() === day &&
              new Date().getMonth() === date.getMonth() &&
              new Date().getFullYear() === date.getFullYear();
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
              />
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
