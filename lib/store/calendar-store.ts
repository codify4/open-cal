import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

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
  meetingType?: 'google-meet' | 'none' | '';
  meetLink?: string;
  meetCode?: string;
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
  chatMode: 'sidebar' | 'popup' | 'fullscreen';

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

  // Multi-session support
  sessionEvents: Record<string, Event[]>; // sessionId -> events
  sessionCalendars: Record<string, any[]>; // sessionId -> calendars

  // Optimistic update counter to force re-renders
  optimisticUpdateCounter: number;
  // Per-event optimistic overrides to prevent flicker on background refresh
  optimisticOverrides: Record<string, { startDate: Date; endDate: Date }>;

  isUpgradeDialogOpen: boolean;
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
  replaceEvent: (event: Event) => void;
  incrementOptimisticCounter: () => void;
  clearOptimisticOverride: (eventId: string) => void;

  toggleChatSidebar: () => void;
  setChatMode: (mode: 'sidebar' | 'popup' | 'fullscreen') => void;
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
  addPendingAction: (
    action: Omit<PendingCalendarAction, 'id' | 'timestamp'>
  ) => void;
  updateActionStatus: (
    id: string,
    status: PendingCalendarAction['status']
  ) => void;
  removePendingAction: (id: string) => void;
  clearPendingActions: () => void;
  setProcessing: (isProcessing: boolean) => void;

  // Google Calendar Actions
  fetchGoogleCalendarEvents: (
    calendarIds: string[],
    startDate: Date,
    endDate: Date
  ) => Promise<void>;
  setGoogleEvents: (events: Event[]) => void;
  setVisibleCalendarIds: (calendarIds: string[]) => void;
  setFetchingEvents: (isFetching: boolean) => void;
  setRefreshFunction: (refreshFn: () => Promise<void>) => void;
  refreshEvents: () => Promise<void>;

  // Multi-session actions
  setSessionEvents: (sessionId: string, events: Event[]) => void;
  setSessionCalendars: (sessionId: string, calendars: any[]) => void;
  getAllVisibleEvents: () => Event[];

  // Upgrade Dialog Actions
  openUpgradeDialog: () => void;
  closeUpgradeDialog: () => void;
}

export type CalendarStore = CalendarState & CalendarActions;

export const defaultInitState: CalendarState = {
  // Chat sidebar state
  isChatSidebarOpen: true,
  isChatFullscreen: false,
  chatMode: 'popup',

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
  events: [],

  // Calendar Agent State
  pendingActions: [],
  isProcessing: false,

  // Google Calendar State
  googleEvents: [],
  isFetchingEvents: false,
  eventsLastFetched: null,
  visibleCalendarIds: [],
  refreshFunction: null,

  // Multi-session support
  sessionEvents: {},
  sessionCalendars: {},

  // Optimistic update counter
  optimisticUpdateCounter: 0,
  optimisticOverrides: {},

  // Upgrade Dialog State
  isUpgradeDialogOpen: false,
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

        replaceEvent: (event: Event) =>
          set((state) => {
            const eventIndex = state.events.findIndex((e) => e.id === event.id);
            const googleEventIndex = state.googleEvents.findIndex(
              (e) => e.id === event.id
            );

            if (eventIndex < 0 && googleEventIndex < 0) {
              return state;
            }

            const newState: Partial<CalendarState> = {};
            if (eventIndex >= 0) {
              const updatedEvents = [...state.events];
              updatedEvents[eventIndex] = event;
              newState.events = updatedEvents;
            }
            if (googleEventIndex >= 0) {
              const updatedGoogleEvents = [...state.googleEvents];
              updatedGoogleEvents[googleEventIndex] = event;
              newState.googleEvents = updatedGoogleEvents;
            }

            return {
              ...newState,
              optimisticUpdateCounter: state.optimisticUpdateCounter + 1,
              optimisticOverrides: {
                ...state.optimisticOverrides,
                [event.id]: {
                  startDate: event.startDate,
                  endDate: event.endDate,
                },
              },
            } as CalendarState;
          }),

        updateEventTime: (
          eventId: string,
          newStartDate: Date,
          newEndDate: Date
        ) =>
          set((state) => {
            const eventIndex = state.events.findIndex((e) => e.id === eventId);
            const googleEventIndex = state.googleEvents.findIndex(
              (e) => e.id === eventId
            );

            if (eventIndex < 0 && googleEventIndex < 0) {
              return state;
            }

            const newState: Partial<CalendarState> = {};
            if (eventIndex >= 0) {
              const updatedEvents = [...state.events];
              updatedEvents[eventIndex] = {
                ...updatedEvents[eventIndex],
                startDate: newStartDate,
                endDate: newEndDate,
              };
              newState.events = updatedEvents;
            }
            if (googleEventIndex >= 0) {
              const updatedGoogleEvents = [...state.googleEvents];
              updatedGoogleEvents[googleEventIndex] = {
                ...updatedGoogleEvents[googleEventIndex],
                startDate: newStartDate,
                endDate: newEndDate,
              };
              newState.googleEvents = updatedGoogleEvents;
            }

            return {
              ...newState,
              optimisticUpdateCounter: state.optimisticUpdateCounter + 1,
              optimisticOverrides: {
                ...state.optimisticOverrides,
                [eventId]: { startDate: newStartDate, endDate: newEndDate },
              },
            } as CalendarState;
          }),

        clearOptimisticOverride: (eventId: string) =>
          set((state) => {
            const { [eventId]: _omit, ...rest } = state.optimisticOverrides;
            return { optimisticOverrides: rest } as Partial<CalendarState>;
          }),

        incrementOptimisticCounter: () =>
          set((state) => ({
            optimisticUpdateCounter: state.optimisticUpdateCounter + 1,
          })),

        toggleChatSidebar: () =>
          set((state) => ({
            isChatSidebarOpen: !state.isChatSidebarOpen,
          })),
        setChatMode: (mode: 'sidebar' | 'popup' | 'fullscreen') =>
          set((state) => ({
            chatMode: mode,
            isChatSidebarOpen: mode !== 'fullscreen',
            isChatFullscreen: mode === 'fullscreen',
          })),
        setChatFullscreen: (fullscreen: boolean) =>
          set({ isChatFullscreen: fullscreen }),

        // Event sidebar actions
        openEventSidebarForNewEvent: (startDate: Date) => {
          // Generate a random color for new events
          const randomColors = [
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
          const randomColor =
            randomColors[Math.floor(Math.random() * randomColors.length)];

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
            pendingActions: state.pendingActions.filter(
              (action) => action.id !== id
            ),
          })),

        clearPendingActions: () => set({ pendingActions: [] }),

        setProcessing: (isProcessing) => set({ isProcessing }),

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
          set((state) => {
            const merged = events.map((e) => {
              const override = state.optimisticOverrides[e.id];
              return override ? { ...e, ...override } : e;
            });
            return {
              googleEvents: merged,
              isFetchingEvents: false,
              eventsLastFetched: new Date(),
            };
          }),

        setVisibleCalendarIds: (calendarIds) => {
          set((state) => {
            // Only update if the IDs actually changed
            if (JSON.stringify(state.visibleCalendarIds) === JSON.stringify(calendarIds)) {
              return state;
            }
            return { visibleCalendarIds: calendarIds };
          });
        },

        setFetchingEvents: (isFetching) =>
          set({ isFetchingEvents: isFetching }),

        setRefreshFunction: (refreshFn) => set({ refreshFunction: refreshFn }),

        refreshEvents: async () => {
          const state = get();
          if (state.refreshFunction) {
            await state.refreshFunction();
          }
        },

        // Multi-session actions
        setSessionEvents: (sessionId, events) =>
          set((state) => ({
            sessionEvents: {
              ...state.sessionEvents,
              [sessionId]: events,
            },
          })),

        setSessionCalendars: (sessionId, calendars) =>
          set((state) => ({
            sessionCalendars: {
              ...state.sessionCalendars,
              [sessionId]: calendars,
            },
          })),

        getAllVisibleEvents: () => {
          const state = get();
          const allEvents = [...state.events, ...state.googleEvents];

          // Add events from all sessions
          Object.values(state.sessionEvents).forEach((sessionEvents) => {
            allEvents.push(...sessionEvents);
          });

          return allEvents;
        },

        openUpgradeDialog: () => set({ isUpgradeDialogOpen: true }),
        closeUpgradeDialog: () => set({ isUpgradeDialogOpen: false }),
      }),
      {
        name: 'calendar-store',
        partialize: (state) => ({
          // Only persist essential UI state
          currentDate: state.currentDate,
          selectedDate: state.selectedDate,
          viewType: state.viewType,
          isChatSidebarOpen: state.isChatSidebarOpen,
          isChatFullscreen: state.isChatFullscreen,
          chatMode: state.chatMode,
          isEventSidebarOpen: state.isEventSidebarOpen,
          isUpgradeDialogOpen: state.isUpgradeDialogOpen,
        }),
        onRehydrateStorage: () => (state) => {
          // Convert string dates back to Date objects after rehydration
          if (state) {
            if (typeof state.currentDate === 'string') {
              state.currentDate = new Date(state.currentDate);
            }
            if (typeof state.selectedDate === 'string') {
              state.selectedDate = new Date(state.selectedDate);
            }
            // Always default to week view
            state.viewType = 'week';
          }
        },
      }
    )
  );
};
