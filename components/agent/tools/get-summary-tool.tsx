'use client';

import { useState } from 'react';
import { Calendar, MapPin, ChevronDown, ChevronRight, Clock, Users, CalendarDaysIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { MessageFooter } from '../message-footer';

interface GetSummaryToolProps {
  args: any;
  result?: any;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onCopy?: () => void;
  onRate?: (rating: 'thumbs-up' | 'thumbs-down') => void;
}

export function GetSummaryTool({
  result,
  onRegenerate,
  isRegenerating,
  onCopy,
  onRate,
}: GetSummaryToolProps) {
  const events = result?.events || [];
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const toggleEvent = (eventId: string) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getEventBadge = (event: any) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const isAllDay = event.isAllDay || (endDate.getTime() - startDate.getTime() >= 24 * 60 * 60 * 1000);
    const isBirthday = event.title?.toLowerCase().includes('birthday');

    if (isBirthday) return { variant: 'default' as const, className: 'bg-pink-500/10 text-pink-500 border-pink-500', text: 'Birthday' };
    if (isAllDay) return { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300', text: 'All Day' };
    return { variant: 'outline' as const, className: 'bg-green-500/10 text-green-500 border-green-500', text: 'Event' };
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-lg border border-neutral-200/60 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-800/80">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50/50 to-neutral-100/30 dark:from-neutral-700/30 dark:to-neutral-800/30"></div>
        
        <div className="relative mb-2">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Calendar Summary</h3>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              {result?.dateRange 
                ? `${events.length > 0 ? `${events.length} events` : 'No events'} from ${formatDate(result.dateRange.startDate)} to ${formatDate(result.dateRange.endDate)}`
                : 'Calendar overview and events'
              }
            </div>
          </div>
        </div>
        
        {events.length === 0 ? (
          <div className="relative py-3 text-center">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700">
              <Calendar className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">No events found for the specified time period</p>
          </div>
        ) : (
          <div className="relative space-y-1">
            {events.map((event: any) => {
              const badge = getEventBadge(event);
              const isExpanded = expandedEvents.has(event.id);

              return (
                <Collapsible key={event.id} open={isExpanded} onOpenChange={() => toggleEvent(event.id)}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="group relative h-auto w-full justify-between rounded-t-md rounded-b-none data-[state=closed]:rounded-b-md border border-neutral-200/60 bg-white/60 p-2 hover:bg-neutral-50 hover:border-neutral-300/60 transition-all duration-200 dark:border-neutral-600/60 dark:bg-neutral-700/40 dark:hover:bg-neutral-600/60 dark:hover:border-neutral-500/60 border-b-0"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-neutral-100 group-hover:bg-neutral-200 transition-colors dark:bg-neutral-600 dark:group-hover:bg-neutral-500">
                          {isExpanded ? <ChevronDown className="h-3 w-3 text-neutral-600 dark:text-neutral-300" /> : <ChevronRight className="h-3 w-3 text-neutral-600 dark:text-neutral-300" />}
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                          <div className="font-medium truncate text-neutral-900 dark:text-neutral-100 text-sm">{event.title}</div>
                        </div>
                      </div>
                      <Badge className={`${badge.className} shadow-sm text-xs`} variant={badge.variant}>
                        {badge.text}
                      </Badge>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-0 space-y-2 rounded-b-md border border-neutral-200/60 bg-neutral-50/80 p-3 backdrop-blur-sm dark:border-neutral-600/60 dark:bg-neutral-700/40 border-t-0">
                      {event.description && (
                        <div className="pb-2 border-b border-neutral-200/40 dark:border-neutral-600/40">
                          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">{event.description}</p>
                        </div>
                      )}
                      <div className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
                            <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-medium">{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-green-100 dark:bg-green-900/30">
                            <MapPin className="h-3 w-3 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="font-medium">{event.location || 'No location'}</span>
                        </div>
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-100 dark:bg-purple-900/30">
                              <Users className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="font-medium">{event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-orange-100 dark:bg-orange-900/30">
                            <CalendarDaysIcon className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                          </div>
                          <span className="font-medium">{formatDate(event.startDate)}</span>
                        </div>
                        {event.calendar && (
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-100 dark:bg-indigo-900/30">
                              <Calendar className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="font-medium">{event.calendar.summary || event.calendar.name || event.calendar}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        )}
      </div>
      <MessageFooter
        isRegenerating={isRegenerating}
        onCopy={onCopy}
        onRate={onRate}
        onRegenerate={onRegenerate}
      />
    </div>
  );
}
