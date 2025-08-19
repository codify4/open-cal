import type { Event } from '@/lib/store/calendar-store';

export interface ClientCalendarTools {
  checkConflicts: (params: {
    startDate: string;
    endDate: string;
    excludeEventId?: string;
  }) => Promise<{ success: boolean; hasConflicts: boolean; events?: Event[]; error?: string }>;

  createEvent: (params: {
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
  }) => Promise<{ 
    success: boolean; 
    event?: Event; 
    hasConflicts?: boolean;
    conflictingEvents?: Array<{ title: string; startTime: string; endTime: string }>;
    error?: string 
  }>;

  deleteEvent: (params: {
    eventId?: string;
    title?: string;
    startDate?: string;
    location?: string;
  }) => Promise<{ success: boolean; error?: string; deletedEvent?: { id: string; title: string; startDate: string; endDate: string }; multipleMatches?: boolean; matchingEvents?: Array<{ id: string; title: string; startDate: string; endDate: string; location?: string }> }>;

  findFreeTime: (params: {
    duration: number;
    startDate: string;
    endDate: string;
    preferredTime?: string;
  }) => Promise<{ success: boolean; freeSlots?: Array<{ start: string; end: string }>; error?: string }>;

  getCalendarSummary: (params: {
    startDate: string;
    endDate: string;
    includeStats?: boolean;
  }) => Promise<{
    success: boolean;
    summary?: {
      totalEvents: number;
      events: any[];
      stats?: { upcoming: number; past: number; allDay: number };
    };
    error?: string;
  }>;

  getEvents: (params: {
    startDate: string;
    endDate: string;
    includeAllDay?: boolean;
  }) => Promise<{ success: boolean; events?: Event[]; error?: string }>;

  updateEvent: (params: {
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
  }) => Promise<{ 
    success: boolean; 
    event?: Event; 
    hasConflicts?: boolean;
    conflictingEvents?: Array<{ title: string; startTime: string; endTime: string }>;
    error?: string 
  }>;
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

  deleteEvent: async (params) => {
    try {
      let eventToDelete: Event | undefined;

      if (params.eventId) {
        // Direct ID lookup
        eventToDelete = calendarStore.events.find(
          (e: Event) => e.id === params.eventId
        );
      } else {
        // Search by descriptive parameters
        const allEvents = [
          ...calendarStore.events,
          ...calendarStore.googleEvents,
        ];

        // Build search criteria
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

        // Find events that match ALL criteria
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
          // Multiple matches - return them for user selection
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

      // For client-side deletion, we'll just remove from local store
      // Google Calendar deletion should be handled server-side
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
  },

  getCalendarSummary: async (params) => {
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

      const summary: {
        totalEvents: number;
        events: any[];
        stats?: { upcoming: number; past: number; allDay: number };
      } = {
        totalEvents: events.length,
        events: events.map((event: Event) => ({
          id: event.id,
          title: event.title,
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location,
          attendees: event.attendees,
        })),
      };

      if (params.includeStats) {
        const now = new Date();
        const upcomingEvents = events.filter(
          (event: Event) => new Date(event.startDate) > now
        );
        const pastEvents = events.filter(
          (event: Event) => new Date(event.endDate) < now
        );

        summary.stats = {
          upcoming: upcomingEvents.length,
          past: pastEvents.length,
          allDay: events.filter((event: Event) => event.isAllDay).length,
        };
      }

      return { success: true, summary };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  createEvent: async (params) => {
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
  },

  updateEvent: async (params) => {
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
