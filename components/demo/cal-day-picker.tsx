'use client';

import { useEffect } from 'react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { Calendar } from '../ui/calendar';

export function DemoCalendarPicker() {
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
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="sr-only">Calendar</SidebarGroupLabel>
      <SidebarMenu>
        <Calendar
          className="rounded-md bg-neutral-950 text-white"
          mode="single"
          onSelect={handleDateSelect}
          selected={selectedDate}
          weekStartsOn={1}
        />
      </SidebarMenu>
    </SidebarGroup>
  );
}
