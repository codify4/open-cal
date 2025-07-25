'use client'

import { Bot, User, Copy, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ChatMessageProps {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isTyping?: boolean
}

export function ChatMessage({ id, content, role, timestamp, isTyping = false }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        "group flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
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
          "flex max-w-[85%] flex-col gap-2 rounded-2xl px-4 py-3 text-sm shadow-sm transition-all duration-200 hover:shadow-md",
          role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-background border border-border'
        )}
      >
        <div className="leading-relaxed whitespace-pre-wrap">
          {isTyping ? (
            <div className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-current rounded-full animate-bounce" />
              <span className="inline-block w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="inline-block w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
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
  )
} 