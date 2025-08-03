'use client';

import { ChevronRight, Mail } from 'lucide-react';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Checkbox } from '../ui/checkbox';

interface CalendarEntry {
  id: string;
  name: string;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange';
  isVisible: boolean;
  type: 'calendar' | 'class' | 'project';
}

interface EmailAccount {
  email: string;
  isDefault: boolean;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange';
}

interface NavCalendarsProps {
  emailAccounts: EmailAccount[];
  calendars: CalendarEntry[];
  selectedEmail: string;
  onEmailChange: (email: string) => void;
  onCalendarToggle: (calendarId: string) => void;
}

const getColorClasses = (
  color: CalendarEntry['color'] | EmailAccount['color']
) => {
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };
  return colorMap[color];
};

export function NavCalendars({
  emailAccounts,
  calendars,
  selectedEmail,
  onEmailChange,
  onCalendarToggle,
}: NavCalendarsProps) {
  const { isMobile } = useSidebar();
  const selectedAccount = emailAccounts.find(
    (acc) => acc.email === selectedEmail
  );

  return (
    <SidebarGroup className="mt-0 group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Account</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="w-full cursor-pointer justify-between rounded-sm py-5 hover:bg-primary/10 hover:text-primary focus:bg-transparent focus:outline-none focus:ring-0 active:bg-transparent">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${getColorClasses(selectedAccount?.color || 'blue')}`}
                  />
                  <div className="flex flex-col items-start">
                    <span className="truncate font-medium text-sm">
                      {selectedAccount?.email || 'Select Account'}
                    </span>
                    {selectedAccount?.isDefault && (
                      <span className="text-muted-foreground text-xs">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={isMobile ? 'end' : 'start'}
              className="w-64 bg-background dark:bg-neutral-950"
              side={isMobile ? 'bottom' : 'right'}
            >
              {emailAccounts.map((account) => (
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  key={account.email}
                  onClick={() => onEmailChange(account.email)}
                >
                  <div
                    className={`h-3 w-3 rounded-full ${getColorClasses(account.color)}`}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm">{account.email}</span>
                    {account.isDefault && (
                      <span className="text-muted-foreground text-xs">
                        Default
                      </span>
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
            <div
              className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-transparent hover:text-primary"
              onClick={() => onCalendarToggle(calendar.id)}
            >
              <Checkbox
                checked={calendar.isVisible}
                className="cursor-pointer"
                color={getColorClasses(calendar.color)}
                onCheckedChange={() => onCalendarToggle(calendar.id)}
              />
              <span className="flex-1 truncate text-sm">{calendar.name}</span>
            </div>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
