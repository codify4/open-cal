'use client';

import { Trash2, AlertTriangle, Calendar, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageFooter } from '../message-footer';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { deleteGoogleEvent } from '@/lib/calendar-utils/google-calendar';
import { getAccessToken } from '@/actions/access-token';
import { useState } from 'react';

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

  if (deleteResult?.success) {
    return (
      <div>
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Check className="h-4 w-4" />
              Event Deleted
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">
              The event has been successfully deleted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600 dark:text-green-400">
              {deleteResult.deletedEvent && (
                <div className="space-y-1">
                  <div><strong>Title:</strong> {deleteResult.deletedEvent.title}</div>
                  <div><strong>Date:</strong> {new Date(deleteResult.deletedEvent.startDate).toLocaleDateString()}</div>
                  <div><strong>Time:</strong> {new Date(deleteResult.deletedEvent.startDate).toLocaleTimeString()} - {new Date(deleteResult.deletedEvent.endDate).toLocaleTimeString()}</div>
                </div>
              )}
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

  if (deleteResult?.error) {
    return (
      <div>
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertTriangle className="h-4 w-4" />
              Delete Failed
            </CardTitle>
            <CardDescription className="text-red-600 dark:text-red-400">
              {deleteResult.error}
            </CardDescription>
          </CardHeader>
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

  return (
    <div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Trash2 className="h-4 w-4 text-red-600" />
          <span className="font-medium text-red-700 dark:text-red-300">Delete Event</span>
        </div>

        <div className="space-y-2 text-gray-600 text-sm dark:text-gray-400">
          {args.title && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span><strong>Title:</strong> {args.title}</span>
            </div>
          )}
          {args.startDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span><strong>Date:</strong> {new Date(args.startDate).toLocaleDateString()}</span>
            </div>
          )}
          {args.location && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span><strong>Location:</strong> {args.location}</span>
            </div>
          )}
          {args.eventId && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span><strong>Event ID:</strong> {args.eventId}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-red-600 hover:bg-red-700" 
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
                <Trash2 className="mr-1 h-3 w-3" />
                Delete
              </>
            )}
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleDecline} 
            size="sm" 
            variant="outline"
            disabled={isDeleting}
          >
            <X className="mr-1 h-3 w-3" />
            Cancel
          </Button>
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
