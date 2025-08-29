import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { useGoogleCalendarRefresh } from '@/hooks/use-google-calendar-refresh';
import { deleteGoogleEvent } from '@/lib/calendar-utils/google-calendar';
import type { Event } from '@/lib/store/calendar-store';

export const useEventCardActions = () => {
  const { openEventSidebarForEdit, deleteEvent, saveEvent, setGoogleEvents, googleEvents, events } = useCalendarStore(
    (state) => state
  );
  const { refreshEvents } = useGoogleCalendarRefresh();
  const { user: clerkUser } = useUser();

  const ensureDate = (date: Date | string): Date => {
    return typeof date === 'string' ? new Date(date) : date;
  };

  const handleEdit = (e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    openEventSidebarForEdit(event);
  };

  const handleDelete = async (event: Event) => {
    if (!clerkUser?.id) {
      toast.error('User not authenticated');
      return;
    }

    // Store the event for potential restoration
    const eventToRestore = event;
    let wasRestored = false;

    // Optimistically delete the event from UI immediately
    if (event.googleEventId) {
      // Remove from googleEvents
      const updatedGoogleEvents = googleEvents.filter((e) => e.id !== event.id);
      setGoogleEvents(updatedGoogleEvents);
    } else {
      // Remove from events
      deleteEvent(event.id);
    }

    try {
      // Handle Google Calendar deletion in the background
      if (event.googleEventId) {
        const calendarId = event.googleCalendarId || 'primary';
        const result = await deleteGoogleEvent(event.googleEventId, calendarId);

        if (!result.success) {
          if (result.error === 'unauthorized') {
            throw new Error('Access token expired. Please reconnect your Google account.');
          }
          if (result.error === 'not_found') {
            // Event not found in Google Calendar, but that's fine for deletion
            return;
          }
          throw new Error(result.error || 'Failed to delete from Google Calendar');
        }
      }
    } catch (error) {
      // Restore the event on error
      if (eventToRestore.googleEventId) {
        const updatedGoogleEvents = [...googleEvents, eventToRestore];
        setGoogleEvents(updatedGoogleEvents);
      } else {
        // For local events, we need to add it back
        // Since we can't directly modify the events array, we'll use saveEvent
        saveEvent(eventToRestore);
      }
      
      wasRestored = true;
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete event';
      toast.error(errorMessage);
      return;
    }

    // Only refresh if we didn't restore (i.e., deletion was successful)
    if (!wasRestored) {
      await refreshEvents();
    }
  };

  const handleDuplicate = (event: Event) => {
    const startDate = ensureDate(event.startDate);
    const endDate = ensureDate(event.endDate);

    const duplicatedEvent = {
      ...event,
      id: `event-${Date.now()}`,
      title: `${event.title} (Copy)`,
      startDate: new Date(startDate.getTime() + 60 * 60 * 1000),
      endDate: new Date(endDate.getTime() + 60 * 60 * 1000),
    };
    saveEvent(duplicatedEvent);
  };

  return {
    handleEdit,
    handleDelete,
    handleDuplicate,
  };
};
