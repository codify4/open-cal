import type { Event } from '@/lib/store/calendar-store';
import { createGoogleEvent, updateGoogleEvent, deleteGoogleEvent } from '@/lib/calendar-utils/google-calendar';

export interface CalendarToolHandlers {
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
        userId: string;
        userEmail?: string;
        calendarId?: string;
    }) => Promise<{ 
        success: boolean; 
        event?: Event; 
        hasConflicts?: boolean;
        conflictingEvents?: Array<{ title: string; startTime: string; endTime: string }>;
        error?: string 
    }>;
    

    findFreeTime: (params: {
        startDate: string;
        endDate: string;
        duration?: number;
        preferredTime?: string;
    }) => Promise<{
        success: boolean;
        freeSlots?: Array<{ start: string; end: string }>;
        totalSlots?: number;
        totalFreeTime?: number;
        largestSlot?: number;
        message?: string;
        suggestions?: string[];
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

    deleteEvent: (params: {
        eventId?: string;
        title?: string;
        startDate?: string;
        location?: string;
    }) => Promise<{ success: boolean; deletedEvent?: { id: string; title: string; startDate: string; endDate: string }; multipleMatches?: boolean; matchingEvents?: Array<{ id: string; title: string; startDate: string; endDate: string; location?: string }>; error?: string }>;

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

    checkConflicts: (params: {
        startDate: string;
        endDate: string;
        excludeEventId?: string;
      }) => Promise<{ 
        success: boolean; 
        hasConflicts: boolean; 
        events?: Event[]; 
        error?: string;
      }>;
}

export const createCalendarToolHandlers = (
    calendarStore: any,
    userId: string,
    userEmail?: string,
    availableCalendars?: Array<{ id: string; summary?: string; primary?: boolean }>
  ): CalendarToolHandlers => ({
    createEvent: async (params) => {
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
    },

  findFreeTime: async (params) => {
    try {
      const startDate = new Date(params.startDate);
      const endDate = new Date(params.endDate);
      const duration = params.duration || 30;

      const allEvents = [
        ...calendarStore.events,
        ...calendarStore.googleEvents,
      ];

      const events = allEvents.filter((event: Event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        const overlaps = eventStart < endDate && eventEnd > startDate;
        
        return overlaps;
      });

      // If no events, entire range is free
      if (events.length === 0) {
        const totalMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60_000);
        
        return { 
          success: true, 
          freeSlots: [{
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          }],
          totalSlots: 1,
          totalFreeTime: totalMinutes,
          largestSlot: totalMinutes,
          message: `Entire time range is free (${Math.round(totalMinutes / 60 * 10) / 10} hours). No conflicting events.`,
        };
      }

      // Sort events by start time
      events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

      const freeSlots = [];
      let currentTime = new Date(startDate);

      // Check free time before first event
      if (currentTime < new Date(events[0].startDate)) {
        const freeTimeStart = new Date(currentTime);
        const freeTimeEnd = new Date(events[0].startDate);
        const freeTimeMinutes = Math.round((freeTimeEnd.getTime() - freeTimeStart.getTime()) / 60_000);
        
        if (freeTimeMinutes >= duration) {
          freeSlots.push({
            start: freeTimeStart.toISOString(),
            end: freeTimeEnd.toISOString(),
          });
        }
      }

      // Check gaps between events
      for (let i = 0; i < events.length - 1; i++) {
        const currentEvent = events[i];
        const nextEvent = events[i + 1];
        
        const gapStart = new Date(currentEvent.endDate);
        const gapEnd = new Date(nextEvent.startDate);
        const gapMinutes = Math.round((gapEnd.getTime() - gapStart.getTime()) / 60_000);
        
        if (gapMinutes >= duration) {
          freeSlots.push({
            start: gapStart.toISOString(),
            end: gapEnd.toISOString(),
          });
        }
      }

      // Check free time after last event
      const lastEvent = events[events.length - 1];
      const afterLastEvent = new Date(lastEvent.endDate);
      
      if (afterLastEvent < endDate) {
        const freeTimeStart = new Date(afterLastEvent);
        const freeTimeEnd = new Date(endDate);
        const freeTimeMinutes = Math.round((freeTimeEnd.getTime() - freeTimeStart.getTime()) / 60_000);
                
        if (freeTimeMinutes >= duration) {
          freeSlots.push({
            start: freeTimeStart.toISOString(),
            end: freeTimeEnd.toISOString(),
          });
        }
      }

      if (freeSlots.length === 0) {
        const totalMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60_000);
        
        return {
          success: true,
          freeSlots: [],
          message: `No free time periods found that meet the ${duration}-minute minimum duration. Found ${events.length} conflicting event${events.length !== 1 ? 's' : ''} in this ${Math.round(totalMinutes / 60 * 10) / 10}-hour time range.`,
          suggestions: [
            `Try a shorter duration (e.g., ${Math.max(15, Math.floor(duration / 2))} minutes)`,
            'Extend the date range to find more options',
            'Check the calendar for busy periods and try different times',
            'Consider early morning or late evening slots',
          ],
        };
      }

      // Calculate totals
      const totalFreeTime = freeSlots.reduce((total, slot) => {
        const slotStart = new Date(slot.start);
        const slotEnd = new Date(slot.end);
        return total + Math.round((slotEnd.getTime() - slotStart.getTime()) / 60_000);
      }, 0);

      const largestSlot = Math.max(...freeSlots.map(slot => {
        const slotStart = new Date(slot.start);
        const slotEnd = new Date(slot.end);
        return Math.round((slotEnd.getTime() - slotStart.getTime()) / 60_000);
      }));

      return { 
        success: true, 
        freeSlots,
        totalSlots: freeSlots.length,
        totalFreeTime,
        largestSlot,
        message: `Found ${freeSlots.length} free time period${freeSlots.length !== 1 ? 's' : ''} totaling ${Math.round(totalFreeTime / 60 * 10) / 10} hours`,
      };
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

  updateEvent: async (params) => {
    try {
      const existingEvent = calendarStore.events.find(
        (e: Event) => e.id === params.eventId
      );
      if (!existingEvent) {
        return { success: false, error: 'Event not found' };
      }

      if (!existingEvent.googleEventId) {
        return { success: false, error: 'Event not synced with Google Calendar' };
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

      const googleResult = await updateGoogleEvent(updatedEvent, userId, userEmail);
      
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
          error: 'Event not found in Google Calendar. It may have been deleted.',
        };
      }

      return {
        success: false,
        error: googleResult?.error || 'Failed to update event in Google Calendar',
      };
    } catch (error) {
      return {
        success: false,
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

      // Delete from Google Calendar first if it exists there
      if (eventToDelete.googleEventId) {
        const deleteResult = await deleteGoogleEvent(
          eventToDelete.googleEventId,
          eventToDelete.googleCalendarId
        );
        
        if (deleteResult?.error === 'unauthorized') {
          return {
            success: false,
            error: 'Google Calendar access expired. Please reconnect your Google account.',
          };
        }

        if (deleteResult?.error === 'not_found') {
          // Event doesn't exist in Google Calendar, but that's okay
          // We can still delete it from local store  
        } else if (deleteResult?.error) {
          return {
            success: false,
            error: `Failed to delete from Google Calendar: ${deleteResult.error}`,
          };
        }
      }

      // Delete from local store
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
  checkConflicts: async (params) => {
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
        
        return eventStart < endDate && eventEnd > startDate;
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
  },
});
