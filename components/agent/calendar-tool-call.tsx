'use client';

import { Check, X, Edit, Clock, Calendar, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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
  const renderToolContent = () => {
    switch (toolName) {
      case 'create_event':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{args.title}</span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(args.startDate).toLocaleString()} - {new Date(args.endDate).toLocaleString()}
                </span>
              </div>
              
              {args.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{args.location}</span>
                </div>
              )}
              
              {args.attendees && args.attendees.length > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{args.attendees.length} attendee{args.attendees.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'find_free_time':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="font-medium">Available Time Slots</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Duration: {args.duration} minutes
            </div>
            {result?.freeSlots && (
              <div className="space-y-1">
                {result.freeSlots.slice(0, 3).map((slot: any, index: number) => (
                  <div key={index} className="text-sm">
                    {new Date(slot.start).toLocaleString()} - {new Date(slot.end).toLocaleString()}
                  </div>
                ))}
                {result.freeSlots.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{result.freeSlots.length - 3} more slots available
                  </div>
                )}
              </div>
            )}
          </div>
        );
        
      case 'get_events':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="font-medium">Calendar Events</span>
            </div>
            {result?.events && (
              <div className="space-y-1">
                {result.events.slice(0, 5).map((event: Event) => (
                  <div key={event.id} className="text-sm">
                    {event.title} - {new Date(event.startDate).toLocaleString()}
                  </div>
                ))}
                {result.events.length > 5 && (
                  <div className="text-xs text-gray-500">
                    +{result.events.length - 5} more events
                  </div>
                )}
              </div>
            )}
          </div>
        );
        
      case 'update_event':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span className="font-medium">Update Event</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Event ID: {args.eventId}
            </div>
            {args.title && (
              <div className="text-sm">New title: {args.title}</div>
            )}
            {args.startDate && (
              <div className="text-sm">New start: {new Date(args.startDate).toLocaleString()}</div>
            )}
          </div>
        );
        
      case 'delete_event':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-red-600" />
              <span className="font-medium">Delete Event</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Event ID: {args.eventId}
            </div>
          </div>
        );
        
      case 'get_calendar_summary':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span className="font-medium">Calendar Summary</span>
            </div>
            {result?.summary && (
              <div className="space-y-1 text-sm">
                <div>Total Events: {result.summary.totalEvents}</div>
                {result.summary.stats && (
                  <div className="text-xs text-gray-500">
                    Upcoming: {result.summary.stats.upcoming} • Past: {result.summary.stats.past} • All-day: {result.summary.stats.allDay}
                  </div>
                )}
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="text-sm">
            <div className="font-medium">{toolName}</div>
            <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
              {JSON.stringify(args, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-md border-2 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            {isPending ? 'Processing...' : 'Calendar Action'}
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            {toolName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderToolContent()}
        
        {!isPending && (onAccept || onDecline || onEdit) && (
          <div className="flex gap-2 pt-2">
            {onAccept && (
              <Button
                onClick={onAccept}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Check className="h-4 w-4 mr-1" />
                Accept
              </Button>
            )}
            {onEdit && (
              <Button
                onClick={onEdit}
                variant="outline"
                size="sm"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            {onDecline && (
              <Button
                onClick={onDecline}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20"
              >
                <X className="h-4 w-4 mr-1" />
                Decline
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 