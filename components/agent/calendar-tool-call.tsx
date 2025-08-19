'use client';

import { CreateEventTool } from './tools/create-event-tool';
import { DefaultTool } from './tools/default-tool';
import { DeleteEventTool } from './tools/delete-event-tool';
import { FindFreeTimeTool } from './tools/find-free-time-tool';
import { GetSummaryTool } from './tools/get-summary-tool';
import { PendingTool } from './tools/pending-tool';
import { UpdateEventTool } from './tools/update-event-tool';

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
          isRegenerating={isRegenerating}
          onAccept={onAccept}
          onCopy={onCopy}
          onDecline={onDecline}
          onEdit={onEdit}
          onRate={onRate}
          onRegenerate={onRegenerate}
          result={result}
        />
      );

    case 'delete_event':
      return (
        <DeleteEventTool
          args={args}
          isRegenerating={isRegenerating}
          onAccept={onAccept}
          onCopy={onCopy}
          onDecline={onDecline}
          onRate={onRate}
          onRegenerate={onRegenerate}
          result={result}
        />
      );

    case 'update_event':
      return (
        <UpdateEventTool
          args={args}
          isRegenerating={isRegenerating}
          onAccept={onAccept}
          onCopy={onCopy}
          onDecline={onDecline}
          onEdit={onEdit}
          onRate={onRate}
          onRegenerate={onRegenerate}
          result={result}
        />
      );

    case 'find_free_time':
      return (
        <FindFreeTimeTool
          args={args}
          isRegenerating={isRegenerating}
          onCopy={onCopy}
          onRate={onRate}
          onRegenerate={onRegenerate}
          result={result}
        />
      );

    case 'get_summary':
      return (
        <GetSummaryTool
          args={args}
          isRegenerating={isRegenerating}
          onCopy={onCopy}
          onRate={onRate}
          onRegenerate={onRegenerate}
          result={result}
        />
      );

    default:
      return (
        <DefaultTool
          args={args}
          isRegenerating={isRegenerating}
          onCopy={onCopy}
          onRate={onRate}
          onRegenerate={onRegenerate}
          result={result}
          toolName={toolName}
        />
      );
  }
}
