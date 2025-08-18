'use client';

import { SidebarMenu, SidebarMenuItem, SidebarGroupLabel } from '@/components/ui/sidebar';
import { Checkbox } from '@/components/ui/checkbox';
import { getCalendarColor } from '@/lib/calendar-utils/calendar-color-utils';
import { CalendarDropdown } from './calendar-dropdown';
import { useSessionList, useSession } from '@clerk/nextjs';
import { useMemo } from 'react';
import type { GoogleCalendar, ColorOption } from '@/types/calendar';

interface CalendarListProps {
	calendars: GoogleCalendar[];
	visibleCalendars: Set<string>;
	colorOptions: ColorOption[];
	isLoading: boolean;
	onToggle: (calendarId: string) => void;
	onColorChange: (calendarId: string, colorId: string) => void;
	onDelete: (calendarId: string) => void;
}

export function CalendarList({
	calendars,
	visibleCalendars,
	colorOptions,
	isLoading,
	onToggle,
	onColorChange,
	onDelete,
}: CalendarListProps) {
	const { sessions } = useSessionList();
	const { session: currentSession } = useSession();

	// Group calendars by account email
	const groupedCalendars = useMemo(() => {
		const groups: Record<string, GoogleCalendar[]> = {};
		const currentEmail = currentSession?.user?.primaryEmailAddress?.emailAddress;
		
		calendars.forEach(calendar => {
			const accountEmail = calendar.account || currentEmail || 'Unknown Account';
			if (!groups[accountEmail]) {
				groups[accountEmail] = [];
			}
			groups[accountEmail].push(calendar);
		});
		
		Object.keys(groups).forEach(email => {
			groups[email].sort((a, b) => {
				if (a.primary && !b.primary) return -1;
				if (!a.primary && b.primary) return 1;
				return (a.summary || a.name || '').localeCompare(b.summary || b.name || '');
			});
		});
		
		const sortedGroups: Record<string, GoogleCalendar[]> = {};
		const currentAccountCalendars = groups[currentEmail || ''] || [];
		const otherAccounts = Object.keys(groups).filter(email => email !== currentEmail);
		
		if (currentAccountCalendars.length > 0) {
			sortedGroups[currentEmail || ''] = currentAccountCalendars;
		}
		
		otherAccounts.forEach(email => {
			sortedGroups[email] = groups[email];
		});
		
		return sortedGroups;
	}, [calendars, currentSession]);

	if (isLoading) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<div className="px-2 py-1.5 text-sm text-muted-foreground">
						Loading calendars...
					</div>
				</SidebarMenuItem>
			</SidebarMenu>
		);
	}

	if (calendars.length === 0) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<div className="px-2 py-1.5 text-sm text-muted-foreground">
						No calendars found. Add a Google Calendar account to get started.
					</div>
				</SidebarMenuItem>
			</SidebarMenu>
		);
	}

	return (
		<div className="space-y-4">
			{Object.entries(groupedCalendars).map(([accountEmail, accountCalendars]) => (
				<div key={accountEmail}>
					<SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
						{accountEmail}
					</SidebarGroupLabel>
					<SidebarMenu>
						{accountCalendars.map((calendar) => (
							<SidebarMenuItem key={calendar.id}>
								<div
									className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-accent hover:text-accent-foreground"
									onClick={() => onToggle(calendar.id)}
								>
									<Checkbox
										checked={visibleCalendars.has(calendar.id)}
										className="cursor-pointer"
										color={getCalendarColor(calendar, Object.fromEntries(colorOptions.map(opt => [opt.id, opt.background])))}
										onCheckedChange={() => onToggle(calendar.id)}
									/>
									<span className="flex-1 truncate text-sm min-w-0">{calendar.summary || calendar.name}</span>
									{calendar.primary && calendar.account === currentSession?.user?.primaryEmailAddress?.emailAddress && (
										<span className="text-xs text-muted-foreground truncate max-w-16 flex-shrink-0">Default</span>
									)}
									<CalendarDropdown
										calendar={calendar}
										colorOptions={colorOptions}
										onColorChange={onColorChange}
										onDelete={onDelete}
									/>
								</div>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</div>
			))}
		</div>
	);
}
