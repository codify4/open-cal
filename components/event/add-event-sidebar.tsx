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

interface AddEventProps {
  onClick: () => void;
}

const AddEventSidebar = ({ onClick }: AddEventProps) => {
  const [formType, setFormType] = useState<'event' | 'birthday'>('event');
  const currentFormData = useRef<Partial<Event>>({});

  const {
    selectedEvent,
    isNewEvent,
    hasUnsavedChanges,
    eventCreationContext,
    updateSelectedEvent,
    closeEventSidebar,
    saveEvent,
  } = useCalendarStore((state) => state);

  const isEditing = !!selectedEvent && !isNewEvent;

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
    closeEventSidebar();
    currentFormData.current = {};
    onClick();
  };

  const handleFormDataChange = (eventData: Partial<Event>) => {
    currentFormData.current = { ...currentFormData.current, ...eventData };
    if (selectedEvent) {
      const updatedEvent = { ...selectedEvent, ...eventData };
      updateSelectedEvent(updatedEvent);
    }
  };

  const handleManualSave = () => {
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
        } as Event;
      }

      saveEvent(eventToSave);
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
