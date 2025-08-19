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
      return eventStart < endDate && eventEnd > startDate;
    });

    if (events.length === 0) {
      const totalMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60_000);
      const maxSlots = Math.floor(totalMinutes / duration);
      
      if (maxSlots > 0) {
        const freeSlots = [];
        let currentTime = new Date(startDate);
        
        while (currentTime < endDate) {
          const slotEnd = new Date(currentTime.getTime() + duration * 60_000);
          if (slotEnd > endDate) break;
          
          freeSlots.push({
            start: currentTime.toISOString(),
            end: slotEnd.toISOString(),
          });
          currentTime = new Date(currentTime.getTime() + 30 * 60_000);
        }
        
        return { 
          success: true, 
          freeSlots,
          totalSlots: freeSlots.length,
          totalFreeTime: freeSlots.length * duration,
          largestSlot: duration,
          message: `Found ${freeSlots.length} available time slot${freeSlots.length !== 1 ? 's' : ''} for ${duration} minutes. No conflicting events in this time range.`,
        };
      }
    }

    const freeSlots = [];
    let currentTime = new Date(startDate);

    while (currentTime < endDate) {
      const slotEnd = new Date(currentTime.getTime() + duration * 60_000);

      if (slotEnd > endDate) {
        break;
      }

      const hasConflict = events.some((event: Event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        return currentTime < eventEnd && slotEnd > eventStart;
      });

      if (!hasConflict) {
        freeSlots.push({
          start: currentTime.toISOString(),
          end: slotEnd.toISOString(),
        });
      }

      currentTime = new Date(currentTime.getTime() + 30 * 60_000);
    }

    if (freeSlots.length === 0) {
      const totalMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60_000);
      const conflictingEventCount = events.length;
      
      return {
        success: true,
        freeSlots: [],
        message: `No free time slots found for ${duration}-minute duration. Found ${conflictingEventCount} conflicting event${conflictingEventCount !== 1 ? 's' : ''} in this ${totalMinutes}-minute time range.`,
        suggestions: [
          `Try a shorter duration (e.g., ${Math.max(15, Math.floor(duration / 2))} minutes)`,
          'Extend the date range to find more options',
          'Check the calendar for busy periods and try different times',
          'Consider early morning or late evening slots',
        ],
      };
    }

    return { 
      success: true, 
      freeSlots,
      totalSlots: freeSlots.length,
      totalFreeTime: freeSlots.length * duration,
      largestSlot: duration,
      message: `Found ${freeSlots.length} available time slot${freeSlots.length !== 1 ? 's' : ''} for ${duration} minutes`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
