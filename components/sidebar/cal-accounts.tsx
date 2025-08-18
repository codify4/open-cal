'use client';

import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { SidebarGroupContent } from '@/components/ui/sidebar';
import { AccountDropdown } from './account-dropdown';
import { CalendarList } from './calendar-list';
import { CreateCalendarDropdown } from './create-calendar-dropdown';
import { useCalendarManagement } from '@/hooks/use-calendar-management';
import type { NavCalendarsProps } from '@/types/calendar';

export function NavCalendars({
	emailAccounts,
	onEmailChange,
	onCalendarToggle,
	onCalendarsFetched,
	selectedEmail,
	user,
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
                        <Button>
                            Sign in to Continue
                        </Button>
                    </SignInButton>
				</SidebarGroupContent>
			</SignedOut>

			<SignedIn>
				<SidebarMenu>
                    <CreateCalendarDropdown onCalendarCreated={handleCalendarCreated} />
                    <CalendarList
                        calendars={fetchedCalendars}
                        visibleCalendars={visibleCalendars}
                        colorOptions={colorOptions}
                        isLoading={isLoadingCalendars}
                        onToggle={wrappedCalendarToggle}
                        onColorChange={handleChangeCalendarColor}
                        onDelete={handleDeleteCalendar}
                    />
				</SidebarMenu>

			</SignedIn>
		</SidebarGroup>
	);
}
