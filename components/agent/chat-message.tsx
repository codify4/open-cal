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
import { FilePreview } from '@/components/agent/file-preview';
import { MarkdownRenderer } from '@/components/agent/markdown-renderer';
import { cn } from '@/lib/utils';

const chatBubbleVariants = cva(
  'group/message relative break-words rounded-xl p-3 text-sm sm:max-w-[75%] shadow-sm border',
  {
    variants: {
      isUser: {
        true: 'bg-primary text-primary-foreground ml-auto border-primary/20',
        false: 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-200 dark:border-neutral-700',
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

  // AI Message with enhanced styling
  if (parts && parts.length > 0) {
    return (
      <div className="flex flex-col items-start space-y-2">
        {parts.map((part, index) => {
          if (part.type === 'text') {
            return (
              <div
                className={cn(
                  'flex flex-col items-start w-full'
                )}
                key={`text-${index}`}
              >
                <div className={cn(chatBubbleVariants({ isUser, animation }), 'relative')}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <MarkdownRenderer>{part.text}</MarkdownRenderer>
                    </div>
                  </div>
                  {actions ? (
                    <div className="absolute -bottom-4 right-2 flex space-x-1 rounded-lg border bg-background p-1 text-foreground opacity-0 transition-opacity group-hover/message:opacity-100">
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
              <div key={`tool-${index}`} className="w-full">
                <ToolCall toolInvocations={[part.toolInvocation]} />
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }

  // Fallback for simple text messages
  return (
    <div className="flex flex-col items-start">
      <div className={cn(chatBubbleVariants({ isUser, animation }), 'relative')}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.552-.552l1.562-1.562a4.006 4.006 0 001.9.903zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033zm7.297 4.773a4.018 4.018 0 01-1.08 1.08l1.58 1.58a5.98 5.98 0 001.08-1.08l-1.58-1.58z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <MarkdownRenderer>{content}</MarkdownRenderer>
          </div>
        </div>
        {actions ? (
          <div className="absolute -bottom-4 right-2 flex space-x-1 rounded-lg border bg-background p-1 text-foreground opacity-0 transition-opacity group-hover/message:opacity-100">
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
