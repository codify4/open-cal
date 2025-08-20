'use client';

import { useAuth, useSessionList } from '@clerk/nextjs';
import * as React from 'react';
import { toast } from 'sonner';
import {
  getAccessToken,
  getAccessTokenForSession,
} from '@/actions/access-token';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import type { ColorOption, GoogleCalendar } from '@/types/calendar';

// Global flag to prevent multiple instances from fetching calendars
let isGlobalFetching = false;

export function useCalendarManagement(
  onCalendarsFetched?: (calendars: GoogleCalendar[]) => void
) {
  const { userId } = useAuth();
  const { sessions } = useSessionList();
  const [fetchedCalendars, setFetchedCalendars] = React.useState<
    GoogleCalendar[]
  >([]);
  const [isLoadingCalendars, setIsLoadingCalendars] = React.useState(false);
  const [visibleCalendars, setVisibleCalendars] = React.useState<Set<string>>(
    new Set()
  );
  const [colorOptions, setColorOptions] = React.useState<ColorOption[]>([]);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const hasFetchedCalendarsRef = React.useRef(false);

  const { setVisibleCalendarIds, setSessionCalendars, visibleCalendarIds } =
    useCalendarStore((state) => state);

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
    // Only initialize visible calendars once when we have data
    if (visibleCalendarIds.length > 0 && visibleCalendars.size === 0) {
      setVisibleCalendars(new Set(visibleCalendarIds));
    } else if (fetchedCalendars.length > 0 && visibleCalendars.size === 0) {
      // Fallback: if no visible calendars set but we have fetched calendars
      const calendarIds = fetchedCalendars.map(cal => cal.id);
      setVisibleCalendars(new Set(calendarIds));
    }
  }, [visibleCalendarIds, fetchedCalendars, visibleCalendars.size]);

  const fetchCalendarsForSession = React.useCallback(
    async (session: any, sessionAccessToken: string) => {
      try {
        const response = await fetch(
          'https://www.googleapis.com/calendar/v3/users/me/calendarList',
          {
            headers: {
              Authorization: `Bearer ${sessionAccessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const calendars: GoogleCalendar[] = data.items.map((cal: any) => ({
          id: cal.id,
          summary: cal.summary,
          name: cal.summary,
          primary: cal.primary,
          accessRole: cal.accessRole,
          colorId: cal.colorId,
          backgroundColor: cal.backgroundColor,
          account: session.user?.primaryEmailAddress?.emailAddress || '',
        }));

        const sortedCalendars = calendars.sort((a, b) => {
          if (a.primary && !b.primary) return -1;
          if (!a.primary && b.primary) return 1;
          return (a.summary || a.name || '').localeCompare(
            b.summary || b.name || ''
          );
        });

        return sortedCalendars;
      } catch (error) {
        console.error(
          `Failed to fetch calendars for session ${session.id}:`,
          error
        );
        return [];
      }
    },
    []
  );

  const fetchCalendars = React.useCallback(async () => {
    if (!userId) {
      return;
    }

    // Prevent duplicate calls from multiple instances
    if (isGlobalFetching) {
      console.log('Skipping fetchCalendars - global fetch in progress');
      return;
    }

    // Prevent duplicate calls from same instance
    if (hasFetchedCalendarsRef.current) {
      console.log('Skipping fetchCalendars - already fetched');
      return;
    }

    setIsLoadingCalendars(true);
    isGlobalFetching = true;
    hasFetchedCalendarsRef.current = true;

    try {
      const allCalendars: GoogleCalendar[] = [];

      if (sessions && sessions.length > 0) {
        console.log(
          'All sessions:',
          sessions.map((s) => ({
            id: s.id,
            email: s.user?.primaryEmailAddress?.emailAddress,
          }))
        );

        for (const session of sessions) {
          try {
            if (!session.user?.primaryEmailAddress?.emailAddress) {
              console.warn(`Session ${session.id} has no user email, skipping`);
              continue;
            }

            const sessionToken = await getAccessTokenForSession(session.id);
            if (sessionToken) {
              const sessionCalendars = await fetchCalendarsForSession(
                session,
                sessionToken
              );

              sessionCalendars.forEach((calendar) => {
                if (
                  !allCalendars.some((existing) => existing.id === calendar.id)
                ) {
                  allCalendars.push(calendar);
                }
              });

              setSessionCalendars(session.id, sessionCalendars);
            } else {
              console.warn(
                `No access token available for session ${session.id}`
              );
            }
          } catch (error) {
            console.error(
              `Failed to fetch calendars for session ${session.id}:`,
              error
            );
          }
        }
      }

      if (allCalendars.length > 0) {
        setFetchedCalendars(allCalendars);

        const calendarIds = allCalendars.map((cal) => cal.id);        
        // Only set visible calendars if they haven't been set yet
        if (visibleCalendars.size === 0) {
          setVisibleCalendarIds(calendarIds);
          setVisibleCalendars(new Set(calendarIds));
        }

        onCalendarsFetched?.(allCalendars);
      } else {
        setFetchedCalendars([]);
        setVisibleCalendarIds([]);
        setVisibleCalendars(new Set());
      }

      if (accessToken) {
        const googleColors = await fetch(
          'https://www.googleapis.com/calendar/v3/colors',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (googleColors.ok) {
          const colorData = await googleColors.json();
          const colors: ColorOption[] = Object.entries(
            colorData.calendar || {}
          ).map(([id, color]: [string, any]) => ({
            id,
            background: color.background,
          }));
          setColorOptions(colors);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch calendars');
      // Reset the ref on error so we can retry
      hasFetchedCalendarsRef.current = false;
    } finally {
      setIsLoadingCalendars(false);
      isGlobalFetching = false; // Reset global flag after fetch
    }
  }, [
    userId,
    accessToken,
    sessions,
    fetchCalendarsForSession,
    setSessionCalendars,
    setVisibleCalendarIds,
    onCalendarsFetched,
  ]);

  // Only fetch calendars once when sessions are available
  React.useEffect(() => {
    if (accessToken && userId && sessions && sessions.length > 0 && !hasFetchedCalendarsRef.current) {
      fetchCalendars();
    }
  }, [accessToken, userId, sessions, fetchCalendars]);

  // Reset fetch state when sessions change
  React.useEffect(() => {
    hasFetchedCalendarsRef.current = false;
    setFetchedCalendars([]);
    setVisibleCalendars(new Set());
    // Reset global flag when sessions change
    isGlobalFetching = false;
  }, [sessions]);

  // Function to manually reset fetch state (useful for testing or manual refresh)
  const resetFetchState = React.useCallback(() => {
    hasFetchedCalendarsRef.current = false;
    isGlobalFetching = false;
    setFetchedCalendars([]);
    setVisibleCalendars(new Set());
  }, []);

  const handleChangeCalendarColor = React.useCallback(
    async (calendarId: string, colorId: string) => {
      if (!(userId && accessToken)) return;

      setFetchedCalendars((prevCalendars) =>
        prevCalendars.map((cal) =>
          cal.id === calendarId
            ? {
                ...cal,
                colorId,
                backgroundColor: colorOptions.find((c) => c.id === colorId)
                  ?.background,
              }
            : cal
        )
      );

      try {
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/users/me/calendarList/${calendarId}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ colorId }),
          }
        );

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
    },
    [userId, accessToken, colorOptions, fetchCalendars]
  );

  const handleDeleteCalendar = React.useCallback(
    async (calendarId: string) => {
      if (!(userId && accessToken)) return;
      try {
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${calendarId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        toast.success('Calendar removed');

        setVisibleCalendars((prev) => {
          const newSet = new Set(prev);
          newSet.delete(calendarId);
          return newSet;
        });

        const newVisibleIds = visibleCalendarIds.filter(
          (id) => id !== calendarId
        );
        setVisibleCalendarIds(newVisibleIds);
        fetchCalendars();
      } catch (error) {
        console.error('Failed to remove calendar:', error);
        toast.error('Failed to remove calendar');
      }
    },
    [
      userId,
      accessToken,
      setVisibleCalendarIds,
      visibleCalendarIds,
      fetchCalendars,
    ]
  );

  const handleCalendarToggle = React.useCallback(
    (calendarId: string) => {
      console.log('Toggling calendar:', calendarId);
      setVisibleCalendars((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(calendarId)) {
          newSet.delete(calendarId);
          console.log('Removing calendar:', calendarId);
        } else {
          newSet.add(calendarId);
          console.log('Adding calendar:', calendarId);
        }
        console.log('New visible calendars set:', Array.from(newSet));
        return newSet;
      });
    },
    []
  );

  const createCalendar = React.useCallback(
    async (calendarData: {
      summary: string;
      description?: string;
      timeZone: string;
      colorId?: string;
    }) => {
      if (!userId) throw new Error('No user session');
      if (!accessToken) throw new Error('Google Calendar not connected');

      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars',
        {
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
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newCalendar = await response.json();
      toast.success('Calendar created successfully');
      fetchCalendars();
      return newCalendar;
    },
    [userId, accessToken, fetchCalendars]
  );

  const createCalendarForAccount = React.useCallback(
    async (
      calendarData: {
        summary: string;
        description?: string;
        timeZone: string;
        colorId?: string;
      },
      targetAccountEmail?: string
    ) => {
      if (!userId) throw new Error('No user session');

      let targetAccessToken = accessToken;

      if (targetAccountEmail && sessions && sessions.length > 1) {
        const targetSession = sessions.find(
          (session) =>
            session.user?.primaryEmailAddress?.emailAddress ===
            targetAccountEmail
        );

        if (targetSession) {
          targetAccessToken = await getAccessTokenForSession(targetSession.id);
        }
      }

      if (!targetAccessToken)
        throw new Error('Google Calendar not connected for target account');

      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${targetAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            summary: calendarData.summary,
            description: calendarData.description,
            timeZone: calendarData.timeZone,
            colorId: calendarData.colorId || '1',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newCalendar = await response.json();
      toast.success('Calendar created successfully');
      fetchCalendars();
      return newCalendar;
    },
    [userId, accessToken, sessions, fetchCalendars]
  );

  return {
    fetchedCalendars,
    isLoadingCalendars,
    visibleCalendars,
    colorOptions,
    handleChangeCalendarColor,
    handleDeleteCalendar,
    handleCalendarToggle,
    createCalendar,
    createCalendarForAccount,
    refetchCalendars: fetchCalendars,
    resetFetchState,
  };
}
