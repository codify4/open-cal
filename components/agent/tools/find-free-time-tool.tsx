'use client';

import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
} 