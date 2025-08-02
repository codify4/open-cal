'use client';

import { Send, Smile } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = 'Type your message...',
  className,
}: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className={cn('p-4', className)}>
      <div className="relative">
        <div
          className={cn(
            'flex flex-col items-end gap-2 rounded-2xl border-2 p-2 transition-all duration-200',
            isFocused 
              ? 'border-primary/50 bg-background' 
              : 'border-border bg-background/50'
          )}
        >
          <Textarea
            className="resize-none border-0 bg-transparent p-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={disabled}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            ref={textareaRef}
            rows={1}
            value={value}
          />

          <div className="flex items-center gap-1">
            <Button
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              size="sm"
              variant="ghost"
            >
              <Smile className="h-4 w-4" />
            </Button>

            <Button
              className="h-8 w-8 bg-primary p-0 text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!value.trim() || disabled}
              onClick={handleSend}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
