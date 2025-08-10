'use client';

import { Frame, Map, PieChart } from 'lucide-react';
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
import { useAction, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = authClient.useSession();
  const accounts = useQuery(api.google.getAccounts, {});
  const listCalendarsAction = useAction(api.google.listCalendars);
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
    setCalendarList((prev) =>
      prev.map((cal) =>
        cal.id === calendarId ? { ...cal, isVisible: !cal.isVisible } : cal
      )
    );
  };

  React.useEffect(() => {
    // no auto-redirect; user will link Google via Better Auth when needed
  }, [isPending, session, accounts]);

  React.useEffect(() => {
    if (!accounts || accounts.length === 0) {
      if (session?.user?.email) setSelectedEmail(session.user.email);
      return;
    }
    if (selectedEmail && accounts.some((a) => a.email === selectedEmail)) return;
    setSelectedEmail(accounts[0]?.email || selectedEmail);
  }, [accounts, session?.user?.email]);

  React.useEffect(() => {
    if (accounts && accounts.length > 0) {
      setEmailAccounts(
        accounts.map((a, idx) => ({
          email: a.email,
          isDefault: idx === 0,
          color: 'blue',
        }))
      );
      return;
    }
    if (session?.user?.email) {
      setEmailAccounts([
        { email: session.user.email, isDefault: true, color: 'blue' },
      ]);
    }
  }, [accounts, session?.user?.email]);

  React.useEffect(() => {
    if (!accounts || accounts.length === 0 || !selectedEmail) {
      setCalendarList([]);
      return;
    }
    const account = accounts.find((a) => a.email === selectedEmail);
    if (!account) {
      setCalendarList([]);
      return;
    }
    listCalendarsAction({ accountId: account._id })
      .then((cals) => {
        setCalendarList(cals as any);
      })
      .catch(() => setCalendarList([]));
  }, [accounts, selectedEmail, listCalendarsAction]);

  const handleAddAccount = async () => {
    await authClient.linkSocial({
      provider: 'google',
      scopes: [
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
        'https://www.googleapis.com/auth/calendar.freebusy',
      ],
      callbackURL: `${window.location.origin}/calendar`,
      errorCallbackURL: `${window.location.origin}/calendar`,
    })
  }

  if (isPending) return null;

  return (
    <Sidebar
      className="overflow-hidden border-none bg-neutral-100 dark:bg-neutral-950"
      variant="inset"
      {...props}
    >
      <SidebarContent className="scrollbar-hide border-none bg-neutral-100 dark:bg-neutral-950">
        <CalendarPicker />
        <NavCalendars
          user={session ? {
            name: session.user.name || session.user.email,
            email: session.user.email,
            avatar: ((session.user as unknown as { image?: string })?.image) || '/caly.svg',
          } : undefined}
          calendars={calendarList}
          emailAccounts={emailAccounts}
          onCalendarToggle={handleCalendarToggle}
          onEmailChange={handleEmailChange}
          selectedEmail={selectedEmail}
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

// demo data removed
