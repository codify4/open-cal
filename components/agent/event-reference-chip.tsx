'use client';

import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { EventReference } from '@/lib/store/chat-store';

interface EventReferenceChipProps {
  event: EventReference;
  onRemove: (eventId: string) => void;
  className?: string;
}

export function EventReferenceChip({ event, onRemove, className }: EventReferenceChipProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm border border-blue-200 dark:border-blue-800/50',
        className
      )}
    >
      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      
      <div className="flex flex-col min-w-0">
        <span className="font-medium truncate max-w-[200px]" title={event.title}>
          {event.title}
        </span>
        <span className="text-xs text-blue-600 dark:text-blue-400">
          {formatDate(event.startDate)} at {formatTime(event.startDate)}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 ml-1"
        onClick={() => onRemove(event.id)}
        aria-label={`Remove ${event.title} reference`}
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}
