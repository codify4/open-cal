import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { convertGoogleEventToLocalEvent } from '@/lib/calendar-utils/calendar-utils';
import { parseTimeString } from './calendar-view-utils';

export const createGoogleEvent = async (
  date: Date,
  timeString: string,
  calendarId: string,
  userId: string,
  userEmail: string
) => {
  // TODO: Implement Google OAuth with Clerk
  toast('Google OAuth integration coming soon');
  throw new Error('Google OAuth integration coming soon');
};

export const handleAddEvent = async (
  targetDate: Date,
  timeString: string,
  session: any,
  visibleCalendarIds: string[],
  saveEvent: Function,
  openEventSidebarForEdit: Function,
  openEventSidebarForNewEvent: Function,
  refreshEvents: Function
) => {
  if (!session) {
    // TODO: Implement Google OAuth with Clerk
    toast('Google OAuth integration coming soon');
    return;
  }

  if (!timeString) {
    console.error('Time string not provided.');
    return;
  }

  try {
    // TODO: Implement Google OAuth with Clerk
    toast('Google OAuth integration coming soon');
    openEventSidebarForNewEvent(targetDate);
  } catch (e) {
    console.error(e);
    toast.error('Failed to create event');
    openEventSidebarForNewEvent(targetDate);
  }
};
