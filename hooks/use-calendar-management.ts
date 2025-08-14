'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { arrangeWarmToCoolGrid } from '@/lib/calendar-color-utils';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import type { GoogleCalendar, ColorOption } from '@/types/calendar';

export function useCalendarManagement(onCalendarsFetched?: (calendars: GoogleCalendar[]) => void) {
	const { data: session } = authClient.useSession();
	const [fetchedCalendars, setFetchedCalendars] = React.useState<GoogleCalendar[]>([]);
	const [isLoadingCalendars, setIsLoadingCalendars] = React.useState(false);
	const [visibleCalendars, setVisibleCalendars] = React.useState<Set<string>>(new Set());
	const [colorOptions, setColorOptions] = React.useState<ColorOption[]>([]);

	const { setVisibleCalendarIds } = useCalendarStore((state) => state);

	const fetchCalendars = React.useCallback(async () => {
		if (!session?.user?.id) return;

		setIsLoadingCalendars(true);
		try {
			const accessToken = await authClient.getAccessToken({
				providerId: 'google',
				userId: session.user.id,
			});

			if (!accessToken?.data?.accessToken) {
				throw new Error('No access token available');
			}

			const url = `https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=250&key=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY}`;

			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${accessToken.data.accessToken}`,
					Accept: 'application/json',
				},
			});

			if (response.status === 401) {
				toast.error('Access token expired. Please reconnect your Google account.');
				await authClient.linkSocial({
					provider: 'google',
					scopes: [
						'https://www.googleapis.com/auth/calendar.events',
						'https://www.googleapis.com/auth/calendar.readonly',
						'https://www.googleapis.com/auth/calendar',
						'https://www.googleapis.com/auth/calendar.calendarlist',
						'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
						'https://www.googleapis.com/auth/calendar.freebusy',
					],
					callbackURL: `${window.location.origin}/calendar`,
					errorCallbackURL: `${window.location.origin}/calendar`,
				});
				return;
			}

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Error response:', errorText);
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const calendarListData = await response.json();
			console.log('Calendars fetched:', calendarListData);

			if (calendarListData.items && Array.isArray(calendarListData.items)) {
				let colorIdToHex: Record<string, string> | undefined;
				try {
					const colorsRes = await fetch('https://www.googleapis.com/calendar/v3/colors', {
						headers: {
							Authorization: `Bearer ${accessToken.data.accessToken}`,
							Accept: 'application/json',
						},
					});
					if (colorsRes.ok) {
						const colorsJson = await colorsRes.json();
						colorIdToHex = Object.fromEntries(
							Object.entries(colorsJson.calendar || {}).map(([id, v]: any) => [id, v.background])
						);
						const unsorted = Object.entries(colorsJson.calendar || {}).map(([id, v]: any) => ({ id, background: v.background }));
						setColorOptions(arrangeWarmToCoolGrid(unsorted));
					}
				} catch {}

				const calendars = calendarListData.items;
				console.log('Raw calendars:', calendars.map((c: any) => ({ id: c.id, summary: c.summary, accessRole: c.accessRole })));

				const sortedCalendars = calendars.sort((a: any, b: any) => {
					if (a.primary && !b.primary) return -1;
					if (b.primary && !a.primary) return 1;
					if (a.accessRole === 'owner' && b.accessRole !== 'owner') return -1;
					if (b.accessRole === 'owner' && a.accessRole !== 'owner') return 1;
					return 0;
				});

				console.log('Sorted calendars:', sortedCalendars.map((c: any) => ({ id: c.id, summary: c.summary, accessRole: c.accessRole })));

				const withResolvedColors = sortedCalendars.map((c: any) => ({
					...c,
					backgroundColor: c.backgroundColor || (colorIdToHex ? colorIdToHex[String(c.colorId)] : undefined),
				}));

				setFetchedCalendars(withResolvedColors);
				setVisibleCalendars(new Set(withResolvedColors.map((cal: any) => cal.id)));
				setVisibleCalendarIds(withResolvedColors.map((cal: any) => cal.id));

				if (onCalendarsFetched) {
					onCalendarsFetched(withResolvedColors);
				}
			}
		} catch (error) {
			console.error('Failed to fetch calendars:', error);
			toast.error('Failed to fetch calendars');
		} finally {
			setIsLoadingCalendars(false);
		}
	}, [session?.user?.id, setVisibleCalendarIds, onCalendarsFetched]);

	const handleChangeCalendarColor = React.useCallback(async (calendarId: string, colorId: string) => {
		if (!session?.user?.id) return;
		try {
			const accessToken = await authClient.getAccessToken({
				providerId: 'google',
				userId: session.user.id,
			});
			if (!accessToken?.data?.accessToken) throw new Error('No access token');
			const res = await fetch(`https://www.googleapis.com/calendar/v3/users/me/calendarList/${encodeURIComponent(calendarId)}`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${accessToken.data.accessToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ colorId }),
			});
			if (!res.ok) throw new Error('Failed to update color');
			const hex = colorOptions.find((c) => c.id === colorId)?.background;
			setFetchedCalendars((prev) => prev.map((c) => c.id === calendarId ? { ...c, colorId, backgroundColor: hex || c.backgroundColor } : c));
		} catch {
			toast.error('Failed to update calendar color');
		}
	}, [session?.user?.id, colorOptions]);

	const handleDeleteCalendar = React.useCallback(async (calendarId: string) => {
		if (!session?.user?.id) return;
		try {
			const accessToken = await authClient.getAccessToken({
				providerId: 'google',
				userId: session.user.id,
			});
			if (!accessToken?.data?.accessToken) throw new Error('No access token');
			const res = await fetch(`https://www.googleapis.com/calendar/v3/users/me/calendarList/${encodeURIComponent(calendarId)}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${accessToken.data.accessToken}`,
					Accept: 'application/json',
				},
			});
			if (!res.ok) throw new Error('Failed to delete calendar');
			setFetchedCalendars((prev) => prev.filter((c) => c.id !== calendarId));
			setVisibleCalendars((prev) => {
				const next = new Set(prev);
				next.delete(calendarId);
				setVisibleCalendarIds(Array.from(next));
				return next;
			});
			toast.success('Calendar removed');
		} catch {
			toast.error('Failed to remove calendar');
		}
	}, [session?.user?.id, setVisibleCalendarIds]);

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
		if (!session?.user?.id) throw new Error('No user session');

		const accessToken = await authClient.getAccessToken({
			providerId: 'google',
			userId: session.user.id,
		});

		if (!accessToken?.data?.accessToken) {
			throw new Error('No access token available');
		}

		const response = await fetch('https://www.googleapis.com/calendar/v3/calendars', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken.data.accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(calendarData),
		});

		if (!response.ok) {
			throw new Error('Failed to create calendar');
		}

		const newCalendar = await response.json();
		
		if (calendarData.colorId) {
			const calendarListEntry = {
				id: newCalendar.id,
				summary: newCalendar.summary,
				accessRole: 'owner',
				colorId: calendarData.colorId,
				backgroundColor: colorOptions.find(c => c.id === calendarData.colorId)?.background,
			};
			setFetchedCalendars((prev: GoogleCalendar[]) => [...prev, calendarListEntry]);
		} else {
			setFetchedCalendars((prev: GoogleCalendar[]) => [...prev, newCalendar]);
		}
		
		setVisibleCalendars((prev: Set<string>) => new Set([...prev, newCalendar.id]));
		setVisibleCalendarIds([...Array.from(visibleCalendars), newCalendar.id]);

		return newCalendar;
	}, [session?.user?.id, setVisibleCalendarIds, visibleCalendars, colorOptions]);

	React.useEffect(() => {
		if (session?.user?.id) {
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
