'use client';

import { useEffect } from 'react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { Calendar } from '../ui/calendar';

export function CalendarPicker() {
  const { selectedDate, currentDate, setSelectedDate, setCurrentDate } =
    useCalendarStore((state) => state);

  useEffect(() => {
    if (
      currentDate &&
      (!selectedDate || selectedDate.getTime() !== currentDate.getTime())
    ) {
      setSelectedDate(currentDate);
    }
  }, [currentDate, setSelectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
      console.log('Date selected:', date);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="sr-only">Calendar</SidebarGroupLabel>
      <SidebarMenu className='flex justify-center items-center'>
        <Calendar
          className="rounded-md bg-neutral-100 dark:bg-neutral-950 w-full"
          mode="single"
          onSelect={handleDateSelect}
          selected={selectedDate}
          weekStartsOn={1}
        />
      </SidebarMenu>
    </SidebarGroup>
  );
}
