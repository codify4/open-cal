'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { useCalendarRefresh } from '@/providers/calendar-store-provider';
import { getAccessToken } from '@/actions/access-token';
import type { ColorOption, GoogleCalendar } from '@/types/calendar';

export function useCalendarManagement() {
  const {
    sessionCalendars,
    visibleCalendarIds,
    setVisibleCalendarIds,
    isFetchingCalendars,
  } = useCalendarStore((state) => state);

  const refreshCalendars = useCalendarRefresh();
  const [colorOptions, setColorOptions] = useState<ColorOption[]>([]);

  const allCalendars = useMemo(() => {
    return Object.values(sessionCalendars).flat();
  }, [sessionCalendars]);
  const visibleCalendars = useMemo(() => new Set(visibleCalendarIds), [visibleCalendarIds]);

  const fetchColors = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (token) {
        const response = await fetch(
          'https://www.googleapis.com/calendar/v3/colors',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const colors: ColorOption[] = Object.entries(
            data.calendar || {}
          ).map(([id, color]: [string, any]) => ({
            id,
            background: color.background,
          }));
          setColorOptions(colors);
        }
      }
    } catch (error) {
      console.error('Failed to fetch colors:', error);
      setColorOptions([
        { id: '1', background: '#7986cb' },
        { id: '2', background: '#33b679' },
        { id: '3', background: '#8f24a2' },
        { id: '4', background: '#e67c73' },
        { id: '5', background: '#f6c026' },
        { id: '6', background: '#f5511d' },
        { id: '7', background: '#039be5' },
        { id: '8', background: '#616161' },
        { id: '9', background: '#3f51b5' },
        { id: '10', background: '#0b8043' },
        { id: '11', background: '#d60000' },
      ]);
    }
  }, []);

  useEffect(() => {
    if (allCalendars.length > 0) {
      fetchColors();
    }
  }, [allCalendars.length, fetchColors]);

  const handleCalendarToggle = useCallback((calendarId: string) => {
    const newVisibleCalendars = new Set(visibleCalendarIds);
    if (newVisibleCalendars.has(calendarId)) {
      newVisibleCalendars.delete(calendarId);
    } else {
      newVisibleCalendars.add(calendarId);
    }
    setVisibleCalendarIds(Array.from(newVisibleCalendars));
  }, [visibleCalendarIds, setVisibleCalendarIds]);

  const handleChangeCalendarColor = useCallback(async (calendarId: string, colorId: string) => {
    try {
      const token = await getAccessToken();
      if (token) {
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/users/me/calendarList/${calendarId}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ colorId }),
          }
        );

        if (response.ok) {
          await refreshCalendars();
        }
      }
    } catch (error) {
      console.error('Failed to update calendar color:', error);
    }
  }, [refreshCalendars]);

  const handleDeleteCalendar = useCallback(async (calendarId: string) => {
    try {
      const token = await getAccessToken();
      if (token) {
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${calendarId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          await refreshCalendars();
        }
      }
    } catch (error) {
      console.error('Failed to delete calendar:', error);
    }
  }, [refreshCalendars]);

  const createCalendarForAccount = useCallback(async (formData: { summary: string; description: string; timeZone: string; colorId: string }, targetAccount?: string) => {
    try {
      const token = await getAccessToken();
      if (token) {
        const response = await fetch(
          'https://www.googleapis.com/calendar/v3/calendars',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              summary: formData.summary,
              description: formData.description,
              timeZone: formData.timeZone,
            }),
          }
        );

        if (response.ok) {
          await refreshCalendars();
          return { success: true };
        }
      }
      return { success: false };
    } catch (error) {
      console.error('Failed to create calendar:', error);
      return { success: false };
    }
  }, [refreshCalendars]);

  return {
    fetchedCalendars: allCalendars,
    isLoadingCalendars: isFetchingCalendars,
    visibleCalendars,
    colorOptions,
    handleChangeCalendarColor,
    handleDeleteCalendar,
    handleCalendarToggle,
    createCalendarForAccount,
    refetchCalendars: refreshCalendars,
  };
}
