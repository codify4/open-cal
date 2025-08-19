'use client';

import { Calendar, BarChart3, TrendingUp, Clock, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageFooter } from '../message-footer';

interface GetCalendarSummaryToolProps {
  args: any;
  result?: any;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onCopy?: () => void;
  onRate?: (rating: 'thumbs-up' | 'thumbs-down') => void;
}

export function GetCalendarSummaryTool({
  result,
  onRegenerate,
  isRegenerating,
  onCopy,
  onRate,
}: GetCalendarSummaryToolProps) {
  const summary = result?.summary;
  const events = summary?.events || [];
  const stats = summary?.stats;

  return (
    <div>
      <Card className="border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Calendar Summary
          </CardTitle>
          <CardDescription>
            {result?.dateRange ? (
              <>
                Summary from {new Date(result.dateRange.startDate).toLocaleDateString()} to{' '}
                {new Date(result.dateRange.endDate).toLocaleDateString()}
              </>
            ) : (
              'Calendar overview and statistics'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats && (
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
                  <TrendingUp className="mb-1 h-5 w-5 text-blue-600" />
                  <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                    {stats.upcoming}
                  </span>
                  <span className="text-xs text-blue-600 dark:text-blue-400">Upcoming</span>
                </div>
                <div className="flex flex-col items-center rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                  <Clock className="mb-1 h-5 w-5 text-green-600" />
                  <span className="text-lg font-bold text-green-700 dark:text-green-300">
                    {stats.allDay}
                  </span>
                  <span className="text-xs text-green-600 dark:text-green-400">All Day</span>
                </div>
                <div className="flex flex-col items-center rounded-lg bg-gray-50 p-3 dark:bg-gray-950/20">
                  <CalendarDays className="mb-1 h-5 w-5 text-gray-600" />
                  <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
                    {stats.past}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Past</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Events: {summary?.totalEvents || 0}</span>
                <Badge variant="outline">
                  {events.length} found
                </Badge>
              </div>

              {events.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">
                  <Calendar className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>No events found for the specified time period</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {events.slice(0, 5).map((event: any) => (
                    <div
                      className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-2 text-sm dark:border-neutral-600 dark:bg-neutral-700"
                      key={event.id}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-muted-foreground text-xs">
                          {new Date(event.startDate).toLocaleDateString()} at{' '}
                          {new Date(event.startDate).toLocaleTimeString(undefined, {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </div>
                      </div>
                      {event.location && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {event.location}
                        </Badge>
                      )}
                    </div>
                  ))}
                  {events.length > 5 && (
                    <div className="text-center text-muted-foreground text-xs">
                      ... and {events.length - 5} more events
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
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
