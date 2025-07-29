"use client"

import { useEffect } from "react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu
} from "@/components/ui/sidebar"
import { Calendar } from "../ui/calendar"
import { useCalendarStore } from "@/providers/calendar-store-provider"

export function CalendarPicker() {
    const {
    selectedDate,
    currentDate,
    setSelectedDate,
    setCurrentDate
  } = useCalendarStore((state) => state)
  
  // Sync selected date with current date when current date changes
  useEffect(() => {
    if (currentDate && (!selectedDate || selectedDate.getTime() !== currentDate.getTime())) {
      setSelectedDate(currentDate)
    }
  }, [currentDate, setSelectedDate])
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date)
      console.log("Date selected:", date)
    }
  }
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="sr-only">Calendar</SidebarGroupLabel>
      <SidebarMenu>
      <Calendar
        mode="single"
        weekStartsOn={1}
        selected={selectedDate}
        onSelect={handleDateSelect}
        className="rounded-md bg-neutral-950"
      />
      </SidebarMenu>
    </SidebarGroup>
  )
}
