import type { Event } from './store/calendar-store';

export const getEventColor = (colorId: string | undefined, calendarId: string): string => {
  // Enhanced color mapping based on Google Calendar's color palette
  const colorMap: Record<string, string> = {
    '1': 'blue',      // Default blue
    '2': 'green',     // Green
    '3': 'red',       // Red
    '4': 'yellow',    // Yellow
    '5': 'purple',    // Purple
    '6': 'orange',    // Orange
    '7': 'pink',      // Pink
    '8': 'indigo',    // Indigo
    '9': 'teal',      // Teal
    '10': 'cyan',     // Cyan
    '11': 'lime',     // Lime
    '12': 'amber',    // Amber
    '13': 'emerald',  // Emerald
    '14': 'violet',   // Violet
    '15': 'rose',     // Rose
    '16': 'slate',    // Slate
    '17': 'gray',     // Gray
    '18': 'zinc',     // Zinc
    '19': 'neutral',  // Neutral
    '20': 'stone',    // Stone
    '21': 'sky',      // Sky blue
    '22': 'fuchsia',  // Fuchsia
    '23': 'lime',     // Light green
    '24': 'emerald',  // Dark green
  };
  
  // Fallback to a color based on calendar ID if no colorId is provided
  if (!colorId) {
    const hash = calendarId.split('').reduce((a, b) => {
      a = ((a << 5) - a + b.charCodeAt(0)) & 0xffffffff;
      return a;
    }, 0);
    const fallbackColors = ['blue', 'green', 'purple', 'orange', 'pink', 'teal', 'indigo', 'rose'];
    return fallbackColors[Math.abs(hash) % fallbackColors.length];
  }
  
  return colorMap[colorId] || 'blue';
};

export const getRandomEventColor = (): string => {
  const colors = [
    'blue', 'green', 'red', 'yellow', 'purple', 'orange', 'pink', 'gray',
    'indigo', 'teal', 'cyan', 'lime', 'amber', 'emerald', 'violet', 'rose',
    'slate', 'zinc', 'neutral', 'stone', 'sky', 'fuchsia'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getColorDisplayName = (color: string): string => {
  const colorNames: Record<string, string> = {
    blue: 'Blue',
    green: 'Green',
    red: 'Red',
    yellow: 'Yellow',
    purple: 'Purple',
    orange: 'Orange',
    pink: 'Pink',
    gray: 'Gray',
    indigo: 'Indigo',
    teal: 'Teal',
    cyan: 'Cyan',
    lime: 'Lime',
    amber: 'Amber',
    emerald: 'Emerald',
    violet: 'Violet',
    rose: 'Rose',
    slate: 'Slate',
    zinc: 'Zinc',
    neutral: 'Neutral',
    stone: 'Stone',
    sky: 'Sky',
    fuchsia: 'Fuchsia',
  };
  return colorNames[color] || 'Blue';
};

export const isValidColor = (color: string): boolean => {
  const validColors = [
    'blue', 'green', 'red', 'yellow', 'purple', 'orange', 'pink', 'gray',
    'indigo', 'teal', 'cyan', 'lime', 'amber', 'emerald', 'violet', 'rose',
    'slate', 'zinc', 'neutral', 'stone', 'sky', 'fuchsia'
  ];
  return validColors.includes(color);
};

export const normalizeColor = (color: string): string => {
  return isValidColor(color) ? color : 'blue';
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
