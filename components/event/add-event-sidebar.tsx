import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { Save, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useGoogleCalendarRefresh } from '@/hooks/use-google-calendar-refresh';
import { useMeetingGeneration } from '@/hooks/use-meeting-generation';
import { upsertGoogleEvent } from '@/lib/calendar-utils/google-calendar';
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
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>(null);
  const googleSyncTimeoutRef = useRef<NodeJS.Timeout>(null);
  const { user } = useUser();

  const {
    selectedEvent,
    isNewEvent,
    hasUnsavedChanges,
    eventCreationContext,
    updateSelectedEvent,
    closeEventSidebar,
    saveEvent,
  } = useCalendarStore((state) => state);

  const {
    isGeneratingMeeting,
    currentFormData,
    updateFormData,
    generateMeeting,
  } = useMeetingGeneration();
  const { refreshEvents } = useGoogleCalendarRefresh();

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
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    if (googleSyncTimeoutRef.current) {
      clearTimeout(googleSyncTimeoutRef.current);
    }
    closeEventSidebar();
    updateFormData({});
    onClick();
  };

  const handleFormDataChange = (eventData: Partial<Event>) => {
    updateFormData(eventData);

    if (selectedEvent) {
      const updatedEvent = { ...selectedEvent, ...eventData };
      updateSelectedEvent(updatedEvent);
    }
  };

  const handleGenerateMeeting = async () => {
    if (!(selectedEvent && user?.id)) return;

    const result = await generateMeeting(
      selectedEvent,
      user.id,
      user.primaryEmailAddress?.emailAddress
    );
    if (result?.success && result.event) {
      saveEvent(result.event);
      updateSelectedEvent(result.event);
      updateFormData(result.event);
      await refreshEvents();
      toast.success('Google Meet link generated successfully');
    }
  };

  const handleManualSave = async () => {
    console.log('handleManualSave called with:', { currentFormData, selectedEvent });
    
    if (
      currentFormData &&
      Object.keys(currentFormData).length > 0 &&
      selectedEvent
    ) {
      const eventToSave = { ...selectedEvent, ...currentFormData };
      console.log('Event to save:', eventToSave);

      if (eventToSave.googleEventId && user?.id) {
        console.log('Updating existing Google Calendar event...');
        const result = await upsertGoogleEvent(
          eventToSave,
          user.id,
          user.primaryEmailAddress?.emailAddress
        );
        console.log('Google Calendar update result:', result);
        
        if (result?.success && result.event) {
          saveEvent(result.event);
          updateSelectedEvent(result.event);
          updateFormData(result.event);
          toast.success('Event updated in Google Calendar');
        } else {
          toast.error('Failed to update event in Google Calendar');
          return;
        }
      } else {
        console.log('Saving local event...');
        saveEvent(eventToSave);
        console.log('Local event saved');
      }

      closeEventSidebar();
      onClick();
    } else {
      console.log('No form data or selected event to save');
    }
  };

  const handleDelete = () => {
    handleClose();
  };

  return (
    <div className="flex h-full flex-col gap-6 p-2 px-1 text-foreground">
      <SignedOut>
        <div className="flex h-full items-center justify-center">
          <div className="space-y-4 text-center">
            <h3 className="font-medium text-foreground text-lg">
              Sign in to create events
            </h3>
            <p className="text-muted-foreground">
              Connect your account to start managing your calendar
            </p>
            <SignInButton mode="modal">
              <Button>Sign in to Continue</Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center">
            <Select
              onValueChange={(value) =>
                setFormType(value as 'event' | 'birthday')
              }
              value={formType}
            >
              <SelectTrigger className="w-32 cursor-pointer rounded-sm border-border bg-transparent px-2 py-0 font-semibold text-foreground text-sm hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
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
              isGeneratingMeeting={isGeneratingMeeting}
              onGenerateMeeting={handleGenerateMeeting}
              onSave={handleFormDataChange}
            />
          ) : (
            <BirthdayForm event={selectedEvent} onSave={handleFormDataChange} />
          )}
        </div>
      </SignedIn>
    </div>
  );
};
export default AddEventSidebar;
