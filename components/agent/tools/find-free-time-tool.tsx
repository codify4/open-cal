'use client';

import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageFooter } from '../message-footer';

interface FindFreeTimeToolProps {
  args: any;
  result?: any;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onCopy?: () => void;
  onRate?: (rating: 'thumbs-up' | 'thumbs-down') => void;
}

export function FindFreeTimeTool({
  result,
  onRegenerate,
  isRegenerating,
  onCopy,
  onRate,
}: FindFreeTimeToolProps) {
  return (
    <div>
      <Card className="border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Available Time Slots
          </CardTitle>
          <CardDescription>
            Found {result?.freeSlots?.length || 0} available time slot
            {result?.freeSlots?.length !== 1 ? 's' : ''} for your requested duration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result?.freeSlots?.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p>No available time slots found for the requested duration</p>
            </div>
          ) : (
            <div className="space-y-2">
              {result?.freeSlots?.map((slot: any, index: number) => {
                const startDate = new Date(slot.start);
                const endDate = new Date(slot.end);
                const durationMinutes = Math.round(
                  (endDate.getTime() - startDate.getTime()) / 60_000
                );
                const isAllDay = durationMinutes >= 1440;

                return (
                  <div
                    className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-600 dark:bg-neutral-700"
                    key={index}
                  >
                    <div className="flex-1">
                      <div className="font-medium">
                        {isAllDay
                          ? 'All Day Available'
                          : `${durationMinutes} minutes available`}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {startDate.toLocaleDateString()} at{' '}
                        {startDate.toLocaleTimeString(undefined, {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                        {!isAllDay && (
                          <>
                            {' '}
                            -{' '}
                            {endDate.toLocaleTimeString(undefined, {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </>
                        )}
                      </div>
                    </div>
                    <Badge className="ml-2" variant="outline">
                      {durationMinutes >= 60
                        ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
                        : `${durationMinutes}m`}
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
