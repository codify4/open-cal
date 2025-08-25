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
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);

    const allEvents = [
      ...calendarStore.events,
      ...calendarStore.googleEvents,
    ];

    const conflictingEvents = allEvents.filter((event: Event) => {
      if (params.excludeEventId && event.id === params.excludeEventId) {
        return false;
      }
      
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      const hasConflict = eventStart < endDate && eventEnd > startDate;
      
      return hasConflict;
    });

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
    return {
      success: false,
      hasConflicts: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
