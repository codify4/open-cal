"use client"

import * as React from "react"
import {
  ChevronRight,
  Mail,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Checkbox } from "../ui/checkbox"

interface CalendarEntry {
  id: string
  name: string
  color: "blue" | "green" | "red" | "yellow" | "purple" | "orange"
  isVisible: boolean
  type: "calendar" | "class" | "project"
}

interface EmailAccount {
  email: string
  isDefault: boolean
  color: "blue" | "green" | "red" | "yellow" | "purple" | "orange"
}

interface NavCalendarsProps {
  emailAccounts: EmailAccount[]
  calendars: CalendarEntry[]
  selectedEmail: string
  onEmailChange: (email: string) => void
  onCalendarToggle: (calendarId: string) => void
}

const getColorClasses = (color: CalendarEntry["color"] | EmailAccount["color"]) => {
  const colorMap = {
    blue: "bg-blue-500",
    green: "bg-green-500", 
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500"
  }
  return colorMap[color]
}

export function NavCalendars({
  emailAccounts,
  calendars,
  selectedEmail,
  onEmailChange,
  onCalendarToggle,
}: NavCalendarsProps) {
  const { isMobile } = useSidebar()
  const selectedAccount = emailAccounts.find(acc => acc.email === selectedEmail)

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden mt-0">
      <SidebarGroupLabel>Account</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="w-full justify-between cursor-pointer py-5 hover:bg-primary/10 hover:text-primary focus:bg-transparent active:bg-transparent rounded-sm focus:outline-none focus:ring-0">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getColorClasses(selectedAccount?.color || "blue")}`} />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium truncate">
                      {selectedAccount?.email || "Select Account"}
                    </span>
                    {selectedAccount?.isDefault && (
                      <span className="text-xs text-muted-foreground">Default</span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 bg-neutral-950"
              side={isMobile ? "bottom" : "right"}
              align={isMobile ? "end" : "start"}
            >
              {emailAccounts.map((account) => (
                <DropdownMenuItem
                  key={account.email}
                  onClick={() => onEmailChange(account.email)}
                  className="flex items-center gap-2"
                >
                  <div className={`w-3 h-3 rounded-full ${getColorClasses(account.color)}`} />
                  <div className="flex flex-col">
                    <span className="text-sm">{account.email}</span>
                    {account.isDefault && (
                      <span className="text-xs text-muted-foreground">Default</span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <SidebarGroupLabel className="mt-2">Calendars</SidebarGroupLabel>
      <SidebarMenu>
        {calendars.map((calendar) => (
          <SidebarMenuItem key={calendar.id}>
            <SidebarMenuButton 
              className="w-full justify-between cursor-pointer hover:bg-transparent hover:text-primary/70 focus:bg-transparent active:bg-transparent data-[state=open]:bg-transparent rounded-none focus:outline-none focus:ring-0"
              onClick={() => onCalendarToggle(calendar.id)}
            >
              <div className="flex items-center gap-2">
                <Checkbox 
                  checked={calendar.isVisible}
                  onCheckedChange={() => onCalendarToggle(calendar.id)}
                  color={getColorClasses(calendar.color)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-sm truncate">{calendar.name}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
