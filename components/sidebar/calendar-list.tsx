'use client';

import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { Checkbox } from '@/components/ui/checkbox';
import { getCalendarColor } from '@/lib/calendar-color-utils';
import { CalendarDropdown } from './calendar-dropdown';
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
						No calendars found
					</div>
				</SidebarMenuItem>
			</SidebarMenu>
		);
	}

	return (
		<SidebarMenu>
			{calendars.map((calendar) => (
				<SidebarMenuItem key={calendar.id}>
					<div
						className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-transparent hover:text-primary"
						onClick={() => onToggle(calendar.id)}
					>
						<Checkbox
							checked={visibleCalendars.has(calendar.id)}
							className="cursor-pointer"
							color={getCalendarColor(calendar)}
							onCheckedChange={() => onToggle(calendar.id)}
						/>
						<span className="flex-1 truncate text-sm min-w-0">{calendar.summary || calendar.name}</span>
						{calendar.primary && (
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
	);
}
