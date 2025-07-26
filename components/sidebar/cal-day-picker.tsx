"use client"

import { useAtom } from "jotai"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu
} from "@/components/ui/sidebar"
import { Calendar } from "../ui/calendar"
import { selectedDateAtom, updateCurrentDateAtom } from "@/lib/atoms/cal-atoms"

export function CalendarPicker() {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom)
  const [, updateCurrentDate] = useAtom(updateCurrentDateAtom)
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      updateCurrentDate(date)
    }
  }
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="sr-only">Calendar</SidebarGroupLabel>
      <SidebarMenu>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        className="rounded-md bg-neutral-950"
      />
      </SidebarMenu>
    </SidebarGroup>
  )
}
