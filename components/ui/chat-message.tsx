'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { Ban, ChevronRight, Code2, Loader2, Terminal } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { FilePreview } from '@/components/ui/file-preview';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { cn } from '@/lib/utils';

const chatBubbleVariants = cva(
  'group/message relative break-words rounded-lg p-3 text-sm sm:max-w-[70%]',
  {
    variants: {
      isUser: {
        true: 'bg-primary text-primary-foreground',
        false: 'bg-muted text-foreground',
      },
      animation: {
        none: '',
        slide: 'fade-in-0 animate-in duration-300',
        scale: 'fade-in-0 zoom-in-75 animate-in duration-300',
        fade: 'fade-in-0 animate-in duration-500',
      },
    },
    compoundVariants: [
      {
        isUser: true,
        animation: 'slide',
        class: 'slide-in-from-right',
      },
      {
        isUser: false,
        animation: 'slide',
        class: 'slide-in-from-left',
      },
      {
        isUser: true,
        animation: 'scale',
        class: 'origin-bottom-right',
      },
      {
        isUser: false,
        animation: 'scale',
        class: 'origin-bottom-left',
      },
    ],
  }
);

type Animation = VariantProps<typeof chatBubbleVariants>['animation'];

interface Attachment {
  name?: string;
  contentType?: string;
  url: string;
}

interface PartialToolCall {
  state: 'partial-call';
  toolName: string;
}

interface ToolCall {
  state: 'call';
  toolName: string;
}

interface ToolResult {
  state: 'result';
  toolName: string;
  result: {
    __cancelled?: boolean;
    [key: string]: any;
  };
}

type ToolInvocation = PartialToolCall | ToolCall | ToolResult;

interface ReasoningPart {
  type: 'reasoning';
  reasoning: string;
}

interface ToolInvocationPart {
  type: 'tool-invocation';
  toolInvocation: ToolInvocation;
}

interface TextPart {
  type: 'text';
  text: string;
}

// For compatibility with AI SDK types, not used
interface SourcePart {
  type: 'source';
  source?: any;
}

interface FilePart {
  type: 'file';
  mimeType: string;
  data: string;
}

interface StepStartPart {
  type: 'step-start';
}

type MessagePart =
  | TextPart
  | ReasoningPart
  | ToolInvocationPart
  | SourcePart
  | FilePart
  | StepStartPart;

export interface Message {
  id: string;
  role: 'user' | 'assistant' | (string & {});
  content: string;
  createdAt?: Date;
  experimental_attachments?: Attachment[];
  toolInvocations?: ToolInvocation[];
  parts?: MessagePart[];
}

export interface ChatMessageProps extends Message {
  showTimeStamp?: boolean;
  animation?: Animation;
  actions?: React.ReactNode;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  createdAt,
  showTimeStamp = false,
  animation = 'scale',
  actions,
  experimental_attachments,
  toolInvocations,
  parts,
}) => {
  const files = useMemo(() => {
    return experimental_attachments?.map((attachment) => {
      const dataArray = dataUrlToUint8Array(attachment.url);
      const file = new File([dataArray], attachment.name ?? 'Unknown', {
        type: attachment.contentType,
      });
      return file;
    });
  }, [experimental_attachments]);

  const isUser = role === 'user';

  const formattedTime = createdAt?.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isUser) {
    return (
      <div
        className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}
      >
        {files ? (
          <div className="mb-1 flex flex-wrap gap-2">
            {files.map((file, index) => {
              return <FilePreview file={file} key={index} />;
            })}
          </div>
        ) : null}

        <div className={cn(chatBubbleVariants({ isUser, animation }))}>
          <MarkdownRenderer>{content}</MarkdownRenderer>
        </div>

        {showTimeStamp && createdAt ? (
          <time
            className={cn(
              'mt-1 block px-1 text-xs opacity-50',
              animation !== 'none' && 'fade-in-0 animate-in duration-500'
            )}
            dateTime={createdAt.toISOString()}
          >
            {formattedTime}
          </time>
        ) : null}
      </div>
    );
  }

  if (parts && parts.length > 0) {
    return parts.map((part, index) => {
      if (part.type === 'text') {
        return (
          <div
            className={cn(
              'flex flex-col',
              isUser ? 'items-end' : 'items-start'
            )}
            key={`text-${index}`}
          >
            <div className={cn(chatBubbleVariants({ isUser, animation }))}>
              <MarkdownRenderer>{part.text}</MarkdownRenderer>
              {actions ? (
                <div className="-bottom-4 absolute right-2 flex space-x-1 rounded-lg border bg-background p-1 text-foreground opacity-0 transition-opacity group-hover/message:opacity-100">
                  {actions}
                </div>
              ) : null}
            </div>

            {showTimeStamp && createdAt ? (
              <time
                className={cn(
                  'mt-1 block px-1 text-xs opacity-50',
                  animation !== 'none' && 'fade-in-0 animate-in duration-500'
                )}
                dateTime={createdAt.toISOString()}
              >
                {formattedTime}
              </time>
            ) : null}
          </div>
        );
      }
      if (part.type === 'reasoning') {
        return <ReasoningBlock key={`reasoning-${index}`} part={part} />;
      }
      if (part.type === 'tool-invocation') {
        return (
          <ToolCall
            key={`tool-${index}`}
            toolInvocations={[part.toolInvocation]}
          />
        );
      }
      return null;
    });
  }

  if (toolInvocations && toolInvocations.length > 0) {
    return <ToolCall toolInvocations={toolInvocations} />;
  }

  return (
    <div className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}>
      <div className={cn(chatBubbleVariants({ isUser, animation }))}>
        <MarkdownRenderer>{content}</MarkdownRenderer>
        {actions ? (
          <div className="-bottom-4 absolute right-2 flex space-x-1 rounded-lg border bg-background p-1 text-foreground opacity-0 transition-opacity group-hover/message:opacity-100">
            {actions}
          </div>
        ) : null}
      </div>

      {showTimeStamp && createdAt ? (
        <time
          className={cn(
            'mt-1 block px-1 text-xs opacity-50',
            animation !== 'none' && 'fade-in-0 animate-in duration-500'
          )}
          dateTime={createdAt.toISOString()}
        >
          {formattedTime}
        </time>
      ) : null}
    </div>
  );
};

function dataUrlToUint8Array(data: string) {
  const base64 = data.split(',')[1];
  const buf = Buffer.from(base64, 'base64');
  return new Uint8Array(buf);
}

const ReasoningBlock = ({ part }: { part: ReasoningPart }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-2 flex flex-col items-start sm:max-w-[70%]">
      <Collapsible
        className="group w-full overflow-hidden rounded-lg border bg-muted/50"
        onOpenChange={setIsOpen}
        open={isOpen}
      >
        <div className="flex items-center p-2">
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground">
              <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
              <span>Thinking</span>
            </button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent forceMount>
          <motion.div
            animate={isOpen ? 'open' : 'closed'}
            className="border-t"
            initial={false}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            variants={{
              open: { height: 'auto', opacity: 1 },
              closed: { height: 0, opacity: 0 },
            }}
          >
            <div className="p-2">
              <div className="whitespace-pre-wrap text-xs">
                {part.reasoning}
              </div>
            </div>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

function ToolCall({
  toolInvocations,
}: Pick<ChatMessageProps, 'toolInvocations'>) {
  if (!toolInvocations?.length) return null;

  return (
    <div className="flex flex-col items-start gap-2">
      {toolInvocations.map((invocation, index) => {
        const isCancelled =
          invocation.state === 'result' &&
          invocation.result.__cancelled === true;

        if (isCancelled) {
          return (
            <div
              className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-muted-foreground text-sm"
              key={index}
            >
              <Ban className="h-4 w-4" />
              <span>
                Cancelled{' '}
                <span className="font-mono">
                  {'`'}
                  {invocation.toolName}
                  {'`'}
                </span>
              </span>
            </div>
          );
        }

        switch (invocation.state) {
          case 'partial-call':
          case 'call':
            return (
              <div
                className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-muted-foreground text-sm"
                key={index}
              >
                <Terminal className="h-4 w-4" />
                <span>
                  Calling{' '}
                  <span className="font-mono">
                    {'`'}
                    {invocation.toolName}
                    {'`'}
                  </span>
                  ...
                </span>
                <Loader2 className="h-3 w-3 animate-spin" />
              </div>
            );
          case 'result':
            return (
              <div
                className="flex flex-col gap-1.5 rounded-lg border bg-muted/50 px-3 py-2 text-sm"
                key={index}
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Code2 className="h-4 w-4" />
                  <span>
                    Result from{' '}
                    <span className="font-mono">
                      {'`'}
                      {invocation.toolName}
                      {'`'}
                    </span>
                  </span>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap text-foreground">
                  {JSON.stringify(invocation.result, null, 2)}
                </pre>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
