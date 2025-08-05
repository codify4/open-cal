'use client';

import { CreateEventTool } from './tools/create-event-tool';
import { FindFreeTimeTool } from './tools/find-free-time-tool';
import { GetEventsTool } from './tools/get-events-tool';
import { DefaultTool } from './tools/default-tool';
import { PendingTool } from './tools/pending-tool';

interface CalendarToolCallProps {
  toolName: string;
  args: any;
  result?: any;
  onAccept?: () => void;
  onDecline?: () => void;
  onEdit?: () => void;
  isPending?: boolean;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onCopy?: () => void;
  onRate?: (rating: 'thumbs-up' | 'thumbs-down') => void;
}

export function CalendarToolCall({
  toolName,
  args,
  result,
  onAccept,
  onDecline,
  onEdit,
  isPending = false,
  onRegenerate,
  isRegenerating,
  onCopy,
  onRate,
}: CalendarToolCallProps) {
  if (isPending) {
    return <PendingTool toolName={toolName} />;
  }

  switch (toolName) {
    case 'create_event':
      return (
        <CreateEventTool
          args={args}
          result={result}
          onAccept={onAccept}
          onDecline={onDecline}
          onEdit={onEdit}
          onRegenerate={onRegenerate}
          isRegenerating={isRegenerating}
          onCopy={onCopy}
          onRate={onRate}
        />
      );

    case 'find_free_time':
      return (
        <FindFreeTimeTool
          args={args}
          result={result}
          onRegenerate={onRegenerate}
          isRegenerating={isRegenerating}
          onCopy={onCopy}
          onRate={onRate}
        />
      );

    case 'get_events':
      return (
        <GetEventsTool
          args={args}
          result={result}
          onRegenerate={onRegenerate}
          isRegenerating={isRegenerating}
          onCopy={onCopy}
          onRate={onRate}
        />
      );

    default:
      return (
        <DefaultTool
          toolName={toolName}
          args={args}
          result={result}
          onRegenerate={onRegenerate}
          isRegenerating={isRegenerating}
          onCopy={onCopy}
          onRate={onRate}
        />
      );
  }
} 