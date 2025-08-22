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
import { BirthdayForm } from './form/birthday-form';
import EventActionsDropdown from './form/event-actions';
import { EventForm } from './form/event-form';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer';

interface AddEventDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddEventDrawer = ({ open, onOpenChange }: AddEventDrawerProps) => {
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
    onOpenChange(false);
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
    if (
      currentFormData &&
      Object.keys(currentFormData).length > 0 &&
      selectedEvent
    ) {
      const eventToSave = { ...selectedEvent, ...currentFormData };

      if (eventToSave.googleEventId && user?.id) {
        const result = await upsertGoogleEvent(
          eventToSave,
          user.id,
          user.primaryEmailAddress?.emailAddress
        );
        
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
        saveEvent(eventToSave);
      }

      closeEventSidebar();
      onOpenChange(false);
    }
  };

  const handleDelete = () => {
    handleClose();
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[95vh] max-h-[100vh] rounded-t-2xl border-0 bg-neutral-900 p-0">
        <DrawerHeader className="border-b px-4 py-2">
          <DrawerTitle className="sr-only">Add Event</DrawerTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Select
                onValueChange={(value) =>
                  setFormType(value as 'event' | 'birthday')
                }
                value={formType}
              >
                <SelectTrigger className="w-28 cursor-pointer rounded-lg border-border bg-transparent px-3 py-2 font-medium text-foreground text-sm hover:bg-accent focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder="Select Event Type" />
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
              <Button
                className="h-9 px-4 font-medium"
                disabled={!(isNewEvent || hasUnsavedChanges)}
                onClick={handleManualSave}
                size="sm"
                variant="default"
              >
                Save
              </Button>

              {isEditing && (
                <EventActionsDropdown
                  onCopy={() => {}}
                  onCut={() => {}}
                  onDelete={handleDelete}
                  onDuplicate={() => {}}
                />
              )}
            </div>
          </div>
        </DrawerHeader>
        
        <div className="flex-1 overflow-y-auto px-4 pb-4 mt-4">
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
                  <Button className="w-full">Sign in to Continue</Button>
                </SignInButton>
              </div>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="space-y-4">
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
      </DrawerContent>
    </Drawer>
  );
};

export default AddEventDrawer;
