import { useCallback } from 'react';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { authClient } from '@/lib/auth-client';
import { getDateRangeForView, convertGoogleEventToLocalEvent } from '@/lib/calendar-utils';
import { toast } from 'sonner';
import type { Event } from '@/lib/store/calendar-store';

export const useGoogleCalendarRefresh = () => {
  const {
    currentDate,
    viewType,
    visibleCalendarIds,
    setGoogleEvents,
    setFetchingEvents,
  } = useCalendarStore((state) => state);

  const refreshEvents = useCallback(async () => {
    if (visibleCalendarIds.length === 0) return;

    const { data: session } = await authClient.getSession();
    if (!session?.user?.id) return;

    setFetchingEvents(true);
    
    try {
      const accessToken = await authClient.getAccessToken({
        providerId: 'google',
        userId: session.user.id,
      });
      
      if (!accessToken?.data?.accessToken) {
        throw new Error('No access token available');
      }
      
      const { startDate, endDate } = getDateRangeForView(currentDate, viewType);
      const allEvents: Event[] = [];
      
      for (const calendarId of visibleCalendarIds) {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${startDate.toISOString()}&timeMax=${endDate.toISOString()}&singleEvents=true&orderBy=startTime&key=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY}`;
        
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken.data.accessToken}`,
            Accept: 'application/json',
          },
        });
        
        if (response.status === 401) {
          toast.error('Access token expired. Please reconnect your Google account.');
          return;
        }
        
        if (response.ok) {
          const eventsData = await response.json();
          const convertedEvents = eventsData.items?.map((googleEvent: any) => 
            convertGoogleEventToLocalEvent(googleEvent, calendarId, session.user.email)
          ) || [];
          allEvents.push(...convertedEvents);
        }
      }
      
      setGoogleEvents(allEvents);
      
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to fetch calendar events');
    } finally {
      setFetchingEvents(false);
    }
  }, [currentDate, viewType, visibleCalendarIds, setGoogleEvents, setFetchingEvents]);

  return { refreshEvents };
};
