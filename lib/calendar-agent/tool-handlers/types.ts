import type { Event } from '@/lib/store/calendar-store';

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

    getSummary: (params: {
        startDate: string;
        endDate: string;
        includeAllDay?: boolean;
    }) => Promise<{
        success: boolean;
        events?: Event[];
        error?: string;
    }>;

    updateEvent: (params: {
        title: string;
        startDate?: string;
        endDate?: string;
        newTitle?: string;
        newDescription?: string;
        newStartDate?: string;
        newEndDate?: string;
        newLocation?: string;
        newAttendees?: string[];
        newColor?: string;
        newIsAllDay?: boolean;
        newRepeat?: string;
        newVisibility?: string;
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
