import type { Event } from '@/lib/store/calendar-store';

export const createEvent = async (
  calendarStore: any,
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
  }
) => {
  try {
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
      account: 'user@example.com',
      googleCalendarId: 'primary',
    };

    calendarStore.saveEvent(event);
    return { success: true, event };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
