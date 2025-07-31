'use client';

import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

export function ChatMessage({
  content,
  role,
  isTyping = false,
}: ChatMessageProps) {
  return (
    <div
      className={cn(
        'group fade-in-0 slide-in-from-bottom-2 flex animate-in gap-3 duration-300',
        role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      {role === 'assistant' && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-muted/50 shadow-sm">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}

      <div
        className={cn(
          'flex max-w-[85%] flex-col gap-2 rounded-2xl px-4 py-3 text-sm shadow-sm transition-all duration-200 hover:shadow-md',
          role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'border border-border bg-background'
        )}
      >
        <div className="whitespace-pre-wrap leading-relaxed">
          {isTyping ? (
            <div className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-current" />
              <span
                className="inline-block h-2 w-2 animate-bounce rounded-full bg-current"
                style={{ animationDelay: '0.1s' }}
              />
              <span
                className="inline-block h-2 w-2 animate-bounce rounded-full bg-current"
                style={{ animationDelay: '0.2s' }}
              />
            </div>
          ) : (
            content
          )}
        </div>
      </div>

      {role === 'user' && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-muted/50 shadow-sm">
          <User className="h-4 w-4 text-primary" />
        </div>
      )}
    </div>
  );
}
