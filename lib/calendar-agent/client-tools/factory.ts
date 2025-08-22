import type { ClientCalendarTools } from './types';
import { checkConflicts } from './check-conflicts';
import { createEvent } from './create-event';
import { deleteEvent } from './delete-event';
import { findFreeTime } from './find-free-time';
import { getCalendarSummary } from './get-calendar-summary';
import { getEvents } from './get-events';
import { updateEvent } from './update-event';

export const createClientCalendarTools = (calendarStore: any): ClientCalendarTools => ({
  checkConflicts: (params) => checkConflicts(calendarStore, params),
  createEvent: (params) => createEvent(calendarStore, params),
  deleteEvent: (params) => deleteEvent(calendarStore, params),
  findFreeTime: (params) => findFreeTime(calendarStore, params),
  getCalendarSummary: (params) => getCalendarSummary(calendarStore, params),
  getEvents: (params) => getEvents(calendarStore, params),
  updateEvent: (params) => updateEvent(calendarStore, params),
});
