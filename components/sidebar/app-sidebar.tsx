'use client';

import { useUser } from '@clerk/nextjs';
import * as React from 'react';
import { toast } from 'sonner';
import { NavCalendars } from '@/components/sidebar/cal-accounts';
import { CalendarPicker } from '@/components/sidebar/cal-day-picker';
import { NavUser } from '@/components/sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Premium from './premium';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoaded } = useUser();
  const [selectedEmail, setSelectedEmail] = React.useState('');
  const [calendarList, setCalendarList] = React.useState<
    Array<{
      id: string;
      name: string;
      color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange';
      isVisible: boolean;
      type: 'calendar' | 'class' | 'project';
    }>
  >([]);
  const [emailAccounts, setEmailAccounts] = React.useState<
    Array<{
      email: string;
      isDefault: boolean;
      color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange';
    }>
  >([]);

  const handleEmailChange = (email: string) => {
    setSelectedEmail(email);
  };

  const handleCalendarToggle = (calendarId: string) => {
    setCalendarList((prev) => {
      const existingCalendar = prev.find((cal) => cal.id === calendarId);
      if (existingCalendar) {
        return prev.map((cal) =>
          cal.id === calendarId ? { ...cal, isVisible: !cal.isVisible } : cal
        );
      }
      return [
        ...prev,
        {
          id: calendarId,
          name: '',
          color: 'blue',
          isVisible: true,
          type: 'calendar',
        },
      ];
    });
  };

  const handleCalendarsFetched = React.useCallback((calendars: any[]) => {
    const newCalendars = calendars.map((calendar: any) => ({
      id: calendar.id,
      name: calendar.summary || calendar.name || '',
      color: 'blue' as const,
      isVisible: true,
      type: 'calendar' as const,
    }));

    setCalendarList((prev) => {
      const existingIds = new Set(prev.map((cal) => cal.id));
      const newCalendarsToAdd = newCalendars.filter(
        (cal) => !existingIds.has(cal.id)
      );
      return [...prev, ...newCalendarsToAdd];
    });
  }, []);

  React.useEffect(() => {
    // no auto-redirect; user will link Google via Clerk when needed
  }, [isLoaded, user]);

  React.useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setSelectedEmail(user.primaryEmailAddress.emailAddress);
      setEmailAccounts([
        {
          email: user.primaryEmailAddress.emailAddress,
          isDefault: true,
          color: 'blue',
        },
      ]);
    }
  }, [user?.primaryEmailAddress?.emailAddress]);

  return (
    <Sidebar
      className="overflow-hidden border-none bg-neutral-100 dark:bg-neutral-950"
      variant="inset"
      {...props}
    >
      <SidebarContent className="scrollbar-hide border-none bg-neutral-100 dark:bg-neutral-950">
        <CalendarPicker />
        <NavCalendars
          onCalendarsFetched={handleCalendarsFetched}
          onCalendarToggle={handleCalendarToggle}
        />
      </SidebarContent>
      <SidebarFooter className="border-none bg-neutral-100 dark:bg-neutral-950">
        <div className="mt-auto">
          <Premium />
        </div>
        {user ? (
          <NavUser
            accounts={emailAccounts}
            calendars={calendarList}
            user={{
              name:
                user.fullName || user.primaryEmailAddress?.emailAddress || '',
              email: user.primaryEmailAddress?.emailAddress || '',
              avatar: user.imageUrl || '/vercel.svg',
            }}
          />
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}
