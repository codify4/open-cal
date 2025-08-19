'use client';

import { Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MessageFooter } from '../message-footer';

interface GetEventsToolProps {
  args: any;
  result?: any;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onCopy?: () => void;
  onRate?: (rating: 'thumbs-up' | 'thumbs-down') => void;
}

export function GetEventsTool({
  result,
  onRegenerate,
  isRegenerating,
  onCopy,
  onRate,
}: GetEventsToolProps) {
  const events = result?.events || [];

  return (
    <div>
      <Card className="border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Calendar Events
          </CardTitle>
          <CardDescription>
            {events.length > 0
              ? `${events.length} event${events.length !== 1 ? 's' : ''} found`
              : 'No events found'}
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
                const startDate = new Date(event.startDate);
                const endDate = new Date(event.endDate);
                const isAllDay =
                  event.isAllDay ||
                  endDate.getTime() - startDate.getTime() >=
                    24 * 60 * 60 * 1000;
                const isBirthday =
                  event.title?.toLowerCase().includes('birthday') ||
                  event.title?.toLowerCase().includes('birthday');

                let badgeVariant: 'outline' | 'default' | 'secondary' =
                  'outline';
                let badgeClassName = 'ml-2';

                if (isBirthday) {
                  badgeVariant = 'default';
                  badgeClassName =
                    'ml-2 bg-pink-500/10 text-pink-500 border-pink-500';
                } else if (isAllDay) {
                  badgeVariant = 'secondary';
                  badgeClassName =
                    'ml-2 bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300';
                } else {
                  badgeVariant = 'outline';
                  badgeClassName =
                    'ml-2 bg-green-500/10 text-green-500 border-green-500';
                }

                return (
                  <div
                    className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-600 dark:bg-neutral-700/50 dark:shadow-none"
                    key={event.id}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-muted-foreground text-sm">
                        {new Date(event.startDate).toLocaleDateString()} at{' '}
                        {new Date(event.startDate).toLocaleTimeString(
                          undefined,
                          {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          }
                        )}
                      </div>
                      {event.location && (
                        <div className="mt-1 flex flex-row items-center gap-1 text-muted-foreground text-xs">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      )}
                    </div>
                    <Badge className={badgeClassName} variant={badgeVariant}>
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
        isRegenerating={isRegenerating}
        onCopy={onCopy}
        onRate={onRate}
        onRegenerate={onRegenerate}
      />
    </div>
  );
}
