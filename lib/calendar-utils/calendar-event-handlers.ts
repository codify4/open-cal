import { toast } from 'sonner';
import { getAccessToken } from '@/actions/access-token';
import { convertGoogleEventToLocalEvent } from '@/lib/calendar-utils/calendar-utils';
import { parseTimeString } from './calendar-view-utils';

export const createGoogleEvent = async (
  date: Date,
  timeString: string,
  calendarId: string,
  userEmail: string
) => {
  const { hours, minutes } = parseTimeString(timeString);

  const startDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes
  );
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error(
      'Google Calendar not connected. Please connect your Google account to create events.'
    );
  }

  const body = {
    summary: 'Untitled Event',
    start: { dateTime: startDate.toISOString() },
    end: { dateTime: endDate.toISOString() },
    visibility: 'public',
    colorId: '1',
  };

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=none`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error('Failed to create event');
  }

  const googleEvent = await resp.json();
  const converted = convertGoogleEventToLocalEvent(googleEvent, calendarId, userEmail);
  
  return converted;
};

export const handleAddEvent = async (
  targetDate: Date,
  timeString: string,
  visibleCalendarIds: string[],
  saveEvent: Function,
  openEventSidebarForEdit: Function,
  openEventSidebarForNewEvent: Function,
  refreshEvents: Function,
  user: { id: string; primaryEmailAddress?: { emailAddress?: string } | null }
) => {
  if (!timeString) {
    return;
  }

  try {
    if (!user?.id) {
      return;
    }

    const accessToken = await getAccessToken();

    if (!accessToken) {
      toast.error(
        'Google Calendar not connected. Please connect your Google account to create events.'
      );
      openEventSidebarForNewEvent(targetDate);
      return;
    }

    let workingCalendarId = 'primary';
    if (visibleCalendarIds.length > 0) {
      workingCalendarId = 'primary';
    }

    const converted = await createGoogleEvent(
      targetDate,
      timeString,
      workingCalendarId,
      user.primaryEmailAddress?.emailAddress || ''
    );
    
    if (!converted) {
      throw new Error('Failed to create event');
    }

    saveEvent(converted);
    openEventSidebarForEdit(converted);
    await refreshEvents();
    
  } catch (e) {
    toast.error('Failed to create event');
    openEventSidebarForNewEvent(targetDate);
  }
};
