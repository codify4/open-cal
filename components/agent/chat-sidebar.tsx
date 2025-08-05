'use client';

import { useChat } from '@ai-sdk/react';
import { Maximize2, MessageSquare, Minimize2, Plus, X } from 'lucide-react';
import type * as React from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Chat } from '@/components/agent/chat';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useChatStore } from '@/providers/chat-store-provider';

interface ChatSidebarProps {
  isFullscreen: boolean;
  onToggleSidebar: () => void;
  onToggleFullscreen: () => void;
}

export function ChatSidebar({
  className,
  isFullscreen,
  onToggleSidebar,
  onToggleFullscreen,
  ...props
}: React.ComponentProps<'div'> & ChatSidebarProps) {
  const { messages, sendMessage, status, setMessages, regenerate } = useChat();
  const [input, setInput] = useState('');
  const [messagesLeft, setMessagesLeft] = useState(3);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratingMessageId, setRegeneratingMessageId] = useState<string | null>(null);
  
  const chatMessages = useChatStore((state) => state.messages);
  const chatInput = useChatStore((state) => state.input);
  const setChatMessages = useChatStore((state) => state.setMessages);
  const setChatInput = useChatStore((state) => state.setInput);
  const clearChat = useChatStore((state) => state.clearChat);

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
    if (input.trim() && messagesLeft > 0) {
      sendMessage({ text: input });
      setInput('');
      setChatInput('');
      setMessagesLeft(prev => Math.max(0, prev - 1));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value;
    setInput(newInput);
    setChatInput(newInput);
  };

  const append = (message: { role: 'user'; content: string }) => {
    if (messagesLeft > 0) {
      sendMessage({ text: message.content });
      setMessagesLeft(prev => Math.max(0, prev - 1));
    }
  };

  const stop = () => {
    // Stop generation if needed
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setMessagesLeft(3);
    clearChat();
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
    const message = messages.find(m => m.id === messageId);
    if (message) {
      const content = message.parts
        .filter(part => part.type === 'text')
        .map(part => (part as any).text)
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
        isFullscreen ? 'mx-auto w-full max-w-4xl scrollbar-hide' : '',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center justify-end gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-8 w-8 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={isFullscreen ? onToggleFullscreen : onToggleSidebar}
                size="icon"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white dark:bg-neutral-950 font-semibold text-neutral-900 dark:text-white">
              <p>{isFullscreen ? 'Exit Fullscreen' : 'Close'}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-8 w-8 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={onToggleFullscreen}
                size="icon"
                variant="ghost"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white dark:bg-neutral-950 font-semibold text-neutral-900 dark:text-white">
              <p>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-1">
                <MessageSquare className="h-4 w-4 text-neutral-900 dark:text-white" />
                <span className="text-sm text-neutral-900 dark:text-white">{messagesLeft}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-white dark:bg-neutral-950 font-semibold text-neutral-900 dark:text-white">
              <p>Messages left</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-8 w-8 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={handleNewChat}
                size="icon"
                variant="ghost"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white dark:bg-neutral-950 font-semibold text-neutral-900 dark:text-white">
              <p>New Chat</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="mt-3 flex-1 min-h-0">
        <Chat
          append={append}
          className="h-full bg-transparent"
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          input={input}
          isGenerating={isGenerating}
          messages={messages}
          stop={stop}
          disabled={messagesLeft === 0}
          onRegenerate={handleRegenerate}
          isRegenerating={isRegenerating && regeneratingMessageId !== null}
          onCopy={handleCopy}
          suggestions={[
            'free time for coffee',
            'work meetings',
            'add a new task',
            'meeting with Mike',
            'pr review',
            "mom's birthday",
          ]}
        />
      </div>
    </div>
  );
}
