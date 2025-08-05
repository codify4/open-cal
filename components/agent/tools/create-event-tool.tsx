'use client';

import { Check, X, Edit, Clock, Calendar, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import { CalendarEventPreview } from '../calendar-event-preview';
import { MessageFooter } from '../message-footer';
import type { Event } from '@/lib/store/calendar-store';

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

  const eventData = result?.event || (result && typeof result === 'object' && 'id' in result ? result : null);
  
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
          onRegenerate={onRegenerate}
          isRegenerating={isRegenerating}
          onCopy={onCopy}
          onRate={onRate}
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
        
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
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
          <Button size="sm" onClick={handleAccept} className="flex-1">
            <Check className="h-3 w-3 mr-1" />
            Accept
          </Button>
          <Button size="sm" variant="outline" onClick={handleDecline} className="flex-1">
            <X className="h-3 w-3 mr-1" />
            Decline
          </Button>
          <Button size="sm" variant="outline" onClick={handleEdit}>
            <Edit className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <MessageFooter
        onRegenerate={onRegenerate}
        isRegenerating={isRegenerating}
        onCopy={onCopy}
        onRate={onRate}
      />
    </div>
  );
} 