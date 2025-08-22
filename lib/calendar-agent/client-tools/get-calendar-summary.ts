import type { Event } from '@/lib/store/calendar-store';

export const getCalendarSummary = async (
  calendarStore: any,
  params: {
    startDate: string;
    endDate: string;
    includeStats?: boolean;
  }
) => {
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
};
