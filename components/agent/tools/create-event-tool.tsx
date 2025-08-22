'use client';

import { Calendar, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { CalendarEventPreview } from '../calendar-event-preview';
import { MessageFooter } from '../message-footer';

interface CreateEventToolProps {
  args: any;
  result?: any;
  onAccept?: () => void;
  onDecline?: () => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onCopy?: () => void;
  onRate?: (rating: 'thumbs-up' | 'thumbs-down') => void;
}

export function CreateEventTool({
  args,
  result,
  onAccept,
  onDecline,
  onRegenerate,
  isRegenerating,
  onCopy,
  onRate,
}: CreateEventToolProps) {
  const { updateActionStatus } = useCalendarStore((state) => state);

  const handleAccept = () => {
    updateActionStatus('temp-id', 'accepted');
    onAccept?.();
  };

  const handleDecline = () => {
    updateActionStatus('temp-id', 'declined');
    onDecline?.();
  };

  const eventData =
    result?.event ||
    (result && typeof result === 'object' && 'id' in result ? result : null);

  if (result?.hasConflicts) {
    return (
      <div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-red-600" />
            <span className="font-medium text-red-700 dark:text-red-300">Scheduling Conflict Detected</span>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
            <div className="text-sm text-red-700 dark:text-red-300">
              <p className="font-medium mb-2">The following events conflict with your requested time:</p>
              {result.conflictingEvents?.map((conflict: any, index: number) => (
                <div key={index} className="ml-2 mb-1">
                  • <span className="font-medium">{conflict.title}</span> at {conflict.startTime} - {conflict.endTime}
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Do you want to add this event anyway?</p>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleAccept} size="sm">
              <Check className="mr-1 h-3 w-3" />
              Yes, Add Anyway
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
        <MessageFooter
          isRegenerating={isRegenerating}
          onCopy={onCopy}
          onRate={onRate}
          onRegenerate={onRegenerate}
        />
      </div>
    );
  }

  if (eventData) {
    return (
      <div>
        <CalendarEventPreview
          event={eventData}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
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
          <Calendar className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{args.title}</span>
        </div>

        <div className="space-y-2 text-gray-600 text-sm dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>
              {new Date(args.startDate).toLocaleDateString()} at{' '}
              {new Date(args.startDate).toLocaleTimeString()}
            </span>
          </div>

          {args.location && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>{args.location}</span>
            </div>
          )}

          {args.attendees && args.attendees.length > 0 && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>{args.attendees.length} attendee(s)</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 h-5 bg-red-500" onClick={handleAccept} size="sm">
            <Check className="mr-1 h-3 w-3" />
            Accept
          </Button>
          <Button
            className="flex-1"
            onClick={handleDecline}
            size="sm"
            variant="outline"
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
