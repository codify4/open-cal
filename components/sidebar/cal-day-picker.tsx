"use client"

import { useAtom } from "jotai"
import { useEffect } from "react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu
} from "@/components/ui/sidebar"
import { Calendar } from "../ui/calendar"
import { selectedDateAtom, currentDateAtom, syncSelectedDateAtom } from "@/lib/atoms/cal-atoms"

export function CalendarPicker() {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom)
  const [currentDate] = useAtom(currentDateAtom)
  const [, syncSelectedDate] = useAtom(syncSelectedDateAtom)
  
  // Sync selected date with current date when current date changes
  useEffect(() => {
    if (currentDate && selectedDate?.getTime() !== currentDate.getTime()) {
      setSelectedDate(currentDate)
    }
  }, [currentDate, selectedDate, setSelectedDate])
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      syncSelectedDate(date)
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
