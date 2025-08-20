import { useUser } from '@clerk/nextjs';
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { getAccessToken, getAccessTokenForSession } from '@/actions/access-token';
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
    sessionCalendars,
    setGoogleEvents,
    setFetchingEvents,
  } = useCalendarStore((state) => state);

  const { user } = useUser();
  const isRefreshingRef = useRef(false);

  const refreshEvents = useCallback(async () => {
    if (visibleCalendarIds.length === 0 || !user?.id || isRefreshingRef.current) {
      return;
    }

    if (Object.keys(sessionCalendars).length === 0) {
      console.log('Session calendars not yet populated, skipping refresh');
      return;
    }

    console.log('Starting event refresh for calendars:', visibleCalendarIds.length);
    isRefreshingRef.current = true;
    setFetchingEvents(true);

    try {
      const { startDate, endDate } = getDateRangeForView(currentDate, viewType);
      const allEvents: Event[] = [];

      for (const calendarId of visibleCalendarIds) {
        try {
          const timeMin = startDate.toISOString();
          const timeMax = endDate.toISOString();

          let accessToken: string | null = null;
          let sessionId: string | null = null;

          for (const [sessionIdKey, calendars] of Object.entries(sessionCalendars)) {
            const calendar = calendars.find((cal: any) => cal.id === calendarId);
            if (calendar) {
              sessionId = sessionIdKey;
              break;
            }
          }

          if (sessionId) {
            accessToken = await getAccessTokenForSession(sessionId);
          }

          if (!accessToken) {
            accessToken = await getAccessToken();
          }

          if (!accessToken) {
            console.warn(`No access token available for calendar ${calendarId}`);
            continue;
          }

          const effectiveCalendarId = calendarId === user.primaryEmailAddress?.emailAddress ? 'primary' : calendarId;

          const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(effectiveCalendarId)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const events = data.items?.map((event: any) =>
              convertGoogleEventToLocalEvent(
                event,
                calendarId,
                user.primaryEmailAddress?.emailAddress
              )
            ) || [];
            allEvents.push(...events);
          } else if (response.status === 404) {
            console.warn(`Calendar not accessible: ${calendarId}`);
          }
        } catch (error) {
          console.warn(`Failed to fetch events for ${calendarId}:`, error);
        }
      }

      console.log(`Fetched ${allEvents.length} events total`);
      setGoogleEvents(allEvents);
    } catch (error) {
      console.error('Event refresh failed:', error);
      toast.error('Failed to fetch calendar events');
    } finally {
      setFetchingEvents(false);
      isRefreshingRef.current = false;
    }
  }, [currentDate, viewType, visibleCalendarIds, sessionCalendars, setGoogleEvents, setFetchingEvents, user?.id]);

  return { refreshEvents };
};
