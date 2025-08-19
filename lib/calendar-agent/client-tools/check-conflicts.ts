import type { Event } from '@/lib/store/calendar-store';

export const checkConflicts = async (
  calendarStore: any,
  params: {
    startDate: string;
    endDate: string;
    excludeEventId?: string;
  }
) => {
  try {
    console.log('Client tools checkConflicts called with params:', params);
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);

    const allEvents = [
      ...calendarStore.events,
      ...calendarStore.googleEvents,
    ];
    
    console.log('Total events in store:', allEvents.length);
    console.log('Store events:', calendarStore.events);
    console.log('Google events:', calendarStore.googleEvents);

    const conflictingEvents = allEvents.filter((event: Event) => {
      if (params.excludeEventId && event.id === params.excludeEventId) {
        return false;
      }
      
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      const hasConflict = eventStart < endDate && eventEnd > startDate;
      console.log(`Event "${event.title}": ${eventStart.toISOString()} - ${eventEnd.toISOString()}, hasConflict: ${hasConflict}`);
      
      return hasConflict;
    });

    console.log('Conflicting events found:', conflictingEvents.length);

    if (conflictingEvents.length === 0) {
      return {
        success: true,
        hasConflicts: false,
        events: [],
      };
    }

    return {
      success: true,
      hasConflicts: true,
      events: conflictingEvents,
    };
  } catch (error) {
    console.error('Error in checkConflicts:', error);
    return {
      success: false,
      hasConflicts: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
