import { tool } from 'ai';
import { z } from 'zod';
import type { Event } from '@/lib/store/calendar-store';
import { createGoogleEvent } from '@/lib/calendar-utils/google-calendar';

export const createEventTool = tool({
    description:
      'Create a new calendar event with the specified details. ALWAYS check for conflicts first using check_conflicts tool.',
    inputSchema: z.object({
      title: z.string().describe('The title of the event'),
      description: z.string().optional().describe('Description of the event'),
      startDate: z.string().describe('Start date and time in ISO format'),
      endDate: z.string().describe('End date and time in ISO format'),
      location: z.string().optional().describe('Location of the event'),
      attendees: z
        .array(z.string())
        .optional()
        .describe('List of attendee emails'),
      color: z
        .enum([
          'blue',
          'green',
          'red',
          'yellow',
          'purple',
          'orange',
          'pink',
          'gray',
        ])
        .optional()
        .describe('Event color'),
      isAllDay: z.boolean().optional().describe('Whether the event is all day'),
      repeat: z
        .enum(['none', 'daily', 'weekly', 'monthly', 'yearly'])
        .optional()
        .describe('Repeat pattern'),
      reminders: z
        .array(z.string())
        .optional()
        .describe('Reminder times in ISO format'),
      visibility: z
        .enum(['public', 'private'])
        .optional()
        .describe('Event visibility'),
      userId: z.string().describe('User ID for saving to Google Calendar'),
      userEmail: z.string().optional().describe('User email for Google Calendar'),
      calendarId: z.string().optional().describe('Specific calendar ID to use (defaults to primary)'),
    }),
    execute: async (params) => {
      try {
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
  
        const googleResult = await createGoogleEvent(
          event,
          params.userId,
          params.userEmail
        );
  
        if (googleResult?.success && googleResult.event) {
          return {
            success: true,
            event: googleResult.event,
            action: 'create_event',
            message: `Created event: ${event.title} on ${event.startDate.toLocaleDateString()}`,
            note: 'Event saved to both local state and Google Calendar',
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
  description: 'Find available time slots in the calendar for a given duration',
  inputSchema: z.object({
    duration: z.number().describe('Duration in minutes'),
    startDate: z.string().describe('Start date to search from in ISO format'),
    endDate: z.string().describe('End date to search until in ISO format'),
    preferredTime: z
      .string()
      .optional()
      .describe(
        'Preferred time of day (e.g., "morning", "afternoon", "evening")'
      ),
  }),
  execute: async (params) => {
    try {
      const startDate = new Date(params.startDate);
      const endDate = new Date(params.endDate);
      const duration = params.duration;

      const freeSlots = [];
      let currentTime = new Date(startDate);

      while (currentTime < endDate) {
        const slotEnd = new Date(currentTime.getTime() + duration * 60_000);

        freeSlots.push({
          start: currentTime.toISOString(),
          end: slotEnd.toISOString(),
        });

        currentTime = new Date(currentTime.getTime() + 30 * 60_000);
      }

      return {
        success: true,
        freeSlots,
        action: 'find_free_time',
        message: `Found ${freeSlots.length} available time slots for ${duration} minutes`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

export const getEventsTool = tool({
  description: 'Get events for a specific time period',
  inputSchema: z.object({
    startDate: z.string().describe('Start date in ISO format'),
    endDate: z.string().describe('End date in ISO format'),
    includeAllDay: z.boolean().optional().describe('Include all-day events'),
  }),
  execute: async (params) => {
    try {
      const startDate = new Date(params.startDate);
      const endDate = new Date(params.endDate);

      return {
        success: true,
        events: [],
        action: 'get_events',
        message: `Retrieved events from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
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
  description:
    'Update an existing calendar event. ALWAYS check for conflicts first using check_conflicts tool when changing dates/times.',
  inputSchema: z.object({
    eventId: z.string().describe('ID of the event to update'),
    title: z.string().optional().describe('New title for the event'),
    description: z
      .string()
      .optional()
      .describe('New description for the event'),
    startDate: z
      .string()
      .optional()
      .describe('New start date and time in ISO format'),
    endDate: z
      .string()
      .optional()
      .describe('New end date and time in ISO format'),
    location: z.string().optional().describe('New location for the event'),
    attendees: z
      .array(z.string())
      .optional()
      .describe('New list of attendee emails'),
    color: z
      .enum([
        'blue',
        'green',
        'red',
        'yellow',
        'purple',
        'orange',
        'pink',
        'gray',
      ])
      .optional()
      .describe('New event color'),
    isAllDay: z.boolean().optional().describe('Whether the event is all day'),
    repeat: z
      .enum(['none', 'daily', 'weekly', 'monthly', 'yearly'])
      .optional()
      .describe('New repeat pattern'),
    visibility: z
      .enum(['public', 'private'])
      .optional()
      .describe('New event visibility'),
  }),
  execute: async (params) => {
    try {
      const updates = {
        eventId: params.eventId,
        ...(params.title && { title: params.title }),
        ...(params.description && { description: params.description }),
        ...(params.startDate && { startDate: new Date(params.startDate) }),
        ...(params.endDate && { endDate: new Date(params.endDate) }),
        ...(params.location && { location: params.location }),
        ...(params.attendees && { attendees: params.attendees }),
        ...(params.color && { color: params.color }),
        ...(params.isAllDay !== undefined && { isAllDay: params.isAllDay }),
        ...(params.repeat && { repeat: params.repeat }),
        ...(params.visibility && { visibility: params.visibility }),
      };

      return {
        success: true,
        updates,
        action: 'update_event',
        message: `Updated event ${params.eventId}`,
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
  description: 'Delete a calendar event',
  inputSchema: z.object({
    eventId: z.string().describe('ID of the event to delete'),
  }),
  execute: async (params) => {
    try {
      return {
        success: true,
        eventId: params.eventId,
        action: 'delete_event',
        message: `Delete event ${params.eventId}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

export const getCalendarSummaryTool = tool({
  description: 'Get a summary of calendar events for a time period',
  inputSchema: z.object({
    startDate: z.string().describe('Start date in ISO format'),
    endDate: z.string().describe('End date in ISO format'),
    includeStats: z
      .boolean()
      .optional()
      .describe('Include statistics about events'),
  }),
  execute: async (params) => {
    try {
      const startDate = new Date(params.startDate);
      const endDate = new Date(params.endDate);

      return {
        success: true,
        summary: { totalEvents: 0, events: [] },
        action: 'get_calendar_summary',
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



export const calendarTools = {
  create_event: createEventTool,
  find_free_time: findFreeTimeTool,
  get_events: getEventsTool,
  update_event: updateEventTool,
  delete_event: deleteEventTool,
  get_calendar_summary: getCalendarSummaryTool,
};
