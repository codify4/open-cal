import { useUser } from '@clerk/nextjs';
import { convertGoogleEventToLocalEvent, getGoogleColorIdFromLocal } from '@/lib/calendar-utils/calendar-utils';
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
    // TODO: Implement Google OAuth with Clerk
    toast('Google OAuth integration coming soon');
    throw new Error('Google OAuth integration coming soon');
  } catch (err) {
    console.error(err);
    toast.error('Error saving event');
    return { success: false, error: 'network_error' };
  }
};
