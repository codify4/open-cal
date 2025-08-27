'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/providers/chat-store-provider';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { getCalendarColor, getDotColor } from '@/lib/calendar-utils/calendar-color-utils';
import { convertEventToReference, convertCalendarToReference } from '@/lib/store/chat-store';
import { useState, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface ReferencePopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (reference: string, eventRef?: any, calendarRef?: any) => void;
}

export function ReferencePopover({ isOpen, onOpenChange, onSelect }: ReferencePopoverProps) {
  const calendarEvents = useCalendarStore((state) => state.events);
  const googleEvents = useCalendarStore((state) => state.googleEvents);
  const sessionCalendars = useCalendarStore((state) => state.sessionCalendars);
  const eventReferences = useChatStore((state) => state.eventReferences);
  const calendarReferences = useChatStore((state) => state.calendarReferences);
  
  const [globalSearch, setGlobalSearch] = useState('');
  const [isEventsOpen, setIsEventsOpen] = useState(true);
  const [isCalendarsOpen, setIsCalendarsOpen] = useState(true);
  
  const allEvents = [...calendarEvents, ...googleEvents];
  const allCalendars = Object.values(sessionCalendars).flat();
  
  const filteredEvents = useMemo(() => {
    let events = allEvents;
    if (globalSearch.trim()) {
      events = allEvents.filter(event => 
        event.title.toLowerCase().includes(globalSearch.toLowerCase())
      );
    }
    
    return events.sort((a, b) => {
      // Sort by startDate from closest to today to oldest
      const today = new Date();
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      
      // Calculate days from today for each event
      const daysFromTodayA = Math.abs((dateA.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const daysFromTodayB = Math.abs((dateB.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      return daysFromTodayA - daysFromTodayB;
    });
  }, [allEvents, globalSearch]);

  const filteredCalendars = useMemo(() => {
    if (!globalSearch.trim()) return allCalendars;
    return allCalendars.filter(calendar => 
      (calendar.summary || calendar.name || '').toLowerCase().includes(globalSearch.toLowerCase())
    );
  }, [allCalendars, globalSearch]);
  
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
      <PopoverContent className="w-72 max-h-96 p-3 overflow-y-auto custom-scrollbar bg-white dark:bg-neutral-900" align="start">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Search events and calendars..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="h-7 pl-7 text-xs bg-white dark:bg-neutral-800 dark:border-neutral-700 text-foreground placeholder:text-muted-foreground rounded-[10px] shadow-none"
            />
          </div>
          
          <div className="space-y-3 overflow-y-auto">
            <Collapsible open={isCalendarsOpen} onOpenChange={setIsCalendarsOpen}>
              <CollapsibleTrigger className="cursor-pointer w-full flex items-center justify-between p-1.5 rounded-[10px] hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors">
                <h4 className="text-xs font-medium text-foreground">Calendars ({filteredCalendars.length})</h4>
                <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${isCalendarsOpen ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-2">
                <div className="space-y-1">
                  {filteredCalendars.length > 0 ? filteredCalendars.map((calendar) => (
                    <button
                      key={calendar.id}
                      onClick={() => handleCalendarSelect(calendar)}
                      className="w-full flex items-center gap-2 p-1.5 transition-colors text-left rounded-[10px] hover:bg-neutral-100 dark:hover:bg-neutral-800/50 cursor-pointer"
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
                    <p className="text-xs text-muted-foreground px-1.5">
                      {globalSearch.trim() ? 'No calendars found' : 'No calendars available'}
                    </p>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={isEventsOpen} onOpenChange={setIsEventsOpen}>
              <CollapsibleTrigger className="cursor-pointer w-full flex items-center justify-between p-1.5 rounded-[10px] hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors">
                <h4 className="text-xs font-medium text-foreground">Events ({filteredEvents.length})</h4>
                <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${isEventsOpen ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-2">
                <div className="space-y-1">
                  {filteredEvents.length > 0 ? filteredEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => handleEventSelect(event)}
                      className="w-full flex items-center gap-2 p-1.5 rounded-[10px] hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors text-left cursor-pointer focus:outline-none"
                    >
                      <div 
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getDotColor(event.color || 'blue')}`}
                      />
                      <span className="text-xs text-foreground truncate">{event.title}</span>
                    </button>
                  )) : (
                    <p className="text-xs text-muted-foreground px-1.5">
                      {globalSearch.trim() ? 'No events found' : 'No events available'}
                    </p>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
