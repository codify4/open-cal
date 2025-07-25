'use client'

import { Sparkles, Code, FileText, Settings, HelpCircle, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Suggestion {
  id: string
  text: string
  icon: React.ComponentType<{ className?: string }>
  category: 'general' | 'code' | 'help' | 'tools'
}

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
  className?: string
}

const suggestions: Suggestion[] = [
  {
    id: '1',
    text: 'Help me with code',
    icon: Code,
    category: 'code'
  },
  {
    id: '2',
    text: 'Explain a concept',
    icon: FileText,
    category: 'general'
  },
  {
    id: '3',
    text: 'Debug an issue',
    icon: Settings,
    category: 'code'
  },
  {
    id: '4',
    text: 'How to use this app',
    icon: HelpCircle,
    category: 'help'
  },
  {
    id: '5',
    text: 'Quick tips',
    icon: Zap,
    category: 'general'
  },
  {
    id: '6',
    text: 'Best practices',
    icon: Sparkles,
    category: 'general'
  }
]

export function ChatSuggestions({ onSuggestionClick, className }: ChatSuggestionsProps) {
  return (
    <div className={cn("p-4 space-y-3", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        <span>Quick suggestions</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon
          return (
            <Button
              key={suggestion.id}
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(suggestion.text)}
              className="h-auto p-3 flex flex-col items-start gap-2 text-left hover:bg-primary/10 transition-all duration-200"
            >
              <Icon className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">{suggestion.text}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
} 