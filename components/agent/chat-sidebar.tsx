'use client';

import { useChat } from '@ai-sdk/react';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import {
  Maximize2,
  MessageSquare,
  Minimize2,
  PanelRight,
  Plus,
  Smartphone,
  X,
} from 'lucide-react';
import type * as React from 'react';
import { useEffect, useState } from 'react';
import { Chat } from '@/components/agent/chat';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { api } from '@/convex/_generated/api';
import { useRateLimit } from '@/hooks/use-rate-limit';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/providers/chat-store-provider';

interface ChatSidebarProps {
  mode: 'sidebar' | 'popup' | 'fullscreen';
  onToggleSidebar: () => void;
  onToggleFullscreen: () => void;
  onTogglePopup: () => void;
}

export function ChatSidebar({
  className,
  mode,
  onToggleSidebar,
  onToggleFullscreen,
  onTogglePopup,
  ...props
}: React.ComponentProps<'div'> & ChatSidebarProps) {
  const { messages, sendMessage, status, setMessages, regenerate, stop } =
    useChat();
  const [input, setInput] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratingMessageId, setRegeneratingMessageId] = useState<
    string | null
  >(null);

  const {
    messagesLeft,
    isLimited,
    sendMessage: sendRateLimitedMessage,
    refreshRateLimit,
  } = useRateLimit();
  const { user: clerkUser, isSignedIn } = useUser();
  const currentUser = useQuery(api.auth.getCurrentUser, {
    clerkUserId: clerkUser?.id,
  });

  const chatMessages = useChatStore((state) => state.messages);
  const chatInput = useChatStore((state) => state.input);
  const eventReferences = useChatStore((state) => state.eventReferences);
  const calendarReferences = useChatStore((state) => state.calendarReferences);
  const setChatMessages = useChatStore((state) => state.setMessages);
  const setChatInput = useChatStore((state) => state.setInput);
  const clearChat = useChatStore((state) => state.clearChat);
  const clearEventReferences = useChatStore((state) => state.clearEventReferences);
  const clearCalendarReferences = useChatStore((state) => state.clearCalendarReferences);

  useEffect(() => {
    if (chatMessages.length > 0) {
      setMessages(chatMessages);
    }
  }, []);

  useEffect(() => {
    if (chatInput) {
      setInput(chatInput);
    }
  }, []);

  const handleSubmit = (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList }
  ) => {
    event?.preventDefault?.();
    if (!isSignedIn) {
      return;
    }
    if (input.trim()) {
      const { isLimited } = sendRateLimitedMessage();

      if (!isLimited) {
        // Enhance message with event references if any
        let enhancedInput = input;
        if (eventReferences.length > 0 || calendarReferences.length > 0) {
          const eventContext = eventReferences.map(ref => 
            `@${ref.title} (${ref.startDate} - ${ref.endDate})`
          ).join(' ');
          const calendarContext = calendarReferences.map(ref => 
            `@${ref.name} (calendar)`
          ).join(' ');
          const allContext = [eventContext, calendarContext].filter(Boolean).join(' ');
          enhancedInput = `${allContext}\n\n${input}`;
        }
        
        sendMessage({ text: enhancedInput });
        setInput('');
        setChatInput('');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value;
    setInput(newInput);
    setChatInput(newInput);
  };

  const append = (message: { role: 'user'; content: string }) => {
    if (!isSignedIn) {
      return;
    }
    const { isLimited } = sendRateLimitedMessage();
    if (!isLimited) {
      sendMessage({ text: message.content });
    }
  };

  const handleNewChat = () => {
    if (!isSignedIn) {
      return;
    }
    setMessages([]);
    setInput('');
    clearChat();
    clearEventReferences();
    clearCalendarReferences();
    refreshRateLimit();
  };

  const handleRegenerate = async (messageId: string) => {
    setRegeneratingMessageId(messageId);
    setIsRegenerating(true);

    try {
      await regenerate();
    } catch (error) {
      console.error('Failed to regenerate:', error);
    } finally {
      setIsRegenerating(false);
      setRegeneratingMessageId(null);
    }
  };

  const handleCopy = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (message) {
      const content = message.parts
        .filter((part) => part.type === 'text')
        .map((part) => (part as any).text)
        .join('');
      navigator.clipboard.writeText(content);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setChatMessages(messages);
    }
  }, [messages, setChatMessages]);

  const isGenerating = status === 'submitted' || status === 'streaming';

  return (
    <div
      className={cn(
        'flex h-full flex-col text-neutral-900 dark:text-white',
        mode === 'fullscreen' ? 'scrollbar-hide mx-auto w-full max-w-4xl' : '',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center justify-end gap-3 px-2 py-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-8 w-8 text-neutral-900 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
                onClick={onToggleSidebar}
                size="icon"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-black font-semibold text-white">
              <p>Close Chat</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-8 w-8 text-neutral-900 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
                onClick={onToggleFullscreen}
                size="icon"
                variant="ghost"
              >
                {mode === 'fullscreen' ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-black font-semibold text-white">
              <p>{mode === 'fullscreen' ? 'Sidebar Mode' : 'Fullscreen'}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-8 w-8 text-neutral-900 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
                onClick={onTogglePopup}
                size="icon"
                variant="ghost"
              >
                {mode === 'sidebar' ? (
                  <Smartphone className="h-4 w-4" />
                ) : (
                  <PanelRight className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-black font-semibold text-white">
              <p>{mode === 'sidebar' ? 'Popup Mode' : 'Sidebar Mode'}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 rounded-md bg-neutral-100 px-2 py-1 dark:bg-neutral-800">
                <MessageSquare className="h-4 w-4 text-neutral-900 dark:text-white" />
                <span className="text-neutral-900 text-sm dark:text-white">
                  {messagesLeft}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-black font-semibold text-white">
              <p>
                {currentUser?.isPro
                  ? 'Messages left this minute'
                  : 'Messages left today'}
              </p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-8 w-8 text-neutral-900 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
                onClick={handleNewChat}
                size="icon"
                variant="ghost"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-black font-semibold text-white">
              <p>New Chat</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="mt-3 min-h-0 flex-1">
        <SignedOut>
          <div className="flex h-full items-center justify-center">
            <div className="space-y-4 text-center">
              <h3 className="font-medium text-lg text-neutral-900 dark:text-white">
                Sign in to use AI Assistant
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Connect with your calendar AI to manage events and schedule
              </p>
              <SignInButton mode="modal">
                <Button>Sign in to Chat</Button>
              </SignInButton>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <Chat
            append={append}
            className="h-full bg-transparent px-2"
            disabled={!isSignedIn || isLimited}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            input={input}
            isGenerating={isGenerating}
            isRegenerating={isRegenerating && regeneratingMessageId !== null}
            messages={messages}
            mode={mode}
            onCopy={handleCopy}
            onRegenerate={handleRegenerate}
            stop={stop}
            suggestions={[
              'free time for coffee',
              'work meetings',
              'add a new task',
              'meeting with Mike',
              'pr review',
              "mom's birthday",
            ]}
          />
        </SignedIn>
      </div>
    </div>
  );
}
