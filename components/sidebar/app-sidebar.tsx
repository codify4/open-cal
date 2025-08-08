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
import { SignInButton } from '@/components/auth/sign-in-button';


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
    setCalendarList((prev) =>
      prev.map((cal) =>
        cal.id === calendarId ? { ...cal, isVisible: !cal.isVisible } : cal
      )
    );
  };

  React.useEffect(() => {
    if (session?.user?.email) setSelectedEmail(session.user.email);
  }, [session?.user?.email]);

  React.useEffect(() => {
    if (!session?.user?.email) return;
    setEmailAccounts((prev) => {
      const exists = prev.some((acc) => acc.email === session.user.email);
      if (exists) return prev;
      return [
        {
          email: session.user.email,
          isDefault: true,
          color: 'blue',
        },
        ...prev,
      ];
    });
  }, [session?.user?.email]);

  const handleAddAccount = () =>
    authClient.signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}/calendar`,
      errorCallbackURL: `${window.location.origin}/calendar`,
      newUserCallbackURL: `${window.location.origin}/calendar`,
    });

  if (isPending) return null;

  if (!session) {
    return (
      <Sidebar
        className="overflow-hidden border-none bg-neutral-100 dark:bg-neutral-950"
        variant="inset"
        {...props}
      >
        <SidebarContent className="scrollbar-hide border-none bg-neutral-100 dark:bg-neutral-950">
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-3">Sign in to manage calendars.</p>
            <SignInButton />
          </div>
        </SidebarContent>
        <SidebarFooter className="border-none bg-neutral-100 dark:bg-neutral-950">
          <Premium />
        </SidebarFooter>
      </Sidebar>
    );
  }

  return (
    <Sidebar
      className="overflow-hidden border-none bg-neutral-100 dark:bg-neutral-950"
      variant="inset"
      {...props}
    >
      <SidebarContent className="scrollbar-hide border-none bg-neutral-100 dark:bg-neutral-950">
        <CalendarPicker />
        <NavCalendars
          user={{
            name: session.user.name || session.user.email,
            email: session.user.email,
            avatar: ((session.user as unknown as { image?: string })?.image) || '/vercel.svg',
          }}
          onAddAccount={handleAddAccount}
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
      </SidebarFooter>
    </Sidebar>
  );
}

// demo data removed
