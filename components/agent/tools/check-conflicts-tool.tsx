'use client';

import { AlertTriangle, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageFooter } from '@/components/agent/message-footer';

interface CheckConflictsToolProps {
  args: any;
  result?: any;
  isRegenerating?: boolean;
  onCopy?: () => void;
  onRate?: (rating: 'thumbs-up' | 'thumbs-down') => void;
  onRegenerate?: () => void;
}

export function CheckConflictsTool({
  args,
  result,
  isRegenerating,
  onCopy,
  onRate,
  onRegenerate,
}: CheckConflictsToolProps) {
  if (!result) return null;

  const { hasConflicts, events, message } = result;

  if (!hasConflicts) {
    return null; // Don't show anything when no conflicts
  }

  const startDate = new Date(args.startDate);
  const endDate = new Date(args.endDate);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <CardTitle className="text-lg">Scheduling Conflict Detected</CardTitle>
        </div>
        <CardDescription>
          Found {events?.length || 0} conflicting event(s) for{' '}
          {startDate.toLocaleDateString()} at{' '}
          {startDate.toLocaleTimeString()} - {endDate.toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {events?.map((event: any, index: number) => (
            <div
              key={event.id || index}
              className="flex items-start gap-3 rounded-lg border bg-muted/50 p-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{event.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    Conflict
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(event.startDate).toLocaleTimeString()} - {new Date(event.endDate).toLocaleTimeString()}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-orange-50 p-3 text-sm text-orange-800 dark:bg-orange-950 dark:text-orange-200">
          <p className="font-medium">What would you like to do?</p>
          <p className="mt-1">
            You can either schedule the event anyway, find a different time, or modify the existing event.
          </p>
        </div>

        <MessageFooter
          isRegenerating={isRegenerating}
          onCopy={onCopy}
          onRate={onRate}
          onRegenerate={onRegenerate}
        />
      </CardContent>
    </Card>
  );
}
