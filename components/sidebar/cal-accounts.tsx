'use client';

import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { Plus } from 'lucide-react';
import { useQuery } from 'convex/react';
import { Button } from '@/components/ui/button';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCalendarManagement } from '@/hooks/use-calendar-management';
import { useGoogleAccounts } from '@/hooks/use-google-accounts';
import type { NavCalendarsProps } from '@/types/calendar';
import { CalendarList } from './calendar-list';
import { api } from '@/convex/_generated/api';

export function NavCalendars({
  onCalendarToggle,
  onCalendarsFetched,
}: NavCalendarsProps) {
  const { user } = useUser();
  const currentUser = useQuery(api.auth.getCurrentUser, {
    clerkUserId: user?.id,
  });
  const { accounts: googleAccounts } = useGoogleAccounts();

  const {
    fetchedCalendars,
    isLoadingCalendars,
    visibleCalendars,
    colorOptions,
    handleChangeCalendarColor,
    handleDeleteCalendar,
    handleCalendarToggle,
    refetchCalendars,
  } = useCalendarManagement();

  const wrappedCalendarToggle = (calendarId: string) => {
    handleCalendarToggle(calendarId);
    onCalendarToggle(calendarId);
  };

  const handleCalendarCreated = () => {
    refetchCalendars();
  };

  const hasProAccess = currentUser?.isPro ?? false;
  const canAddAccount = hasProAccess || googleAccounts.length === 0;
  const showProRequirement = !hasProAccess && googleAccounts.length > 0;

  console.log('Subscription debug:', {
    currentUser,
    isPro: currentUser?.isPro,
    googleAccountsCount: googleAccounts.length,
    hasProAccess,
    canAddAccount,
    showProRequirement
  });

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
            {canAddAccount ? (
              <SignInButton mode="modal">
                <Button
                  className="h-auto w-full justify-start gap-2 border-0 px-2 py-1.5 font-normal text-muted-foreground hover:text-foreground"
                  size="sm"
                  variant="ghost"
                >
                  <Plus className="h-3 w-3" />
                  <span className="text-xs">
                    {showProRequirement ? 'Add calendar account (Pro)' : 'Add calendar account'}
                  </span>
                </Button>
              </SignInButton>
            ) : (
              <div className="w-full">
                <Button
                  className="h-auto w-full justify-start gap-2 border-0 px-2 py-1.5 font-normal text-muted-foreground"
                  size="sm"
                  variant="ghost"
                  disabled
                >
                  <Plus className="h-3 w-3" />
                  <span className="text-xs">Add calendar account (Pro)</span>
                </Button>
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SignedIn>
    </SidebarGroup>
  );
}
