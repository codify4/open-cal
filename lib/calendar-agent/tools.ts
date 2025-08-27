import { tool } from 'ai';
import { z } from 'zod';
import type { Event } from '@/lib/store/calendar-store';
import type { EventReference, CalendarReference } from '@/lib/store/chat-store';
import { createGoogleEvent } from '@/lib/calendar-utils/google-calendar';
import { getAccessToken, getAccessTokenForSession } from '@/actions/access-token';
import { convertGoogleEventToLocalEvent } from '@/lib/calendar-utils/calendar-utils';

// Helper function to enhance tool calls with event and calendar context
function enhanceToolCallWithContext<T extends Record<string, any>>(
  toolCall: T,
  eventReferences: EventReference[],
  calendarReferences: CalendarReference[]
): T & { 
  eventContext?: { referencedEvents: EventReference[] };
  calendarContext?: { referencedCalendars: CalendarReference[] };
} {
  const enhanced: any = { ...toolCall };
  
  if (eventReferences.length > 0) {
    enhanced.eventContext = {
      referencedEvents: eventReferences,
    };
  }
  
  if (calendarReferences.length > 0) {
    enhanced.calendarContext = {
      referencedCalendars: calendarReferences,
    };
  }
  
  return enhanced;
}

export const createEventTool = tool({
  description: 'Create a new calendar event with the specified details. This tool will automatically check for conflicts before creating the event. When event references are provided, consider their context for better scheduling decisions.',
  inputSchema: z.object({
    title: z.string().describe('The title of the event'),
    description: z.string().optional().describe('Description of the event'),
    startDate: z.string().describe('Start date and time in ISO format'),
    endDate: z.string().describe('End date and time in ISO format'),
    location: z.string().optional().describe('Location of the event'),
    attendees: z.array(z.string()).optional().describe('List of attendee emails'),
    color: z.enum(['blue', 'green', 'red', 'yellow', 'purple', 'orange', 'pink', 'gray']).optional().describe('Event color'),
    isAllDay: z.boolean().optional().describe('Whether the event is all day'),
    repeat: z.enum(['none', 'daily', 'weekly', 'monthly', 'yearly']).optional().describe('Repeat pattern'),
    reminders: z.array(z.string()).optional().describe('Reminder times in ISO format'),
    visibility: z.enum(['public', 'private']).optional().describe('Event visibility'),
    userId: z.string().describe('User ID for saving to Google Calendar'),
    userEmail: z.string().optional().describe('User email for Google Calendar'),
    calendarId: z.string().optional().describe('Specific calendar ID to use (defaults to primary)'),
    eventContext: z.object({
      referencedEvents: z.array(z.object({
        id: z.string(),
        title: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        description: z.string().optional(),
        attendees: z.array(z.string()).optional(),
        location: z.string().optional(),
        calendarId: z.string(),
        color: z.string().optional(),
      })).optional(),
    }).optional().describe('Context about referenced events for better scheduling decisions'),
    calendarContext: z.object({
      referencedCalendars: z.array(z.object({
        id: z.string(),
        name: z.string(),
        summary: z.string().optional(),
        color: z.string().optional(),
        accessRole: z.string().optional(),
      })).optional(),
    }).optional().describe('Context about referenced calendars for better scheduling decisions'),
  }),
  execute: async (params) => {
    try {
      // Handle event context for better scheduling decisions
      let contextNote = '';
      if (params.eventContext?.referencedEvents?.length) {
        const refEvents = params.eventContext.referencedEvents;
        contextNote = `\n\nEvent Context: Referencing ${refEvents.length} event(s): ${refEvents.map(e => e.title).join(', ')}`;
        
        // Check for potential conflicts with referenced events
        const newEventStart = new Date(params.startDate);
        const newEventEnd = new Date(params.endDate);
        
        const conflicts = refEvents.filter(ref => {
          const refStart = new Date(ref.startDate);
          const refEnd = new Date(ref.endDate);
          return (newEventStart < refEnd && newEventEnd > refStart);
        });
        
        if (conflicts.length > 0) {
          contextNote += `\n⚠️ Note: New event may conflict with referenced events: ${conflicts.map(e => e.title).join(', ')}`;
        }
      }

      if (params.calendarContext?.referencedCalendars?.length) {
        const refCalendars = params.calendarContext.referencedCalendars;
        contextNote += `\n\nCalendar Context: Referencing ${refCalendars.length} calendar(s): ${refCalendars.map(c => c.name).join(', ')}`;
        
        // If specific calendars are referenced, prefer using one of them
        if (!params.calendarId && refCalendars.length > 0) {
          const preferredCalendar = refCalendars[0];
          if (preferredCalendar.id !== 'primary') {
            params.calendarId = preferredCalendar.id;
            contextNote += `\n📅 Using referenced calendar: ${preferredCalendar.name}`;
          }
        }
        
        // Check if the referenced calendars have specific access roles or permissions
        const writableCalendars = refCalendars.filter(cal => 
          cal.accessRole === 'owner' || cal.accessRole === 'writer'
        );
        
        if (writableCalendars.length > 0 && !params.calendarId) {
          const writableCalendar = writableCalendars[0];
          params.calendarId = writableCalendar.id;
          contextNote += `\n✏️ Selected writable calendar: ${writableCalendar.name}`;
        }
      }

      const event: Event = {
        id: `event-${Date.now()}`,
        title: params.title,
        description: params.description,
        startDate: new Date(params.startDate),
        endDate: new Date(params.endDate),
        location: params.location,
        attendees: params.attendees || [],
        color: params.color || 'blue',
        type: 'event',
        reminders: params.reminders?.map((r) => new Date(r)) || [],
        repeat: (params.repeat as any) || 'none',
        visibility: (params.visibility as any) || 'public',
        isAllDay: params.isAllDay,
        account: params.userEmail || 'user@example.com',
        googleCalendarId: params.calendarId,
      };

      const googleResult = await createGoogleEvent(event, params.userId, params.userEmail);

      if (googleResult?.success && googleResult.event) {
        return {
          success: true,
          event: googleResult.event,
          action: 'create_event',
          message: `Created event: ${event.title} on ${event.startDate.toLocaleDateString()}`,
          note: `Event saved to both local state and Google Calendar${contextNote}`,
        };
      }

      if (googleResult?.error === 'unauthorized') {
        return {
          success: false,
          error: 'Google Calendar access expired. Please reconnect your Google account.',
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
});

export const findFreeTimeTool = tool({
  description: 'Find available free time periods in the calendar by analyzing gaps between existing events. Returns grouped free time periods (not individual slots) that meet the minimum duration requirement. For natural language queries like "tomorrow" or "this week", interpret as full day/period requests.',
  inputSchema: z.object({
    startDate: z.string().describe('Start date to search from in ISO format. For natural language like "tomorrow", use full day (00:00 to 23:59)'),
    endDate: z.string().describe('End date to search until in ISO format. For natural language like "tomorrow", use full day (00:00 to 23:59)'),
    duration: z.number().optional().describe('Minimum duration in minutes for free time periods (defaults to 30 minutes if not specified)'),
    preferredTime: z.string().optional().describe('Preferred time of day (e.g., "morning", "afternoon", "evening")'),
    calendarContext: z.object({
      referencedCalendars: z.array(z.object({
        id: z.string(),
        name: z.string(),
        summary: z.string().optional(),
        color: z.string().optional(),
        accessRole: z.string().optional(),
      })).optional(),
    }).optional().describe('Context about referenced calendars to include in the search'),
  }),
  execute: async (params) => {
    try {
      const startDate = new Date(params.startDate);
      const endDate = new Date(params.endDate);
      const duration = params.duration || 30; // Default to 30 minutes if not specified

      if (duration <= 0) {
        return {
          success: false,
          error: 'Duration must be greater than 0 minutes',
        };
      }

      if (startDate >= endDate) {
        return {
          success: false,
          error: 'Start date must be before end date',
        };
      }

      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (totalDays > 31) {
        return {
          success: false,
          error: 'Search range cannot exceed 31 days. Please narrow your search period.',
        };
      }

      const timeMin = startDate.toISOString();
      const timeMax = endDate.toISOString();
      
      let allEvents: any[] = [];
      const processedCalendars = new Set<string>();

      // If calendar references are provided, fetch from those specific calendars
      if (params.calendarContext?.referencedCalendars?.length) {
        
        // Get the calendar store to access session calendars
        const calendarStore = await import('@/lib/store/calendar-store');
        const storeInstance = calendarStore.createCalendarStore();
        const sessionCalendars = storeInstance.getState().sessionCalendars;
        
        for (const calendarRef of params.calendarContext.referencedCalendars) {
          const calendarId = calendarRef.id;
          
          // Skip if we've already processed this calendar
          if (processedCalendars.has(calendarId)) continue;
          
          // Find which session owns this calendar
          let sessionAccessToken: string | null = null;
          
          // Check if it's the primary calendar (current user's main calendar)
          if (calendarId === 'primary' || calendarId.includes('@gmail.com')) {
            const accessToken = await getAccessToken();
            if (accessToken) {
              sessionAccessToken = accessToken;
            }
          } else {
            // Find which session owns this calendar
            for (const [sessionId, calendars] of Object.entries(sessionCalendars)) {
              const sessionCalendarsList = calendars as Array<{ id: string; summary?: string; name?: string }>;
              const foundCalendar = sessionCalendarsList.find((cal) => 
                cal.id === calendarId || cal.summary === calendarRef.name
              );
              if (foundCalendar) {
                sessionAccessToken = await getAccessTokenForSession(sessionId);
                break;
              }
            }
          }
          
          if (!sessionAccessToken) {
            console.warn(`No access token available for calendar: ${calendarId}`);
            continue;
          }
          
          try {
            const response = await fetch(
              `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
              {
                headers: {
                  Authorization: `Bearer ${sessionAccessToken}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              const calendarEvents = data.items?.map((event: any) =>
                convertGoogleEventToLocalEvent(event, calendarId, 'user@example.com')
              ) || [];
              
              allEvents.push(...calendarEvents);
              processedCalendars.add(calendarId);
            }
          } catch (error) {
            console.warn(`Failed to fetch events for calendar ${calendarId}:`, error);
          }
        }
      }
      
      // If no calendar references or no events found, fall back to primary calendar
      if (allEvents.length === 0) {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          return {
            success: false,
            error: 'Google Calendar not connected. Please connect your Google account.',
          };
        }

        const calendarId = 'primary';
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          return {
            success: false,
            error: `Failed to fetch events from Google Calendar: ${response.status}`,
          };
        }

        const data = await response.json();
        allEvents = data.items?.map((event: any) =>
          convertGoogleEventToLocalEvent(event, calendarId, 'user@example.com')
        ) || [];
      }



      // If no events, entire range is free
      if (allEvents.length === 0) {
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
          message: `Entire time range is free (${Math.round(totalMinutes / 60 * 10) / 10} hours). No conflicting events found.`,
        };
      }

      // Sort events by start time
      allEvents.sort((a: Event, b: Event) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

      // Find free time periods by analyzing gaps between events
      const freeSlots = [];
      
      // Check free time before first event
      const firstEventStart = new Date(allEvents[0].startDate);
      if (firstEventStart > startDate) {
        const freeTimeBefore = Math.round((firstEventStart.getTime() - startDate.getTime()) / 60_000);
        if (freeTimeBefore >= duration) {
          freeSlots.push({
            start: startDate.toISOString(),
            end: firstEventStart.toISOString(),
          });
        }
      }

      // Check gaps between events
      for (let i = 0; i < allEvents.length - 1; i++) {
        const currentEventEnd = new Date(allEvents[i].endDate);
        const nextEventStart = new Date(allEvents[i + 1].startDate);
        
        if (nextEventStart > currentEventEnd) {
          const gapMinutes = Math.round((nextEventStart.getTime() - currentEventEnd.getTime()) / 60_000);
          if (gapMinutes >= duration) {
            freeSlots.push({
              start: currentEventEnd.toISOString(),
              end: nextEventStart.toISOString(),
            });
          }
        }
      }

      // Check free time after last event
      const lastEventEnd = new Date(allEvents[allEvents.length - 1].endDate);
      if (lastEventEnd < endDate) {
        const freeTimeAfter = Math.round((endDate.getTime() - lastEventEnd.getTime()) / 60_000);
        if (freeTimeAfter >= duration) {
          freeSlots.push({
            start: lastEventEnd.toISOString(),
            end: endDate.toISOString(),
          });
        }
      }

      if (freeSlots.length === 0) {
        return {
          success: true,
          freeSlots: [],
          totalSlots: 0,
          totalFreeTime: 0,
          largestSlot: 0,
          message: `No free time periods of at least ${duration} minutes found. All time is occupied by events.`,
        };
      }

      // Calculate total free time
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
});

export const getSummaryTool = tool({
  description: 'Get a summary of calendar events for a specific time period. Returns events in a compact list format.',
  inputSchema: z.object({
    startDate: z.string().describe('Start date in ISO format'),
    endDate: z.string().describe('End date in ISO format'),
    includeAllDay: z.boolean().optional().describe('Include all-day events'),
    calendarContext: z.object({
      referencedCalendars: z.array(z.object({
        id: z.string(),
        name: z.string(),
        summary: z.string().optional(),
        color: z.string().optional(),
        accessRole: z.string().optional(),
      })).optional(),
    }).optional().describe('Context about referenced calendars to include in the summary'),
  }),
  execute: async (params) => {
    try {
      const startDate = new Date(params.startDate);
      const endDate = new Date(params.endDate);

      const timeMin = startDate.toISOString();
      const timeMax = endDate.toISOString();
      
      let allEvents: any[] = [];

      if (params.calendarContext?.referencedCalendars?.length) {
        for (const calendarRef of params.calendarContext.referencedCalendars) {
          let sessionAccessToken: string | null = null;
          
          if (calendarRef.id === 'primary' || calendarRef.id.includes('@gmail.com')) {
            const accessToken = await getAccessToken();
            if (accessToken) {
              sessionAccessToken = accessToken;
            }
          } else {
            // For non-primary calendars, we need to find the session that owns this calendar
            const calendarStore = await import('@/lib/store/calendar-store');
            const storeInstance = calendarStore.createCalendarStore();
            const sessionCalendars = storeInstance.getState().sessionCalendars;
            
            for (const [sessionId, calendars] of Object.entries(sessionCalendars)) {
              const sessionCalendarsList = calendars as Array<{ id: string; summary?: string; name?: string }>;
              const foundCalendar = sessionCalendarsList.find((cal) => 
                cal.id === calendarRef.id || cal.summary === calendarRef.name
              );
              if (foundCalendar) {
                sessionAccessToken = await getAccessTokenForSession(sessionId);
                break;
              }
            }
            
            // Fallback to primary access token if no session found
            if (!sessionAccessToken) {
              const accessToken = await getAccessToken();
              if (accessToken) {
                sessionAccessToken = accessToken;
              }
            }
          }
          
          if (!sessionAccessToken) {
            console.warn(`No access token available for calendar: ${calendarRef.id}`);
            continue;
          }
          
          try {
            const response = await fetch(
              `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarRef.id)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
              {
                headers: {
                  Authorization: `Bearer ${sessionAccessToken}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              const calendarEvents = data.items?.map((event: any) =>
                convertGoogleEventToLocalEvent(event, calendarRef.id, 'user@example.com')
              ) || [];
              
              allEvents.push(...calendarEvents);
            }
          } catch (error) {
            console.warn(`Failed to fetch events for calendar ${calendarRef.id}:`, error);
          }
        }
      } else {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          return {
            success: false,
            error: 'Google Calendar not connected. Please connect your Google account.',
          };
        }

        const calendarId = 'primary';
        
        try {
          const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (!response.ok) {
            return {
              success: false,
              error: `Failed to fetch events from Google Calendar: ${response.status}`,
            };
          }

          const data = await response.json();
          allEvents = data.items?.map((event: any) =>
            convertGoogleEventToLocalEvent(event, calendarId, 'user@example.com')
          ) || [];
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      }

      return {
        success: true,
        events: allEvents,
        action: 'get_summary',
        message: `Calendar summary from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
        dateRange: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

export const updateEventTool = tool({
  description: 'Update an existing calendar event. This tool will automatically check for conflicts when changing dates/times.',
  inputSchema: z.object({
    title: z.string().describe('Title of the event to update (used to find the event)'),
    startDate: z.string().optional().describe('Current start date of the event to help identify it'),
    endDate: z.string().optional().describe('Current end date of the event to help identify it'),
    newTitle: z.string().optional().describe('New title for the event'),
    newDescription: z.string().optional().describe('New description for the event'),
    newStartDate: z.string().optional().describe('New start date and time in ISO format'),
    newEndDate: z.string().optional().describe('New end date and time in ISO format'),
    newLocation: z.string().optional().describe('New location for the event'),
    newAttendees: z.array(z.string()).optional().describe('New list of attendee emails'),
    newColor: z.enum(['blue', 'green', 'red', 'yellow', 'purple', 'orange', 'pink', 'gray']).optional().describe('New event color'),
    newIsAllDay: z.boolean().optional().describe('Whether the event is all day'),
    newRepeat: z.enum(['none', 'daily', 'weekly', 'monthly', 'yearly']).optional().describe('New repeat pattern'),
    newVisibility: z.enum(['public', 'private']).optional().describe('New event visibility'),
    calendarContext: z.object({
      referencedCalendars: z.array(z.object({
        id: z.string(),
        name: z.string(),
        summary: z.string().optional(),
        color: z.string().optional(),
        accessRole: z.string().optional(),
      })).optional(),
    }).optional().describe('Context about referenced calendars to include in the search'),
  }),
  execute: async (params) => {
    try {
      let contextNote = '';
      
      if (params.calendarContext?.referencedCalendars?.length) {
        const refCalendars = params.calendarContext.referencedCalendars;
        contextNote = `\n\nCalendar Context: Will search in ${refCalendars.length} referenced calendar(s): ${refCalendars.map(c => c.name).join(', ')}`;
        
        // Prioritize calendars where user has write access
        const writableCalendars = refCalendars.filter(cal => 
          cal.accessRole === 'owner' || cal.accessRole === 'writer'
        );
        
        if (writableCalendars.length > 0) {
          contextNote += `\n✏️ Found ${writableCalendars.length} writable calendar(s) for updates`;
        }
      }

      const updates = {
        title: params.title,
        startDate: params.startDate,
        endDate: params.endDate,
        ...(params.newTitle && { newTitle: params.newTitle }),
        ...(params.newDescription && { newDescription: params.newDescription }),
        ...(params.newStartDate && { newStartDate: params.newStartDate }),
        ...(params.newEndDate && { newEndDate: params.newEndDate }),
        ...(params.newLocation && { newLocation: params.newLocation }),
        ...(params.newAttendees && { newAttendees: params.newAttendees }),
        ...(params.newColor && { newColor: params.newColor }),
        ...(params.newIsAllDay !== undefined && { newIsAllDay: params.newIsAllDay }),
        ...(params.newRepeat && { newRepeat: params.newRepeat }),
        ...(params.newVisibility && { newVisibility: params.newVisibility }),
      };

      return {
        success: true,
        updates,
        action: 'update_event',
        message: `Found event "${params.title}" to update${contextNote}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

export const deleteEventTool = tool({
  description: 'Delete a calendar event. You can identify the event by title, date, or other descriptive information. The tool will find the most relevant event to delete and return it for user confirmation.',
  inputSchema: z.object({
    title: z.string().optional().describe('Title of the event to delete (if known)'),
    startDate: z.string().optional().describe('Start date of the event to delete (if known)'),
    endDate: z.string().optional().describe('End date of the event to delete (if known)'),
    location: z.string().optional().describe('Location of the event to delete (if known)'),
    eventId: z.string().optional().describe('Event ID (if known, otherwise the tool will search by other parameters)'),
    userId: z.string().describe('User ID for authentication'),
    userEmail: z.string().optional().describe('User email for Google Calendar'),
    calendarContext: z.object({
      referencedCalendars: z.array(z.object({
        id: z.string(),
        name: z.string(),
        summary: z.string().optional(),
        color: z.string().optional(),
        accessRole: z.string().optional(),
      })).optional(),
    }).optional().describe('Context about referenced calendars to include in the search'),
  }),
  execute: async (params) => {
    try {
      let contextNote = '';
      
      if (params.calendarContext?.referencedCalendars?.length) {
        const refCalendars = params.calendarContext.referencedCalendars;
        contextNote = `\n\nCalendar Context: Will search in ${refCalendars.length} referenced calendar(s): ${refCalendars.map(c => c.name).join(', ')}`;
        
        // Check if user has delete permissions on referenced calendars
        const deletableCalendars = refCalendars.filter(cal => 
          cal.accessRole === 'owner' || cal.accessRole === 'writer'
        );
        
        if (deletableCalendars.length > 0) {
          contextNote += `\n🗑️ Found ${deletableCalendars.length} calendar(s) with delete permissions`;
        }
      }

      const searchParams = {
        title: params.title,
        startDate: params.startDate,
        endDate: params.endDate,
        location: params.location,
        eventId: params.eventId,
        userId: params.userId,
        userEmail: params.userEmail,
      };

      return {
        success: true,
        action: 'confirm_delete',
        searchParams,
        message: `Found event to delete. Please confirm the deletion.${contextNote}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

export const calendarTools = {
  create_event: createEventTool,
  find_free_time: findFreeTimeTool,
  get_summary: getSummaryTool,
  update_event: updateEventTool,
  delete_event: deleteEventTool,
};
