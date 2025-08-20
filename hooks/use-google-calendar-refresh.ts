import { useSessionList, useUser } from '@clerk/nextjs';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { getAccessTokenForSession } from '@/actions/access-token';
import {
  convertGoogleEventToLocalEvent,
  getDateRangeForView,
} from '@/lib/calendar-utils/calendar-utils';
import type { Event } from '@/lib/store/calendar-store';
import { useCalendarStore } from '@/providers/calendar-store-provider';

export const useGoogleCalendarRefresh = () => {
  const {
    currentDate,
    viewType,
    visibleCalendarIds,
    setGoogleEvents,
    setFetchingEvents,
    sessionCalendars,
  } = useCalendarStore((state) => state);

  const { user } = useUser();
  const { sessions } = useSessionList();

  const refreshEvents = useCallback(async () => {
    if (visibleCalendarIds.length === 0) {
      return;
    }
    if (!user?.id) {
      return;
    }

    setFetchingEvents(true);

    try {
      const { startDate, endDate } = getDateRangeForView(currentDate, viewType);
      const allEvents: Event[] = [];

      for (const calendarId of visibleCalendarIds) {
        let sessionAccessToken: string | null = null;
        
        for (const [sessionId, calendars] of Object.entries(sessionCalendars)) {
          if (calendars.some(cal => cal.id === calendarId)) {
            sessionAccessToken = await getAccessTokenForSession(sessionId);
            break;
          }
        }

        if (!sessionAccessToken && sessions) {
          for (const session of sessions) {
            const sessionEmail = session.user?.primaryEmailAddress?.emailAddress;
            if (sessionEmail === calendarId) {
              sessionAccessToken = await getAccessTokenForSession(session.id);
              break;
            }
          }
        }

        if (!sessionAccessToken) {
          console.warn(`No access token found for calendar: ${calendarId}`);
          continue;
        }

        const timeMin = startDate.toISOString();
        const timeMax = endDate.toISOString();

        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
          {
            headers: {
              Authorization: `Bearer ${sessionAccessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            console.warn(`Calendar not found or no access: ${calendarId}`);
            continue;
          }
          continue;
        }

        const data = await response.json();
        const events = data.items?.map((event: any) =>
          convertGoogleEventToLocalEvent(
            event,
            calendarId,
            user.primaryEmailAddress?.emailAddress
          )
        ) || [];

        allEvents.push(...events);
      }

      setGoogleEvents(allEvents);
    } catch (error) {
      toast.error('Failed to fetch calendar events');
    } finally {
      setFetchingEvents(false);
    }
  }, [
    currentDate,
    viewType,
    visibleCalendarIds,
    setGoogleEvents,
    setFetchingEvents,
    user?.id,
    sessionCalendars,
  ]);

  return { refreshEvents };
};
