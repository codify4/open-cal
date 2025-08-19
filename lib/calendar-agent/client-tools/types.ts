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
    error?: string 
  }>;

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
