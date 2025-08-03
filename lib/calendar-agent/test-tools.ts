import { calendarTools } from './tools';
import { createCalendarToolHandlers } from './tool-handlers';

// Mock calendar store for testing
const mockCalendarStore = {
  events: [
    {
      id: 'test-event-1',
      title: 'Test Meeting',
      description: 'A test event',
      startDate: new Date('2024-01-15T10:00:00Z'),
      endDate: new Date('2024-01-15T11:00:00Z'),
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
  ],
  saveEvent: (event: any) => {
    console.log('Saving event:', event);
  },
  deleteEvent: (eventId: string) => {
    console.log('Deleting event:', eventId);
  },
};

// Test the tools
export async function testCalendarTools() {
  const handlers = createCalendarToolHandlers(mockCalendarStore);
  
  console.log('Testing calendar tools...');
  
  // Test create event
  const createResult = await handlers.createEvent({
    title: 'Test Event',
    description: 'A test event created by the agent',
    startDate: '2024-01-16T14:00:00Z',
    endDate: '2024-01-16T15:00:00Z',
    location: 'Office',
    attendees: ['colleague@example.com'],
    color: 'green',
  });
  
  console.log('Create event result:', createResult);
  
  // Test find free time
  const freeTimeResult = await handlers.findFreeTime({
    duration: 60,
    startDate: '2024-01-15T09:00:00Z',
    endDate: '2024-01-15T17:00:00Z',
  });
  
  console.log('Find free time result:', freeTimeResult);
  
  // Test get events
  const getEventsResult = await handlers.getEvents({
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-01-16T23:59:59Z',
  });
  
  console.log('Get events result:', getEventsResult);
  
  // Test calendar summary
  const summaryResult = await handlers.getCalendarSummary({
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-01-16T23:59:59Z',
    includeStats: true,
  });
  
  console.log('Calendar summary result:', summaryResult);
}

// Export for use in development
if (typeof window !== 'undefined') {
  (window as any).testCalendarTools = testCalendarTools;
} 