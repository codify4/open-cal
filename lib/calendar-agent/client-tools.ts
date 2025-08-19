import type { Event } from '@/lib/store/calendar-store';

export interface ClientCalendarTools {
  checkConflicts: (params: {
    startDate: string;
    endDate: string;
    excludeEventId?: string;
  }) => Promise<{ success: boolean; hasConflicts: boolean; events?: Event[]; error?: string }>;

  findFreeTime: (params: {
    duration: number;
    startDate: string;
    endDate: string;
    preferredTime?: string;
  }) => Promise<{ success: boolean; freeSlots?: Array<{ start: string; end: string }>; error?: string }>;

  getEvents: (params: {
    startDate: string;
    endDate: string;
    includeAllDay?: boolean;
  }) => Promise<{ success: boolean; events?: Event[]; error?: string }>;
}

export const createClientCalendarTools = (calendarStore: any): ClientCalendarTools => ({
  checkConflicts: async (params) => {
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
  },

  findFreeTime: async (params) => {
    try {
      const startDate = new Date(params.startDate);
      const endDate = new Date(params.endDate);
      const duration = params.duration;

      const allEvents = [
        ...calendarStore.events,
        ...calendarStore.googleEvents,
      ];

      const events = allEvents.filter((event: Event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        return eventStart < endDate && eventEnd > startDate;
      });

      const freeSlots = [];
      let currentTime = new Date(startDate);

      while (currentTime < endDate) {
        const slotEnd = new Date(currentTime.getTime() + duration * 60_000);

        const hasConflict = events.some((event: Event) => {
          const eventStart = new Date(event.startDate);
          const eventEnd = new Date(event.endDate);
          return currentTime < eventEnd && slotEnd > eventStart;
        });

        if (!hasConflict) {
          freeSlots.push({
            start: currentTime.toISOString(),
            end: slotEnd.toISOString(),
          });
        }

        currentTime = new Date(currentTime.getTime() + 30 * 60_000);
      }

      return { success: true, freeSlots };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  getEvents: async (params) => {
    try {
      const startDate = new Date(params.startDate);
      const endDate = new Date(params.endDate);

      const allEvents = [
        ...calendarStore.events,
        ...calendarStore.googleEvents,
      ];

      const events = allEvents.filter((event: Event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        return eventStart < endDate && eventEnd > startDate;
      });

      return { success: true, events };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});
