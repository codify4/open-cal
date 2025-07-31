'use client';

import {
  Code,
  FileText,
  HelpCircle,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Suggestion {
  id: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'general' | 'code' | 'help' | 'tools';
}

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  className?: string;
}

const suggestions: Suggestion[] = [
  {
    id: '1',
    text: 'Help me with code',
    icon: Code,
    category: 'code',
  },
  {
    id: '2',
    text: 'Explain a concept',
    icon: FileText,
    category: 'general',
  },
  {
    id: '3',
    text: 'Debug an issue',
    icon: Settings,
    category: 'code',
  },
  {
    id: '4',
    text: 'How to use this app',
    icon: HelpCircle,
    category: 'help',
  },
  {
    id: '5',
    text: 'Quick tips',
    icon: Zap,
    category: 'general',
  },
  {
    id: '6',
    text: 'Best practices',
    icon: Sparkles,
    category: 'general',
  },
];

export function ChatSuggestions({
  onSuggestionClick,
  className,
}: ChatSuggestionsProps) {
  return (
    <div className={cn('space-y-3 p-4', className)}>
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Sparkles className="h-4 w-4" />
        <span>Quick suggestions</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;
          return (
            <Button
              className="flex h-auto flex-col items-start gap-2 p-3 text-left transition-all duration-200 hover:bg-primary/10"
              key={suggestion.id}
              onClick={() => onSuggestionClick(suggestion.text)}
              size="sm"
              variant="outline"
            >
              <Icon className="h-4 w-4 text-primary" />
              <span className="font-medium text-xs">{suggestion.text}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
