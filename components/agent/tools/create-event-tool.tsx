'use client';

import { Calendar, Check, Clock, Edit, MapPin, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { CalendarEventPreview } from '../calendar-event-preview';
import { MessageFooter } from '../message-footer';

interface CreateEventToolProps {
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

export function CreateEventTool({
  args,
  result,
  onAccept,
  onDecline,
  onEdit,
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

  const handleEdit = () => {
    updateActionStatus('temp-id', 'edited');
    onEdit?.();
  };

  const eventData =
    result?.event ||
    (result && typeof result === 'object' && 'id' in result ? result : null);

  if (eventData) {
    return (
      <div>
        <CalendarEventPreview
          event={eventData}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onEdit={handleEdit}
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
            <Clock className="h-3 w-3" />
            <span>
              {new Date(args.startDate).toLocaleDateString()} at{' '}
              {new Date(args.startDate).toLocaleTimeString()}
            </span>
          </div>

          {args.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span>{args.location}</span>
            </div>
          )}

          {args.attendees && args.attendees.length > 0 && (
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3" />
              <span>{args.attendees.length} attendee(s)</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleAccept} size="sm">
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
          <Button onClick={handleEdit} size="sm" variant="outline">
            <Edit className="h-3 w-3" />
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
