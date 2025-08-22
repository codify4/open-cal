'use client';

import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCalendarManagement } from '@/hooks/use-calendar-management';
import type { NavCalendarsProps } from '@/types/calendar';
import { CalendarList } from './calendar-list';

export function NavCalendars({
  onCalendarToggle,
  onCalendarsFetched,
}: NavCalendarsProps) {
  const {
    fetchedCalendars,
    isLoadingCalendars,
    visibleCalendars,
    colorOptions,
    handleChangeCalendarColor,
    handleDeleteCalendar,
    handleCalendarToggle: calendarToggle,
    refetchCalendars,
  } = useCalendarManagement(onCalendarsFetched);

  const wrappedCalendarToggle = (calendarId: string) => {
    calendarToggle(calendarId);
    onCalendarToggle(calendarId);
  };

  const handleCalendarCreated = () => {
    refetchCalendars();
  };

  return (
    <SidebarGroup className="mt-0 group-data-[collapsible=icon]:hidden">
      <SignedOut>
        <SidebarGroupContent>
          <SignInButton mode="modal">
            <Button>Sign in to Continue</Button>
          </SignInButton>
        </SidebarGroupContent>
      </SignedOut>

      <SignedIn>
        <SidebarMenu>
          <CalendarList
            calendars={fetchedCalendars}
            colorOptions={colorOptions}
            isLoading={isLoadingCalendars}
            onCalendarCreated={handleCalendarCreated}
            onColorChange={handleChangeCalendarColor}
            onDelete={handleDeleteCalendar}
            onToggle={wrappedCalendarToggle}
            visibleCalendars={visibleCalendars}
          />

          <SidebarMenuItem>
            <SignInButton mode="modal">
              <Button
                className="h-auto w-full justify-start gap-2 border-0 px-2 py-1.5 font-normal text-muted-foreground hover:text-foreground"
                size="sm"
                variant="ghost"
              >
                <Plus className="h-3 w-3" />
                <span className="text-xs">Add calendar account</span>
              </Button>
            </SignInButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SignedIn>
    </SidebarGroup>
  );
}
