export interface CalendarEntry {
  id: string;
  name: string;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange';
  isVisible: boolean;
  type: 'calendar' | 'class' | 'project';
}

export interface EmailAccount {
  email: string;
  isDefault: boolean;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange';
}

export interface NavCalendarsProps {
  onCalendarToggle: (calendarId: string) => void;
  onCalendarsFetched?: (calendars: GoogleCalendar[]) => void;
}

export interface GoogleCalendar {
  id: string;
  summary?: string;
  name?: string;
  primary?: boolean;
  accessRole?: string;
  colorId?: string;
  backgroundColor?: string;
  account?: string;
}

export interface ColorOption {
  id: string;
  background: string;
}
