'use client';

import { ChevronRight, Plus } from 'lucide-react';
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
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { SidebarGroupContent } from '@/components/ui/sidebar';

export interface CalendarEntry {
  id: string;
  name: string;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange';
  isVisible: boolean;
  type: 'calendar' | 'class' | 'project';
}

export interface EmailAccount {
  email: string;
  isDefault: boolean;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange';
}

export interface NavCalendarsProps {
  emailAccounts: EmailAccount[];
  calendars: CalendarEntry[];
  selectedEmail: string;
  onEmailChange: (email: string) => void;
  onCalendarToggle: (calendarId: string) => void;
  user?: { name: string; email: string; avatar: string };
}

export const getColorClasses = (
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

export const emailColorFromString = (
  email: string
): EmailAccount['color'] => {
  const palette: EmailAccount['color'][] = [
    'blue',
    'green',
    'red',
    'yellow',
    'purple',
    'orange',
  ];
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = (hash + email.charCodeAt(i)) % 2147483647;
  return palette[hash % palette.length];
};

export function NavCalendars({
  emailAccounts,
  calendars,
  selectedEmail,
  onEmailChange,
  onCalendarToggle,
  user,
}: NavCalendarsProps) {
  const { isMobile } = useSidebar();
  const selectedAccount = emailAccounts.find(
    (acc) => acc.email === selectedEmail
  );
  const currentUser = useQuery(api.auth.getCurrentUser, {});
  const canAddMoreAccounts = Boolean(currentUser?.isPro || emailAccounts.length === 0);

  const { data: session } = authClient.useSession();

  if (!session) {
    return (
      <SidebarGroup className="mt-0 group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Account</SidebarGroupLabel>
        <SidebarGroupContent>
            <Button
              variant="outline"
              size="sm"
              className='w-full justify-start'
              onClick={() =>
                authClient.signIn.social({ provider: 'google', callbackURL: `${window.location.origin}/calendar` })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add account
            </Button>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

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
                    className={`h-3 w-3 rounded-full ${getColorClasses(
                      (selectedAccount?.color ?? emailColorFromString(selectedAccount?.email || user?.email || ''))
                    )}`}
                  />
                  <div className="flex flex-col items-start">
                    <span className="truncate font-medium text-sm">
                      {selectedAccount?.email || user?.email || 'Select Account'}
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
              className="w-64 bg-neutral-100 dark:bg-neutral-950"
              side={isMobile ? 'bottom' : 'right'}
            >
              {emailAccounts.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No accounts connected
                </div>
              )}
              {emailAccounts.map((account) => (
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  key={account.email}
                  onClick={() => onEmailChange(account.email)}
                >
                  <div
                    className={`h-3 w-3 rounded-full ${getColorClasses(
                      account.color ?? emailColorFromString(account.email)
                    )}`}
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
              <DropdownMenuItem
                className={`mt-1 flex items-center gap-2 ${canAddMoreAccounts ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                onClick={async () => {
                  if (!canAddMoreAccounts) {
                    toast('Upgrade required', { description: 'Upgrade to add more calendar accounts.' })
                    return
                  }
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
                }}
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">{canAddMoreAccounts ? 'Add account' : 'Add account (Pro)'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <SidebarGroupLabel className="mt-2">Calendars</SidebarGroupLabel>
      <SidebarMenu>
        {calendars.length === 0 && (
          <SidebarMenuItem>
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No calendars yet
            </div>
          </SidebarMenuItem>
        )}
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
