"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu
} from "@/components/ui/sidebar"
import { Calendar } from "../ui/calendar"
import { useState } from "react"

export function CalendarPicker() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="sr-only">Calendar</SidebarGroupLabel>
      <SidebarMenu>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md bg-neutral-950"
      />
      </SidebarMenu>
    </SidebarGroup>
  )
}
