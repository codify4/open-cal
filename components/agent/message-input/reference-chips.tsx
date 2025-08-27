'use client';

import { AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/providers/chat-store-provider';
import { getEventReferenceChipColor } from '@/lib/calendar-utils/calendar-color-utils';

export function ReferenceChips() {
  const eventReferences = useChatStore((state) => state.eventReferences);
  const calendarReferences = useChatStore((state) => state.calendarReferences);
  const removeEventReference = useChatStore((state) => state.removeEventReference);
  const removeCalendarReference = useChatStore((state) => state.removeCalendarReference);

  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
      <EventReferencesInline 
        eventReferences={eventReferences}
        onRemove={removeEventReference}
      />
      <CalendarReferencesInline 
        calendarReferences={calendarReferences}
        onRemove={removeCalendarReference}
      />
    </div>
  );
}

function EventReferencesInline({ 
  eventReferences, 
  onRemove 
}: { 
  eventReferences: any[];
  onRemove: (id: string) => void;
}) {
  if (eventReferences.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-1">
      <AnimatePresence mode="popLayout">
        {eventReferences.map((event, index) => (
          <div
            key={`event-${event.id}-${index}`}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getEventReferenceChipColor(event.color || 'blue')}`}
          >
            <span className="truncate font-medium" title={event.title}>
              {event.title}
            </span>
            <button
              onClick={() => onRemove(event.id)}
              className="ml-1 h-4 w-4 rounded-full flex items-center justify-center transition-colors"
              aria-label={`Remove ${event.title} reference`}
            >
              <span className="text-xs">×</span>
            </button>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function CalendarReferencesInline({ 
  calendarReferences, 
  onRemove 
}: { 
  calendarReferences: any[];
  onRemove: (id: string) => void;
}) {
  if (calendarReferences.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-1">
      <AnimatePresence mode="popLayout">
        {calendarReferences.map((calendar, index) => (
          <div
            key={`calendar-${calendar.id}-${index}`}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0`}
              style={{ backgroundColor: calendar.color || '#3b82f6' }}
            />
            <span className="truncate font-medium" title={calendar.name}>
              {calendar.name}
            </span>
            <button
              onClick={() => onRemove(calendar.id)}
              className="ml-1 h-4 w-4 rounded-full flex items-center justify-center transition-colors hover:bg-neutral-700"
              aria-label={`Remove ${calendar.name} reference`}
            >
              <span className="text-xs">×</span>
            </button>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
