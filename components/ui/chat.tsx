'use client';

import { ArrowDown, ThumbsDown, ThumbsUp } from 'lucide-react';
import {
  forwardRef,
  type ReactElement,
  useCallback,
  useRef,
  useState,
} from 'react';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { MessageInput } from '@/components/ui/message-input';
import { MessageList } from '@/components/ui/message-list';
import { PromptSuggestions } from '@/components/ui/prompt-suggestions';
import { useAutoScroll } from '@/hooks/use-auto-scroll';
import { cn } from '@/lib/utils';
import type { UIMessage } from 'ai';

interface ChatPropsBase {
  handleSubmit: (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList }
  ) => void;
  messages: UIMessage[];
  input: string;
  className?: string;
  handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  isGenerating: boolean;
  stop?: () => void;
  onRateResponse?: (
    messageId: string,
    rating: 'thumbs-up' | 'thumbs-down'
  ) => void;
  setMessages?: (messages: UIMessage[]) => void;
  transcribeAudio?: (blob: Blob) => Promise<string>;
}

interface ChatPropsWithoutSuggestions extends ChatPropsBase {
  append?: never;
  suggestions?: never;
}

interface ChatPropsWithSuggestions extends ChatPropsBase {
  append: (message: { role: 'user'; content: string }) => void;
  suggestions: string[];
}

type ChatProps = ChatPropsWithoutSuggestions | ChatPropsWithSuggestions;

export function Chat({
  messages,
  handleSubmit,
  input,
  handleInputChange,
  stop,
  isGenerating,
  append,
  suggestions,
  className,
  onRateResponse,
  setMessages,
  transcribeAudio,
}: ChatProps) {
  const lastMessage = messages.at(-1);
  const isEmpty = messages.length === 0;
  const isTyping = lastMessage?.role === 'user';

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const handleStop = useCallback(() => {
    stop?.();
  }, [stop]);

  const messageOptions = useCallback(
    (message: UIMessage) => ({
      actions: onRateResponse ? (
        <>
          <div className="border-r pr-1 bg-neutral-100 dark:bg-neutral-800">
            <CopyButton
              content={message.parts
                .filter(part => part.type === 'text')
                .map(part => (part as any).text)
                .join('')}
              copyMessage="Copied response to clipboard!"
            />
          </div>
          <Button
            className="h-6 w-6"
            onClick={() => onRateResponse(message.id, 'thumbs-up')}
            size="icon"
            variant="ghost"
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            className="h-6 w-6"
            onClick={() => onRateResponse(message.id, 'thumbs-down')}
            size="icon"
            variant="ghost"
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <CopyButton
          content={message.parts
            .filter(part => part.type === 'text')
            .map(part => (part as any).text)
            .join('')}
          copyMessage="Copied response to clipboard!"
        />
      ),
    }),
    [onRateResponse]
  );

  return (
    <ChatContainer className={className}>
      {isEmpty && append && suggestions ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8">
          <PromptSuggestions append={append} suggestions={suggestions} />
        </div>
      ) : null}

      {messages.length > 0 ? (
        <ChatMessages messages={messages}>
          <MessageList
            isTyping={isTyping}
            messageOptions={messageOptions}
            messages={messages}
          />
        </ChatMessages>
      ) : null}

      <ChatForm
        className="mt-auto"
        handleSubmit={handleSubmit}
        isPending={isGenerating || isTyping}
      >
        {({ files, setFiles }) => (
          <MessageInput
            className="min-h-[80px] bg-background/80"
            files={files}
            isGenerating={isGenerating}
            onChange={handleInputChange}
            setFiles={setFiles}
            stop={handleStop}
            transcribeAudio={transcribeAudio}
            value={input}
          />
        )}
      </ChatForm>
    </ChatContainer>
  );
}
Chat.displayName = 'Chat';

export function ChatMessages({
  messages,
  children,
}: React.PropsWithChildren<{
  messages: UIMessage[];
}>) {
  const {
    containerRef,
    scrollToBottom,
    handleScroll,
    shouldAutoScroll,
    handleTouchStart,
  } = useAutoScroll([messages]);

  return (
    <div
      className="grid grid-cols-1 overflow-y-auto pb-4"
      onScroll={handleScroll}
      onTouchStart={handleTouchStart}
      ref={containerRef}
    >
      <div className="max-w-full [grid-column:1/1] [grid-row:1/1]">
        {children}
      </div>

      {!shouldAutoScroll && (
        <div className="pointer-events-none flex flex-1 items-end justify-end [grid-column:1/1] [grid-row:1/1]">
          <div className="sticky bottom-0 left-0 flex w-full justify-end">
            <Button
              className="fade-in-0 slide-in-from-bottom-1 pointer-events-auto h-8 w-8 animate-in rounded-full ease-in-out"
              onClick={scrollToBottom}
              size="icon"
              variant="ghost"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export const ChatContainer = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn('flex h-full flex-col bg-background text-foreground', className)}
      ref={ref}
      {...props}
    />
  );
});
ChatContainer.displayName = 'ChatContainer';

interface ChatFormProps {
  className?: string;
  isPending: boolean;
  handleSubmit: (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList }
  ) => void;
  children: (props: {
    files: File[] | null;
    setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  }) => ReactElement;
}

export const ChatForm = forwardRef<HTMLFormElement, ChatFormProps>(
  ({ children, handleSubmit, isPending, className }, ref) => {
    const [files, setFiles] = useState<File[] | null>(null);

    const onSubmit = (event: React.FormEvent) => {
      if (!files) {
        handleSubmit(event);
        return;
      }

      const fileList = createFileList(files);
      handleSubmit(event, { experimental_attachments: fileList });
      setFiles(null);
    };

    return (
      <form className={className} onSubmit={onSubmit} ref={ref}>
        {children({ files, setFiles })}
      </form>
    );
  }
);
ChatForm.displayName = 'ChatForm';

function createFileList(files: File[] | FileList): FileList {
  const dataTransfer = new DataTransfer();
  for (const file of Array.from(files)) {
    dataTransfer.items.add(file);
  }
  return dataTransfer.files;
}
