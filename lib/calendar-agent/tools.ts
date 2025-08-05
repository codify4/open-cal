import { z } from 'zod';
import { tool } from 'ai';
import type { Event } from '@/lib/store/calendar-store';
import { createCalendarToolHandlers } from './tool-handlers';

// Mock calendar store for tool execution
const mockCalendarStore = {
  events: [
    {
      id: 'test-event-1',
      title: 'Test Meeting',
      description: 'A test event',
      startDate: new Date('2025-01-15T10:00:00Z'),
      endDate: new Date('2025-01-15T11:00:00Z'),
      color: 'blue',
      type: 'event' as const,
      location: 'Conference Room',
      attendees: ['user@example.com'],
      reminders: [],
      repeat: 'none' as const,
      visibility: 'public' as const,
      isAllDay: false,
      account: 'user@example.com',
    },
    {
      id: 'july-30-meeting',
      title: 'Team Standup',
      description: 'Daily team standup meeting',
      startDate: new Date('2025-07-30T09:00:00Z'),
      endDate: new Date('2025-07-30T09:30:00Z'),
      color: 'green',
      type: 'event' as const,
      location: 'Zoom Meeting',
      attendees: ['user@example.com', 'colleague@example.com'],
      reminders: [],
      repeat: 'none' as const,
      visibility: 'public' as const,
      isAllDay: false,
      account: 'user@example.com',
    },
    {
      id: 'august-1-lunch',
      title: 'Client Lunch',
      description: 'Lunch meeting with important client',
      startDate: new Date('2025-08-01T12:00:00Z'),
      endDate: new Date('2025-08-01T13:30:00Z'),
      color: 'purple',
      type: 'event' as const,
      location: 'Downtown Restaurant',
      attendees: ['user@example.com', 'client@example.com'],
      reminders: [],
      repeat: 'none' as const,
      visibility: 'public' as const,
      isAllDay: false,
      account: 'user@example.com',
    },
    {
      id: 'august-2-birthday',
      title: 'John\'s Birthday',
      description: 'Team member birthday celebration',
      startDate: new Date('2025-08-02T15:00:00Z'),
      endDate: new Date('2025-08-02T16:00:00Z'),
      color: 'pink',
      type: 'event' as const,
      location: 'Office Kitchen',
      attendees: ['user@example.com', 'john@example.com', 'team@example.com'],
      reminders: [],
      repeat: 'none' as const,
      visibility: 'public' as const,
      isAllDay: false,
      account: 'user@example.com',
    },
  ],
  saveEvent: (event: any) => {
    return event;
  },
  deleteEvent: (eventId: string) => {
    return { success: true, eventId };
  },
  getEvents: (startDate?: Date, endDate?: Date) => {
    return mockCalendarStore.events;
  },
  findFreeTime: (duration: number, startDate?: Date, endDate?: Date) => {
    return [
      {
        start: new Date('2024-01-15T14:00:00Z'),
        end: new Date('2024-01-15T15:00:00Z'),
        duration: 60,
      },
      {
        start: new Date('2024-01-16T10:00:00Z'),
        end: new Date('2024-01-16T11:00:00Z'),
        duration: 60,
      },
    ];
  },
};

const toolHandlers = createCalendarToolHandlers(mockCalendarStore);

export const createEventTool = tool({
  description: 'Create a new calendar event with the specified details',
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
  }),
  execute: async (params) => {
    return await toolHandlers.createEvent(params);
  },
});

export const findFreeTimeTool = tool({
  description: 'Find available time slots in the calendar for a given duration',
  inputSchema: z.object({
    duration: z.number().describe('Duration in minutes'),
    startDate: z.string().describe('Start date to search from in ISO format'),
    endDate: z.string().describe('End date to search until in ISO format'),
    preferredTime: z.string().optional().describe('Preferred time of day (e.g., "morning", "afternoon", "evening")'),
  }),
  execute: async (params) => {
    return await toolHandlers.findFreeTime(params);
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
    return await toolHandlers.getEvents(params);
  },
});

export const updateEventTool = tool({
  description: 'Update an existing calendar event',
  inputSchema: z.object({
    eventId: z.string().describe('ID of the event to update'),
    title: z.string().optional().describe('New title for the event'),
    description: z.string().optional().describe('New description for the event'),
    startDate: z.string().optional().describe('New start date and time in ISO format'),
    endDate: z.string().optional().describe('New end date and time in ISO format'),
    location: z.string().optional().describe('New location for the event'),
    attendees: z.array(z.string()).optional().describe('New list of attendee emails'),
    color: z.enum(['blue', 'green', 'red', 'yellow', 'purple', 'orange', 'pink', 'gray']).optional().describe('New event color'),
    isAllDay: z.boolean().optional().describe('Whether the event is all day'),
    repeat: z.enum(['none', 'daily', 'weekly', 'monthly', 'yearly']).optional().describe('New repeat pattern'),
    visibility: z.enum(['public', 'private']).optional().describe('New event visibility'),
  }),
  execute: async (params) => {
    return await toolHandlers.updateEvent(params);
  },
});

export const deleteEventTool = tool({
  description: 'Delete a calendar event',
  inputSchema: z.object({
    eventId: z.string().describe('ID of the event to delete'),
  }),
  execute: async (params) => {
    return await toolHandlers.deleteEvent(params);
  },
});

export const getCalendarSummaryTool = tool({
  description: 'Get a summary of calendar events for a time period',
  inputSchema: z.object({
    startDate: z.string().describe('Start date in ISO format'),
    endDate: z.string().describe('End date in ISO format'),
    includeStats: z.boolean().optional().describe('Include statistics about events'),
  }),
  execute: async (params) => {
    return await toolHandlers.getCalendarSummary(params);
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