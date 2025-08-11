import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import { getDateRangeForView } from '../calendar-utils';

export type ViewType = 'day' | 'week' | 'month';

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  color: string;
  type: 'event' | 'birthday';
  location?: string;
  attendees?: string[];
  reminders?: Date[];
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  visibility?: 'public' | 'private';
  isAllDay?: boolean;
  account?: string;
  calendar?: string;
  // Google Calendar specific fields
  googleCalendarId?: string;
  googleEventId?: string;
  htmlLink?: string;
  status?: 'confirmed' | 'tentative' | 'cancelled';
}

export interface EventCreationContext {
  startDate: Date;
  endDate: Date;
  title?: string;
  description?: string;
  color?: string;
  type?: 'event' | 'birthday';
}

export interface PendingCalendarAction {
  id: string;
  toolName: string;
  args: any;
  result?: any;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'declined' | 'edited';
}

export interface CalendarState {
  events: Event[];
  isChatSidebarOpen: boolean;
  isChatFullscreen: boolean;

  isEventSidebarOpen: boolean;
  selectedEvent: Event | null;
  eventCreationContext: EventCreationContext | null;
  hasUnsavedChanges: boolean;
  isNewEvent: boolean;

  currentDate: Date;
  selectedDate: Date;
  viewType: ViewType;
  navigationDirection: number;

  eventColors: string[];
  eventTypes: Array<'event' | 'birthday'>;

  // Calendar Agent State
  pendingActions: PendingCalendarAction[];
  isProcessing: boolean;

  // Google Calendar State
  googleEvents: Event[];
  isFetchingEvents: boolean;
  eventsLastFetched: Date | null;
  visibleCalendarIds: string[];
  refreshFunction: (() => Promise<void>) | null;
}

export interface CalendarActions {
  saveEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  setEvents: (events: Event[]) => void;
  updateEventTime: (
    eventId: string,
    newStartDate: Date,
    newEndDate: Date
  ) => void;

  toggleChatSidebar: () => void;
  setChatFullscreen: (fullscreen: boolean) => void;

  openEventSidebarForNewEvent: (startDate: Date) => void;
  openEventSidebarForEdit: (event: Event) => void;
  closeEventSidebar: () => void;
  updateSelectedEvent: (event: Partial<Event>) => void;
  clearEventForm: () => void;

  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
  setViewType: (viewType: ViewType) => void;
  setNavigationDirection: (direction: number) => void;

  goToToday: () => void;
  goToPreviousDay: () => void;
  goToNextDay: () => void;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;

  // Calendar Agent Actions
  addPendingAction: (action: Omit<PendingCalendarAction, 'id' | 'timestamp'>) => void;
  updateActionStatus: (id: string, status: PendingCalendarAction['status']) => void;
  removePendingAction: (id: string) => void;
  clearPendingActions: () => void;
  setProcessing: (isProcessing: boolean) => void;

  // Google Calendar Actions
  fetchGoogleCalendarEvents: (calendarIds: string[], startDate: Date, endDate: Date) => Promise<void>;
  setGoogleEvents: (events: Event[]) => void;
  setVisibleCalendarIds: (calendarIds: string[]) => void;
  setFetchingEvents: (isFetching: boolean) => void;
  setRefreshFunction: (refreshFn: () => Promise<void>) => void;
  refreshEvents: () => Promise<void>;
}

export type CalendarStore = CalendarState & CalendarActions;

export const defaultInitState: CalendarState = {
  // Chat sidebar state
  isChatSidebarOpen: false,
  isChatFullscreen: false,

  // Event sidebar state
  isEventSidebarOpen: false,
  selectedEvent: null,
  eventCreationContext: null,
  hasUnsavedChanges: false,
  isNewEvent: false,

  // Calendar navigation state
  currentDate: new Date(),
  selectedDate: new Date(),
  viewType: 'week',
  navigationDirection: 0,

  // Event colors and types
  eventColors: [
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
  ],
  eventTypes: ['event', 'birthday'],
  events: [
    {
      id: 'test-event-1',
      title: 'Test Meeting',
      description: 'A test event to verify functionality',
      startDate: new Date(new Date().setHours(10, 0, 0, 0)),
      endDate: new Date(new Date().setHours(11, 0, 0, 0)),
      color: 'blue',
      type: 'event',
      location: '',
      attendees: [],
      reminders: [],
      repeat: 'none',
      visibility: 'public',
      isAllDay: false,
      account: 'john.doe@gmail.com',
    },
  ],

  // Calendar Agent State
  pendingActions: [],
  isProcessing: false,

  // Google Calendar State
  googleEvents: [],
  isFetchingEvents: false,
  eventsLastFetched: null,
  visibleCalendarIds: [],
  refreshFunction: null,
};

export const createCalendarStore = (
  initState: CalendarState = defaultInitState
) => {
  return createStore<CalendarStore>()(
    persist(
      (set, get) => ({
        ...initState,

        saveEvent: (event: Event) =>
          set((state) => {
            const existingEventIndex = state.events.findIndex(
              (e) => e.id === event.id
            );
            if (existingEventIndex >= 0) {
              const updatedEvents = [...state.events];
              updatedEvents[existingEventIndex] = event;
              return { events: updatedEvents };
            }
            return { events: [...state.events, event] };
          }),

        setEvents: (events: Event[]) => set({ events }),

        deleteEvent: (eventId: string) =>
          set((state) => ({
            events: state.events.filter((e) => e.id !== eventId),
          })),

        updateEventTime: (
          eventId: string,
          newStartDate: Date,
          newEndDate: Date
        ) =>
          set((state) => {
            const eventIndex = state.events.findIndex((e) => e.id === eventId);
            if (eventIndex >= 0) {
              const updatedEvents = [...state.events];
              updatedEvents[eventIndex] = {
                ...updatedEvents[eventIndex],
                startDate: newStartDate,
                endDate: newEndDate,
              };
              return { events: updatedEvents };
            }
            return state;
          }),

        toggleChatSidebar: () =>
          set((state) => ({
            isChatSidebarOpen: !state.isChatSidebarOpen,
          })),
        setChatFullscreen: (fullscreen: boolean) =>
          set({ isChatFullscreen: fullscreen }),

        // Event sidebar actions
        openEventSidebarForNewEvent: (startDate: Date) => {
          // Generate a random color for new events
          const randomColors = [
            'blue', 'green', 'red', 'yellow', 'purple', 'orange', 'pink', 'gray',
            'indigo', 'teal', 'cyan', 'lime', 'amber', 'emerald', 'violet', 'rose',
            'slate', 'zinc', 'neutral', 'stone', 'sky', 'fuchsia'
          ];
          const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
          
          set({
            isEventSidebarOpen: true,
            selectedEvent: null,
            eventCreationContext: {
              startDate,
              endDate: new Date(startDate.getTime() + 60 * 60 * 1000), // 1 hour later
              title: '',
              description: '',
              color: randomColor,
              type: 'event',
            },
            hasUnsavedChanges: false,
            isNewEvent: true,
          });
        },

        openEventSidebarForEdit: (event: Event) =>
          set({
            isEventSidebarOpen: true,
            selectedEvent: event,
            eventCreationContext: {
              startDate: event.startDate,
              endDate: event.endDate,
              title: event.title,
              description: event.description,
              color: event.color,
              type: event.type,
            },
            hasUnsavedChanges: false,
            isNewEvent: false,
          }),

        closeEventSidebar: () =>
          set({
            isEventSidebarOpen: false,
            selectedEvent: null,
            eventCreationContext: null,
            hasUnsavedChanges: false,
            isNewEvent: false,
          }),

        updateSelectedEvent: (event: Partial<Event>) =>
          set((state) => ({
            selectedEvent: state.selectedEvent
              ? { ...state.selectedEvent, ...event }
              : null,
            hasUnsavedChanges: true,
          })),

        clearEventForm: () =>
          set({
            selectedEvent: null,
            eventCreationContext: null,
            hasUnsavedChanges: false,
            isNewEvent: false,
          }),

        // Calendar navigation actions
        setCurrentDate: (date: Date) => set({ currentDate: date }),
        setSelectedDate: (date: Date) => set({ selectedDate: date }),
        setViewType: (viewType: ViewType) => set({ viewType }),
        setNavigationDirection: (direction: number) =>
          set({ navigationDirection: direction }),

        // Navigation helper functions
        goToToday: () => {
          const today = new Date();
          set({
            currentDate: today,
            selectedDate: today,
            navigationDirection: 0,
          });
        },

        goToPreviousDay: () => {
          const { currentDate } = get();
          const newDate = new Date(currentDate);
          newDate.setDate(currentDate.getDate() - 1);
          set({
            currentDate: newDate,
            selectedDate: newDate,
            navigationDirection: -1,
          });
        },

        goToNextDay: () => {
          const { currentDate } = get();
          const newDate = new Date(currentDate);
          newDate.setDate(currentDate.getDate() + 1);
          set({
            currentDate: newDate,
            selectedDate: newDate,
            navigationDirection: 1,
          });
        },

        goToPreviousWeek: () => {
          const { currentDate } = get();
          const newDate = new Date(currentDate);
          newDate.setDate(currentDate.getDate() - 7);
          set({
            currentDate: newDate,
            selectedDate: newDate,
            navigationDirection: -1,
          });
        },

        goToNextWeek: () => {
          const { currentDate } = get();
          const newDate = new Date(currentDate);
          newDate.setDate(currentDate.getDate() + 7);
          set({
            currentDate: newDate,
            selectedDate: newDate,
            navigationDirection: 1,
          });
        },

        goToPreviousMonth: () => {
          const { currentDate } = get();
          const newDate = new Date(currentDate);
          newDate.setMonth(currentDate.getMonth() - 1);
          set({
            currentDate: newDate,
            selectedDate: newDate,
            navigationDirection: -1,
          });
        },

        goToNextMonth: () => {
          const { currentDate } = get();
          const newDate = new Date(currentDate);
          newDate.setMonth(currentDate.getMonth() + 1);
          set({
            currentDate: newDate,
            selectedDate: newDate,
            navigationDirection: 1,
          });
        },

        // Calendar Agent Actions
        addPendingAction: (action) =>
          set((state) => {
            // Check if this action already exists to prevent duplicates
            const existingAction = state.pendingActions.find(
              (existing) => 
                existing.toolName === action.toolName && 
                JSON.stringify(existing.args) === JSON.stringify(action.args)
            );
            
            if (existingAction) {
              return state; // Don't add duplicate
            }
            
            // Limit to 10 pending actions to prevent localStorage quota issues
            const newActions = [
              ...state.pendingActions,
              {
                ...action,
                id: `action-${Date.now()}`,
                timestamp: new Date(),
              },
            ];
            
            // Keep only the 10 most recent actions
            if (newActions.length > 10) {
              newActions.splice(0, newActions.length - 10);
            }
            
            return { pendingActions: newActions };
          }),

        updateActionStatus: (id, status) =>
          set((state) => ({
            pendingActions: state.pendingActions.map((action) =>
              action.id === id ? { ...action, status } : action
            ),
          })),

        removePendingAction: (id) =>
          set((state) => ({
            pendingActions: state.pendingActions.filter((action) => action.id !== id),
          })),

        clearPendingActions: () =>
          set({ pendingActions: [] }),

        setProcessing: (isProcessing) =>
          set({ isProcessing }),

        // Google Calendar Actions
        fetchGoogleCalendarEvents: async (calendarIds, startDate, endDate) => {
          set({ isFetchingEvents: true });
          
          try {
            // This will be implemented in the component that uses it
            // For now, just set fetching state
            set({ isFetchingEvents: false });
          } catch (error) {
            console.error('Failed to fetch events:', error);
            set({ isFetchingEvents: false });
          }
        },

        setGoogleEvents: (events) =>
          set({ googleEvents: events, isFetchingEvents: false, eventsLastFetched: new Date() }),

        setVisibleCalendarIds: (calendarIds) =>
          set({ visibleCalendarIds: calendarIds }),

        setFetchingEvents: (isFetching) =>
          set({ isFetchingEvents: isFetching }),

        setRefreshFunction: (refreshFn) =>
          set({ refreshFunction: refreshFn }),

        refreshEvents: async () => {
          const state = get();
          if (state.refreshFunction) {
            await state.refreshFunction();
          }
        },
      }),
      {
        name: 'calendar-store',
        onRehydrateStorage: () => (state) => {
          // Convert string dates back to Date objects after rehydration
          if (state) {
            if (typeof state.currentDate === 'string') {
              state.currentDate = new Date(state.currentDate);
            }
            if (typeof state.selectedDate === 'string') {
              state.selectedDate = new Date(state.selectedDate);
            }
            // Convert event dates back to Date objects
            if (state.events) {
              state.events = state.events.map((event) => ({
                ...event,
                startDate:
                  event.startDate instanceof Date
                    ? event.startDate
                    : new Date(event.startDate),
                endDate:
                  event.endDate instanceof Date
                    ? event.endDate
                    : new Date(event.endDate),
                reminders:
                  event.reminders?.map((reminder) =>
                    reminder instanceof Date ? reminder : new Date(reminder)
                  ) || [],
              }));
            }
            // Convert selected event dates if it exists
            if (state.selectedEvent) {
              state.selectedEvent = {
                ...state.selectedEvent,
                startDate:
                  state.selectedEvent.startDate instanceof Date
                    ? state.selectedEvent.startDate
                    : new Date(state.selectedEvent.startDate),
                endDate:
                  state.selectedEvent.endDate instanceof Date
                    ? state.selectedEvent.endDate
                    : new Date(state.selectedEvent.endDate),
                reminders:
                  state.selectedEvent.reminders?.map((reminder) =>
                    reminder instanceof Date ? reminder : new Date(reminder)
                  ) || [],
              };
            }
            // Convert event creation context dates if it exists
            if (state.eventCreationContext) {
              state.eventCreationContext = {
                ...state.eventCreationContext,
                startDate:
                  state.eventCreationContext.startDate instanceof Date
                    ? state.eventCreationContext.startDate
                    : new Date(state.eventCreationContext.startDate),
                endDate:
                  state.eventCreationContext.endDate instanceof Date
                    ? state.eventCreationContext.endDate
                    : new Date(state.eventCreationContext.endDate),
              };
            }
            // Always default to week view
            state.viewType = 'week';
          }
        },
      }
    )
  );
};
