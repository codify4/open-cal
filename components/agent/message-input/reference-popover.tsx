'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useChatStore } from '@/providers/chat-store-provider';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { getCalendarColor, getDotColor } from '@/lib/calendar-utils/calendar-color-utils';
import { convertEventToReference, convertCalendarToReference } from '@/lib/store/chat-store';

interface ReferencePopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (reference: string, eventRef?: any, calendarRef?: any) => void;
}

export function ReferencePopover({ isOpen, onOpenChange, onSelect }: ReferencePopoverProps) {
  const addEventReference = useChatStore((state) => state.addEventReference);
  const addCalendarReference = useChatStore((state) => state.addCalendarReference);
  const calendarEvents = useCalendarStore((state) => state.events);
  const googleEvents = useCalendarStore((state) => state.googleEvents);
  const sessionCalendars = useCalendarStore((state) => state.sessionCalendars);
  const eventReferences = useChatStore((state) => state.eventReferences);
  const calendarReferences = useChatStore((state) => state.calendarReferences);
  
  const allEvents = [...calendarEvents, ...googleEvents];
  const allCalendars = Object.values(sessionCalendars).flat();
  
  const handleEventSelect = (event: any) => {
    const eventRef = convertEventToReference(event);
    onSelect(`@${event.title}`, eventRef);
  };

  const handleCalendarSelect = (calendar: any) => {
    const calendarRef = convertCalendarToReference(calendar);
    onSelect(`@${calendar.summary || calendar.name}`, undefined, calendarRef);
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          className="flex h-6 px-2 items-center justify-center rounded-md bg-muted text-muted-foreground hover:bg-muted/80 transition-colors flex-shrink-0"
          aria-label="Reference events or calendars"
          variant="outline"
        >
          <span className="text-sm font-medium">@</span>
          {eventReferences.length === 0 && calendarReferences.length === 0 && (
            <span className="text-xs">Add context</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3 bg-neutral-900" align="start">
        <div className="space-y-3 overflow-y-auto scrollbar-hide">
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-foreground">Events</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {allEvents.length > 0 ? allEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => handleEventSelect(event)}
                  className="w-full flex items-center gap-2 p-1.5 rounded-[10px] hover:bg-neutral-800/50 transition-colors text-left cursor-pointer focus:outline-none"
                >
                  <div 
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getDotColor(event.color || 'blue')}`}
                  />
                  <span className="text-xs text-foreground truncate">{event.title}</span>
                </button>
              )) : (
                <p className="text-xs text-muted-foreground px-1.5">No events available</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-foreground">
                Calendars
            </h4>
            <div className="space-y-1 max-h-20">
              {allCalendars.length > 0 ? allCalendars.map((calendar) => (
                <button
                  key={calendar.id}
                  onClick={() => handleCalendarSelect(calendar)}
                  className="w-full flex items-center gap-2 p-1.5 transition-colors text-left rounded-[10px] hover:bg-neutral-800/50 cursor-pointer"
                >
                    <div className="flex items-center gap-2">
                        <div
                            className={`h-3 w-3 rounded-xs ${getCalendarColor(calendar)}`}
                            style={{ backgroundColor: getCalendarColor(calendar) }}
                        />
                        <span className="text-xs text-foreground truncate">{calendar.summary || calendar.name}</span>
                    </div>
                </button>
              )) : (
                <p className="text-xs text-muted-foreground px-1.5">No calendars available</p>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
