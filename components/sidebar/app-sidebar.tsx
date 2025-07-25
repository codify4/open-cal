"use client"

import * as React from "react"
import {
  Frame,
  Map,
  PieChart,
} from "lucide-react"

import { CalendarPicker } from "@/components/sidebar/cal-day-picker"
import { NavCalendars } from "@/components/sidebar/cal-accounts"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter
} from "@/components/ui/sidebar"

const emailAccounts = [
  {
    email: "kushta.joni@gmail.com",
    isDefault: true,
    color: "red" as const,
  },
  {
    email: "john.doe@gmail.com",
    isDefault: false,
    color: "blue" as const,
  },
]

const calendars = [
  {
    id: "1",
    name: "11B Informatike Teknike",
    color: "blue" as const,
    isVisible: false,
    type: "class" as const,
  },
  {
    id: "2", 
    name: "KLASA XIB GR2",
    color: "blue" as const,
    isVisible: false,
    type: "class" as const,
  },
  {
    id: "3",
    name: "Klasa 11B DB-SY",
    color: "green" as const,
    isVisible: false,
    type: "class" as const,
  },
  {
    id: "4",
    name: "Programim 11B 2024-2025",
    color: "green" as const,
    isVisible: false,
    type: "class" as const,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [selectedEmail, setSelectedEmail] = React.useState("kushta.joni@gmail.com")
  const [calendarList, setCalendarList] = React.useState(calendars)

  const handleEmailChange = (email: string) => {
    setSelectedEmail(email)
  }

  const handleCalendarToggle = (calendarId: string) => {
    setCalendarList(prev => 
      prev.map(cal => 
        cal.id === calendarId 
          ? { ...cal, isVisible: !cal.isVisible }
          : cal
      )
    )
  }

  return (
    <Sidebar variant="inset" className="bg-neutral-950 border-none overflow-hidden" {...props}>
      <SidebarContent className="bg-neutral-950 border-none">
        <CalendarPicker />
        <NavCalendars 
          emailAccounts={emailAccounts}
          calendars={calendarList}
          selectedEmail={selectedEmail}
          onEmailChange={handleEmailChange}
          onCalendarToggle={handleCalendarToggle}
        />
      </SidebarContent>
      <SidebarFooter className="bg-neutral-950 border-none">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}
