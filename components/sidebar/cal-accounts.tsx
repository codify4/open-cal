'use client';

import { Plus } from 'lucide-react';

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
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
	const { data: session } = authClient.useSession();
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
					<AccountDropdown
						emailAccounts={emailAccounts}
						selectedEmail={selectedEmail}
						onEmailChange={onEmailChange}
						userEmail={user?.email}
					/>
				</SidebarMenuItem>
			</SidebarMenu>

			<div className="flex items-center justify-between mt-2">
				<SidebarGroupLabel className="mt-0">Calendars</SidebarGroupLabel>
				<CreateCalendarDropdown onCalendarCreated={handleCalendarCreated} />
			</div>
			<CalendarList
				calendars={fetchedCalendars}
				visibleCalendars={visibleCalendars}
				colorOptions={colorOptions}
				isLoading={isLoadingCalendars}
				onToggle={wrappedCalendarToggle}
				onColorChange={handleChangeCalendarColor}
				onDelete={handleDeleteCalendar}
			/>
		</SidebarGroup>
	);
}
