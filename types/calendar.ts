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
	emailAccounts: EmailAccount[];
	calendars: CalendarEntry[];
	selectedEmail: string;
	onEmailChange: (email: string) => void;
	onCalendarToggle: (calendarId: string) => void;
	onCalendarsFetched?: (calendars: GoogleCalendar[]) => void;
	user?: { name: string; email: string; avatar: string };
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
