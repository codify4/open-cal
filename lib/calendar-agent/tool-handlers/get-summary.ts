import type { Event } from '@/lib/store/calendar-store';

export const getSummary = async (
  calendarStore: any,
  params: {
    startDate: string;
    endDate: string;
    includeAllDay?: boolean;
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

    return { success: true, events };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
