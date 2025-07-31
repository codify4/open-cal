import {
  ChatMessage,
  type ChatMessageProps,
  type Message,
} from '@/components/ui/chat-message';
import { TypingIndicator } from '@/components/ui/typing-indicator';
import { cn } from '@/lib/utils';
import { AnimatedShinyText } from '../magicui/animated-shiny-text';
import { TextShimmer } from './text-shimmer';

type AdditionalMessageOptions = Omit<ChatMessageProps, keyof Message>;

interface MessageListProps {
  messages: Message[];
  showTimeStamps?: boolean;
  isTyping?: boolean;
  messageOptions?:
    | AdditionalMessageOptions
    | ((message: Message) => AdditionalMessageOptions);
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
        const additionalOptions =
          typeof messageOptions === 'function'
            ? messageOptions(message)
            : messageOptions;

        return <ChatMessage key={index} {...message} {...additionalOptions} />;
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
