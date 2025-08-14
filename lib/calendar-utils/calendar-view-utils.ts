import type { Event } from '@/lib/store/calendar-store';

export const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  const ampm = i < 12 ? 'AM' : 'PM';
  return `${hour}:00 ${ampm}`;
});

export const getDaysInWeek = (date: Date, weekStartsOn: 'monday' | 'sunday' = 'monday') => {
  const startDay = weekStartsOn === 'monday' ? 1 : 0;
  const currentDayOfWeek = date.getDay();
  const daysToSubtract = (currentDayOfWeek - startDay + 7) % 7;
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - daysToSubtract);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + i);
    days.push(day);
  }
  return days;
};

export const getDaysInMonth = (month: number, year: number) => {
  return Array.from(
    { length: new Date(year, month + 1, 0).getDate() },
    (_, index) => index + 1
  );
};

export const parseTimeString = (timeString: string) => {
  const [timePart, ampm] = timeString.split(' ');
  const [hourStr, minuteStr] = timePart.split(':');
  let hours = Number.parseInt(hourStr);
  const minutes = Number.parseInt(minuteStr);

  if (ampm === 'PM' && hours < 12) {
    hours += 12;
  } else if (ampm === 'AM' && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
};

export const formatTimeFromPosition = (y: number, rect: DOMRect) => {
  const hourHeight = rect.height / 24;
  const hour = Math.max(0, Math.min(23, Math.floor(y / hourHeight)));
  const minuteFraction = (y % hourHeight) / hourHeight;
  const minutes = Math.floor(minuteFraction * 60);

  const hour12 = hour % 12 || 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${hour12}:${Math.max(0, minutes).toString().padStart(2, '0')} ${ampm}`;
};

export const getEventsForDay = (events: Event[], targetDate: Date) => {
  return events.filter((event) => {
    const eventDate = new Date(event.startDate);
    return (
      eventDate.getDate() === targetDate.getDate() &&
      eventDate.getMonth() === targetDate.getMonth() &&
      eventDate.getFullYear() === targetDate.getFullYear()
    );
  });
};

export const getTimedEventsForDay = (events: Event[], targetDate: Date) => {
  return getEventsForDay(events, targetDate).filter((event) => {
    const eventDate = new Date(event.startDate);
    const eventEndDate = new Date(event.endDate);
    const isAllDay = event.isAllDay || 
      (eventDate.getHours() === 0 && eventDate.getMinutes() === 0 &&
       eventEndDate.getHours() === 23 && eventEndDate.getMinutes() === 59) ||
      event.type === 'birthday';
    return !isAllDay;
  });
};

export const getAllDayEventsForDay = (events: Event[], targetDate: Date) => {
  return getEventsForDay(events, targetDate).filter((event) => {
    const eventDate = new Date(event.startDate);
    const eventEndDate = new Date(event.endDate);
    const isAllDay = event.isAllDay || 
      (eventDate.getHours() === 0 && eventDate.getMinutes() === 0 &&
       eventEndDate.getHours() === 23 && eventEndDate.getMinutes() === 59) ||
      event.type === 'birthday';
    return isAllDay;
  });
};

export const groupEventsByTimePeriod = (events: Event[]) => {
  if (!events || events.length === 0) return [];

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const eventsOverlap = (event1: Event, event2: Event) => {
    const start1 = new Date(event1.startDate).getTime();
    const end1 = new Date(event1.endDate).getTime();
    const start2 = new Date(event2.startDate).getTime();
    const end2 = new Date(event2.endDate).getTime();

    return start1 < end2 && start2 < end1;
  };

  const graph: Record<string, Set<string>> = {};

  for (const event of sortedEvents) {
    graph[event.id] = new Set<string>();
  }

  for (let i = 0; i < sortedEvents.length; i++) {
    for (let j = i + 1; j < sortedEvents.length; j++) {
      if (eventsOverlap(sortedEvents[i], sortedEvents[j])) {
        graph[sortedEvents[i].id].add(sortedEvents[j].id);
        graph[sortedEvents[j].id].add(sortedEvents[i].id);
      }
    }
  }

  const visited = new Set<string>();
  const groups: Event[][] = [];

  for (const event of sortedEvents) {
    if (!visited.has(event.id)) {
      const group: Event[] = [];
      const stack: Event[] = [event];
      visited.add(event.id);

      while (stack.length > 0) {
        const current = stack.pop()!;
        group.push(current);

        for (const neighborId of graph[current.id]) {
          if (!visited.has(neighborId)) {
            const neighbor = sortedEvents.find((e) => e.id === neighborId);
            if (neighbor) {
              stack.push(neighbor);
              visited.add(neighborId);
            }
          }
        }
      }

      group.sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );

      groups.push(group);
    }
  }

  return groups;
};
