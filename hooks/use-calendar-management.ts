'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { arrangeWarmToCoolGrid } from '@/lib/calendar-utils/calendar-color-utils';
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
		console.log('🔐 fetchCalendars called, session:', { userId: session?.user?.id, hasSession: !!session });
		
		if (!session?.user?.id) {
			console.log('❌ No session or user ID, returning early');
			return;
		}

		setIsLoadingCalendars(true);
		try {
			console.log('📡 Getting initial access token...');
			let accessToken = await authClient.getAccessToken({
				providerId: 'google',
				userId: session.user.id,
			});

			console.log('🔑 Initial access token result:', {
				hasData: !!accessToken?.data,
				hasAccessToken: !!accessToken?.data?.accessToken,
				tokenLength: accessToken?.data?.accessToken?.length,
				expiresAt: accessToken?.data?.accessTokenExpiresAt
			});

			if (!accessToken?.data?.accessToken) {
				console.log('❌ No access token available, throwing error');
				throw new Error('No access token available');
			}

			console.log('🔄 Attempting to refresh token...');
			try {
				const refreshedToken = await authClient.refreshToken({
					providerId: 'google',
					userId: session.user.id,
				});
				
				console.log('🔄 Refresh token result:', {
					hasData: !!refreshedToken?.data,
					hasAccessToken: !!refreshedToken?.data?.accessToken,
					tokenLength: refreshedToken?.data?.accessToken?.length,
					originalToken: accessToken.data.accessToken.substring(0, 20) + '...',
					refreshedToken: refreshedToken?.data?.accessToken?.substring(0, 20) + '...'
				});

				if (refreshedToken?.data?.accessToken) {
					console.log('✅ Token refreshed successfully, updating accessToken');
					accessToken = {
						...accessToken,
						data: {
							...accessToken.data,
							accessToken: refreshedToken.data.accessToken
						}
					};
				} else {
					console.log('⚠️ Refresh returned no token, keeping original');
				}
			} catch (refreshError) {
				console.log('❌ Token refresh failed:', refreshError);
			}

			const url = `https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=250&key=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY}`;
			console.log('🌐 Making Google Calendar API call to:', url.substring(0, 80) + '...');
			console.log('🔑 Using token:', accessToken.data.accessToken.substring(0, 20) + '...');

			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${accessToken.data.accessToken}`,
					Accept: 'application/json',
				},
			});

			console.log('📡 Google API response:', {
				status: response.status,
				statusText: response.statusText,
				ok: response.ok,
				headers: Object.fromEntries(response.headers.entries())
			});

			if (response.status === 401) {
				console.log('🚨 Got 401, attempting token refresh...');
				
				try {
					const refreshedToken = await authClient.refreshToken({
						providerId: 'google',
						userId: session.user.id,
					});
					
					console.log('🔄 Second refresh attempt result:', {
						hasData: !!refreshedToken?.data,
						hasAccessToken: !!refreshedToken?.data?.accessToken,
						tokenLength: refreshedToken?.data?.accessToken?.length
					});
					
					if (refreshedToken?.data?.accessToken) {
						console.log('✅ Second refresh successful, retrying API call...');
						
						const retryResponse = await fetch(url, {
							headers: {
								Authorization: `Bearer ${refreshedToken.data.accessToken}`,
								Accept: 'application/json',
							},
						});
						
						console.log('📡 Retry response:', {
							status: retryResponse.status,
							statusText: retryResponse.statusText,
							ok: retryResponse.ok
						});
						
						if (retryResponse.ok) {
							console.log('✅ Retry successful, processing calendar data...');
							const calendarListData = await retryResponse.json();
							
							console.log('📅 Calendar data received:', {
								itemCount: calendarListData.items?.length,
								hasItems: !!calendarListData.items
							});
							
							if (calendarListData.items && Array.isArray(calendarListData.items)) {
								let colorIdToHex: Record<string, string> | undefined;
								try {
									const colorsRes = await fetch('https://www.googleapis.com/calendar/v3/colors', {
										headers: {
											Authorization: `Bearer ${refreshedToken.data.accessToken}`,
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
							return;
						}
					}
				} catch (refreshError) {
					console.error('❌ Second token refresh failed:', refreshError);
				}

				console.log('💀 All refresh attempts failed, forcing re-authentication');
				toast.error('Authentication expired. Please sign in again.');
				
				// Use signIn.social instead of linkSocial for expired tokens
				await authClient.signIn.social({
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
				console.error('❌ Google API error response:', errorText);
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			console.log('✅ Google API call successful, processing response...');
			const calendarListData = await response.json();
			console.log('📅 Calendar list data:', {
				itemCount: calendarListData.items?.length,
				hasItems: !!calendarListData.items
			});

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
			console.error('💥 fetchCalendars failed:', error);
			toast.error('Failed to fetch calendars');
		} finally {
			console.log('🏁 fetchCalendars completed, setting loading to false');
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
