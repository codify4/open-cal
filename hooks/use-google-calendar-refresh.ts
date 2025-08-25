import { useUser } from '@clerk/nextjs';
import { useCallback, useRef, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { getAccessToken, getAccessTokenForSession } from '@/actions/access-token';
import {
  convertGoogleEventToLocalEvent,
  getDateRangeForView,
} from '@/lib/calendar-utils/calendar-utils';
import type { Event } from '@/lib/store/calendar-store';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { useSessionList } from '@clerk/nextjs';

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
  const { sessions } = useSessionList();
  const isRefreshingRef = useRef(false);
  const hasFetchedRef = useRef(false);

  const sessionsStable = useMemo(() => sessions, [sessions?.length, sessions?.map(s => s.id).join(',')]);

  const refreshEvents = useCallback(async () => {
    if (visibleCalendarIds.length === 0 || !user?.id || isRefreshingRef.current) {
      return;
    }

    if (Object.keys(sessionCalendars).length === 0) {
      console.log('Session calendars not yet populated, skipping refresh');
      return;
    }

    isRefreshingRef.current = true;
    setFetchingEvents(true);

    try {
      const { startDate, endDate } = getDateRangeForView(currentDate, viewType);
      const timeMin = startDate.toISOString();
      const timeMax = endDate.toISOString();

      const allEvents: Event[] = [];
      
      for (const calendarId of visibleCalendarIds) {
        try {
          const effectiveCalendarId = calendarId === user.primaryEmailAddress?.emailAddress ? 'primary' : calendarId;
          
          let sessionAccessToken: string | null = null;
          
          if (calendarId === user.primaryEmailAddress?.emailAddress) {
            sessionAccessToken = await getAccessToken();
          } else {
            const targetSession = sessionsStable?.find(session => {
              const sessionCals = sessionCalendars[session.id] || [];
              return sessionCals.some(cal => cal.id === calendarId);
            });
            
            if (targetSession) {
              sessionAccessToken = await getAccessTokenForSession(targetSession.id);
            }
          }
          
          if (!sessionAccessToken) {
            console.warn(`No access token available for calendar: ${calendarId}`);
            continue;
          }
          
          const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(effectiveCalendarId)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
            {
              headers: {
                Authorization: `Bearer ${sessionAccessToken}`,
                'Content-Type': 'application/json',
              },
              cache: 'reload',
            }
          );

          if (response.ok) {
            const data = await response.json();
            const calendarEvents = data.items?.map((event: any) =>
              convertGoogleEventToLocalEvent(
                event,
                calendarId,
                user.primaryEmailAddress?.emailAddress
              )
            ) || [];
            
            allEvents.push(...calendarEvents);
            // Update UI immediately with each calendar's events
            setGoogleEvents([...allEvents]);
          } else if (response.status === 404) {
            console.warn(`Calendar not accessible: ${calendarId}`);
          }
        } catch (error) {
          console.warn(`Failed to fetch events for ${calendarId}:`, error);
        }
      }

      hasFetchedRef.current = true;
    } catch (error) {
      console.error('Event refresh failed:', error);
      toast.error('Failed to fetch calendar events');
    } finally {
      setFetchingEvents(false);
      isRefreshingRef.current = false;
    }
  }, [currentDate, viewType, visibleCalendarIds, sessionCalendars, setGoogleEvents, setFetchingEvents, user?.id, user?.primaryEmailAddress?.emailAddress, sessionsStable]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && hasFetchedRef.current) {
        return;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { refreshEvents };
};
