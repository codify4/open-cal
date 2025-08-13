import { Save, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Event } from '@/lib/store/calendar-store';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { BirthdayForm } from './form/birthday-form';
import EventActionsDropdown from './form/event-actions';
import { EventForm } from './form/event-form';
import { authClient } from '@/lib/auth-client';
import { useGoogleCalendarRefresh } from '@/hooks/use-google-calendar-refresh';
import { convertGoogleEventToLocalEvent } from '@/lib/calendar-utils';
import { toast } from 'sonner';

interface AddEventProps {
  onClick: () => void;
}

const AddEventSidebar = ({ onClick }: AddEventProps) => {
  const [formType, setFormType] = useState<'event' | 'birthday'>('event');
  const currentFormData = useRef<Partial<Event>>({});
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>(null);
  const googleSyncTimeoutRef = useRef<NodeJS.Timeout>(null);

  const {
    selectedEvent,
    isNewEvent,
    hasUnsavedChanges,
    eventCreationContext,
    updateSelectedEvent,
    closeEventSidebar,
    saveEvent,
    deleteEvent,
  } = useCalendarStore((state) => state);

  const isEditing = !!selectedEvent && !isNewEvent;

  const { refreshEvents } = useGoogleCalendarRefresh();

  const buildGoogleEventPayload = (e: Event) => {
    const isAllDay = e.isAllDay || false;
    const start = isAllDay
      ? { date: new Date(e.startDate).toISOString().slice(0, 10) }
      : { dateTime: new Date(e.startDate).toISOString() };
    const end = isAllDay
      ? { date: new Date(e.endDate).toISOString().slice(0, 10) }
      : { dateTime: new Date(e.endDate).toISOString() };
    return {
      summary: e.title || '',
      description: e.description || '',
      start,
      end,
      location: e.location || undefined,
      attendees: (e.attendees || []).map((email) => ({ email })),
      visibility: e.visibility || 'public',
      recurrence:
        e.repeat && e.repeat !== 'none'
          ? [
              `RRULE:FREQ=${
                e.repeat === 'daily'
                  ? 'DAILY'
                  : e.repeat === 'weekly'
                  ? 'WEEKLY'
                  : e.repeat === 'monthly'
                  ? 'MONTHLY'
                  : 'YEARLY'
              }`,
            ]
          : undefined,
    } as Record<string, unknown>;
  };

  const upsertGoogleEvent = async (eventToSave: Event, provisionalId?: string) => {
    try {
      const { data: session } = await authClient.getSession();
      if (!session?.user?.id) return;

      const accessToken = await authClient.getAccessToken({
        providerId: 'google',
        userId: session.user.id,
      });
      if (!accessToken?.data?.accessToken) return;

      const calendarId = eventToSave.googleCalendarId || 'primary';
      let isUpdate = Boolean(eventToSave.googleEventId);
      const baseUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
      let url = isUpdate
        ? `${baseUrl}/${encodeURIComponent(eventToSave.googleEventId!)}?sendUpdates=none`
        : `${baseUrl}?sendUpdates=none`;

      let method: 'PUT' | 'POST' = isUpdate ? 'PUT' : 'POST';
      let body: string;
      let etag: string | undefined;

      if (isUpdate) {
        const getResp = await fetch(`${baseUrl}/${encodeURIComponent(eventToSave.googleEventId!)}`, {
          headers: {
            Authorization: `Bearer ${accessToken.data.accessToken}`,
            Accept: 'application/json',
          },
        });
        if (getResp.status === 404) {
          isUpdate = false;
          url = `${baseUrl}?sendUpdates=none`;
          method = 'POST';
          body = JSON.stringify(buildGoogleEventPayload(eventToSave));
        } else {
          if (!getResp.ok) {
            const errText = await getResp.text();
            console.error('Failed to fetch existing event:', errText);
            toast.error('Failed to load event for update');
            return;
          }
          const existing = await getResp.json();
          etag = existing?.etag;
          const payload = buildGoogleEventPayload(eventToSave);
          const merged = {
            ...existing,
            summary: payload.summary,
            description: payload.description,
            start: payload.start,
            end: payload.end,
            location: payload.location,
            attendees: payload.attendees,
            visibility: payload.visibility,
            recurrence: payload.recurrence,
          } as Record<string, unknown>;
          body = JSON.stringify(merged);
        }
      } else {
        body = JSON.stringify(buildGoogleEventPayload(eventToSave));
      }

      let attempt = 0;
      let delayMs = 500;
      while (attempt < 3) {
        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${accessToken.data.accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(etag ? { 'If-Match': etag } : {}),
          },
          body,
        });

        if (response.ok) {
          const googleEvent = await response.json();
          const converted = convertGoogleEventToLocalEvent(
            googleEvent,
            calendarId,
            session.user.email
          );
          saveEvent(converted);
          if (provisionalId && provisionalId !== converted.id) {
            deleteEvent(provisionalId);
          }
          await refreshEvents();
          return;
        }

        if (response.status === 401) {
          toast.error('Access token expired. Please reconnect your Google account.');
          return;
        }

        const errorText = await response.text();
        let shouldRetry = false;
        try {
          const errJson = JSON.parse(errorText);
          const reason = errJson?.error?.errors?.[0]?.reason;
          if (
            response.status === 429 ||
            reason === 'rateLimitExceeded' ||
            reason === 'userRateLimitExceeded'
          ) {
            shouldRetry = true;
          }
        } catch {}

        if (!shouldRetry) {
          console.error('Failed to upsert Google event:', errorText);
          toast.error('Failed to save event to Google Calendar');
          return;
        }

        await new Promise((r) => setTimeout(r, delayMs + Math.floor(Math.random() * 200)));
        attempt += 1;
        delayMs *= 2;
      }

      toast.error('Rate limited by Google Calendar. Please try again.');
    } catch (err) {
      console.error(err);
      toast.error('Error saving event');
    }
  };

  useEffect(() => {
    if (selectedEvent) {
      setFormType(selectedEvent.type);
    } else if (eventCreationContext?.startDate && !selectedEvent) {
      const newEvent: Event = {
        id: `event-${Date.now()}`,
        title: eventCreationContext.title || '',
        description: eventCreationContext.description || '',
        startDate: eventCreationContext.startDate,
        endDate: eventCreationContext.endDate,
        color: eventCreationContext.color || 'blue',
        type: eventCreationContext.type || 'event',
        location: '',
        attendees: [],
        reminders: [],
        repeat: 'none',
        visibility: 'public',
      };

      updateSelectedEvent(newEvent);
    }
  }, [selectedEvent, eventCreationContext]);

  const handleClose = () => {
    // Clear any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    if (googleSyncTimeoutRef.current) {
      clearTimeout(googleSyncTimeoutRef.current);
    }
    closeEventSidebar();
    currentFormData.current = {};
    onClick();
  };

  const handleFormDataChange = (eventData: Partial<Event>) => {
    currentFormData.current = { ...currentFormData.current, ...eventData };
    
    if (selectedEvent) {
      const updatedEvent = { ...selectedEvent, ...eventData };
      updateSelectedEvent(updatedEvent);
      
      if (!isNewEvent) {
        saveEvent(updatedEvent);
        if (googleSyncTimeoutRef.current) clearTimeout(googleSyncTimeoutRef.current);
        googleSyncTimeoutRef.current = setTimeout(() => {
          upsertGoogleEvent({
            ...updatedEvent,
            googleCalendarId: updatedEvent.googleCalendarId || 'primary',
          });
        }, 1000);
      } else {
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }
        
        autoSaveTimeoutRef.current = setTimeout(() => {
          const eventToSave: Event = {
            id: selectedEvent.id,
            title: currentFormData.current.title || '',
            description: currentFormData.current.description || '',
            startDate: currentFormData.current.startDate || new Date(),
            endDate: currentFormData.current.endDate || new Date(),
            color: currentFormData.current.color || 'blue',
            type: currentFormData.current.type || 'event',
            location: currentFormData.current.location || '',
            attendees: currentFormData.current.attendees || [],
            reminders: currentFormData.current.reminders || [],
            repeat: currentFormData.current.repeat || 'none',
            visibility: currentFormData.current.visibility || 'public',
            googleCalendarId: 'primary',
          };
          
          saveEvent(eventToSave);
          upsertGoogleEvent(eventToSave, selectedEvent.id);
        }, 1000);
      }
    }
  };

  const handleManualSave = async () => {
    if (
      currentFormData.current &&
      Object.keys(currentFormData.current).length > 0
    ) {
      let eventToSave: Event;

      if (selectedEvent) {
        eventToSave = { ...selectedEvent, ...currentFormData.current };
      } else {
        eventToSave = {
          id: `event-${Date.now()}`,
          title: currentFormData.current.title || '',
          description: currentFormData.current.description || '',
          startDate: currentFormData.current.startDate || new Date(),
          endDate: currentFormData.current.endDate || new Date(),
          color: currentFormData.current.color || 'blue',
          type: currentFormData.current.type || 'event',
          location: currentFormData.current.location || '',
          attendees: currentFormData.current.attendees || [],
          reminders: currentFormData.current.reminders || [],
          repeat: currentFormData.current.repeat || 'none',
          visibility: currentFormData.current.visibility || 'public',
          googleCalendarId: 'primary',
        };
      }

      saveEvent(eventToSave);
      await upsertGoogleEvent(eventToSave, eventToSave.id);
      closeEventSidebar();
      onClick();
    }
  };

  const handleDelete = () => {
    if (isEditing && selectedEvent) {
    }
    handleClose();
  };

  return (
    <div className="flex h-full flex-col gap-6 p-2 px-1 text-foreground">
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center">
          <Select
            onValueChange={(value) =>
              setFormType(value as 'event' | 'birthday')
            }
            value={formType}
          >
            <SelectTrigger className="w-32 cursor-pointer rounded-sm border-border bg-transparent px-2 py-0 font-semibold text-sm text-foreground hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-border bg-popover dark:bg-neutral-900">
              <SelectItem
                className="cursor-pointer text-popover-foreground hover:bg-accent"
                value="event"
              >
                Event
              </SelectItem>
              <SelectItem
                className="cursor-pointer text-popover-foreground hover:bg-accent"
                value="birthday"
              >
                Birthday
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-8 w-8 text-foreground hover:bg-accent"
                disabled={!(isNewEvent || hasUnsavedChanges)}
                onClick={handleManualSave}
                size="icon"
                variant="ghost"
              >
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-popover font-semibold text-popover-foreground">
              <p>Save</p>
            </TooltipContent>
          </Tooltip>

          {isEditing && (
            <EventActionsDropdown
              onCopy={() => {}}
              onCut={() => {}}
              onDelete={handleDelete}
              onDuplicate={() => {}}
            />
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-8 w-8 text-foreground hover:bg-accent"
                onClick={handleClose}
                size="icon"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-popover font-semibold text-popover-foreground">
              <p>Close</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex-1">
        {formType === 'event' ? (
          <EventForm
            event={
              selectedEvent ||
              (eventCreationContext
                ? {
                    id: `temp-${Date.now()}`,
                    title: eventCreationContext.title || '',
                    description: eventCreationContext.description || '',
                    startDate: eventCreationContext.startDate,
                    endDate: eventCreationContext.endDate,
                    color: eventCreationContext.color || 'blue',
                    type: eventCreationContext.type || 'event',
                    location: '',
                    attendees: [],
                    reminders: [],
                    repeat: 'none',
                    visibility: 'public',
                  }
                : null)
            }
            onSave={handleFormDataChange}
          />
        ) : (
          <BirthdayForm event={selectedEvent} onSave={handleFormDataChange} />
        )}
      </div>
    </div>
  );
};

export default AddEventSidebar;
