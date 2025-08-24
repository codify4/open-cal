'use client';

import { createContext, type ReactNode, useContext, useRef, useEffect, useState, useCallback } from 'react';
import { useStore } from 'zustand';
import { useAuth, useSessionList } from '@clerk/nextjs';
import { getAccessToken, getAccessTokenForSession } from '@/actions/access-token';
import type { GoogleCalendar } from '@/types/calendar';

import {
  type CalendarStore,
  createCalendarStore,
  defaultInitState,
} from '@/lib/store/calendar-store';

export type CalendarStoreApi = ReturnType<typeof createCalendarStore>;

export const CalendarStoreContext = createContext<CalendarStoreApi | undefined>(
  undefined
);

export const CalendarRefreshContext = createContext<(() => Promise<void>) | null>(null);

export interface CalendarStoreProviderProps {
  children: ReactNode;
}

function BackgroundCalendarFetcher({ children }: { children: ReactNode }) {
  const { userId } = useAuth();
  const { sessions } = useSessionList();
  const { setSessionCalendars, setVisibleCalendarIds, visibleCalendarIds, setFetchingCalendars } = useCalendarStore((state) => state);
  const [isFetching, setIsFetching] = useState(false);

  const fetchCalendarsForSession = async (session: any, sessionAccessToken: string) => {
    try {
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/users/me/calendarList',
        {
          headers: {
            Authorization: `Bearer ${sessionAccessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const calendars: GoogleCalendar[] = data.items.map((cal: any) => ({
        id: cal.id,
        summary: cal.summary,
        name: cal.summary,
        primary: cal.primary,
        accessRole: cal.accessRole,
        colorId: cal.colorId,
        backgroundColor: cal.backgroundColor,
        account: session.user?.primaryEmailAddress?.emailAddress || '',
      }));

      return calendars.sort((a, b) => {
        if (a.primary && !b.primary) return -1;
        if (!a.primary && b.primary) return 1;
        return (a.summary || a.name || '').localeCompare(
          b.summary || b.name || ''
        );
      });
    } catch (error) {
      console.error(
        `Failed to fetch calendars for session ${session.id}:`,
        error
      );
      return [];
    }
  };

  const fetchAllCalendars = async () => {
    setIsFetching(true);
    setFetchingCalendars(true);
    
    try {
      const allCalendars: GoogleCalendar[] = [];

      if (!sessions) return;

      for (const session of sessions) {
        if (!session.user?.primaryEmailAddress?.emailAddress) continue;

        try {
          const sessionToken = await getAccessTokenForSession(session.id);
          if (sessionToken) {
            const sessionCalendars = await fetchCalendarsForSession(
              session,
              sessionToken
            );

            sessionCalendars.forEach((calendar) => {
              if (!allCalendars.some((existing) => existing.id === calendar.id)) {
                allCalendars.push(calendar);
              }
            });

            setSessionCalendars(session.id, sessionCalendars);
          }
        } catch (error) {
          console.error(
            `Failed to fetch calendars for session ${session.id}:`,
            error
          );
        }
      }

      if (allCalendars.length > 0 && visibleCalendarIds.length === 0) {
        const calendarIds = allCalendars.map((cal) => cal.id);
        setVisibleCalendarIds(calendarIds);
      }
    } finally {
      setIsFetching(false);
      setFetchingCalendars(false);
    }
  };

  const refreshCalendars = useCallback(async () => {
    if (userId && sessions && sessions.length > 0) {
      await fetchAllCalendars();
    }
  }, [userId, sessions, setSessionCalendars, setVisibleCalendarIds, visibleCalendarIds.length, setFetchingCalendars]);

  useEffect(() => {
    if (!userId || !sessions || sessions.length === 0) return;
    fetchAllCalendars();
  }, [userId, sessions, setSessionCalendars, setVisibleCalendarIds, visibleCalendarIds.length, setFetchingCalendars]);

  return (
    <CalendarRefreshContext.Provider value={refreshCalendars}>
      {children}
    </CalendarRefreshContext.Provider>
  );
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
      <BackgroundCalendarFetcher>
        {children}
      </BackgroundCalendarFetcher>
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
    throw new Error(
      'useCalendarStoreApi must be used within CalendarStoreProvider'
    );
  }
  return calendarStoreContext;
};

export const useCalendarRefresh = () => {
  const refreshContext = useContext(CalendarRefreshContext);
  if (!refreshContext) {
    throw new Error(
      'useCalendarRefresh must be used within CalendarStoreProvider'
    );
  }
  return refreshContext;
};
