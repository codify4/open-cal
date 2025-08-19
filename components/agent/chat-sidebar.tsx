'use client';

import { useChat } from '@ai-sdk/react';
import { Maximize2, MessageSquare, Minimize2, Plus, X, PanelRight, PanelLeft } from 'lucide-react';
import type * as React from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Chat } from '@/components/agent/chat';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useChatStore } from '@/providers/chat-store-provider';
import { useRateLimit } from '@/hooks/use-rate-limit';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';

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
  const { messages, sendMessage, status, setMessages, regenerate, stop } = useChat();
  const [input, setInput] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratingMessageId, setRegeneratingMessageId] = useState<string | null>(null);
  
  const { messagesLeft, isLimited, sendMessage: sendRateLimitedMessage, refreshRateLimit } = useRateLimit();
  const { user: clerkUser, isSignedIn } = useUser();
  const currentUser = useQuery(api.auth.getCurrentUser, { 
    clerkUserId: clerkUser?.id 
  });
  
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
    if (!isSignedIn) {
      return;
    }
    if (input.trim()) {
      const { isLimited } = sendRateLimitedMessage();
      
      if (!isLimited) {
        sendMessage({ text: input });
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
        mode === 'fullscreen' ? 'mx-auto w-full max-w-4xl scrollbar-hide' : '',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center justify-end gap-3 px-2 py-1">
            <Tooltip>
             <TooltipTrigger asChild>
               <Button
                 className="h-8 w-8 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
                 className="h-8 w-8 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
                 className="h-8 w-8 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                 onClick={onTogglePopup}
                 size="icon"
                 variant="ghost"
               >
                 {mode === 'sidebar' ? <PanelRight className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
               </Button>
             </TooltipTrigger>
             <TooltipContent className="bg-black font-semibold text-white">
               <p>Sidebar Mode</p>
             </TooltipContent>
           </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-1">
                <MessageSquare className="h-4 w-4 text-neutral-900 dark:text-white" />
                <span className="text-sm text-neutral-900 dark:text-white">{messagesLeft}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-black font-semibold text-white">
              <p>{currentUser?.isPro ? 'Messages left this minute' : 'Messages left today'}</p>
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
            <TooltipContent className="bg-black font-semibold text-white">
              <p>New Chat</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="mt-3 flex-1 min-h-0">
        <SignedOut>
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
                Sign in to use AI Assistant
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Connect with your calendar AI to manage events and schedule
              </p>
              <SignInButton mode="modal">
                <Button>
                  Sign in to Chat
                </Button>
              </SignInButton>
            </div>
          </div>
        </SignedOut>
        
        <SignedIn>
          <Chat
            append={append}
            className="h-full bg-transparent px-2"
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            input={input}
            isGenerating={isGenerating}
            messages={messages}
            stop={stop}
            disabled={!isSignedIn || isLimited}
            onRegenerate={handleRegenerate}
            isRegenerating={isRegenerating && regeneratingMessageId !== null}
            onCopy={handleCopy}
            mode={mode}
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
