'use client';

import { useChat } from '@ai-sdk/react';
import { Maximize2, MessageSquare, Minimize2, Plus, X } from 'lucide-react';
import type * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Chat } from '@/components/agent/chat';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');

  const handleSubmit = (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList }
  ) => {
    event?.preventDefault?.();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const append = (message: { role: 'user'; content: string }) => {
    sendMessage({ text: message.content });
  };

  const stop = () => {
    // Stop generation if needed
  };

  const isGenerating = status === 'submitted' || status === 'streaming';

  return (
    <div
      className={cn(
        'flex h-full flex-col text-neutral-900 dark:text-white',
        isFullscreen ? 'mx-auto w-full max-w-4xl' : '',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between ">
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
                <span className="text-sm text-neutral-900 dark:text-white">0</span>
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
                size="icon"
                variant="ghost"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white dark:bg-neutral-950 font-semibold text-neutral-900 dark:text-white">
              <p>Add</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="mt-3 flex-1">
        <Chat
          append={append}
          className="h-full bg-transparent"
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          input={input}
          isGenerating={isGenerating}
          messages={messages}
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
      </div>
    </div>
  );
}
