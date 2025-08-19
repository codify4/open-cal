import type { Event } from '@/lib/store/calendar-store';

export const updateEvent = async (
  calendarStore: any,
  params: {
    eventId: string;
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    attendees?: string[];
    color?: string;
    isAllDay?: boolean;
    repeat?: string;
    visibility?: string;
  }
) => {
  try {
    const existingEvent = calendarStore.events.find(
      (e: Event) => e.id === params.eventId
    );
    
    if (!existingEvent) {
      return { success: false, error: 'Event not found' };
    }

    const updatedEvent: Event = {
      ...existingEvent,
      ...(params.title && { title: params.title }),
      ...(params.description && { description: params.description }),
      ...(params.startDate && { startDate: new Date(params.startDate) }),
      ...(params.endDate && { endDate: new Date(params.endDate) }),
      ...(params.location && { location: params.location }),
      ...(params.attendees && { attendees: params.attendees }),
      ...(params.color && { color: params.color }),
      ...(params.isAllDay !== undefined && { isAllDay: params.isAllDay }),
      ...(params.repeat && { repeat: params.repeat as any }),
      ...(params.visibility && { visibility: params.visibility as any }),
    };

    if (params.startDate || params.endDate) {
      const startDate = params.startDate ? new Date(params.startDate) : existingEvent.startDate;
      const endDate = params.endDate ? new Date(params.endDate) : existingEvent.endDate;

      const allEvents = [
        ...calendarStore.events,
        ...calendarStore.googleEvents,
      ];

      const conflictingEvents = allEvents.filter((event: Event) => {
        if (event.id === params.eventId) return false;
        
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
    }

    calendarStore.saveEvent(updatedEvent);
    return { success: true, event: updatedEvent };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
