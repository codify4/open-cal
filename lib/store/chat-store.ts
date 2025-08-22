import type { UIMessage } from 'ai';
import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

export interface EventReference {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
  attendees?: string[];
  location?: string;
  calendarId: string;
  color?: string;
}

export interface CalendarReference {
  id: string;
  name: string;
  summary?: string;
  color?: string;
  accessRole?: string;
}

export interface ChatState {
  messages: UIMessage[];
  input: string;
  eventReferences: EventReference[];
  calendarReferences: CalendarReference[];
}

export interface ChatActions {
  setMessages: (messages: UIMessage[]) => void;
  setInput: (input: string) => void;
  clearChat: () => void;
  addMessage: (message: UIMessage) => void;
  addEventReference: (event: EventReference) => void;
  removeEventReference: (eventId: string) => void;
  clearEventReferences: () => void;
  addCalendarReference: (calendar: CalendarReference) => void;
  removeCalendarReference: (calendarId: string) => void;
  clearCalendarReferences: () => void;
}

export type ChatStore = ChatState & ChatActions;

export const defaultChatState: ChatState = {
  messages: [],
  input: '',
  eventReferences: [],
  calendarReferences: [],
};

export const createChatStore = (initState: ChatState = defaultChatState) => {
  return createStore<ChatStore>()(
    persist(
      (set, get) => ({
        ...initState,

        setMessages: (messages: UIMessage[]) => set({ messages }),

        setInput: (input: string) => set({ input }),

        clearChat: () => set({ messages: [], input: '' }),

        addMessage: (message: UIMessage) =>
          set((state) => ({
            messages: [...state.messages, message],
          })),

        addEventReference: (event: EventReference) =>
          set((state) => ({
            eventReferences: [...state.eventReferences, event],
          })),

        removeEventReference: (eventId: string) =>
          set((state) => ({
            eventReferences: state.eventReferences.filter(ref => ref.id !== eventId),
          })),

        clearEventReferences: () => set({ eventReferences: [] }),

        addCalendarReference: (calendar: CalendarReference) =>
          set((state) => ({
            calendarReferences: [...state.calendarReferences, calendar],
          })),

        removeCalendarReference: (calendarId: string) =>
          set((state) => ({
            calendarReferences: state.calendarReferences.filter(ref => ref.id !== calendarId),
          })),

        clearCalendarReferences: () => set({ calendarReferences: [] }),
      }),
      {
        name: 'chat-store',
      }
    )
  );
};

// Utility function to convert Event to EventReference
export function convertEventToReference(event: any): EventReference {
  return {
    id: event.id,
    title: event.title,
    startDate: event.startDate instanceof Date ? event.startDate.toISOString() : event.startDate,
    endDate: event.endDate instanceof Date ? event.endDate.toISOString() : event.endDate,
    description: event.description,
    attendees: event.attendees,
    location: event.location,
    calendarId: event.calendar || event.googleCalendarId || 'default',
    color: event.color,
  };
}

// Utility function to convert Calendar to CalendarReference
export function convertCalendarToReference(calendar: any): CalendarReference {
  return {
    id: calendar.id,
    name: calendar.name || calendar.summary || 'Unknown Calendar',
    summary: calendar.summary,
    color: calendar.backgroundColor || calendar.color,
    accessRole: calendar.accessRole,
  };
}
