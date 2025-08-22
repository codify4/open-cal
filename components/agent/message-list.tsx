import type { UIMessage } from 'ai';
import {
  ChatMessage,
  type ChatMessageProps,
} from '@/components/agent/chat-message';
import { cn } from '@/lib/utils';
import { TextShimmer } from './text-shimmer';

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
