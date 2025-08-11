'use client';

import * as React from 'react';
import { NavCalendars } from '@/components/sidebar/cal-accounts';
import { CalendarPicker } from '@/components/sidebar/cal-day-picker';
import { NavUser } from '@/components/sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Premium from './premium';
import { authClient } from '@/lib/auth-client';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = authClient.useSession();
  const [selectedEmail, setSelectedEmail] = React.useState('');
  const [calendarList, setCalendarList] = React.useState<Array<{
    id: string;
    name: string;
    color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange';
    isVisible: boolean;
    type: 'calendar' | 'class' | 'project';
  }>>([]);
  const [emailAccounts, setEmailAccounts] = React.useState<Array<{
    email: string;
    isDefault: boolean;
    color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange';
  }>>([]);

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
      } else {
        return [...prev, { id: calendarId, name: '', color: 'blue', isVisible: true, type: 'calendar' }];
      }
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
    
    setCalendarList(prev => {
      const existingIds = new Set(prev.map(cal => cal.id));
      const newCalendarsToAdd = newCalendars.filter(cal => !existingIds.has(cal.id));
      return [...prev, ...newCalendarsToAdd];
    });
  }, []);

  React.useEffect(() => {
    // no auto-redirect; user will link Google via Better Auth when needed
  }, [isPending, session]);

  React.useEffect(() => {
    if (session?.user?.email) {
      setSelectedEmail(session.user.email);
      setEmailAccounts([
        { email: session.user.email, isDefault: true, color: 'blue' },
      ]);
    }
  }, [session?.user?.email]);

  const handleAddAccount = async () => {
    await authClient.linkSocial({
      provider: 'google',
      scopes: [
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.calendarlist',
        'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
        'https://www.googleapis.com/auth/calendar.freebusy',
      ],
      callbackURL: `${window.location.origin}/calendar`,
      errorCallbackURL: `${window.location.origin}/calendar`,
    });
  };

  const userForNav = session?.user ? {
    name: session.user.name || session.user.email,
    email: session.user.email,
    avatar: (session.user as any)?.image || '/caly.svg',
  } : undefined;

  return (
    <Sidebar
      className="overflow-hidden border-none bg-neutral-100 dark:bg-neutral-950"
      variant="inset"
      {...props}
    >
      <SidebarContent className="scrollbar-hide border-none bg-neutral-100 dark:bg-neutral-950">
        <CalendarPicker />
        <NavCalendars
          emailAccounts={emailAccounts}
          calendars={calendarList}
          selectedEmail={selectedEmail}
          onEmailChange={handleEmailChange}
          onCalendarToggle={handleCalendarToggle}
          onCalendarsFetched={handleCalendarsFetched}
          user={userForNav}
        />
      </SidebarContent>
      <SidebarFooter className="border-none bg-neutral-100 dark:bg-neutral-950">
        <div className="mt-auto">
          <Premium />
        </div>
        {session ? (
          <NavUser
            user={{
              name: session.user.name || session.user.email,
              email: session.user.email,
              avatar: ((session.user as unknown as { image?: string })?.image) || '/vercel.svg',
            }}
            accounts={emailAccounts}
            calendars={calendarList}
            onAddAccount={handleAddAccount}
          />
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}

