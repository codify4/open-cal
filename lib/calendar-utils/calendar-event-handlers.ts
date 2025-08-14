import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { convertGoogleEventToLocalEvent } from '@/lib/calendar-utils/calendar-utils';
import { parseTimeString } from './calendar-view-utils';

export const createGoogleEvent = async (
  date: Date,
  timeString: string,
  calendarId: string,
  userId: string,
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

  const accessToken = await authClient.getAccessToken({
    providerId: 'google',
    userId: userId,
  });

  if (!accessToken?.data?.accessToken) {
    throw new Error('No access token available');
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
      Authorization: `Bearer ${accessToken.data.accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.error('Failed to create Google event:', errText);
    throw new Error('Failed to create event');
  }

  const googleEvent = await resp.json();
  return convertGoogleEventToLocalEvent(googleEvent, calendarId, userEmail);
};

export const handleAddEvent = async (
  targetDate: Date,
  timeString: string,
  session: any,
  visibleCalendarIds: string[],
  saveEvent: Function,
  openEventSidebarForEdit: Function,
  openEventSidebarForNewEvent: Function,
  refreshEvents: Function
) => {
  if (!session) {
    authClient.signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}/calendar`,
      errorCallbackURL: `${window.location.origin}/calendar`,
      newUserCallbackURL: `${window.location.origin}/calendar`,
    });
    return;
  }

  if (!timeString) {
    console.error('Time string not provided.');
    return;
  }

  try {
    const { data: s } = await authClient.getSession();
    if (!s?.user?.id) {
      openEventSidebarForNewEvent(targetDate);
      return;
    }

    const accessToken = await authClient.getAccessToken({
      providerId: 'google',
      userId: s.user.id,
    });

    if (!accessToken?.data?.accessToken) {
      openEventSidebarForNewEvent(targetDate);
      return;
    }

    const calendarId = visibleCalendarIds[0] || 'primary';
    const converted = await createGoogleEvent(
      targetDate,
      timeString,
      calendarId,
      s.user.id,
      s.user.email
    );

    saveEvent(converted);
    openEventSidebarForEdit(converted);
    await refreshEvents();
  } catch (e) {
    console.error(e);
    toast.error('Failed to create event');
    openEventSidebarForNewEvent(targetDate);
  }
};
