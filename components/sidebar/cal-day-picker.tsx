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

  // Sync selected date with current date when current date changes
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
      <SidebarMenu>
        <Calendar
          className="rounded-md bg-neutral-950"
          mode="single"
          onSelect={handleDateSelect}
          selected={selectedDate}
          weekStartsOn={1}
        />
      </SidebarMenu>
    </SidebarGroup>
  );
}
