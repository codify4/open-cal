import type { Event } from '@/lib/store/calendar-store';
import { createGoogleEvent } from '@/lib/calendar-utils/google-calendar';

export const createEvent = async (
  calendarStore: any,
  userId: string,
  userEmail: string | undefined,
  availableCalendars: Array<{ id: string; summary?: string; primary?: boolean }> | undefined,
  params: {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    location?: string;
    attendees?: string[];
    color?: string;
    isAllDay?: boolean;
    repeat?: string;
    reminders?: string[];
    visibility?: string;
    userId: string;
    userEmail?: string;
    calendarId?: string;
  }
) => {
  try {
    let calendarId = params.calendarId;
    
    if (!calendarId && availableCalendars && availableCalendars.length > 0) {
      const primaryCalendar = availableCalendars.find(cal => cal.primary);
      calendarId = primaryCalendar?.id || availableCalendars[0].id;
    }

    if (!calendarId) {
      return {
        success: false,
        error: 'No calendar available. Please connect a Google Calendar first.',
      };
    }

    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);

    const allEvents = [
      ...calendarStore.events,
      ...calendarStore.googleEvents,
    ];

    const conflictingEvents = allEvents.filter((event: Event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return eventStart < endDate && eventEnd > startDate;
    });

    if (conflictingEvents.length > 0) {
      const conflictDetails = conflictingEvents.map((event: Event) => ({
        title: event.title,
        startTime: new Date(event.startDate).toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        endTime: new Date(event.endDate).toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      }));

      return {
        success: false,
        hasConflicts: true,
        conflictingEvents: conflictDetails,
        error: 'Scheduling conflicts detected',
      };
    }

    const event: Event = {
      id: `event-${Date.now()}`,
      title: params.title,
      description: params.description,
      startDate: startDate,
      endDate: endDate,
      location: params.location,
      attendees: params.attendees || [],
      color: params.color || 'blue',
      type: 'event',
      reminders: params.reminders?.map((r) => new Date(r)) || [],
      repeat: (params.repeat as any) || 'none',
      visibility: (params.visibility as any) || 'public',
      isAllDay: params.isAllDay,
      account: userEmail || 'user@example.com',
      googleCalendarId: calendarId,
    };

    const googleResult = await createGoogleEvent(event, userId, userEmail);
    
    if (googleResult?.success && googleResult.event) {
      const savedEvent = googleResult.event;
      calendarStore.saveEvent(savedEvent);
      return { success: true, event: savedEvent };
    }

    if (googleResult?.error === 'unauthorized') {
      return {
        success: false,
        error: 'Google Calendar access expired. Please reconnect your Google account.',
      };
    }

    if (googleResult?.error === 'event_not_found') {
      return {
        success: false,
        error: 'Event not found for update. Please create a new event instead.',
      };
    }

    return {
      success: false,
      error: googleResult?.error || 'Failed to save to Google Calendar',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
