'use client';

import { Check, X, Edit, Clock, Calendar, Users, MapPin, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { CalendarEventPreview } from './calendar-event-preview';
import { MessageFooter } from './message-footer';
import type { Event } from '@/lib/store/calendar-store';

interface CalendarToolCallProps {
  toolName: string;
  args: any;
  result?: any;
  onAccept?: () => void;
  onDecline?: () => void;
  onEdit?: () => void;
  isPending?: boolean;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onCopy?: () => void;
  onRate?: (rating: 'thumbs-up' | 'thumbs-down') => void;
}

export function CalendarToolCall({
  toolName,
  args,
  result,
  onAccept,
  onDecline,
  onEdit,
  isPending = false,
  onRegenerate,
  isRegenerating,
  onCopy,
  onRate,
}: CalendarToolCallProps) {
  const { updateActionStatus, removePendingAction } = useCalendarStore((state) => state);

  const handleAccept = () => {
    updateActionStatus('temp-id', 'accepted');
    onAccept?.();
  };

  const handleDecline = () => {
    updateActionStatus('temp-id', 'declined');
    onDecline?.();
  };

  const handleEdit = () => {
    updateActionStatus('temp-id', 'edited');
    onEdit?.();
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-2 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Processing {toolName}...
        </span>
      </div>
    );
  }

  switch (toolName) {
    case 'create_event':
      const eventData = result?.event || (result && typeof result === 'object' && 'id' in result ? result : null);
      
      if (eventData) {
        return (
          <div>
            <CalendarEventPreview
              event={eventData}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onEdit={handleEdit}
            />
            <MessageFooter
              onRegenerate={onRegenerate}
              isRegenerating={isRegenerating}
              onCopy={onCopy}
              onRate={onRate}
            />
          </div>
        );
      }
      return (
        <div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{args.title}</span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>
                  {new Date(args.startDate).toLocaleDateString()} at{' '}
                  {new Date(args.startDate).toLocaleTimeString()}
                </span>
              </div>
              
              {args.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>{args.location}</span>
                </div>
              )}
              
              {args.attendees && args.attendees.length > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3" />
                  <span>{args.attendees.length} attendee(s)</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAccept} className="flex-1">
                <Check className="h-3 w-3 mr-1" />
                Accept
              </Button>
              <Button size="sm" variant="outline" onClick={handleDecline} className="flex-1">
                <X className="h-3 w-3 mr-1" />
                Decline
              </Button>
              <Button size="sm" variant="outline" onClick={handleEdit}>
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <MessageFooter
            onRegenerate={onRegenerate}
            isRegenerating={isRegenerating}
            onCopy={onCopy}
            onRate={onRate}
          />
        </div>
      );

    case 'find_free_time':
      return (
        <div>
          <Card className="bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Available Time Slots
              </CardTitle>
              <CardDescription>
                Found {result?.freeSlots?.length || 0} available time slot{result?.freeSlots?.length !== 1 ? 's' : ''} for your requested duration
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result?.freeSlots?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No available time slots found for the requested duration</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {result?.freeSlots?.map((slot: any, index: number) => {
                    const startDate = new Date(slot.start);
                    const endDate = new Date(slot.end);
                    const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
                    const isAllDay = durationMinutes >= 1440; // 24 hours
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700">
                        <div className="flex-1">
                          <div className="font-medium">
                            {isAllDay ? 'All Day Available' : `${durationMinutes} minutes available`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {startDate.toLocaleDateString()} at{' '}
                            {startDate.toLocaleTimeString(undefined, { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            })}
                            {!isAllDay && (
                              <> - {endDate.toLocaleTimeString(undefined, { 
                                hour: 'numeric', 
                                minute: '2-digit',
                                hour12: true 
                              })}</>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {durationMinutes >= 60 ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m` : `${durationMinutes}m`}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          <MessageFooter
            onRegenerate={onRegenerate}
            isRegenerating={isRegenerating}
            onCopy={onCopy}
            onRate={onRate}
          />
        </div>
      );

    case 'get_events':
      const events = result?.events || [];
      return (
        <div>
          <Card className="bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Calendar Events
              </CardTitle>
              <CardDescription>
                {events.length > 0 
                  ? `${events.length} event${events.length !== 1 ? 's' : ''} found`
                  : 'No events found'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No events found for the specified time period</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {events.map((event: any) => {
                    const startDate = new Date(event.startDate);
                    const endDate = new Date(event.endDate);
                    const isAllDay = event.isAllDay || (endDate.getTime() - startDate.getTime()) >= 24 * 60 * 60 * 1000;
                    const isBirthday = event.title?.toLowerCase().includes('birthday') || event.title?.toLowerCase().includes('birthday');
                    
                    let badgeVariant: "outline" | "default" | "secondary" = 'outline';
                    let badgeClassName = 'ml-2';
                    
                    if (isBirthday) {
                      badgeVariant = 'default';
                      badgeClassName = 'ml-2 bg-pink-500/10 text-pink-500 border-pink-500';
                    } else if (isAllDay) {
                      badgeVariant = 'secondary';
                      badgeClassName = 'ml-2 bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300';
                    } else {
                      badgeVariant = 'outline';
                      badgeClassName = 'ml-2 bg-green-500/10 text-green-500 border-green-500';
                    }
                    
                    return (
                      <div key={event.id} className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-600 rounded-lg shadow-sm dark:shadow-none bg-white dark:bg-neutral-700/50">
                        <div className="flex-1">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(event.startDate).toLocaleDateString()} at{' '}
                            {new Date(event.startDate).toLocaleTimeString(undefined, {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </div>
                          {event.location && (
                            <div className="flex flex-row items-center gap-1 text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3" />
                               {event.location}
                            </div>
                          )}
                        </div>
                        <Badge variant={badgeVariant} className={badgeClassName}>
                          {isBirthday ? 'Birthday' : isAllDay ? 'All Day' : 'Event'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          <MessageFooter
            onRegenerate={onRegenerate}
            isRegenerating={isRegenerating}
            onCopy={onCopy}
            onRate={onRate}
          />
        </div>
      );

    default:
      return (
        <div>
          <Card className="bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                {toolName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Arguments:</span>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1">
                    {JSON.stringify(args, null, 2)}
                  </pre>
                </div>
                {result && (
                  <div>
                    <span className="font-medium">Result:</span>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <MessageFooter
            onRegenerate={onRegenerate}
            isRegenerating={isRegenerating}
            onCopy={onCopy}
            onRate={onRate}
          />
        </div>
      );
  }
} 