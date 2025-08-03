import {
  ChatMessage,
  type ChatMessageProps,
} from '@/components/ui/chat-message';
import { cn } from '@/lib/utils';
import { TextShimmer } from './text-shimmer';
import type { UIMessage } from 'ai';

// Convert UIMessage to ChatMessageProps
function convertUIMessageToChatMessageProps(uiMessage: UIMessage): ChatMessageProps {
  return {
    id: uiMessage.id,
    role: uiMessage.role,
    content: uiMessage.parts
      .filter(part => part.type === 'text')
      .map(part => (part as any).text)
      .join(''),
    parts: uiMessage.parts.map(part => {
      if (part.type === 'text') {
        return { type: 'text', text: (part as any).text };
      }
      if (part.type === 'tool-call') {
        return { 
          type: 'tool-invocation', 
          toolInvocation: {
            state: 'call',
            toolName: (part as any).toolName,
            args: (part as any).args
          }
        };
      }
      if (part.type === 'tool-result') {
        return { 
          type: 'tool-invocation', 
          toolInvocation: {
            state: 'result',
            toolName: (part as any).toolName,
            result: (part as any).result
          }
        };
      }
      return part;
    }) as any,
  };
}

interface MessageListProps {
  messages: UIMessage[];
  showTimeStamps?: boolean;
  isTyping?: boolean;
  messageOptions?:
    | Omit<ChatMessageProps, 'id' | 'role' | 'content' | 'createdAt' | 'parts'>
    | ((message: UIMessage) => Omit<ChatMessageProps, 'id' | 'role' | 'content' | 'createdAt' | 'parts'>);
}

export function MessageList({
  messages,
  showTimeStamps = true,
  isTyping = false,
  messageOptions,
}: MessageListProps) {
  return (
    <div className="space-y-4 overflow-visible">
      {messages.map((message, index) => {
        const chatMessageProps = convertUIMessageToChatMessageProps(message);
        const additionalOptions =
          typeof messageOptions === 'function'
            ? messageOptions(message)
            : messageOptions;

        return <ChatMessage key={index} {...chatMessageProps} {...additionalOptions} />;
      })}
      {isTyping && (
        <div className={cn('group rounded-full ')}>
          <TextShimmer className="text-sm" duration={1}>
            Processing...
          </TextShimmer>
        </div>
      )}
    </div>
  );
}
