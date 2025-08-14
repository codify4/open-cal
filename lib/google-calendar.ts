import { authClient } from '@/lib/auth-client';
import { convertGoogleEventToLocalEvent, getGoogleColorIdFromLocal } from '@/lib/calendar-utils';
import type { Event } from '@/lib/store/calendar-store';
import { toast } from 'sonner';

export const buildGoogleEventPayload = (e: Event) => {
  const isAllDay = e.isAllDay || false;
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
    payload.conferenceData = {
      createRequest: {
        requestId: crypto.randomUUID(),
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    };
  }
  
  return payload;
};

export const upsertGoogleEvent = async (eventToSave: Event, provisionalId?: string) => {
  try {
    const { data: session } = await authClient.getSession();
    if (!session?.user?.id) return;

    const accessToken = await authClient.getAccessToken({
      providerId: 'google',
      userId: session.user.id,
    });
    if (!accessToken?.data?.accessToken) return;

    const calendarId = eventToSave.googleCalendarId || 'primary';
    let isUpdate = Boolean(eventToSave.googleEventId);
    const baseUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
    const confSuffix = '&conferenceDataVersion=1';
    let url = isUpdate
      ? `${baseUrl}/${encodeURIComponent(eventToSave.googleEventId!)}?sendUpdates=none${confSuffix}`
      : `${baseUrl}?sendUpdates=none${confSuffix}`;

    let method: 'PUT' | 'POST' = isUpdate ? 'PUT' : 'POST';
    let body: string;
    let etag: string | undefined;

    if (isUpdate) {
      const getResp = await fetch(`${baseUrl}/${encodeURIComponent(eventToSave.googleEventId!)}`, {
        headers: {
          Authorization: `Bearer ${accessToken.data.accessToken}`,
          Accept: 'application/json',
        },
      });
      if (getResp.status === 404) {
        isUpdate = false;
        url = `${baseUrl}?sendUpdates=none`;
        method = 'POST';
        body = JSON.stringify(buildGoogleEventPayload(eventToSave));
      } else {
        if (!getResp.ok) {
          const errText = await getResp.text();
          console.error('Failed to fetch existing event:', errText);
          toast.error('Failed to load event for update');
          return;
        }
        const existing = await getResp.json();
        etag = existing?.etag;
        const payload = buildGoogleEventPayload(eventToSave);
        const merged = {
          ...existing,
          summary: payload.summary,
          description: payload.description,
          start: payload.start,
          end: payload.end,
          location: payload.location,
          attendees: payload.attendees,
          visibility: payload.visibility,
          recurrence: payload.recurrence,
          colorId: payload.colorId,
          conferenceData: payload.conferenceData,
        } as Record<string, unknown>;
        body = JSON.stringify(merged);
      }
    } else {
      body = JSON.stringify(buildGoogleEventPayload(eventToSave));
    }

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken.data.accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(etag ? { 'If-Match': etag } : {}),
      },
      body,
    });

    if (response.ok) {
      const googleEvent = await response.json();
      const converted = convertGoogleEventToLocalEvent(
        googleEvent,
        calendarId,
        session.user.email
      );
      
      if (googleEvent?.conferenceData || googleEvent?.hangoutLink) {
        converted.meetingType = 'google-meet';
        const videoEntry = googleEvent.conferenceData?.entryPoints?.find((e: any) => e.entryPointType === 'video');
        converted.meetLink = googleEvent.hangoutLink || videoEntry?.uri || '';
        converted.meetCode = googleEvent.conferenceData?.conferenceId || '';
      }
      
      return { success: true, event: converted };
    }

    if (response.status === 401) {
      toast.error('Access token expired. Please reconnect your Google account.');
      return { success: false, error: 'unauthorized' };
    }

    const errorText = await response.text();
    console.error('Failed to upsert Google event:', errorText);
    toast.error('Failed to save event to Google Calendar');
    return { success: false, error: 'api_error' };
  } catch (err) {
    console.error(err);
    toast.error('Error saving event');
    return { success: false, error: 'network_error' };
  }
};
