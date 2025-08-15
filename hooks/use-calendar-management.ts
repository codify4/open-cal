'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { arrangeWarmToCoolGrid } from '@/lib/calendar-utils/calendar-color-utils';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import type { GoogleCalendar, ColorOption } from '@/types/calendar';

export function useCalendarManagement(onCalendarsFetched?: (calendars: GoogleCalendar[]) => void) {
	const { user } = useUser();
	const [fetchedCalendars, setFetchedCalendars] = React.useState<GoogleCalendar[]>([]);
	const [isLoadingCalendars, setIsLoadingCalendars] = React.useState(false);
	const [visibleCalendars, setVisibleCalendars] = React.useState<Set<string>>(new Set());
	const [colorOptions, setColorOptions] = React.useState<ColorOption[]>([]);

	const { setVisibleCalendarIds } = useCalendarStore((state) => state);

	const fetchCalendars = React.useCallback(async () => {
		console.log('🔐 fetchCalendars called, user:', { userId: user?.id, hasUser: !!user });
		
		if (!user?.id) {
			console.log('❌ No user ID, returning early');
			return;
		}

		setIsLoadingCalendars(true);
		try {
			// TODO: Implement Google OAuth with Clerk
			console.log('📡 Google OAuth integration coming soon');
			toast('Google OAuth integration coming soon');
		} catch (error) {
			console.error('💥 fetchCalendars failed:', error);
			toast.error('Failed to fetch calendars');
		} finally {
			console.log('🏁 fetchCalendars completed, setting loading to false');
			setIsLoadingCalendars(false);
		}
	}, [user?.id, setVisibleCalendarIds, onCalendarsFetched]);

	const handleChangeCalendarColor = React.useCallback(async (calendarId: string, colorId: string) => {
		if (!user?.id) return;
		try {
			// TODO: Implement Google OAuth with Clerk
			toast('Google OAuth integration coming soon');
		} catch {
			toast.error('Failed to update calendar color');
		}
	}, [user?.id, colorOptions]);

	const handleDeleteCalendar = React.useCallback(async (calendarId: string) => {
		if (!user?.id) return;
		try {
			// TODO: Implement Google OAuth with Clerk
			toast('Google OAuth integration coming soon');
		} catch {
			toast.error('Failed to remove calendar');
		}
	}, [user?.id, setVisibleCalendarIds]);

	const handleCalendarToggle = React.useCallback((calendarId: string) => {
		setVisibleCalendars(prev => {
			const newSet = new Set(prev);
			if (newSet.has(calendarId)) {
				newSet.delete(calendarId);
			} else {
				newSet.add(calendarId);
			}
			return newSet;
		});

		const newVisibleCalendars = Array.from(visibleCalendars);
		if (newVisibleCalendars.includes(calendarId)) {
			setVisibleCalendarIds(newVisibleCalendars.filter(id => id !== calendarId));
		} else {
			setVisibleCalendarIds([...newVisibleCalendars, calendarId]);
		}
	}, [visibleCalendars, setVisibleCalendarIds]);

	const createCalendar = React.useCallback(async (calendarData: {
		summary: string;
		description?: string;
		timeZone: string;
		colorId?: string;
	}) => {
		if (!user?.id) throw new Error('No user session');

		// TODO: Implement Google OAuth with Clerk
		toast('Google OAuth integration coming soon');
		throw new Error('Google OAuth integration coming soon');
	}, [user?.id, setVisibleCalendarIds, visibleCalendars, colorOptions]);

	React.useEffect(() => {
		if (user?.id) {
			fetchCalendars();
		}
	}, [fetchCalendars]);

	return {
		fetchedCalendars,
		isLoadingCalendars,
		visibleCalendars,
		colorOptions,
		handleChangeCalendarColor,
		handleDeleteCalendar,
		handleCalendarToggle,
		createCalendar,
		refetchCalendars: fetchCalendars,
	};
}
