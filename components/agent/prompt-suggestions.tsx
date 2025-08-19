'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface PromptSuggestionsProps {
  append: (message: { role: 'user'; content: string }) => void;
  suggestions: string[];
  mode: 'popup' | 'sidebar' | 'fullscreen';
}

export function PromptSuggestions({
  append,
  suggestions,
  mode,
}: PromptSuggestionsProps) {
  const { theme } = useTheme();
  return (
    <div
      className={cn(
        'flex max-w-md flex-col items-center justify-center gap-6',
        mode === 'popup' && 'max-w-sm'
      )}
    >
      <Image
        alt="Caly"
        className="rounded-full border dark:border-none"
        height={80}
        src={theme === 'dark' ? '/caly.svg' : '/caly-light.svg'}
        width={80}
      />

      <div className="flex flex-col items-center gap-2">
        <h1 className="font-bold text-foreground text-xl">Caly Agent</h1>
        <p className="text-muted-foreground text-sm">
          Ask anything about your calendar
        </p>
      </div>

      <div className="relative flex flex-col items-center">
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent dark:from-neutral-900" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-20 bg-gradient-to-l from-background to-transparent dark:from-neutral-900" />
        <div className="mb-3 flex gap-3 overflow-x-hidden">
          {suggestions.slice(0, 3).map((suggestion, index) => (
            <Button
              className={cn(
                'h-auto flex-shrink-0 cursor-pointer whitespace-nowrap rounded-sm border border-border bg-card/50 p-2 text-left text-card-foreground transition-all duration-200 hover:border-border/80 hover:bg-card/80',
                mode === 'popup' && 'p-1 text-xs'
              )}
              key={suggestion}
              onClick={() => append({ role: 'user', content: suggestion })}
              variant="outline"
            >
              <span className="text-card-foreground text-sm leading-relaxed">
                {suggestion}
              </span>
            </Button>
          ))}
        </div>

        <div className="flex gap-3 overflow-x-hidden">
          {suggestions.slice(3, 6).map((suggestion, index) => (
            <Button
              className={cn(
                'h-auto flex-shrink-0 cursor-pointer whitespace-nowrap rounded-sm border border-border bg-card/50 p-2 text-left text-card-foreground transition-all duration-200 hover:border-border/80 hover:bg-card/80',
                mode === 'popup' && 'rounded-sm p-1 text-xs'
              )}
              key={suggestion}
              onClick={() => append({ role: 'user', content: suggestion })}
              variant="outline"
            >
              <span className="text-card-foreground text-sm leading-relaxed">
                {suggestion}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
