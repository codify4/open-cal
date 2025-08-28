import type { UIMessage } from 'ai';
import {
  ChatMessage,
  type ChatMessageProps,
} from '@/components/agent/chat-message';
import { cn } from '@/lib/utils';
import { TextShimmer } from './text-shimmer';
import { convertCalendarToReference, convertEventToReference } from '@/lib/store/chat-store';

interface MessageListProps {
  messages: UIMessage[];
  showTimeStamps?: boolean;
  isTyping?: boolean;
  messageOptions?:
    | Omit<ChatMessageProps, 'id' | 'role' | 'content' | 'createdAt' | 'parts'>
    | ((
        message: UIMessage
      ) => Omit<
        ChatMessageProps,
        'id' | 'role' | 'content' | 'createdAt' | 'parts'
      >);
}

export function MessageList({
  messages,
  showTimeStamps = true,
  isTyping = false,
  messageOptions,
}: MessageListProps) {
  return (
    <div className="h-full space-y-4 overflow-y-auto">
      {messages.map((message, index) => {
        // Extract calendar references from tool results
        const calendarReferences: Array<{
          id: string;
          name: string;
          summary?: string;
          color?: string;
          accessRole?: string;
        }> = [];

        message.parts?.forEach((part) => {
          if (part.type.startsWith('tool-') && (part as any).state === 'output-available') {
            const toolPart = part as any;
            
            // Extract calendar references from tool results
            if (toolPart.output?.event) {
              const eventRef = convertEventToReference(toolPart.output.event);
              calendarReferences.push({
                id: eventRef.id,
                name: eventRef.title,
                color: eventRef.color,
              });
            }
            
            if (toolPart.output?.calendar) {
              const calendarRef = convertCalendarToReference(toolPart.output.calendar);
              calendarReferences.push({
                id: calendarRef.id,
                name: calendarRef.name,
                summary: calendarRef.summary,
                color: calendarRef.color,
                accessRole: calendarRef.accessRole,
              });
            }
          }
        });

        const chatMessageProps: ChatMessageProps = {
          id: message.id,
          role: message.role,
          content: message.parts
            .filter((part) => part.type === 'text')
            .map((part) => (part as any).text)
            .join(''),
          parts: message.parts.map((part) => {
            if (part.type === 'text') {
              return { type: 'text', text: (part as any).text };
            }

            if (part.type.startsWith('tool-')) {
              const toolPart = part as any;
              const toolName = part.type.replace('tool-', '');

              return {
                type: 'tool-invocation',
                toolInvocation: {
                  state:
                    toolPart.state === 'output-available' ? 'result' : 'call',
                  toolName,
                  args: toolPart.input,
                  result: toolPart.output,
                },
              };
            }

            return part;
          }) as any,
          calendarReferences, // Add the extracted references
        };

        const additionalOptions =
          typeof messageOptions === 'function'
            ? messageOptions(message)
            : messageOptions;

        return (
          <ChatMessage
            key={index}
            {...chatMessageProps}
            {...additionalOptions}
          />
        );
      })}
      {isTyping && (
        <div className={cn('group rounded-full')}>
          <TextShimmer className="text-sm" duration={1}>
            Processing...
          </TextShimmer>
        </div>
      )}
    </div>
  );
}
