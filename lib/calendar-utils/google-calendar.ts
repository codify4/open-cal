import { toast } from 'sonner';
import { getAccessToken } from '@/actions/access-token';
import {
  convertGoogleEventToLocalEvent,
  getGoogleColorIdFromLocal,
} from '@/lib/calendar-utils/calendar-utils';
import type { Event } from '@/lib/store/calendar-store';

export const buildGoogleEventPayload = (e: Event) => {
  const isAllDay = e.isAllDay;
  const start = isAllDay
    ? { date: new Date(e.startDate).toISOString().slice(0, 10) }
    : { dateTime: new Date(e.startDate).toISOString() };
  const end = isAllDay
    ? { date: new Date(e.endDate).toISOString().slice(0, 10) }
    : { dateTime: new Date(e.endDate).toISOString() };
  const colorId = getGoogleColorIdFromLocal(e.color) || '1';

  const payload: Record<string, unknown> = {
    summary: e.title || '',
    description: e.description || '',
    start,
    end,
    colorId,
    location: e.location || undefined,
    attendees: (e.attendees || []).map((email) => ({ email })),
    visibility: e.visibility || 'public',
    recurrence:
      e.repeat && e.repeat !== 'none'
        ? [
            `RRULE:FREQ=${
              e.repeat === 'daily'
                ? 'DAILY'
                : e.repeat === 'weekly'
                  ? 'WEEKLY'
                  : e.repeat === 'monthly'
                    ? 'MONTHLY'
                    : 'YEARLY'
            }`,
          ]
        : undefined,
  };

  if (e.meetingType === 'google-meet') {
    const generateId = () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    payload.conferenceData = {
      createRequest: {
        requestId: generateId(),
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    };
  }

  return payload;
};

export const createGoogleEvent = async (
  eventToSave: Event,
  userId: string,
  userEmail?: string
) => {
  console.log('createGoogleEvent called with:', { eventToSave, userId, userEmail });
  
  try {
    if (!userId) {
      console.log('No userId provided');
      return;
    }

    const accessToken = await getAccessToken();
    console.log('Access token obtained:', !!accessToken);
    
    if (!accessToken) {
      toast.error(
        'Google Calendar not connected. Please connect your Google account to save events.'
      );
      return;
    }

    const calendarId = eventToSave.googleCalendarId || 'primary';
    console.log('Using calendar ID:', calendarId);
    
    let workingCalendarId = calendarId;
    if (calendarId.includes('@') && !calendarId.includes('group.calendar.google.com')) {
      workingCalendarId = 'primary';
      console.log('Falling back to primary calendar');
    }
    
    const baseUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(workingCalendarId)}/events`;
    const confSuffix = '&conferenceDataVersion=1';
    const url = `${baseUrl}?sendUpdates=none${confSuffix}`;

    console.log('Creating event at URL:', url);
    
    const payload = buildGoogleEventPayload(eventToSave);
    console.log('Built payload:', payload);
    
    const body = JSON.stringify(payload);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body,
    });

    console.log('Create response status:', response.status);

    if (response.ok) {
      const googleEvent = await response.json();
      console.log('Google event created successfully:', googleEvent);
      
      const converted = convertGoogleEventToLocalEvent(
        googleEvent,
        workingCalendarId,
        userEmail
      );
      console.log('Converted event:', converted);
      
      return { success: true, event: converted };
    }

    if (response.status === 401) {
      console.log('Unauthorized - access token expired');
      toast.error(
        'Access token expired. Please reconnect your Google account.'
      );
      return { success: false, error: 'unauthorized' };
    }

    const errorText = await response.text();
    console.error('Failed to create Google event:', errorText);
    
    toast.error('Failed to save event to Google Calendar');
    return { success: false, error: 'api_error' };
  } catch (err) {
    console.error('Error in createGoogleEvent:', err);
    toast.error('Error saving event');
    return { success: false, error: 'network_error' };
  }
};

export const updateGoogleEvent = async (
  eventToSave: Event,
  userId: string,
  userEmail?: string
) => {
  console.log('updateGoogleEvent called with:', { eventToSave, userId, userEmail });
  
  try {
    if (!userId || !eventToSave.googleEventId) {
      console.log('Missing userId or googleEventId:', { userId, googleEventId: eventToSave.googleEventId });
      return;
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.log('No access token available');
      toast.error(
        'Google Calendar not connected. Please connect your Google account to save events.'
      );
      return;
    }

    const calendarId = eventToSave.googleCalendarId || 'primary';
    console.log('Using calendar ID:', calendarId);
    
    const baseUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
    const confSuffix = '&conferenceDataVersion=1';
    const url = `${baseUrl}/${encodeURIComponent(eventToSave.googleEventId)}?sendUpdates=none${confSuffix}`;

    const payload = buildGoogleEventPayload(eventToSave);
    console.log('Built payload:', payload);
    
    const body = JSON.stringify(payload);

    console.log('Sending PUT request to:', url);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body,
    });

    console.log('Update response status:', response.status);

    if (response.ok) {
      const googleEvent = await response.json();
      console.log('Google event updated successfully:', googleEvent);
      
      const converted = convertGoogleEventToLocalEvent(
        googleEvent,
        calendarId,
        userEmail
      );
      console.log('Converted event:', converted);

      return { success: true, event: converted };
    }

    if (response.status === 401) {
      console.log('Unauthorized - access token expired');
      toast.error(
        'Access token expired. Please reconnect your Google account.'
      );
      return { success: false, error: 'unauthorized' };
    }

    const errorText = await response.text();
    console.error('Failed to update Google event:', errorText);

    toast.error('Failed to update event in Google Calendar');
    return { success: false, error: 'api_error' };
  } catch (err) {
    console.error('Error in updateGoogleEvent:', err);
    toast.error('Error updating event');
    return { success: false, error: 'network_error' };
  }
};

export const upsertGoogleEvent = async (
  eventToSave: Event,
  userId: string,
  userEmail?: string
) => {
  console.log('upsertGoogleEvent called with:', { eventToSave, userId, userEmail });
  
  if (eventToSave.googleEventId) {
    console.log('Updating existing Google event:', eventToSave.googleEventId);
    return updateGoogleEvent(eventToSave, userId, userEmail);
  } else {
    console.log('Creating new Google event');
    return createGoogleEvent(eventToSave, userId, userEmail);
  }
};

export const deleteGoogleEvent = async (
  eventId: string,
  calendarId = 'primary'
) => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      toast.error(
        'Google Calendar not connected. Please connect your Google account to delete events.'
      );
      return { success: false, error: 'no_token' };
    }

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}?sendUpdates=none`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return { success: true };
    }

    if (response.status === 404) {
      return { success: false, error: 'not_found' };
    }

    if (response.status === 401) {
      toast.error(
        'Access token expired. Please reconnect your Google account.'
      );
      return { success: false, error: 'unauthorized' };
    }

    const errorText = await response.text();
    console.error('Failed to delete Google event:', errorText);

    toast.error('Failed to delete event from Google Calendar');
    return { success: false, error: 'api_error' };
  } catch (err) {
    console.error(err);
    toast.error('Error deleting event');
    return { success: false, error: 'network_error' };
  }
};
