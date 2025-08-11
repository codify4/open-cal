import type { Event } from './store/calendar-store';

export const getEventColor = (colorId: string | undefined, calendarId: string): string => {
  const colorMap: Record<string, string> = {
    '1': 'blue',
    '2': 'green',
    '3': 'red',
    '4': 'yellow',
    '5': 'purple',
    '6': 'orange',
    '7': 'pink',
    '8': 'indigo',
    '9': 'teal',
    '10': 'cyan',
    '11': 'lime',
    '12': 'amber',
    '13': 'emerald',
    '14': 'violet',
    '15': 'rose',
    '16': 'slate',
    '17': 'gray',
    '18': 'zinc',
    '19': 'neutral',
    '20': 'stone',
  };
  
  return colorMap[colorId || '1'] || 'blue';
};

export const getRepeatType = (recurrence: string[] | undefined): Event['repeat'] => {
  if (!recurrence || recurrence.length === 0) return 'none';
  
  const rule = recurrence[0];
  if (rule.includes('FREQ=DAILY')) return 'daily';
  if (rule.includes('FREQ=WEEKLY')) return 'weekly';
  if (rule.includes('FREQ=MONTHLY')) return 'monthly';
  if (rule.includes('FREQ=YEARLY')) return 'yearly';
  
  return 'none';
};

export const convertGoogleEventToLocalEvent = (
  googleEvent: any, 
  calendarId: string,
  userEmail?: string
): Event => {
  const startDate = googleEvent.start.dateTime 
    ? new Date(googleEvent.start.dateTime)
    : new Date(googleEvent.start.date);
    
  const endDate = googleEvent.end.dateTime 
    ? new Date(googleEvent.end.dateTime)
    : new Date(googleEvent.end.date);
    
  const isAllDay = !googleEvent.start.dateTime;
  
  return {
    id: googleEvent.id,
    title: googleEvent.summary || 'Untitled Event',
    description: googleEvent.description || '',
    startDate,
    endDate,
    color: getEventColor(googleEvent.colorId, calendarId),
    type: 'event',
    location: googleEvent.location || '',
    attendees: googleEvent.attendees?.map((a: any) => a.email) || [],
    reminders: googleEvent.reminders?.overrides?.map((r: any) => new Date(Date.now() + r.minutes * 60000)) || [],
    repeat: getRepeatType(googleEvent.recurrence),
    visibility: googleEvent.visibility || 'public',
    isAllDay,
    account: userEmail || '',
    calendar: calendarId,
    googleCalendarId: calendarId,
    googleEventId: googleEvent.id,
    htmlLink: googleEvent.htmlLink,
    status: googleEvent.status,
  };
};

export const getWeekDateRange = (currentDate: Date): { startDate: Date; endDate: Date } => {
  const weekStartsOn = 1; // Monday
  const currentDayOfWeek = currentDate.getDay();
  const daysToSubtract = (currentDayOfWeek - weekStartsOn + 7) % 7;
  
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - daysToSubtract);
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return { startDate: weekStart, endDate: weekEnd };
};

export const getMonthDateRange = (currentDate: Date): { startDate: Date; endDate: Date } => {
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
  return { startDate, endDate };
};

export const getDayDateRange = (currentDate: Date): { startDate: Date; endDate: Date } => {
  const startDate = new Date(currentDate);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(currentDate);
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
};

export const getDateRangeForView = (currentDate: Date, viewType: 'day' | 'week' | 'month'): { startDate: Date; endDate: Date } => {
  switch (viewType) {
    case 'day':
      return getDayDateRange(currentDate);
    case 'week':
      return getWeekDateRange(currentDate);
    case 'month':
      return getMonthDateRange(currentDate);
    default:
      return getWeekDateRange(currentDate);
  }
};
