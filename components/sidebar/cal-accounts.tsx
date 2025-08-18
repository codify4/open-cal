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
import { CalendarList } from './calendar-list';
import { Plus } from 'lucide-react';

import { useCalendarManagement } from '@/hooks/use-calendar-management';
import type { NavCalendarsProps } from '@/types/calendar';

export function NavCalendars({
	onCalendarToggle,
	onCalendarsFetched,
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
                    <CalendarList
                        calendars={fetchedCalendars}
                        visibleCalendars={visibleCalendars}
                        colorOptions={colorOptions}
                        isLoading={isLoadingCalendars}
                        onToggle={wrappedCalendarToggle}
                        onColorChange={handleChangeCalendarColor}
                        onDelete={handleDeleteCalendar}
                        onCalendarCreated={handleCalendarCreated}
                    />
					
					<SidebarMenuItem>
						<SignInButton mode="modal">
							<Button 
								variant="ghost" 
								size="sm" 
								className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 border-0 px-2 py-1.5 h-auto font-normal"
							>
								<Plus className="h-3 w-3" />
								<span className="text-xs">Add Google Account</span>
							</Button>
						</SignInButton>
					</SidebarMenuItem>
				</SidebarMenu>

			</SignedIn>
		</SidebarGroup>
	);
}
