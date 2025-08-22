'use client';

import { useSession } from '@clerk/nextjs';
import { ChevronDown, ChevronRight } from 'lucide-react';
import React, { useMemo, useState, useCallback } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { ColorOption, GoogleCalendar } from '@/types/calendar';
import { CalendarDropdown } from './calendar-dropdown';
import { CreateCalendarDropdown } from './create-calendar-dropdown';

interface CalendarListProps {
  calendars: GoogleCalendar[];
  visibleCalendars: Set<string>;
  colorOptions: ColorOption[];
  isLoading: boolean;
  onToggle: (calendarId: string) => void;
  onColorChange: (calendarId: string, colorId: string) => void;
  onDelete: (calendarId: string) => void;
  onCalendarCreated: () => void;
}

export function CalendarList({
  calendars,
  visibleCalendars,
  colorOptions,
  isLoading,
  onToggle,
  onColorChange,
  onDelete,
  onCalendarCreated,
}: CalendarListProps) {
  const { session: currentSession } = useSession();
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(
    new Set()
  );

  const groupedCalendars = useMemo(() => {
    const groups: Record<string, GoogleCalendar[]> = {};
    const currentEmail =
      currentSession?.user?.primaryEmailAddress?.emailAddress;

    calendars.forEach((calendar) => {
      const accountEmail =
        calendar.account || currentEmail || 'Unknown Account';
      if (!groups[accountEmail]) {
        groups[accountEmail] = [];
      }
      groups[accountEmail].push(calendar);
    });

    Object.keys(groups).forEach((email) => {
      groups[email].sort((a, b) => {
        if (a.primary && !b.primary) return -1;
        if (!a.primary && b.primary) return 1;
        return (a.summary || a.name || '').localeCompare(
          b.summary || b.name || ''
        );
      });
    });

    const sortedGroups: Record<string, GoogleCalendar[]> = {};
    const currentAccountCalendars = groups[currentEmail || ''] || [];
    const otherAccounts = Object.keys(groups).filter(
      (email) => email !== currentEmail
    );

    if (currentAccountCalendars.length > 0) {
      sortedGroups[currentEmail || ''] = currentAccountCalendars;
    }

    otherAccounts.forEach((email) => {
      sortedGroups[email] = groups[email];
    });

    return sortedGroups;
  }, [calendars, currentSession?.user?.primaryEmailAddress?.emailAddress]);

  React.useEffect(() => {
    const currentEmail =
      currentSession?.user?.primaryEmailAddress?.emailAddress;
    if (currentEmail) {
      setExpandedAccounts((prev) => new Set(prev).add(currentEmail));
    }
  }, [currentSession?.user?.primaryEmailAddress?.emailAddress]);

  const toggleAccountExpansion = useCallback((accountEmail: string) => {
    setExpandedAccounts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(accountEmail)) {
        newSet.delete(accountEmail);
      } else {
        newSet.add(accountEmail);
      }
      return newSet;
    });
  }, []);

  const handleCalendarToggle = useCallback((calendarId: string) => {
    onToggle(calendarId);
  }, [onToggle]);

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="px-2 py-1.5 text-muted-foreground text-sm">
            Loading calendars...
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (calendars.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="px-2 py-1.5 text-muted-foreground text-sm">
            No calendars found. Add a Google Calendar account to get started.
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <div className="space-y-2">
      {Object.entries(groupedCalendars).map(
        ([accountEmail, accountCalendars]) => {
          const isExpanded = expandedAccounts.has(accountEmail);

          return (
            <Collapsible
              key={accountEmail}
              onOpenChange={() => toggleAccountExpansion(accountEmail)}
              open={isExpanded}
            >
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 font-medium text-muted-foreground text-xs hover:bg-accent hover:text-accent-foreground">
                  <div className="flex items-center gap-1">
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                    <span className="truncate">{accountEmail}</span>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <CreateCalendarDropdown
                      onCalendarCreated={onCalendarCreated}
                      targetAccount={accountEmail}
                    />
                  </div>
                </SidebarGroupLabel>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenu>
                  {accountCalendars.map((calendar) => {
                    const calendarColor = 
                      calendar.backgroundColor || 
                      colorOptions.find(opt => opt.id === calendar.colorId)?.background || 
                      '#3b82f6';
                    
                    console.log(`Calendar ${calendar.summary || calendar.name}:`, {
                      colorId: calendar.colorId,
                      backgroundColor: calendar.backgroundColor,
                      foundColor: colorOptions.find(opt => opt.id === calendar.colorId)?.background,
                      finalColor: calendarColor
                    });

                    return (
                      <SidebarMenuItem key={calendar.id}>
                        <div className="flex w-full items-center gap-2 rounded-sm px-2 py-1">
                          <Checkbox
                            checked={visibleCalendars.has(calendar.id)}
                            className="cursor-pointer"
                            color={calendarColor}
                            onCheckedChange={() => handleCalendarToggle(calendar.id)}
                          />
                          <span 
                            className="min-w-0 flex-1 truncate text-sm cursor-pointer hover:text-accent-foreground"
                            onClick={() => onToggle(calendar.id)}
                          >
                            {calendar.summary || calendar.name}
                          </span>
                          {calendar.primary &&
                            calendar.account ===
                              currentSession?.user?.primaryEmailAddress
                                ?.emailAddress && (
                              <span className="max-w-16 flex-shrink-0 truncate text-muted-foreground text-xs">
                                Default
                              </span>
                            )}
                          <CalendarDropdown
                            calendar={calendar}
                            colorOptions={colorOptions}
                            onColorChange={onColorChange}
                            onDelete={onDelete}
                          />
                        </div>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </CollapsibleContent>
            </Collapsible>
          );
        }
      )}
    </div>
  );
}
