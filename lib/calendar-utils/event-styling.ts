import type { Event } from '@/lib/store/calendar-store';

interface EventStylingOptions {
  eventsInSamePeriod?: number;
  periodIndex?: number;
  adjustForPeriod?: boolean;
}

export const calculateEventStyling = (
  event: Event,
  dayEvents: Event[],
  periodOptions?: EventStylingOptions
) => {
  const eventsOnHour = dayEvents.filter((e) => {
    if (e.id === event.id) return false;

    const eStart = e.startDate instanceof Date ? e.startDate.getTime() : new Date(e.startDate).getTime();
    const eEnd = e.endDate instanceof Date ? e.endDate.getTime() : new Date(e.endDate).getTime();
    const eventStart = event.startDate instanceof Date ? event.startDate.getTime() : new Date(event.startDate).getTime();
    const eventEnd = event.endDate instanceof Date ? event.endDate.getTime() : new Date(event.endDate).getTime();

    return eStart < eventEnd && eEnd > eventStart;
  });

  const allEventsInRange = [event, ...eventsOnHour];

  allEventsInRange.sort((a, b) => {
    const aStart = a.startDate instanceof Date ? a.startDate.getTime() : new Date(a.startDate).getTime();
    const bStart = b.startDate instanceof Date ? b.startDate.getTime() : new Date(b.startDate).getTime();
    return aStart - bStart;
  });

  const useCustomPeriod =
    periodOptions?.adjustForPeriod &&
    periodOptions.eventsInSamePeriod !== undefined &&
    periodOptions.periodIndex !== undefined;

  let numEventsOnHour = useCustomPeriod
    ? periodOptions!.eventsInSamePeriod!
    : allEventsInRange.length;
  let indexOnHour = useCustomPeriod
    ? periodOptions!.periodIndex!
    : allEventsInRange.indexOf(event);

  if (numEventsOnHour === 0 || indexOnHour === -1) {
    numEventsOnHour = 1;
    indexOnHour = 0;
  }

  let eventHeight = 0;
  let maxHeight = 0;
  let eventTop = 0;

  const startDate = event.startDate instanceof Date ? event.startDate : new Date(event.startDate);
  const endDate = event.endDate instanceof Date ? event.endDate : new Date(event.endDate);

  if (
    startDate &&
    endDate &&
    !isNaN(startDate.getTime()) &&
    !isNaN(endDate.getTime())
  ) {
    const startTime = startDate.getHours() * 60 + startDate.getMinutes();
    const endTime = endDate.getHours() * 60 + endDate.getMinutes();

    const diffInMinutes = endTime - startTime;

    eventHeight = (diffInMinutes / 60) * 64;

    const eventStartHour = startDate.getHours() + startDate.getMinutes() / 60;

    const dayEndHour = 24;

    maxHeight = Math.max(0, (dayEndHour - eventStartHour) * 64);

    eventHeight = Math.min(eventHeight, maxHeight);

    eventTop = eventStartHour * 64;
  } else {
    return {
      height: '20px',
      top: '0px',
      zIndex: 1,
      left: '0%',
      maxWidth: '95%',
      minWidth: '95%',
    };
  }

  const widthPercentage = Math.min(95 / Math.max(numEventsOnHour, 1), 95);

  const leftPosition = indexOnHour * (widthPercentage + 1);

  const safeLeftPosition = Math.min(leftPosition, 100 - widthPercentage);

  const minimumHeight = 20;

  return {
    height: `${
      eventHeight < minimumHeight
        ? minimumHeight
        : eventHeight > maxHeight
          ? maxHeight
          : eventHeight
    }px`,
    top: `${eventTop}px`,
    zIndex: indexOnHour + 1,
    left: `${safeLeftPosition}%`,
    maxWidth: `${widthPercentage}%`,
    minWidth: `${widthPercentage}%`,
  };
};
