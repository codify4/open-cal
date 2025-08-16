import { useCallback, useEffect, useState } from 'react';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { useUser } from '@clerk/nextjs';
import { getDateRangeForView, convertGoogleEventToLocalEvent } from '@/lib/calendar-utils/calendar-utils';
import { toast } from 'sonner';
import type { Event } from '@/lib/store/calendar-store';
import { getAccessToken } from '@/actions/access-token';

export const useGoogleCalendarRefresh = () => {
  const {
    currentDate,
    viewType,
    visibleCalendarIds,
    setGoogleEvents,
    setFetchingEvents,
  } = useCalendarStore((state) => state);

  const { user } = useUser();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (user?.id) {
        const token = await getAccessToken();
        setAccessToken(token);
      }
    };
    
    fetchToken();
  }, [user?.id]);

  const refreshEvents = useCallback(async () => {
    if (visibleCalendarIds.length === 0) return;
    if (!user?.id || !accessToken) return;

    setFetchingEvents(true);
    
    try {
      const { startDate, endDate } = getDateRangeForView(currentDate, viewType);
      
      const allEvents: Event[] = [];
      
      for (const calendarId of visibleCalendarIds) {
        const timeMin = startDate.toISOString();
        const timeMax = endDate.toISOString();
        
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          console.error(`Failed to fetch events for calendar ${calendarId}:`, response.status);
          continue;
        }

        const data = await response.json();
        const events = data.items?.map((event: any) => 
          convertGoogleEventToLocalEvent(event, calendarId, user.primaryEmailAddress?.emailAddress)
        ) || [];
        
        allEvents.push(...events);
      }

      setGoogleEvents(allEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to fetch calendar events');
    } finally {
      setFetchingEvents(false);
    }
  }, [currentDate, viewType, visibleCalendarIds, setGoogleEvents, setFetchingEvents, user?.id, accessToken]);

  return { refreshEvents };
};
