'use client';

import { Edit, Check, X, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessageFooter } from '../message-footer';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { getAccessToken } from '@/actions/access-token';
import { useState, useEffect } from 'react';
import { cn, ensureDate } from '@/lib/utils';

interface UpdateEventToolProps {
  args: any;
  result?: any;
  onAccept?: () => void;
  onDecline?: () => void;
  onEdit?: () => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onCopy?: () => void;
  onRate?: (rating: 'thumbs-up' | 'thumbs-down') => void;
}

export function UpdateEventTool({
  args,
  result,
  onAccept,
  onDecline,
  onEdit,
  onRegenerate,
  isRegenerating,
  onCopy,
  onRate,
}: UpdateEventToolProps) {
  const { events, replaceEvent, googleEvents, setGoogleEvents, saveEvent, refreshEvents } = useCalendarStore((state) => state);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<any>(null);
  const [existingEvent, setExistingEvent] = useState<any>(null);

  useEffect(() => {
    const fetchExistingEvent = async () => {
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
                } else if (eventTitle.includes(searchTitle)) {
                  score += 5;
                }
              }
              
              if (args.startDate && googleEvent.start?.dateTime) {
                const eventDate = new Date(googleEvent.start.dateTime);
                const searchDate = new Date(args.startDate);
                const dateMatch = eventDate.toDateString() === searchDate.toDateString();
                if (dateMatch) score += 3;
              }

              if (score > bestScore) {
                bestScore = score;
                bestMatch = googleEvent;
              }
            }

            if (bestMatch && bestScore >= 5) {
              const eventData = {
                id: bestMatch.id,
                title: bestMatch.summary,
                startDate: new Date(bestMatch.start?.dateTime || bestMatch.start?.date),
                endDate: new Date(bestMatch.end?.dateTime || bestMatch.end?.date),
                location: bestMatch.location,
                description: bestMatch.description,
                color: 'blue',
                type: 'event',
                googleEventId: bestMatch.id,
                googleCalendarId: 'primary',
                isAllDay: !bestMatch.start?.dateTime,
                attendees: bestMatch.attendees?.map((a: any) => a.email) || [],
                visibility: bestMatch.visibility || 'public',
              };
              setExistingEvent(eventData);
            }
          }
        }
             } catch (error) {
         // Failed to fetch existing event
       }
    };

    fetchExistingEvent();
  }, [args.title, args.startDate]);

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

  const handleAccept = async () => {
    setIsUpdating(true);
    
    try {
      if (!existingEvent) {
        setUpdateResult({ success: false, error: 'Event not found. Please check the event title and date.' });
        return;
      }

      const updatedEvent = {
        ...existingEvent,
        title: args.newTitle || existingEvent.title,
        description: args.newDescription || existingEvent.description,
        startDate: args.newStartDate ? new Date(args.newStartDate) : existingEvent.startDate,
        endDate: args.newEndDate ? new Date(args.newEndDate) : existingEvent.endDate,
        location: args.newLocation || existingEvent.location,
        attendees: args.newAttendees || existingEvent.attendees,
        color: args.newColor || existingEvent.color,
        isAllDay: args.newIsAllDay !== undefined ? args.newIsAllDay : existingEvent.isAllDay,
        repeat: args.newRepeat || existingEvent.repeat,
        visibility: args.newVisibility || existingEvent.visibility,
      };

      const accessToken = await getAccessToken();
      if (!accessToken) {
        setUpdateResult({ success: false, error: 'Google Calendar not connected' });
        return;
      }

      const googleEventData = {
        summary: updatedEvent.title,
        description: updatedEvent.description,
        location: updatedEvent.location,
        start: {
          dateTime: updatedEvent.startDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: updatedEvent.endDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        attendees: updatedEvent.attendees.map((email: string) => ({ email })),
        visibility: updatedEvent.visibility,
      };

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${existingEvent.googleEventId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(googleEventData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setUpdateResult({ 
          success: false, 
          error: `Failed to update in Google Calendar: ${errorData.error?.message || response.statusText}` 
        });
        return;
      }

      const responseData = await response.json();
      
      const updatedEventWithGoogleData = {
        ...updatedEvent,
        googleEventId: responseData.id || existingEvent.googleEventId,
        etag: responseData.etag,
        id: existingEvent.id || `event-${Date.now()}`,
      };

      saveEvent(updatedEventWithGoogleData);
      await refreshEvents();
      
      setUpdateResult({ 
        success: true, 
        updatedEvent: {
          id: updatedEventWithGoogleData.id,
          title: updatedEventWithGoogleData.title,
          startDate: updatedEventWithGoogleData.startDate.toISOString(),
          endDate: updatedEventWithGoogleData.endDate.toISOString(),
        }
      });
      
      onAccept?.();
    } catch (error) {
      setUpdateResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecline = () => {
    onDecline?.();
  };

  const handleEdit = () => {
    onEdit?.();
  };

  if (updateResult?.success) {
    return (
      <div>
        <div className={cn(
          'group relative rounded-sm border p-2 text-xs transition-all duration-200',
          'bg-green-500/20 border-green-500/30 text-green-700 dark:bg-green-500/40 dark:text-green-100'
        )}>
          <div className="flex items-center gap-2 mb-2">
            <Check className="h-4 w-4" />
            <span className="font-medium">Event Updated Successfully</span>
          </div>
          {updateResult.updatedEvent && (
            <div className="space-y-1 text-xs opacity-80">
              <div><strong>Title:</strong> {updateResult.updatedEvent.title}</div>
              <div><strong>Date:</strong> {new Date(updateResult.updatedEvent.startDate).toLocaleDateString()}</div>
              <div><strong>Time:</strong> {new Date(updateResult.updatedEvent.startDate).toLocaleTimeString()} - {new Date(updateResult.updatedEvent.endDate).toLocaleTimeString()}</div>
            </div>
          )}
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

  if (updateResult?.error) {
    return (
      <div>
        <div className={cn(
          'group relative rounded-sm border p-2 text-xs transition-all duration-200',
          'bg-red-500/20 border-red-500/30 text-red-700 dark:bg-red-500/40 dark:text-red-100'
        )}>
          <div className="flex items-center gap-2 mb-2">
            <X className="h-4 w-4" />
            <span className="font-medium">Update Failed</span>
          </div>
          <p className="text-xs opacity-80">{updateResult.error}</p>
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

  const updates = [];
  if (args.newTitle) updates.push(`Title: ${args.newTitle}`);
  if (args.newDescription) updates.push(`Description: ${args.newDescription}`);
  if (args.newStartDate) updates.push(`Start: ${new Date(args.newStartDate).toLocaleString()}`);
  if (args.newEndDate) updates.push(`End: ${new Date(args.newEndDate).toLocaleString()}`);
  if (args.newLocation) updates.push(`Location: ${args.newLocation}`);
  if (args.newAttendees) updates.push(`Attendees: ${args.newAttendees.length}`);
  if (args.newColor) updates.push(`Color: ${args.newColor}`);
  if (args.newIsAllDay !== undefined) updates.push(`All Day: ${args.newIsAllDay}`);
  if (args.newRepeat) updates.push(`Repeat: ${args.newRepeat}`);
  if (args.newVisibility) updates.push(`Visibility: ${args.newVisibility}`);

  const eventColor = args.newColor || 'blue';
  const displayTitle = args.newTitle || existingEvent?.title || 'Untitled Event';
  
  const displayStartDate = args.newStartDate ? new Date(args.newStartDate) : 
                          existingEvent?.startDate || new Date();
  const displayEndDate = args.newEndDate ? new Date(args.newEndDate) : 
                        existingEvent?.endDate || new Date();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const timeDisplay = `${formatTime(displayStartDate)}–${formatTime(displayEndDate)}`;

  return (
    <div>
      <div className={cn(
        'group relative rounded-sm border p-2 text-xs transition-all duration-200 hover:shadow-md',
        getColorClasses(eventColor)
      )}>
        <div className="flex items-center gap-2 mb-2">
          <Edit className="h-4 w-4" />
          <span className="font-medium">Updated Event</span>
        </div>
        
        <div className="relative z-10 flex flex-row gap-2">
          <div className={cn('w-[2px]', getColorClasses(eventColor))} />
          <div className="flex flex-col items-start justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <Calendar className="h-3 w-3" />
              <h4 className="truncate font-medium">
                {displayTitle}
              </h4>
            </div>
            <div className="mt-1 space-y-1">
              <div className="text-xs opacity-80">
                <Clock className="inline h-3 w-3 mr-1" />
                {timeDisplay}
              </div>
              {args.newLocation && (
                <div className="text-xs opacity-80">
                  <MapPin className="inline h-3 w-3 mr-1" />
                  {args.newLocation}
                </div>
              )}
              {args.newDescription && (
                <div className="text-xs opacity-80">
                  {args.newDescription}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button 
            className="bg-white text-black hover:bg-gray-50 h-7 rounded-[10px]" 
            onClick={handleAccept} 
            size="sm"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
                Updating...
              </>
            ) : (
              <>
                <Check className="mr-1 h-3 w-3" />
                Accept
              </>
            )}
          </Button>
          <Button 
            className="h-7 rounded-[10px] border-blue-200 text-blue-700 bg-transparent hover:bg-blue-50 hover:text-blue-800 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/30" 
            onClick={handleDecline} 
            size="sm" 
            variant="outline"
            disabled={isUpdating}
          >
            <X className="mr-1 h-3 w-3" />
            Decline
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
