import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { useGoogleCalendarRefresh } from '@/hooks/use-google-calendar-refresh';
import { deleteGoogleEvent } from '@/lib/calendar-utils/google-calendar';
import type { Event } from '@/lib/store/calendar-store';

export const useEventCardActions = () => {
  const { openEventSidebarForEdit, deleteEvent, saveEvent } = useCalendarStore(
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
    try {
      if (event.googleEventId && clerkUser) {
        const calendarId = event.googleCalendarId || 'primary';
        const result = await deleteGoogleEvent(event.googleEventId, calendarId);

        if (!result.success) {
          if (result.error === 'unauthorized') {
            toast.error(
              'Access token expired. Please reconnect your Google account.'
            );
            return;
          }
          if (result.error === 'not_found') {
            toast.info('Event not found in Google Calendar, deleting locally');
          } else {
            toast.error('Failed to delete from Google Calendar');
            return;
          }
        }
      }
    } catch (error) {
      toast.error('Failed to delete event');
      return;
    }

    deleteEvent(event.id);
    await refreshEvents();
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

  const handleCopy = (event: Event) => {
    navigator.clipboard.writeText(JSON.stringify(event, null, 2));
  };

  return {
    handleEdit,
    handleDelete,
    handleDuplicate,
    handleCopy,
  };
};
