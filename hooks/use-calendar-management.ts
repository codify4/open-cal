'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { useAuth, useUser } from '@clerk/nextjs';
import { arrangeWarmToCoolGrid } from '@/lib/calendar-utils/calendar-color-utils';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import type { GoogleCalendar, ColorOption } from '@/types/calendar';
import { getAccessToken } from '@/actions/access-token';

export function useCalendarManagement(onCalendarsFetched?: (calendars: GoogleCalendar[]) => void) {
    const { userId } = useAuth();
	const [fetchedCalendars, setFetchedCalendars] = React.useState<GoogleCalendar[]>([]);
	const [isLoadingCalendars, setIsLoadingCalendars] = React.useState(false);
	const [visibleCalendars, setVisibleCalendars] = React.useState<Set<string>>(new Set());
	const [colorOptions, setColorOptions] = React.useState<ColorOption[]>([]);
	const [accessToken, setAccessToken] = React.useState<string | null>(null);

	const { setVisibleCalendarIds } = useCalendarStore((state) => state);

	React.useEffect(() => {
		const fetchToken = async () => {
			if (userId) {
				const token = await getAccessToken();
				setAccessToken(token);
			}
		};
		
		fetchToken();
	}, [userId]);

	const fetchCalendars = React.useCallback(async () => {
		console.log('🔐 fetchCalendars called, user:', { userId, hasUser: !!userId });
		
		if (!userId) {
			console.log('❌ No user ID, returning early');
			return;
		}

		if (!accessToken) {
			console.log('❌ No access token, returning early');
			return;
		}

		setIsLoadingCalendars(true);
		try {
			const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			const calendars: GoogleCalendar[] = data.items.map((cal: any) => ({
				id: cal.id,
				summary: cal.summary,
				name: cal.summary,
				primary: cal.primary || false,
				accessRole: cal.accessRole,
				colorId: cal.colorId,
				backgroundColor: cal.backgroundColor,
			}));

			setFetchedCalendars(calendars);
			
			// Set all calendars as visible by default
			const calendarIds = calendars.map(cal => cal.id);
			setVisibleCalendarIds(calendarIds);
			setVisibleCalendars(new Set(calendarIds));
			
			onCalendarsFetched?.(calendars);

			const googleColors = await fetch('https://www.googleapis.com/calendar/v3/colors', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			});

			if (googleColors.ok) {
				const colorData = await googleColors.json();
				const colors: ColorOption[] = Object.entries(colorData.calendar || {}).map(([id, color]: [string, any]) => ({
					id,
					background: color.background,
				}));
				setColorOptions(colors);
			}
		} catch (error) {
			console.error('💥 fetchCalendars failed:', error);
			toast.error('Failed to fetch calendars');
		} finally {
			console.log('🏁 fetchCalendars completed, setting loading to false');
			setIsLoadingCalendars(false);
		}
	}, [userId, accessToken, setVisibleCalendarIds, onCalendarsFetched]);

	const handleChangeCalendarColor = React.useCallback(async (calendarId: string, colorId: string) => {
		if (!userId || !accessToken) return;
		try {
			const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ colorId }),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			toast.success('Calendar color updated');
			fetchCalendars();
		} catch (error) {
			console.error('Failed to update calendar color:', error);
			toast.error('Failed to update calendar color');
		}
	}, [userId, accessToken, colorOptions, fetchCalendars]);

	const handleDeleteCalendar = React.useCallback(async (calendarId: string) => {
		if (!userId || !accessToken) return;
		try {
			const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			toast.success('Calendar removed');
			setVisibleCalendarIds(Array.from(visibleCalendars).filter(id => id !== calendarId));
			fetchCalendars();
		} catch (error) {
			console.error('Failed to remove calendar:', error);
			toast.error('Failed to remove calendar');
		}
	}, [userId, accessToken, setVisibleCalendarIds, visibleCalendars, fetchCalendars]);

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

		const currentVisibleIds = Array.from(visibleCalendars);
		if (currentVisibleIds.includes(calendarId)) {
			setVisibleCalendarIds(currentVisibleIds.filter(id => id !== calendarId));
		} else {
			setVisibleCalendarIds([...currentVisibleIds, calendarId]);
		}
	}, [visibleCalendars, setVisibleCalendarIds]);

	const createCalendar = React.useCallback(async (calendarData: {
		summary: string;
		description?: string;
		timeZone: string;
		colorId?: string;
	}) => {
		if (!userId) throw new Error('No user session');
		if (!accessToken) throw new Error('Google Calendar not connected');

		const response = await fetch('https://www.googleapis.com/calendar/v3/calendars', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				summary: calendarData.summary,
				description: calendarData.description,
				timeZone: calendarData.timeZone,
				colorId: calendarData.colorId || '1',
			}),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const newCalendar = await response.json();
		toast.success('Calendar created successfully');
		fetchCalendars();
		return newCalendar;
	}, [userId, accessToken, setVisibleCalendarIds, visibleCalendars, colorOptions, fetchCalendars]);

	React.useEffect(() => {
		if (userId) {
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
