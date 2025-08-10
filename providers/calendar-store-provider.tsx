'use client';

import { createContext, type ReactNode, useContext, useRef } from 'react';
import { useStore } from 'zustand';

import {
  type CalendarStore,
  createCalendarStore,
  defaultInitState,
} from '@/lib/store/calendar-store';

export type CalendarStoreApi = ReturnType<typeof createCalendarStore>;

export const CalendarStoreContext = createContext<CalendarStoreApi | undefined>(
  undefined
);

export interface CalendarStoreProviderProps {
  children: ReactNode;
}

export const CalendarStoreProvider = ({
  children,
}: CalendarStoreProviderProps) => {
  const storeRef = useRef<CalendarStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createCalendarStore(defaultInitState);
  }

  return (
    <CalendarStoreContext.Provider value={storeRef.current}>
      {children}
    </CalendarStoreContext.Provider>
  );
};

export const useCalendarStore = <T,>(
  selector: (store: CalendarStore) => T
): T => {
  const calendarStoreContext = useContext(CalendarStoreContext);

  if (!calendarStoreContext) {
    throw new Error(
      'useCalendarStore must be used within CalendarStoreProvider'
    );
  }

  return useStore(calendarStoreContext, selector);
};

export const useCalendarStoreApi = () => {
  const calendarStoreContext = useContext(CalendarStoreContext);
  if (!calendarStoreContext) {
    throw new Error('useCalendarStoreApi must be used within CalendarStoreProvider');
  }
  return calendarStoreContext;
};
