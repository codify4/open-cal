'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle, Calendar, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessageFooter } from '../message-footer';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { deleteGoogleEvent } from '@/lib/calendar-utils/google-calendar';
import { getAccessToken } from '@/actions/access-token';
import { cn } from '@/lib/utils';

interface DeleteEventToolProps {
  args: any;
  result?: any;
  onAccept?: () => void;
  onDecline?: () => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onCopy?: () => void;
  onRate?: (rating: 'thumbs-up' | 'thumbs-down') => void;
}

export function DeleteEventTool({
  args,
  result,
  onAccept,
  onDecline,
  onRegenerate,
  isRegenerating,
  onCopy,
  onRate,
}: DeleteEventToolProps) {
  const { events, deleteEvent, googleEvents, setGoogleEvents } = useCalendarStore((state) => state);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteResult, setDeleteResult] = useState<any>(null);

  const handleAccept = async () => {
    setIsDeleting(true);
    
    try {
      let eventToDelete: any = null;
      
      try {
        const accessToken = await getAccessToken();
        if (accessToken) {
          const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${new Date().toISOString()}&maxResults=100&singleEvents=true&orderBy=startTime`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const googleEventsData = data.items || [];

            let bestMatch: any = null;
            let bestScore = 0;

            for (const googleEvent of googleEventsData) {
              let score = 0;
              
              if (args.title && googleEvent.summary) {
                const searchTitle = args.title.toLowerCase().trim();
                const eventTitle = googleEvent.summary.toLowerCase().trim();
                
                if (eventTitle === searchTitle) {
                  score += 10;
                } else if (eventTitle.startsWith(searchTitle)) {
                  score += 7;
                } else if (eventTitle.endsWith(searchTitle)) {
                  score += 6;
                } else if (eventTitle.includes(searchTitle)) {
                  score += 3;
                } else if (new RegExp(`\\b${searchTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(eventTitle)) {
                  score += 5;
                }
              }
              
              if (args.startDate && googleEvent.start?.dateTime) {
                const eventDate = new Date(googleEvent.start.dateTime);
                const searchDate = new Date(args.startDate);
                const dateMatch = eventDate.toDateString() === searchDate.toDateString();
                if (dateMatch) score += 2;
              }
              
              if (args.location && googleEvent.location) {
                const searchLocation = args.location.toLowerCase().trim();
                const eventLocation = googleEvent.location.toLowerCase().trim();
                
                if (eventLocation === searchLocation) {
                  score += 2;
                } else if (eventLocation.includes(searchLocation)) {
                  score += 1;
                }
              }

              if (score > bestScore) {
                bestScore = score;
                bestMatch = googleEvent;
              }
            }

            if (bestMatch && bestScore >= 5) {
              eventToDelete = {
                id: bestMatch.id,
                title: bestMatch.summary,
                startDate: new Date(bestMatch.start?.dateTime || bestMatch.start?.date),
                endDate: new Date(bestMatch.end?.dateTime || bestMatch.end?.date),
                location: bestMatch.location,
                googleEventId: bestMatch.id,
                googleCalendarId: 'primary',
                isAllDay: !bestMatch.start?.dateTime,
              };
            }
          }
        }
      } catch (error) {
        // Failed to fetch from Google Calendar
      }

      if (!eventToDelete) {
        setDeleteResult({ success: false, error: 'Event not found in Google Calendar. Please check the event title and date.' });
        return;
      }

      const googleDeleteResult = await deleteGoogleEvent(
        eventToDelete.googleEventId,
        eventToDelete.googleCalendarId
      );
      
      if (googleDeleteResult?.error === 'not_found') {
        // Event doesn't exist in Google Calendar, but that's okay
      } else if (googleDeleteResult?.error) {
        setDeleteResult({ 
          success: false, 
          error: `Failed to delete from Google Calendar: ${googleDeleteResult.error}` 
        });
        return;
      }

      const localEvent = events.find((e: any) => e.googleEventId === eventToDelete.googleEventId);
      if (localEvent) {
        deleteEvent(localEvent.id);
      }
      
      if (googleEvents.find((e: any) => e.googleEventId === eventToDelete.googleEventId)) {
        setGoogleEvents(googleEvents.filter((e: any) => e.googleEventId !== eventToDelete.googleEventId));
      }
      
      setDeleteResult({ 
        success: true, 
        deletedEvent: {
          id: eventToDelete.id,
          title: eventToDelete.title,
          startDate: eventToDelete.startDate.toISOString(),
          endDate: eventToDelete.endDate.toISOString(),
        }
      });
      
      onAccept?.();
    } catch (error) {
      setDeleteResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDecline = () => {
    onDecline?.();
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500/20 border-blue-500/30 text-blue-700 dark:bg-blue-500/40 dark:text-blue-100',
      green: 'bg-green-500/20 border-green-500/30 text-green-700 dark:bg-green-500/40 dark:text-green-100',
      purple: 'bg-purple-500/20 border-purple-500/30 text-purple-700 dark:bg-purple-500/40 dark:text-purple-100',
      orange: 'bg-orange-500/20 border-orange-500/30 text-orange-700 dark:bg-orange-500/40 dark:text-orange-100',
      red: 'bg-red-500/20 border-red-500/30 text-red-700 dark:bg-red-500/40 dark:text-red-100',
      pink: 'bg-pink-500/20 border-pink-500/30 text-pink-700 dark:bg-pink-500/40 dark:text-pink-100',
      yellow: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-700 dark:bg-yellow-500/40 dark:text-yellow-100',
      gray: 'bg-gray-500/20 border-gray-500/30 text-gray-700 dark:bg-gray-500/40 dark:text-gray-100',
    };
    return colorMap[color] || colorMap.blue;
  };

  const getColorAccent = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500/30',
      green: 'bg-green-500/30',
      purple: 'bg-purple-500/30',
      orange: 'bg-orange-500/30',
      red: 'bg-red-500/30',
      pink: 'bg-pink-500/30',
      yellow: 'bg-yellow-500/30',
      gray: 'bg-gray-500/30',
    };
    return colorMap[color] || colorMap.blue;
  };

  if (deleteResult?.success) {
    return (
      <div className="space-y-2">
        <div className="rounded-sm border border-green-200 bg-green-50 p-2 text-xs text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200">
          <div className="flex flex-row gap-2">
            <div className="w-[2px] bg-green-500/30" />
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex min-w-0 flex-1 items-center gap-1">
                <Check className="h-3 w-3 text-green-600" />
                <h4 className="truncate font-medium">Event Deleted Successfully</h4>
              </div>
              {deleteResult.deletedEvent && (
                <div className="mt-2 space-y-1 text-xs opacity-80">
                  <p><strong>Title:</strong> {deleteResult.deletedEvent.title}</p>
                  <p><strong>Date:</strong> {new Date(deleteResult.deletedEvent.startDate).toLocaleDateString()}</p>
                  <p>
                    <strong>Time:</strong>{' '}
                    {new Date(deleteResult.deletedEvent.startDate).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}{' '}
                    -{' '}
                    {new Date(deleteResult.deletedEvent.endDate).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </div>
              )}
            </div>
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

  if (deleteResult?.error) {
    return (
      <div className="space-y-2">
        <div className="rounded-sm border border-red-200 bg-red-50 p-2 text-xs text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200">
          <div className="flex flex-row gap-2">
            <div className="w-[2px] bg-red-500/30" />
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex min-w-0 flex-1 items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-red-600" />
                <h4 className="truncate font-medium">Delete Failed</h4>
              </div>
              <p className="mt-1 text-xs opacity-80">
                {deleteResult.error}
              </p>
            </div>
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

  return (
    <div className="space-y-2">
      <div className={cn(
        'group relative rounded-sm border p-2 text-xs transition-all duration-200 hover:shadow-md',
        getColorClasses(args.color || 'blue')
      )}>
        <div className="flex flex-row gap-2">
          <div className={cn('w-[2px]', getColorAccent(args.color || 'blue'))} />
          <div className="flex flex-col items-start justify-between w-full">
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <Calendar className="h-3 w-3" />
              <h4 className="truncate font-medium">
                {args.title || 'Untitled Event'}
              </h4>
            </div>
            
            <div className="mt-1 space-y-1 text-xs opacity-80">
              {args.startDate && (
                <p>Date: {new Date(args.startDate).toLocaleDateString()}</p>
              )}
              {args.location && (
                <p>Location: {args.location}</p>
              )}
              {args.eventId && (
                <p>Event ID: {args.eventId}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-2 flex justify-end gap-2 pt-3">
          <Button
            className="bg-red-600 text-white hover:bg-red-700 h-7 rounded-[10px]"
            onClick={handleAccept}
            size="sm"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </Button>
          <Button
            className="h-7 rounded-[10px] border-blue-200 text-blue-700 bg-transparent hover:bg-blue-50 hover:text-blue-800 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/30"
            onClick={handleDecline}
            size="sm"
            variant="outline"
            disabled={isDeleting}
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>
      
      <div className="rounded-md bg-orange-50 border border-orange-200 p-2 text-xs text-orange-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-3 w-3 text-red-600" />
          <span className="font-medium">This action cannot be undone</span>
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
