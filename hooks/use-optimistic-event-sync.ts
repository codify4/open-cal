import { useCallback } from 'react';
import { toast } from 'sonner';
import { upsertGoogleEvent } from '@/lib/calendar-utils/google-calendar';
import type { Event } from '@/lib/store/calendar-store';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { useGoogleCalendarRefresh } from './use-google-calendar-refresh';

interface OptimisticSnapshot {
  eventId: string;
  source: 'events' | 'googleEvents';
  previousStartDate: Date;
  previousEndDate: Date;
}

export const useOptimisticEventSync = () => {
  const {
    events,
    googleEvents,
    updateEventTime,
    replaceEvent,
    clearOptimisticOverride,
  } = useCalendarStore((state) => state);
  const { refreshEvents } = useGoogleCalendarRefresh();

  const findEvent = useCallback(
    (eventId: string): Event | null => {
      return (
        events.find((e) => e.id === eventId) ||
        googleEvents.find((e) => e.id === eventId) ||
        null
      );
    },
    [events, googleEvents]
  );

  const optimisticUpdate = useCallback(
    (eventId: string, newStartDate: Date, newEndDate: Date) => {
      const currentEvent = findEvent(eventId);
      if (!currentEvent) {
        console.warn(`Event ${eventId} not found for optimistic update`);
        return null;
      }

      const snapshot: OptimisticSnapshot = {
        eventId,
        source: events.find((e) => e.id === eventId)
          ? 'events'
          : 'googleEvents',
        previousStartDate: new Date(currentEvent.startDate),
        previousEndDate: new Date(currentEvent.endDate),
      };

      updateEventTime(eventId, newStartDate, newEndDate);

      const updatedEvent: Event = {
        ...currentEvent,
        startDate: newStartDate,
        endDate: newEndDate,
      };

      const revert = () => {
        updateEventTime(
          snapshot.eventId,
          snapshot.previousStartDate,
          snapshot.previousEndDate
        );
        clearOptimisticOverride(snapshot.eventId);
      };

      return { snapshot, updatedEvent, revert };
    },
    [events, googleEvents, findEvent, updateEventTime]
  );

  const commit = useCallback(
    async (
      updatedEvent: Event,
      userId: string,
      userEmail?: string
    ): Promise<void> => {
      if (!(updatedEvent.googleEventId || updatedEvent.googleCalendarId)) {
        return;
      }

      try {
        const result = await upsertGoogleEvent(updatedEvent, userId, userEmail);

        if (result?.success && result.event) {
          replaceEvent(result.event);
          clearOptimisticOverride(result.event.id);
        } else {
          throw new Error(result?.error || 'Unknown error');
        }
      } catch (error) {
        console.error('Failed to sync event to Google Calendar:', error);
        toast.error('Failed to save changes to Google Calendar');
        await refreshEvents();
        throw error;
      }
    },
    [replaceEvent, refreshEvents]
  );

  return {
    optimisticUpdate,
    commit,
  };
};
