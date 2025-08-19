'use client';

import { CreateEventTool } from './tools/create-event-tool';
import { DefaultTool } from './tools/default-tool';
import { FindFreeTimeTool } from './tools/find-free-time-tool';
import { GetEventsTool } from './tools/get-events-tool';
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

    case 'get_events':
      return (
        <GetEventsTool
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
