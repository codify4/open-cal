'use client';

import { useState } from 'react';
import { Calendar, MapPin, ChevronDown, ChevronRight, Clock, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const formatTime = (date: string | Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: string | Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  const getEventBadge = (event: any) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const isAllDay = event.isAllDay || (endDate.getTime() - startDate.getTime() >= 24 * 60 * 60 * 1000);
    const isBirthday = event.title?.toLowerCase().includes('birthday');

    if (isBirthday) {
      return { variant: 'default' as const, className: 'bg-pink-500/10 text-pink-500 border-pink-500', text: 'Birthday' };
    } else if (isAllDay) {
      return { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300', text: 'All Day' };
    } else {
      return { variant: 'outline' as const, className: 'bg-green-500/10 text-green-500 border-green-500', text: 'Event' };
    }
  };

  return (
    <div>
      <Card className="border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar Summary
          </CardTitle>
          <CardDescription>
            {result?.dateRange ? (
              <>
                {events.length > 0
                  ? `${events.length} event${events.length !== 1 ? 's' : ''} found`
                  : 'No events found'} from {formatDate(result.dateRange.startDate)} to {formatDate(result.dateRange.endDate)}
              </>
            ) : (
              'Calendar overview and events'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Calendar className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p>No events found for the specified time period</p>
            </div>
          ) : (
            <div className="space-y-2">
              {events.map((event: any) => {
                const badge = getEventBadge(event);
                const isExpanded = expandedEvents.has(event.id);

                return (
                  <Collapsible key={event.id} open={isExpanded} onOpenChange={() => toggleEvent(event.id)}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-auto w-full justify-between p-3 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      >
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <div className="flex-1 text-left">
                            <div className="font-medium">{event.title}</div>
                            <div className="text-muted-foreground text-sm">
                              {formatDate(event.startDate)} at {formatTime(event.startDate)}
                            </div>
                          </div>
                        </div>
                        <Badge className={badge.className} variant={badge.variant}>
                          {badge.text}
                        </Badge>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-6 mt-2 space-y-2 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-600 dark:bg-neutral-700/50">
                        {event.description && (
                          <div className="text-sm text-muted-foreground">
                            {event.description}
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(event.startDate)} - {formatTime(event.endDate)}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                          )}
                          {event.attendees && event.attendees.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
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
        </CardContent>
      </Card>
      <MessageFooter
        isRegenerating={isRegenerating}
        onCopy={onCopy}
        onRate={onRate}
        onRegenerate={onRegenerate}
      />
    </div>
  );
}
