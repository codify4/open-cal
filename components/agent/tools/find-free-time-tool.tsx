'use client';

import { Clock, AlertCircle, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  const hasError = result?.error;
  const hasSuggestions = result?.suggestions && result.suggestions.length > 0;
  const freeSlots = result?.freeSlots || [];

  return (
    <div>
      <Card className="border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {hasError ? 'Time Slot Search' : 'Available Time Slots'}
          </CardTitle>
          <CardDescription>
            {hasError 
              ? 'Unable to complete the search'
              : `Found ${freeSlots.length} free time period${freeSlots.length !== 1 ? 's' : ''} that meet your minimum duration requirement`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{result.error}</AlertDescription>
            </Alert>
          ) : freeSlots.length === 0 ? (
            <div className="space-y-4">
              <div className="py-8 text-center text-muted-foreground">
                <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No free time periods found that meet the minimum duration requirement</p>
              </div>
              
              {hasSuggestions && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Suggestions</h4>
                      <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                        {result.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {result.totalSlots && (
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <span className="font-medium">Total free time:</span> {Math.round(result.totalFreeTime / 60 * 10) / 10} hours
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {result.totalSlots} periods
                  </Badge>
                </div>
              )}
              
              <div className="space-y-2">
                {freeSlots.map((slot: any, index: number) => {
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
                            : 'Free Time Available'}
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
