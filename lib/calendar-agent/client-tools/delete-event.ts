import type { Event } from '@/lib/store/calendar-store';

export const deleteEvent = async (
  calendarStore: any,
  params: {
    eventId?: string;
    title?: string;
    startDate?: string;
    location?: string;
  }
) => {
  try {
    let eventToDelete: Event | undefined;

    if (params.eventId) {
      eventToDelete = calendarStore.events.find(
        (e: Event) => e.id === params.eventId
      );
    } else {
      const allEvents = [
        ...calendarStore.events,
        ...calendarStore.googleEvents,
      ];

      const searchCriteria: Array<(event: Event) => boolean> = [];
      if (params.title) {
        searchCriteria.push((event: Event) => 
          event.title.toLowerCase().includes(params.title!.toLowerCase())
        );
      }
      if (params.startDate) {
        const searchDate = new Date(params.startDate);
        searchCriteria.push((event: Event) => 
          new Date(event.startDate).toDateString() === searchDate.toDateString()
        );
      }
      if (params.location) {
        searchCriteria.push((event: Event) => 
          event.location ? event.location.toLowerCase().includes(params.location!.toLowerCase()) : false
        );
      }

      if (searchCriteria.length === 0) {
        return { 
          success: false, 
          error: 'Please provide at least one search parameter (title, date, or location)' 
        };
      }

      const matchingEvents = allEvents.filter((event: Event) => 
        searchCriteria.every(criteria => criteria(event))
      );

      if (matchingEvents.length === 0) {
        return { 
          success: false, 
          error: 'No events found matching the specified criteria' 
        };
      }

      if (matchingEvents.length > 1) {
        return {
          success: false,
          multipleMatches: true,
          matchingEvents: matchingEvents.map((event: Event) => ({
            id: event.id,
            title: event.title,
            startDate: event.startDate.toISOString(),
            endDate: event.endDate.toISOString(),
            location: event.location,
          })),
          error: `Found ${matchingEvents.length} matching events. Please be more specific or provide an event ID.`,
        };
      }

      eventToDelete = matchingEvents[0];
    }
    
    if (!eventToDelete) {
      return { success: false, error: 'Event not found' };
    }

    calendarStore.deleteEvent(eventToDelete.id);
    
    return { 
      success: true, 
      deletedEvent: {
        id: eventToDelete.id,
        title: eventToDelete.title,
        startDate: eventToDelete.startDate.toISOString(),
        endDate: eventToDelete.endDate.toISOString(),
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
