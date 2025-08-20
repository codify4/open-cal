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

let isGlobalFetching = false;

export function useCalendarManagement(
  onCalendarsFetched?: (calendars: GoogleCalendar[]) => void
) {
  const { userId } = useAuth();
  const { sessions: rawSessions } = useSessionList();
  const sessions = React.useMemo(() => rawSessions, [rawSessions?.map(s => s.id).join(',')]);

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

  const onCalendarsFetchedRef = React.useRef(onCalendarsFetched);
  React.useEffect(() => {
    onCalendarsFetchedRef.current = onCalendarsFetched;
  }, [onCalendarsFetched]);

  React.useEffect(() => {
    if (userId) {
      getAccessToken().then(setAccessToken);
    }
  }, [userId]);

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

        return calendars.sort((a, b) => {
          if (a.primary && !b.primary) return -1;
          if (!a.primary && b.primary) return 1;
          return (a.summary || a.name || '').localeCompare(
            b.summary || b.name || ''
          );
        });
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
    if (!userId || isGlobalFetching || hasFetchedCalendarsRef.current) {
      return;
    }

    setIsLoadingCalendars(true);
    isGlobalFetching = true;
    hasFetchedCalendarsRef.current = true;

    try {
      const allCalendars: GoogleCalendar[] = [];

      if (sessions && sessions.length > 0) {
        for (const session of sessions) {
          if (!session.user?.primaryEmailAddress?.emailAddress) continue;

          try {
            const sessionToken = await getAccessTokenForSession(session.id);
            if (sessionToken) {
              const sessionCalendars = await fetchCalendarsForSession(
                session,
                sessionToken
              );

              sessionCalendars.forEach((calendar) => {
                if (!allCalendars.some((existing) => existing.id === calendar.id)) {
                  allCalendars.push(calendar);
                }
              });

              setSessionCalendars(session.id, sessionCalendars);
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

        if (visibleCalendars.size === 0) {
          const calendarIds = allCalendars.map((cal) => cal.id);
          setVisibleCalendarIds(calendarIds);
          setVisibleCalendars(new Set(calendarIds));
        }

        onCalendarsFetchedRef.current?.(allCalendars);
      } else {
        setFetchedCalendars([]);
        setVisibleCalendarIds([]);
        setVisibleCalendars(new Set());
      }

      if (accessToken) {
        try {
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
        } catch (error) {
          console.error('Failed to fetch colors:', error);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch calendars');
      hasFetchedCalendarsRef.current = false;
    } finally {
      setIsLoadingCalendars(false);
      isGlobalFetching = false;
    }
  }, [userId, accessToken, sessions, fetchCalendarsForSession, setSessionCalendars, setVisibleCalendarIds]);

  React.useEffect(() => {
    if (accessToken && userId && sessions && sessions.length > 0 && !hasFetchedCalendarsRef.current) {
      fetchCalendars();
    }
  }, [accessToken, userId, sessions, fetchCalendars]);

  React.useEffect(() => {
    hasFetchedCalendarsRef.current = false;
    setFetchedCalendars([]);
    setVisibleCalendars(new Set());
    isGlobalFetching = false;
  }, [sessions]);

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
        await fetchCalendars();
      } catch (error) {
        console.error('Failed to update calendar color:', error);
        await fetchCalendars();

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
        await fetchCalendars();
      } catch (error) {
        console.error('Failed to remove calendar:', error);
        toast.error('Failed to remove calendar');
      }
    },
    [userId, accessToken, setVisibleCalendarIds, visibleCalendarIds, fetchCalendars]
  );

  const handleCalendarToggle = React.useCallback(
    (calendarId: string) => {
      const isCurrentlyVisible = visibleCalendarIds.includes(calendarId);
      const newVisibleIds = isCurrentlyVisible
        ? visibleCalendarIds.filter((id: string) => id !== calendarId)
        : [...visibleCalendarIds, calendarId];
      
      setVisibleCalendarIds(newVisibleIds);
      setVisibleCalendars(new Set(newVisibleIds));
    },
    [visibleCalendarIds, setVisibleCalendarIds]
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
      await fetchCalendars();
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
      await fetchCalendars();
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
