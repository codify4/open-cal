'use client';

import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Event } from '@/lib/store/calendar-store';

interface CalendarEventPreviewProps {
  event: Event;
  onAccept: () => void;
  onDecline: () => void;
  onEdit: () => void;
}

export function CalendarEventPreview({
  event,
  onAccept,
  onDecline,
  onEdit,
}: CalendarEventPreviewProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="w-full max-w-md border-2 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            Event Preview
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            {event.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-400" />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100">{event.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(event.startDate)} • {formatTime(event.startDate)} - {formatTime(event.endDate)}
              </p>
            </div>
          </div>

          {event.description && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {event.description}
            </div>
          )}

          {event.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}

          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span>{event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className={cn(
              'h-3 w-3 rounded-full',
              {
                'bg-blue-500': event.color === 'blue',
                'bg-green-500': event.color === 'green',
                'bg-red-500': event.color === 'red',
                'bg-yellow-500': event.color === 'yellow',
                'bg-purple-500': event.color === 'purple',
                'bg-orange-500': event.color === 'orange',
                'bg-pink-500': event.color === 'pink',
                'bg-gray-500': event.color === 'gray',
              }
            )} />
            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{event.color}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={onAccept}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            Accept
          </Button>
          <Button
            onClick={onEdit}
            variant="outline"
            size="sm"
          >
            Edit
          </Button>
          <Button
            onClick={onDecline}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20"
          >
            Decline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 