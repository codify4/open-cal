'use client';

import { Edit, Check, X, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessageFooter } from '../message-footer';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { updateGoogleEvent } from '@/lib/calendar-utils/google-calendar';
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
  const { events, replaceEvent, googleEvents, setGoogleEvents } = useCalendarStore((state) => state);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<any>(null);
  const [existingEvent, setExistingEvent] = useState<any>(null);

  // Fetch the existing event data when component mounts
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

            // Find the event by ID - check multiple possible ID fields
            const foundEvent = googleEventsData.find((event: any) => 
              event.id === args.eventId || 
              event.id === args.googleEventId ||
              event.googleEventId === args.eventId
            );
            
            if (foundEvent) {
              const eventData = {
                id: foundEvent.id,
                title: foundEvent.summary,
                startDate: new Date(foundEvent.start?.dateTime || foundEvent.start?.date),
                endDate: new Date(foundEvent.end?.dateTime || foundEvent.end?.date),
                location: foundEvent.location,
                description: foundEvent.description,
                color: 'blue',
                type: 'event',
                googleEventId: foundEvent.id,
                googleCalendarId: 'primary',
                isAllDay: !foundEvent.start?.dateTime,
                attendees: foundEvent.attendees?.map((a: any) => a.email) || [],
                visibility: foundEvent.visibility || 'public',
              };
              setExistingEvent(eventData);
            } else {
              // If we can't find the event by ID, create event data from args
              if (args.startDate && args.endDate) {
                const eventData = {
                  id: args.eventId,
                  title: args.title || 'Untitled Event',
                  startDate: new Date(args.startDate),
                  endDate: new Date(args.endDate),
                  location: args.location || '',
                  description: args.description || '',
                  color: args.color || 'blue',
                  type: 'event',
                  googleEventId: args.eventId,
                  googleCalendarId: 'primary',
                  isAllDay: args.isAllDay || false,
                  attendees: args.attendees || [],
                  visibility: args.visibility || 'public',
                };
                setExistingEvent(eventData);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch existing event:', error);
        // Fallback: create event data from args
        if (args.startDate && args.endDate) {
          const eventData = {
            id: args.eventId,
            title: args.title || 'Untitled Event',
            startDate: new Date(args.startDate),
            endDate: new Date(args.endDate),
            location: args.location || '',
            description: args.description || '',
            color: args.color || 'blue',
            type: 'event',
            googleEventId: args.eventId,
            googleCalendarId: 'primary',
            isAllDay: args.isAllDay || false,
            attendees: args.attendees || [],
            visibility: args.visibility || 'public',
          };
          setExistingEvent(eventData);
        }
      }
    };

    fetchExistingEvent();
  }, [args.eventId, args.startDate, args.endDate]);

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

  if (updateResult?.hasConflicts) {
    return (
      <div>
        <div className={cn(
          'group relative rounded-sm border p-2 text-xs transition-all duration-200',
          'bg-orange-500/20 border-orange-500/30 text-orange-700 dark:bg-orange-500/40 dark:text-orange-100'
        )}>
          <div className="flex items-center gap-2 mb-2">
            <X className="h-4 w-4" />
            <span className="font-medium">Scheduling Conflict Detected</span>
          </div>
          <p className="text-xs opacity-80 mb-3">
            The following events conflict with your requested time:
          </p>
          <div className="space-y-2 mb-3">
            {updateResult.conflictingEvents?.map((conflict: any, index: number) => (
              <div key={index} className="text-xs opacity-80">
                • <span className="font-medium">{conflict.title}</span> at {conflict.startTime} - {conflict.endTime}
              </div>
            ))}
          </div>
          
          <div className="text-xs opacity-80 mb-3">
            <p>Do you want to update this event anyway?</p>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 bg-white text-black hover:bg-gray-50 h-7 rounded-[10px]" onClick={handleAccept} size="sm">
              <Check className="mr-1 h-3 w-3" />
              Yes, Update Anyway
            </Button>
            <Button
              className="flex-1 h-7 rounded-[10px] border-orange-200 text-orange-700 bg-transparent hover:bg-orange-50 hover:text-orange-800 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/30"
              onClick={handleDecline}
              size="sm"
              variant="outline"
            >
              <X className="mr-1 h-3 w-3" />
              No, Find Better Time
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

  const eventColor = args.color || 'blue';

  // Debug: log what events are available
  console.log('All events in store:', events);
  console.log('All Google events:', googleEvents);
  console.log('Looking for eventId:', args.eventId);
  console.log('Existing event from state:', existingEvent);

  // Get the event title to display
  const displayTitle = args.title || existingEvent?.title || 'Untitled Event';
  
  const displayStartDate = args.startDate ? ensureDate(args.startDate) : 
                          existingEvent?.startDate ? ensureDate(existingEvent.startDate) : 
                          new Date();
  const displayEndDate = args.endDate ? ensureDate(args.endDate) : 
                        existingEvent?.endDate ? ensureDate(existingEvent.endDate) : 
                        new Date();

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const timeDisplay = `${formatTime(displayStartDate)}–${formatTime(displayEndDate)}`;

  console.log('Update Event Tool Args:', args);
  console.log('Existing Event Found:', existingEvent);
  console.log('Display Start Date:', displayStartDate);
  console.log('Display End Date:', displayEndDate);

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
              {args.location && (
                <div className="text-xs opacity-80">
                  <MapPin className="inline h-3 w-3 mr-1" />
                  {args.location}
                </div>
              )}
              {args.description && (
                <div className="text-xs opacity-80">
                  {args.description}
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
