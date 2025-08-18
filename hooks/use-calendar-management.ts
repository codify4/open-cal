'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { useAuth, useSessionList } from '@clerk/nextjs';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import type { GoogleCalendar, ColorOption } from '@/types/calendar';
import { getAccessToken, getAccessTokenForSession } from '@/actions/access-token';

export function useCalendarManagement(onCalendarsFetched?: (calendars: GoogleCalendar[]) => void) {
    const { userId } = useAuth();
    const { sessions } = useSessionList();
	const [fetchedCalendars, setFetchedCalendars] = React.useState<GoogleCalendar[]>([]);
	const [isLoadingCalendars, setIsLoadingCalendars] = React.useState(false);
	const [visibleCalendars, setVisibleCalendars] = React.useState<Set<string>>(new Set());
	const [colorOptions, setColorOptions] = React.useState<ColorOption[]>([]);
	const [accessToken, setAccessToken] = React.useState<string | null>(null);

	const { setVisibleCalendarIds, setSessionCalendars, visibleCalendarIds } = useCalendarStore((state) => state);

	React.useEffect(() => {
		const fetchToken = async () => {
			if (userId) {
				const token = await getAccessToken();
				setAccessToken(token);
			}
		};
		
		fetchToken();
	}, [userId]);

	React.useEffect(() => {
		if (accessToken && userId) {
			fetchCalendars();
		}
	}, [accessToken, userId]);

	const fetchCalendarsForSession = React.useCallback(async (session: any, sessionAccessToken: string) => {
		try {
			const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
				headers: {
					Authorization: `Bearer ${sessionAccessToken}`,
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
				account: session.user?.primaryEmailAddress?.emailAddress || '',
			}));

			const sortedCalendars = calendars.sort((a, b) => {
				if (a.primary && !b.primary) return -1;
				if (!a.primary && b.primary) return 1;
				return (a.summary || a.name || '').localeCompare(b.summary || b.name || '');
			});

			return sortedCalendars;
		} catch (error) {
			console.error(`Failed to fetch calendars for session ${session.id}:`, error);
			return [];
		}
	}, []);

	const fetchCalendars = React.useCallback(async () => {
		if (!userId) {
			return;
		}

		setIsLoadingCalendars(true);
		
		try {
			const allCalendars: GoogleCalendar[] = [];

			if (sessions && sessions.length > 0) {
				console.log('All sessions:', sessions.map(s => ({ id: s.id, email: s.user?.primaryEmailAddress?.emailAddress })));
				
				for (const session of sessions) {
					try {
						if (!session.user?.primaryEmailAddress?.emailAddress) {
							console.warn(`Session ${session.id} has no user email, skipping`);
							continue;
						}
						
						const sessionToken = await getAccessTokenForSession(session.id);
						if (sessionToken) {
							const sessionCalendars = await fetchCalendarsForSession(session, sessionToken);
							
							sessionCalendars.forEach(calendar => {
								if (!allCalendars.some(existing => existing.id === calendar.id)) {
									allCalendars.push(calendar);
								}
							});
							
							setSessionCalendars(session.id, sessionCalendars);
						} else {
							console.warn(`No access token available for session ${session.id}`);
						}
					} catch (error) {
						console.error(`Failed to fetch calendars for session ${session.id}:`, error);
					}
				}
			}

			if (allCalendars.length > 0) {
				setFetchedCalendars(allCalendars);
				
				const calendarIds = allCalendars.map(cal => cal.id);
				console.log('Setting visible calendar IDs:', calendarIds);
				console.log('Calendar details:', allCalendars.map(cal => ({ id: cal.id, summary: cal.summary, account: cal.account })));
				setVisibleCalendarIds(calendarIds);
				setVisibleCalendars(new Set(calendarIds));
				
				onCalendarsFetched?.(allCalendars);
			} else {
				console.log('No calendars found for any sessions');
				setFetchedCalendars([]);
				setVisibleCalendarIds([]);
				setVisibleCalendars(new Set());
			}

			if (accessToken) {
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
			}
		} catch (error) {
			toast.error('Failed to fetch calendars');
		} finally {
			setIsLoadingCalendars(false);
		}
	}, [userId, accessToken, sessions, fetchCalendarsForSession, setSessionCalendars, setVisibleCalendarIds, onCalendarsFetched]);

	const handleChangeCalendarColor = React.useCallback(async (calendarId: string, colorId: string) => {
		if (!userId || !accessToken) return;
		
		setFetchedCalendars(prevCalendars => 
			prevCalendars.map(cal => 
				cal.id === calendarId 
					? { ...cal, colorId, backgroundColor: colorOptions.find(c => c.id === colorId)?.background }
					: cal
			)
		);
		
		try {
			const response = await fetch(`https://www.googleapis.com/calendar/v3/users/me/calendarList/${calendarId}`, {
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
			
			fetchCalendars();
			
			if (error instanceof Error && error.message.includes('403')) {
				toast.error('Cannot modify this calendar - insufficient permissions');
			} else if (error instanceof Error && error.message.includes('404')) {
				toast.error('Calendar not found');
			} else {
				toast.error('Failed to update calendar color');
			}
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
			
			setVisibleCalendars(prev => {
				const newSet = new Set(prev);
				newSet.delete(calendarId);
				return newSet;
			});
			
			const newVisibleIds = visibleCalendarIds.filter(id => id !== calendarId);
			setVisibleCalendarIds(newVisibleIds);
			fetchCalendars();
		} catch (error) {
			console.error('Failed to remove calendar:', error);
			toast.error('Failed to remove calendar');
		}
	}, [userId, accessToken, setVisibleCalendarIds, visibleCalendarIds, fetchCalendars]);

	const handleCalendarToggle = React.useCallback((calendarId: string) => {
		console.log('Toggling calendar:', calendarId);
		setVisibleCalendars(prev => {
			const newSet = new Set(prev);
			if (newSet.has(calendarId)) {
				newSet.delete(calendarId);
			} else {
				newSet.add(calendarId);
			}
			
			const newVisibleIds = Array.from(newSet);
			console.log('New visible calendar IDs:', newVisibleIds);
			setVisibleCalendarIds(newVisibleIds);
			
			return newSet;
		});
	}, [setVisibleCalendarIds]);

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
	}, [userId, accessToken, fetchCalendars]);

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
