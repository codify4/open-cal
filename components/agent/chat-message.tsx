'use client';

import { useUser } from '@clerk/nextjs';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { Ban, ChevronRight, Code2, Loader2, Terminal } from 'lucide-react';
import type React from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CalendarToolCall } from '@/components/agent/calendar-tool-call';
import { FilePreview } from '@/components/agent/file-preview';
import { MessageFooter } from '@/components/agent/message-footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  deleteGoogleEvent,
  upsertGoogleEvent,
} from '@/lib/calendar-utils/google-calendar';
import { cn, ensureDate } from '@/lib/utils';
import {
  CalendarStoreContext,
  useCalendarStore,
} from '@/providers/calendar-store-provider';

const chatBubbleVariants = cva(
  'group/message relative break-words border p-2 text-sm shadow-sm sm:max-w-[75%]',
  {
    variants: {
      isUser: {
        true: 'ml-auto rounded-l-lg rounded-tr-none rounded-br-lg border-primary/20 bg-primary text-primary-foreground',
        false:
          'rounded-r-lg rounded-tl-none rounded-bl-lg border-neutral-200 bg-neutral-100 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100',
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

interface ToolInvocationPart {
  type: 'tool-invocation';
  toolInvocation: {
    state: 'call' | 'result';
    toolName: string;
    args?: any;
    result?: any;
  };
}

interface TextPart {
  type: 'text';
  text: string;
}

interface ReasoningPart {
  type: 'reasoning';
  reasoning: string;
}

interface StepStartPart {
  type: 'step-start';
}

type MessagePart =
  | TextPart
  | ReasoningPart
  | ToolInvocationPart
  | StepStartPart;

export interface Message {
  id: string;
  role: 'user' | 'assistant' | (string & {});
  content: string;
  createdAt?: Date;
  experimental_attachments?: Attachment[];
  parts?: MessagePart[];
}

export interface ChatMessageProps extends Message {
  showTimeStamp?: boolean;
  animation?: Animation;
  actions?: React.ReactNode;
  avatar?: string;
  avatarFallback?: string;
  footer?: React.ReactNode;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onCopy?: () => void;
  onRate?: (rating: 'thumbs-up' | 'thumbs-down') => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  createdAt,
  showTimeStamp = false,
  animation = 'scale',
  actions,
  experimental_attachments,
  parts,
  avatar,
  avatarFallback,
  footer,
  onRegenerate,
  isRegenerating,
  onCopy,
  onRate,
}) => {
  const { addPendingAction } = useCalendarStore((state) => state);
  const calendarStoreContext = useContext(CalendarStoreContext);
  const { user } = useUser();

  useEffect(() => {
    if (parts && parts.length > 0) {
      parts.forEach((part) => {
        if (part.type === 'tool-invocation') {
          const toolInvocation = part.toolInvocation;
          const calendarToolNames = [
            'create_event',
            'find_free_time',
            'get_events',
            'update_event',
            'delete_event',
            'get_calendar_summary',
          ];

          if (
            calendarToolNames.includes(toolInvocation.toolName) &&
            toolInvocation.state === 'result' &&
            toolInvocation.result
          ) {
            addPendingAction({
              toolName: toolInvocation.toolName,
              args: toolInvocation.args || {},
              result: toolInvocation.result,
              status: 'pending',
            });
          }
        }
      });
    }
  }, [parts, addPendingAction]);

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
      <div className="flex items-start gap-3">
        <div className="flex flex-1 flex-col items-end">
          {files ? (
            <div className="mb-1 flex flex-wrap gap-2">
              {files.map((file, index) => {
                return <FilePreview file={file} key={index} />;
              })}
            </div>
          ) : null}

          <div className={cn(chatBubbleVariants({ isUser, animation }))}>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
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

        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage alt="User avatar" src={avatar} />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {avatarFallback || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  if (parts && parts.length > 0) {
    return (
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage alt="AI Assistant" src="/caly.svg" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-sm text-white">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                clipRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.552-.552l1.562-1.562a4.006 4.006 0 001.9.903zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033zm7.297 4.773a4.018 4.018 0 01-1.08 1.08l1.58 1.58a5.98 5.98 0 001.08-1.08l-1.58-1.58z"
                fillRule="evenodd"
              />
            </svg>
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-1 flex-col items-start space-y-2">
          {parts.map((part, index) => {
            if (part.type === 'text') {
              return (
                <div
                  className={cn('flex w-full flex-col items-start')}
                  key={`text-${index}`}
                >
                  <div
                    className={cn(
                      chatBubbleVariants({ isUser, animation }),
                      'relative'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="prose prose-sm dark:prose-invert min-w-0 max-w-none flex-1">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {part.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>

                  {role === 'assistant' && (
                    <MessageFooter
                      isRegenerating={isRegenerating}
                      onCopy={onCopy}
                      onRate={onRate}
                      onRegenerate={onRegenerate}
                    >
                      {footer}
                    </MessageFooter>
                  )}

                  {showTimeStamp && createdAt ? (
                    <time
                      className={cn(
                        'mt-1 block px-1 text-xs opacity-50',
                        animation !== 'none' &&
                          'fade-in-0 animate-in duration-500'
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
              const toolInvocation = part.toolInvocation;
              const calendarToolNames = [
                'create_event',
                'find_free_time',
                'get_events',
                'update_event',
                'delete_event',
                'get_calendar_summary',
              ];

              if (calendarToolNames.includes(toolInvocation.toolName)) {
                return (
                  <div className="w-full" key={`calendar-tool-${index}`}>
                    <CalendarToolCall
                      args={toolInvocation.args || {}}
                      isPending={toolInvocation.state === 'call'}
                      isRegenerating={isRegenerating}
                      onAccept={async () => {
                        if (calendarStoreContext && user?.id) {
                          const store = calendarStoreContext.getState();

                          try {
                            switch (toolInvocation.toolName) {
                              case 'create_event':
                                if (toolInvocation.result?.event) {
                                  const eventWithProperDates = {
                                    ...toolInvocation.result.event,
                                    startDate: ensureDate(
                                      toolInvocation.result.event.startDate
                                    ),
                                    endDate: ensureDate(
                                      toolInvocation.result.event.endDate
                                    ),
                                    googleCalendarId:
                                      store.visibleCalendarIds[0] || 'primary',
                                  };

                                  const googleResult = await upsertGoogleEvent(
                                    eventWithProperDates,
                                    user.id,
                                    user.primaryEmailAddress?.emailAddress
                                  );

                                  if (
                                    googleResult?.success &&
                                    googleResult.event
                                  ) {
                                    store.saveEvent(googleResult.event);
                                    store.setCurrentDate(
                                      googleResult.event.startDate
                                    );
                                  } else {
                                    store.saveEvent(eventWithProperDates);
                                    store.setCurrentDate(
                                      eventWithProperDates.startDate
                                    );
                                  }

                                  store.refreshEvents();
                                }
                                break;

                              case 'update_event':
                                if (toolInvocation.result?.updates) {
                                  const { eventId, ...updates } =
                                    toolInvocation.result.updates;
                                  const existingEvent =
                                    store.events.find(
                                      (e) => e.id === eventId
                                    ) ||
                                    store.googleEvents.find(
                                      (e) => e.id === eventId
                                    );

                                  if (existingEvent) {
                                    const updatedEvent = {
                                      ...existingEvent,
                                      ...updates,
                                      ...(updates.startDate && {
                                        startDate: ensureDate(
                                          updates.startDate
                                        ),
                                      }),
                                      ...(updates.endDate && {
                                        endDate: ensureDate(updates.endDate),
                                      }),
                                    };

                                    // Update on Google Calendar first
                                    const googleResult =
                                      await upsertGoogleEvent(
                                        updatedEvent,
                                        user.id,
                                        user.primaryEmailAddress?.emailAddress
                                      );

                                    if (
                                      googleResult?.success &&
                                      googleResult.event
                                    ) {
                                      // Update with the Google Calendar response
                                      store.replaceEvent(googleResult.event);
                                    } else {
                                      // If Google Calendar fails, update locally as fallback
                                      store.replaceEvent(updatedEvent);
                                    }

                                    // Refresh events to sync
                                    store.refreshEvents();
                                  }
                                }
                                break;

                              case 'delete_event':
                                if (toolInvocation.result?.eventId) {
                                  const existingEvent =
                                    store.events.find(
                                      (e) =>
                                        e.id === toolInvocation.result.eventId
                                    ) ||
                                    store.googleEvents.find(
                                      (e) =>
                                        e.id === toolInvocation.result.eventId
                                    );

                                  if (existingEvent?.googleEventId) {
                                    // Delete from Google Calendar first
                                    const googleResult =
                                      await deleteGoogleEvent(
                                        existingEvent.googleEventId,
                                        existingEvent.googleCalendarId ||
                                          'primary'
                                      );

                                    if (googleResult.success) {
                                      store.deleteEvent(
                                        toolInvocation.result.eventId
                                      );
                                    } else {
                                      store.deleteEvent(
                                        toolInvocation.result.eventId
                                      );
                                    }
                                  } else {
                                    store.deleteEvent(
                                      toolInvocation.result.eventId
                                    );
                                  }

                                  store.refreshEvents();
                                }
                                break;

                              case 'find_free_time':
                              case 'get_events':
                              case 'get_calendar_summary':
                                break;
                            }

                            // Update the pending action status
                            if (toolInvocation.result?.action) {
                              const pendingAction = store.pendingActions.find(
                                (action) =>
                                  action.toolName === toolInvocation.toolName
                              );
                              if (pendingAction) {
                                store.updateActionStatus(
                                  pendingAction.id,
                                  'accepted'
                                );
                              }
                            }
                          } catch (error) {
                            console.error(
                              'Error executing calendar action:',
                              error
                            );
                            if (toolInvocation.result?.action) {
                              const pendingAction = store.pendingActions.find(
                                (action) =>
                                  action.toolName === toolInvocation.toolName
                              );
                              if (pendingAction) {
                                store.updateActionStatus(
                                  pendingAction.id,
                                  'accepted'
                                );
                              }
                            }
                          }
                        }
                      }}
                      onCopy={onCopy}
                      onDecline={() => {
                        if (calendarStoreContext) {
                          const store = calendarStoreContext.getState();

                          // Update the pending action status to declined
                          if (toolInvocation.result?.action) {
                            const pendingAction = store.pendingActions.find(
                              (action) =>
                                action.toolName === toolInvocation.toolName
                            );
                            if (pendingAction) {
                              store.updateActionStatus(
                                pendingAction.id,
                                'declined'
                              );
                            }
                          }
                        }
                      }}
                      onEdit={() => {
                        if (calendarStoreContext) {
                          const store = calendarStoreContext.getState();

                          switch (toolInvocation.toolName) {
                            case 'create_event':
                              if (toolInvocation.result?.event) {
                                const eventWithProperDates = {
                                  ...toolInvocation.result.event,
                                  startDate: ensureDate(
                                    toolInvocation.result.event.startDate
                                  ),
                                  endDate: ensureDate(
                                    toolInvocation.result.event.endDate
                                  ),
                                };
                                store.openEventSidebarForEdit(
                                  eventWithProperDates
                                );
                              }
                              break;

                            case 'update_event':
                              if (toolInvocation.result?.updates) {
                                const { eventId, ...updates } =
                                  toolInvocation.result.updates;
                                const existingEvent =
                                  store.events.find((e) => e.id === eventId) ||
                                  store.googleEvents.find(
                                    (e) => e.id === eventId
                                  );

                                if (existingEvent) {
                                  const updatedEvent = {
                                    ...existingEvent,
                                    ...updates,
                                    ...(updates.startDate && {
                                      startDate: ensureDate(updates.startDate),
                                    }),
                                    ...(updates.endDate && {
                                      endDate: ensureDate(updates.endDate),
                                    }),
                                  };
                                  store.openEventSidebarForEdit(updatedEvent);
                                }
                              }
                              break;

                            case 'find_free_time':
                            case 'get_events':
                            case 'get_calendar_summary':
                            case 'delete_event':
                              // These operations don't support editing in the event sidebar
                              break;
                          }

                          // Update the pending action status to edited
                          if (toolInvocation.result?.action) {
                            const pendingAction = store.pendingActions.find(
                              (action) =>
                                action.toolName === toolInvocation.toolName
                            );
                            if (pendingAction) {
                              store.updateActionStatus(
                                pendingAction.id,
                                'edited'
                              );
                            }
                          }
                        }
                      }}
                      onRate={onRate}
                      onRegenerate={onRegenerate}
                      result={toolInvocation.result}
                      toolName={toolInvocation.toolName}
                    />
                  </div>
                );
              }

              return (
                <div className="w-full" key={`tool-${index}`}>
                  <ToolCall toolInvocations={[toolInvocation]} />
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage alt="AI Assistant" src="/caly.svg" />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-sm text-white">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              clipRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.552-.552l1.562-1.562a4.006 4.006 0 001.9.903zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033zm7.297 4.773a4.018 4.018 0 01-1.08 1.08l1.58 1.58a5.98 5.98 0 001.08-1.08l-1.58-1.58z"
              fillRule="evenodd"
            />
          </svg>
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col items-start">
        <div
          className={cn(chatBubbleVariants({ isUser, animation }), 'relative')}
        >
          <div className="flex items-start gap-3">
            <div className="prose prose-sm dark:prose-invert min-w-0 max-w-none flex-1">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {role === 'assistant' && (
          <MessageFooter
            isRegenerating={isRegenerating}
            onCopy={onCopy}
            onRate={onRate}
            onRegenerate={onRegenerate}
          >
            {footer}
          </MessageFooter>
        )}

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
}: {
  toolInvocations: Array<{
    state: 'call' | 'result';
    toolName: string;
    result?: any;
  }>;
}) {
  if (!toolInvocations?.length) return null;

  return (
    <div className="flex flex-col items-start gap-2">
      {toolInvocations.map((invocation, index) => {
        const isCancelled =
          invocation.state === 'result' &&
          invocation.result?.__cancelled === true;

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
