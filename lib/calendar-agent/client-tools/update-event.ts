import type { Event } from '@/lib/store/calendar-store';

export const updateEvent = async (
  calendarStore: any,
  params: {
    title: string;
    startDate?: string;
    endDate?: string;
    newTitle?: string;
    newDescription?: string;
    newStartDate?: string;
    newEndDate?: string;
    newLocation?: string;
    newAttendees?: string[];
    newColor?: string;
    newIsAllDay?: boolean;
    newRepeat?: string;
    newVisibility?: string;
  }
) => {
  try {
    const allEvents = [
      ...calendarStore.events,
      ...calendarStore.googleEvents,
    ];

    let existingEvent = allEvents.find((e: Event) => {
      if (e.title.toLowerCase() !== params.title.toLowerCase()) return false;
      
      if (params.startDate) {
        const eventDate = e.startDate.toDateString();
        const searchDate = new Date(params.startDate).toDateString();
        if (eventDate !== searchDate) return false;
      }
      
      return true;
    });
    
    if (!existingEvent) {
      return { success: false, error: 'Event not found' };
    }

    const updatedEvent: Event = {
      ...existingEvent,
      ...(params.newTitle && { title: params.newTitle }),
      ...(params.newDescription && { description: params.newDescription }),
      ...(params.newStartDate && { startDate: new Date(params.newStartDate) }),
      ...(params.newEndDate && { endDate: new Date(params.newEndDate) }),
      ...(params.newLocation && { location: params.newLocation }),
      ...(params.newAttendees && { attendees: params.newAttendees }),
      ...(params.newColor && { color: params.newColor }),
      ...(params.newIsAllDay !== undefined && { isAllDay: params.newIsAllDay }),
      ...(params.newRepeat && { repeat: params.newRepeat as any }),
      ...(params.newVisibility && { visibility: params.newVisibility as any }),
    };

    if (params.newStartDate || params.newEndDate) {
      const startDate = params.newStartDate ? new Date(params.newStartDate) : existingEvent.startDate;
      const endDate = params.newEndDate ? new Date(params.newEndDate) : existingEvent.endDate;

      const conflictingEvents = allEvents.filter((event: Event) => {
        if (event.id === params.title) return false;
        
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
