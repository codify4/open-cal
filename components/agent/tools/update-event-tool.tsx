'use client';

import { Edit, Check, X, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageFooter } from '../message-footer';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { updateGoogleEvent } from '@/lib/calendar-utils/google-calendar';
import { getAccessToken } from '@/actions/access-token';
import { useState } from 'react';

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
  const { events, replaceEvent, googleEvents, setGoogleEvents } = useCalendarStore((state) => state);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<any>(null);

  const handleAccept = async () => {
    setIsUpdating(true);
    
    try {
      let eventToUpdate: any = null;
      
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
              eventToUpdate = {
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
            }
          }
        }
      } catch (error) {
        // Failed to fetch from Google Calendar
      }

      if (!eventToUpdate) {
        setUpdateResult({ success: false, error: 'Event not found in Google Calendar. Please check the event title and date.' });
        return;
      }

      if (args.startDate || args.endDate) {
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
              const allGoogleEvents = data.items || [];
              
              const newStartDate = args.startDate ? new Date(args.startDate) : eventToUpdate.startDate;
              const newEndDate = args.endDate ? new Date(args.endDate) : eventToUpdate.endDate;
              
              const conflictingEvents = allGoogleEvents.filter((event: any) => {
                if (event.id === eventToUpdate.googleEventId) return false;
                
                const eventStart = new Date(event.start?.dateTime || event.start?.date);
                const eventEnd = new Date(event.end?.dateTime || event.end?.date);
                
                return (
                  (newStartDate < eventEnd && newEndDate > eventStart) ||
                  (eventStart < newEndDate && eventEnd > newStartDate)
                );
              });

              if (conflictingEvents.length > 0) {
                const conflictDetails = conflictingEvents.map((event: any) => ({
                  title: event.summary,
                  startTime: new Date(event.start?.dateTime || event.start?.date).toLocaleTimeString(),
                  endTime: new Date(event.end?.dateTime || event.end?.date).toLocaleTimeString(),
                }));

                setUpdateResult({ 
                  success: false, 
                  hasConflicts: true, 
                  conflictingEvents: conflictDetails,
                  error: 'Scheduling conflicts detected'
                });
                return;
              }
            }
          }
        } catch (error) {
          // Failed to check conflicts
        }
      }

      const updatedEvent = {
        ...eventToUpdate,
        title: args.title || eventToUpdate.title,
        description: args.description || eventToUpdate.description,
        startDate: args.startDate ? new Date(args.startDate) : eventToUpdate.startDate,
        endDate: args.endDate ? new Date(args.endDate) : eventToUpdate.endDate,
        location: args.location || eventToUpdate.location,
        attendees: args.attendees || eventToUpdate.attendees,
        color: args.color || eventToUpdate.color,
        isAllDay: args.isAllDay !== undefined ? args.isAllDay : eventToUpdate.isAllDay,
        repeat: args.repeat || eventToUpdate.repeat,
        visibility: args.visibility || eventToUpdate.visibility,
      };

      const googleUpdateResult = await updateGoogleEvent(
        updatedEvent,
        'user-id',
        'user-email'
      );
      
      if (googleUpdateResult?.error) {
        setUpdateResult({ 
          success: false, 
          error: `Failed to update in Google Calendar: ${googleUpdateResult.error}` 
        });
        return;
      }

      const localEvent = events.find((e: any) => e.googleEventId === eventToUpdate.googleEventId);
      if (localEvent) {
        replaceEvent(updatedEvent);
      }
      
      const googleEventIndex = googleEvents.findIndex((e: any) => e.googleEventId === eventToUpdate.googleEventId);
      if (googleEventIndex !== -1) {
        const updatedGoogleEvents = [...googleEvents];
        updatedGoogleEvents[googleEventIndex] = updatedEvent;
        setGoogleEvents(updatedGoogleEvents);
      }
      
      setUpdateResult({ 
        success: true, 
        updatedEvent: {
          id: updatedEvent.id,
          title: updatedEvent.title,
          startDate: updatedEvent.startDate.toISOString(),
          endDate: updatedEvent.endDate.toISOString(),
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
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Check className="h-4 w-4" />
              Event Updated
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">
              The event has been successfully updated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600 dark:text-green-400">
              {updateResult.updatedEvent && (
                <div className="space-y-1">
                  <div><strong>Title:</strong> {updateResult.updatedEvent.title}</div>
                  <div><strong>Date:</strong> {new Date(updateResult.updatedEvent.startDate).toLocaleDateString()}</div>
                  <div><strong>Time:</strong> {new Date(updateResult.updatedEvent.startDate).toLocaleTimeString()} - {new Date(updateResult.updatedEvent.endDate).toLocaleTimeString()}</div>
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

  if (updateResult?.error) {
    return (
      <div>
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <X className="h-4 w-4" />
              Update Failed
            </CardTitle>
            <CardDescription className="text-red-600 dark:text-red-400">
              {updateResult.error}
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

  if (updateResult?.hasConflicts) {
    return (
      <div>
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <X className="h-4 w-4" />
              Scheduling Conflict Detected
            </CardTitle>
            <CardDescription className="text-red-600 dark:text-red-400">
              The following events conflict with your requested time:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {updateResult.conflictingEvents?.map((conflict: any, index: number) => (
                <div key={index} className="text-sm text-red-700 dark:text-red-400">
                  • <span className="font-medium">{conflict.title}</span> at {conflict.startTime} - {conflict.endTime}
                </div>
              ))}
              
              <div className="text-sm text-gray-600 dark:text-gray-400 pt-2">
                <p>Do you want to update this event anyway?</p>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleAccept} size="sm">
                  <Check className="mr-1 h-3 w-3" />
                  Yes, Update Anyway
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleDecline}
                  size="sm"
                  variant="outline"
                >
                  <X className="mr-1 h-3 w-3" />
                  No, Find Better Time
                </Button>
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

  const updates = [];
  if (args.title) updates.push(`Title: ${args.title}`);
  if (args.description) updates.push(`Description: ${args.description}`);
  if (args.startDate) updates.push(`Start: ${new Date(args.startDate).toLocaleString()}`);
  if (args.endDate) updates.push(`End: ${new Date(args.endDate).toLocaleString()}`);
  if (args.location) updates.push(`Location: ${args.location}`);
  if (args.attendees) updates.push(`Attendees: ${args.attendees.length}`);
  if (args.color) updates.push(`Color: ${args.color}`);
  if (args.isAllDay !== undefined) updates.push(`All Day: ${args.isAllDay}`);
  if (args.repeat) updates.push(`Repeat: ${args.repeat}`);
  if (args.visibility) updates.push(`Visibility: ${args.visibility}`);

  return (
    <div>
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Edit className="h-4 w-4" />
            Update Event
          </CardTitle>
          <CardDescription className="text-blue-600 dark:text-blue-400">
            Review the changes to be made to this event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-3 w-3" />
              <span>Event ID: {args.eventId}</span>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm font-medium">Updates:</span>
              <div className="space-y-1">
                {updates.map((update, index) => (
                  <div key={index} className="text-sm text-blue-600 dark:text-blue-400">
                    • {update}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                onClick={handleAccept} 
                size="sm"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
                className="flex-1" 
                onClick={handleDecline} 
                size="sm" 
                variant="outline"
                disabled={isUpdating}
              >
                <X className="mr-1 h-3 w-3" />
                Decline
              </Button>
              <Button onClick={handleEdit} size="sm" variant="outline" disabled={isUpdating}>
                <Edit className="h-3 w-3" />
              </Button>
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
