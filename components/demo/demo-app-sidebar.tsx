'use client';

import { Frame, Map, PieChart } from 'lucide-react';
import * as React from 'react';
import { DemoNavCalendars } from '@/components/demo/cal-accounts';
import { DemoCalendarPicker } from '@/components/demo/cal-day-picker';
import { DemoNavUser } from '@/components/demo/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';

const emailAccounts = [
  {
    email: 'anne.smith@gmail.com',
    isDefault: true,
    color: 'red' as const,
  },
  {
    email: 'john.doe@gmail.com',
    isDefault: false,
    color: 'blue' as const,
  },
];

const calendars = [
  {
    id: '1',
    name: 'Team Meetings',
    color: 'blue' as const,
    isVisible: false,
    type: 'class' as const,
  },
  {
    id: '2',
    name: 'Project Alpha',
    color: 'purple' as const,
    isVisible: false,
    type: 'class' as const,
  },
  {
    id: '3',
    name: 'Personal Errands',
    color: 'red' as const,
    isVisible: false,
    type: 'class' as const,
  },
  {
    id: '4',
    name: 'Client Consultations',
    color: 'green' as const,
    isVisible: false,
    type: 'class' as const,
  },
];

export function DemoAppSidebar({ ...props }: React.ComponentProps<'div'>) {
  const [selectedEmail, setSelectedEmail] = React.useState(
    'kushta.joni@gmail.com'
  );
  const [calendarList, setCalendarList] = React.useState(calendars);

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

  return (
    <Sidebar
      className="overflow-hidden border-none bg-neutral-950"
      collapsible="none"
      variant="inset"
      {...props}
    >
      <SidebarContent className="scrollbar-hide border-none bg-neutral-950">
        <DemoCalendarPicker />
        <DemoNavCalendars
          calendars={calendarList}
          emailAccounts={emailAccounts}
          onCalendarToggle={handleCalendarToggle}
          onEmailChange={handleEmailChange}
          selectedEmail={selectedEmail}
        />
      </SidebarContent>
      <SidebarFooter className="border-none bg-neutral-950">
        <DemoNavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/vercel.svg',
  },
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};
