import type { Event } from '@/lib/store/calendar-store';

export const findFreeTime = async (
  calendarStore: any,
  params: {
    startDate: string;
    endDate: string;
    duration?: number;
    preferredTime?: string;
  }
) => {
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

    events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const freeSlots = [];
    let currentTime = new Date(startDate);

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
};
