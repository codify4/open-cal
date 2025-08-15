'use client';

import { Plus } from 'lucide-react';
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
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
	const { user: clerkUser } = useUser();
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

	const handleGoogleOAuth = async () => {
		try {
			if (clerkUser) {
				// Redirect to Google OAuth through Clerk
				window.location.href = '/api/auth/google';
			} else {
				toast.error('Please sign in first');
			}
		} catch (error) {
			console.error('Google OAuth error:', error);
			toast.error('Failed to connect Google Calendar');
		}
	};

	return (
		<SidebarGroup className="mt-0 group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Account</SidebarGroupLabel>
			
			<SignedOut>
				<SidebarGroupContent>
					<Button
						variant="outline"
						size="sm"
						className='w-full justify-start'
						onClick={() => {
							window.location.href = '/api/auth/signin';
						}}
					>
						<Plus className="h-4 w-4 mr-2" />
						Sign in to add accounts
					</Button>
				</SidebarGroupContent>
			</SignedOut>

			<SignedIn>
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
			</SignedIn>
		</SidebarGroup>
	);
}
