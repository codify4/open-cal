import type { CalendarToolHandlers } from './types';
import { createEvent } from './create-event';
import { findFreeTime } from './find-free-time';
import { getSummary } from './get-summary';
import { updateEvent } from './update-event';
import { deleteEvent } from './delete-event';
import { checkConflicts } from './check-conflicts';

export const createCalendarToolHandlers = (
  calendarStore: any,
  userId: string,
  userEmail?: string,
  availableCalendars?: Array<{ id: string; summary?: string; primary?: boolean }>
): CalendarToolHandlers => ({
  createEvent: (params) => createEvent(calendarStore, userId, userEmail, availableCalendars, params),
  findFreeTime: (params) => findFreeTime(calendarStore, params),
  getSummary: (params) => getSummary(calendarStore, params),
  updateEvent: (params) => updateEvent(calendarStore, userId, userEmail, params),
  deleteEvent: (params) => deleteEvent(calendarStore, params),
  checkConflicts: (params) => checkConflicts(calendarStore, params),
});
