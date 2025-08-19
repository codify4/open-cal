import type { Event } from '../store/calendar-store';

// Map Google event color IDs (1..11) to our local palette approximations
const googleColorIdToLocal: Record<string, string> = {
  '1': 'purple',
  '2': 'green',
  '3': 'purple',
  '4': 'rose',
  '5': 'yellow',
  '6': 'orange',
  '7': 'teal',
  '8': 'gray',
  '9': 'blue',
  '10': 'green',
  '11': 'red',
};

export const getEventColor = (
  colorId: string | undefined,
  _calendarId: string
): string => {
  if (!colorId) return 'blue';
  return googleColorIdToLocal[colorId] || 'blue';
};

// Map our local palette to Google event color IDs (restricted to known IDs)
const localToGoogleColorId: Record<string, string> = {
  blue: '9',
  green: '10',
  red: '11',
  yellow: '5',
  purple: '3',
  orange: '6',
  pink: '4',
  rose: '4',
  gray: '8',
  indigo: '1',
  teal: '7',
  cyan: '7',
  lime: '10',
  amber: '6',
  emerald: '10',
  violet: '3',
  slate: '8',
  zinc: '8',
  neutral: '8',
  stone: '8',
  sky: '9',
  fuchsia: '4',
};

export const getGoogleColorIdFromLocal = (
  localColor: string
): string | undefined => {
  return localToGoogleColorId[localColor];
};

export const getRandomEventColor = (): string => {
  const colors = [
    'blue',
    'green',
    'red',
    'yellow',
    'purple',
    'orange',
    'pink',
    'gray',
    'indigo',
    'teal',
    'cyan',
    'lime',
    'amber',
    'emerald',
    'violet',
    'rose',
    'slate',
    'zinc',
    'neutral',
    'stone',
    'sky',
    'fuchsia',
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
    'blue',
    'green',
    'red',
    'yellow',
    'purple',
    'orange',
    'pink',
    'gray',
    'indigo',
    'teal',
    'cyan',
    'lime',
    'amber',
    'emerald',
    'violet',
    'rose',
    'slate',
    'zinc',
    'neutral',
    'stone',
    'sky',
    'fuchsia',
  ];
  return validColors.includes(color);
};

export const normalizeColor = (color: string): string => {
  return isValidColor(color) ? color : 'blue';
};

export const getRepeatType = (
  recurrence: string[] | undefined
): Event['repeat'] => {
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

  const meetingType =
    googleEvent.conferenceData || googleEvent.hangoutLink
      ? 'google-meet'
      : 'none';
  const meetLink =
    googleEvent.hangoutLink ||
    googleEvent.conferenceData?.entryPoints?.find(
      (e: any) => e.entryPointType === 'video'
    )?.uri ||
    '';
  const meetCode = googleEvent.conferenceData?.conferenceId || '';

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
    reminders:
      googleEvent.reminders?.overrides?.map(
        (r: any) => new Date(Date.now() + r.minutes * 60_000)
      ) || [],
    repeat: getRepeatType(googleEvent.recurrence),
    visibility: googleEvent.visibility || 'public',
    isAllDay,
    account: userEmail || '',
    calendar: calendarId,
    googleCalendarId: calendarId,
    googleEventId: googleEvent.id,
    htmlLink: googleEvent.htmlLink,
    status: googleEvent.status,
    meetingType,
    meetLink,
    meetCode,
  };
};

export const getWeekDateRange = (
  currentDate: Date
): { startDate: Date; endDate: Date } => {
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

export const getMonthDateRange = (
  currentDate: Date
): { startDate: Date; endDate: Date } => {
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  return { startDate, endDate };
};

export const getDayDateRange = (
  currentDate: Date
): { startDate: Date; endDate: Date } => {
  const startDate = new Date(currentDate);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(currentDate);
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
};

export const getDateRangeForView = (
  currentDate: Date,
  viewType: 'day' | 'week' | 'month'
): { startDate: Date; endDate: Date } => {
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
