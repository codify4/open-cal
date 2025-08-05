'use client';

import { Check, X, Edit, Clock, Calendar, Users, MapPin, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { CalendarEventPreview } from './calendar-event-preview';
import type { Event } from '@/lib/store/calendar-store';

interface CalendarToolCallProps {
  toolName: string;
  args: any;
  result?: any;
  onAccept?: () => void;
  onDecline?: () => void;
  onEdit?: () => void;
  isPending?: boolean;
}

export function CalendarToolCall({
  toolName,
  args,
  result,
  onAccept,
  onDecline,
  onEdit,
  isPending = false,
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
          <CalendarEventPreview
            event={eventData}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onEdit={handleEdit}
          />
        );
      }
      return (
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
      );

    case 'find_free_time':
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
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
              <div className="space-y-3">
                {result?.freeSlots?.map((slot: any, index: number) => {
                  const startDate = new Date(slot.start);
                  const endDate = new Date(slot.end);
                  const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
                  const isSameDay = startDate.toDateString() === endDate.toDateString();
                  const isAllDay = durationMinutes >= 1440; // 24 hours
                  
                  return (
                    <div key={index} className="border rounded-lg p-4 bg-muted/30">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="font-medium">
                            {isAllDay ? 'All Day' : `${durationMinutes} minutes available`}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {durationMinutes >= 60 ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m` : `${durationMinutes}m`}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">
                            {startDate.toLocaleDateString(undefined, { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        
                        {!isAllDay && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {startDate.toLocaleTimeString(undefined, { 
                                hour: 'numeric', 
                                minute: '2-digit',
                                hour12: true 
                              })} - {endDate.toLocaleTimeString(undefined, { 
                                hour: 'numeric', 
                                minute: '2-digit',
                                hour12: true 
                              })}
                            </span>
                          </div>
                        )}
                        
                        {isAllDay && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Available all day</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      );

    case 'get_events':
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result?.events?.map((event: any) => (
                <div key={event.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(event.startDate).toLocaleDateString()} {new Date(event.startDate).toLocaleTimeString()}
                    </div>
                  </div>
                  <Badge variant="outline">{event.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );

    default:
      return (
        <Card>
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
      );
  }
} 