import { useMemo } from 'react';
import { getCalendarColor, getCardColor, getActualColor } from '@/lib/calendar-utils/calendar-color-utils';
import type { Event } from '@/lib/store/calendar-store';

export const ensureDate = (date: Date | string): Date => {
  return typeof date === 'string' ? new Date(date) : date;
};

export const formatTime = (date: Date | string, showAMPM = true) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return 'Invalid time';
  }
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const hour12 = hours % 12 || 12;
  const ampm = hours < 12 ? 'AM' : 'PM';
  const timeStr = `${hour12}${minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''}`;
  return showAMPM ? `${timeStr} ${ampm}` : timeStr;
};

export const getTimeDisplay = (startDate: Date | string, endDate: Date | string) => {
  return `${formatTime(startDate, false)}–${formatTime(endDate, true)}`;
};

export const calculateEventHeight = (startDate: Date | string, endDate: Date | string) => {
  const start = ensureDate(startDate);
  const end = ensureDate(endDate);
  const durationMs = end.getTime() - start.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  const pixelsPerHour = 64;
  return Math.max(40, durationHours * pixelsPerHour);
};

export const useEventCardColor = (
  event: Event,
  sessionCalendars: Record<string, any[]>,
  isFocused: boolean,
  currentSessionId?: string
) => {
  return useMemo(() => {
    if (!event.calendar || !currentSessionId || !sessionCalendars[currentSessionId]) {
      return getActualColor(getCardColor(event.color, isFocused));
    }
    
    const sessionCalendarsList = sessionCalendars[currentSessionId];
    const calendar = sessionCalendarsList.find(
      (cal: any) => cal.id === event.calendar
    );
    
    if (calendar) {
      const calendarColor = getCalendarColor(calendar);
      return getActualColor(calendarColor);
    }
    
    return getActualColor(getCardColor(event.color, isFocused));
  }, [event.calendar, event.color, sessionCalendars, isFocused, currentSessionId]);
};
