'use client';

import { useEffect, useState } from 'react';
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

  const allCalendars = Object.values(sessionCalendars).flat();
  const visibleCalendars = new Set(visibleCalendarIds);

  useEffect(() => {
    const fetchColors = async () => {
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
            console.log('Loaded Google Calendar colors:', colors);
            setColorOptions(colors);
          }
        }
      } catch (error) {
        console.error('Failed to fetch colors:', error);
        // Fallback to default colors if Google API fails
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
    };

    if (allCalendars.length > 0) {
      console.log('Calendars loaded, fetching colors. Calendars:', allCalendars.map(c => ({ id: c.id, colorId: c.colorId, backgroundColor: c.backgroundColor })));
      fetchColors();
    }
  }, [allCalendars.length]);

  const handleCalendarToggle = (calendarId: string) => {
    const newVisibleCalendars = new Set(visibleCalendarIds);
    if (newVisibleCalendars.has(calendarId)) {
      newVisibleCalendars.delete(calendarId);
    } else {
      newVisibleCalendars.add(calendarId);
    }
    setVisibleCalendarIds(Array.from(newVisibleCalendars));
  };

  const handleChangeCalendarColor = async (calendarId: string, colorId: string) => {
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
  };

  const handleDeleteCalendar = async (calendarId: string) => {
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
  };

  return {
    fetchedCalendars: allCalendars,
    isLoadingCalendars: isFetchingCalendars,
    visibleCalendars,
    colorOptions,
    handleChangeCalendarColor,
    handleDeleteCalendar,
    handleCalendarToggle,
    refetchCalendars: refreshCalendars,
  };
}
