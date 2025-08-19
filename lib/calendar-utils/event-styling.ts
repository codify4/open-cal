import type { Event } from '@/lib/store/calendar-store';

interface EventStylingOptions {
  eventsInSamePeriod?: number;
  periodIndex?: number;
  adjustForPeriod?: boolean;
  focusedEventId?: string;
}

interface OverlappingEvent {
  event: Event;
  overlapLevel: number;
  maxOverlaps: number;
}

export const calculateEventStyling = (
  event: Event,
  dayEvents: Event[],
  periodOptions?: EventStylingOptions
) => {
  const overlappingEvents = findOverlappingEvents(event, dayEvents);

  const useCustomPeriod =
    periodOptions?.adjustForPeriod &&
    periodOptions.eventsInSamePeriod !== undefined &&
    periodOptions.periodIndex !== undefined;

  let numEventsInPeriod = useCustomPeriod
    ? periodOptions!.eventsInSamePeriod!
    : overlappingEvents.length;
  let indexInPeriod = useCustomPeriod
    ? periodOptions!.periodIndex!
    : overlappingEvents.findIndex((oe) => oe.event.id === event.id);

  if (numEventsInPeriod === 0 || indexInPeriod === -1) {
    numEventsInPeriod = 1;
    indexInPeriod = 0;
  }

  let eventHeight = 0;
  let maxHeight = 0;
  let eventTop = 0;

  const startDate =
    event.startDate instanceof Date
      ? event.startDate
      : new Date(event.startDate);
  const endDate =
    event.endDate instanceof Date ? event.endDate : new Date(event.endDate);

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
      left: '2.5%',
      maxWidth: '95%',
      minWidth: '95%',
    };
  }

  const minimumHeight = 20;
  const finalHeight = Math.max(eventHeight, minimumHeight);

  if (numEventsInPeriod === 1) {
    return {
      height: `${finalHeight}px`,
      top: `${eventTop}px`,
      zIndex: periodOptions?.focusedEventId === event.id ? 1000 : 1,
      left: '2.5%',
      maxWidth: '95%',
      minWidth: '95%',
    };
  }

  const maxOverlaps = Math.max(
    ...overlappingEvents.map((oe) => oe.maxOverlaps)
  );
  const overlapLevel =
    overlappingEvents.find((oe) => oe.event.id === event.id)?.overlapLevel || 0;

  if (overlapLevel === 0) {
    return {
      height: `${finalHeight}px`,
      top: `${eventTop}px`,
      zIndex: periodOptions?.focusedEventId === event.id ? 1000 : 1,
      left: '2.5%',
      maxWidth: '95%',
      minWidth: '95%',
    };
  }

  const overlapWidth = Math.max(95 / maxOverlaps, 30);
  const leftPosition = 2.5 + overlapLevel * (overlapWidth + 2);

  return {
    height: `${finalHeight}px`,
    top: `${eventTop}px`,
    zIndex:
      periodOptions?.focusedEventId === event.id ? 1000 : overlapLevel + 1,
    left: `${leftPosition}%`,
    maxWidth: `${overlapWidth}%`,
    minWidth: `${overlapWidth}%`,
  };
};

function findOverlappingEvents(
  event: Event,
  dayEvents: Event[]
): OverlappingEvent[] {
  const eventStart =
    event.startDate instanceof Date
      ? event.startDate.getTime()
      : new Date(event.startDate).getTime();
  const eventEnd =
    event.endDate instanceof Date
      ? event.endDate.getTime()
      : new Date(event.endDate).getTime();

  const overlapping: OverlappingEvent[] = [];

  for (const otherEvent of dayEvents) {
    if (otherEvent.id === event.id) continue;

    const otherStart =
      otherEvent.startDate instanceof Date
        ? otherEvent.startDate.getTime()
        : new Date(otherEvent.startDate).getTime();
    const otherEnd =
      otherEvent.endDate instanceof Date
        ? otherEvent.endDate.getTime()
        : new Date(otherEvent.endDate).getTime();

    if (eventStart < otherEnd && otherStart < eventEnd) {
      overlapping.push({
        event: otherEvent,
        overlapLevel: 0,
        maxOverlaps: 0,
      });
    }
  }

  if (overlapping.length === 0) {
    return [
      {
        event,
        overlapLevel: 0,
        maxOverlaps: 1,
      },
    ];
  }

  const allOverlapping = [event, ...overlapping.map((oe) => oe.event)];
  const overlapGroups = groupOverlappingEvents(allOverlapping);

  const result: OverlappingEvent[] = [];

  for (const group of overlapGroups) {
    const maxOverlaps = group.length;
    for (let i = 0; i < group.length; i++) {
      const overlapLevel = i;
      result.push({
        event: group[i],
        overlapLevel,
        maxOverlaps,
      });
    }
  }

  return result;
}

function groupOverlappingEvents(events: Event[]): Event[][] {
  if (events.length <= 1) return [events];

  const sortedEvents = [...events].sort((a, b) => {
    const aStart =
      a.startDate instanceof Date
        ? a.startDate.getTime()
        : new Date(a.startDate).getTime();
    const bStart =
      b.startDate instanceof Date
        ? b.startDate.getTime()
        : new Date(b.startDate).getTime();
    return aStart - bStart;
  });

  const groups: Event[][] = [];
  const visited = new Set<string>();

  for (const event of sortedEvents) {
    if (visited.has(event.id)) continue;

    const group: Event[] = [event];
    visited.add(event.id);

    for (const otherEvent of sortedEvents) {
      if (visited.has(otherEvent.id)) continue;

      if (eventsOverlap(event, otherEvent)) {
        group.push(otherEvent);
        visited.add(otherEvent.id);
      }
    }

    groups.push(group);
  }

  return groups;
}

function eventsOverlap(event1: Event, event2: Event): boolean {
  const start1 =
    event1.startDate instanceof Date
      ? event1.startDate.getTime()
      : new Date(event1.startDate).getTime();
  const end1 =
    event1.endDate instanceof Date
      ? event1.endDate.getTime()
      : new Date(event1.endDate).getTime();
  const start2 =
    event2.startDate instanceof Date
      ? event2.startDate.getTime()
      : new Date(event2.startDate).getTime();
  const end2 =
    event2.endDate instanceof Date
      ? event2.endDate.getTime()
      : new Date(event2.endDate).getTime();

  return start1 < end2 && start2 < end1;
}
