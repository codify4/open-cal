'use client';

import { Clock, AlertCircle, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
      <div className="relative overflow-hidden rounded-lg border border-neutral-200/60 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-800/80">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50/50 to-neutral-100/30 dark:from-neutral-700/30 dark:to-neutral-800/30"></div>
        
        <div className="relative mb-2">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {hasError ? 'Time Slot Search' : 'Available Time Slots'}
              </h3>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                {hasError 
                  ? 'Unable to complete the search'
                  : `Found ${freeSlots.length} free time period${freeSlots.length !== 1 ? 's' : ''}`
                }
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          {hasError ? (
            <Alert variant="destructive" className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{result.error}</AlertDescription>
            </Alert>
          ) : freeSlots.length === 0 ? (
            <div className="space-y-3">
              <div className="py-3 text-center text-neutral-500 dark:text-neutral-400">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700">
                  <Clock className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                </div>
                <p className="text-xs">No free time periods found that meet the minimum duration requirement</p>
              </div>
              
              {hasSuggestions && (
                <div className="rounded-lg border border-amber-200/60 bg-amber-50/80 p-3 dark:border-amber-800/60 dark:bg-amber-950/40">
                  <div className="flex items-start gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-amber-100 dark:bg-amber-900/30">
                      <Lightbulb className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-amber-800 dark:text-amber-200 text-sm mb-1">Suggestions</h4>
                      <ul className="space-y-1 text-xs text-amber-700 dark:text-amber-300">
                        {result.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
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
            <div className="space-y-2">
              {freeSlots.map((slot: any, index: number) => {
                const startDate = new Date(slot.start);
                const endDate = new Date(slot.end);
                const durationMinutes = Math.round(
                  (endDate.getTime() - startDate.getTime()) / 60_000
                );
                const isAllDay = durationMinutes >= 1440;

                                 const formatShortDate = (date: Date) => {
                   return date.toLocaleDateString('en-US', {
                     weekday: 'short',
                     day: 'numeric'
                   });
                 };

                 const formatTime = (date: Date) => {
                   return date.toLocaleTimeString('en-US', {
                     hour: 'numeric',
                     minute: '2-digit',
                     hour12: true
                   });
                 };

                 const isSameDay = startDate.toDateString() === endDate.toDateString();
                 const isMultiDay = !isSameDay;

                return (
                  <div
                    className="flex items-center justify-between rounded-lg border border-neutral-200/60 bg-white/60 px-3 py-2 dark:border-neutral-600/60 dark:bg-neutral-700/60"
                    key={index}
                  >
                    <div className="space-y-1">
                      <div className="text-xs text-neutral-700 dark:text-neutral-300">
                        {formatShortDate(startDate)} {formatTime(startDate)}
                      </div>
                      <div className="text-xs text-neutral-700 dark:text-neutral-300">
                        {formatShortDate(endDate)} {formatTime(endDate)}
                      </div>
                    </div>
                    <Badge className="text-xs rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-center w-18">
                      {isAllDay ? 'All Day' : 'Free Time'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <MessageFooter
        isRegenerating={isRegenerating}
        onCopy={onCopy}
        onRate={onRate}
        onRegenerate={onRegenerate}
      />
    </div>
  );
}
