'use client'

import * as React from "react"
import { GalleryVerticalEnd, Send, Bot, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export function ChatSidebar({ className, ...props }: React.ComponentProps<"div">) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      role: 'assistant',
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: '2',
      content: 'I need help with my project setup',
      role: 'user',
      timestamp: new Date(Date.now() - 30000)
    },
    {
      id: '3',
      content: 'I\'d be happy to help you with your project setup! What kind of project are you working on?',
      role: 'assistant',
      timestamp: new Date(Date.now() - 15000)
    }
  ])
  const [inputValue, setInputValue] = React.useState('')
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'I understand your question. Let me help you with that!',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className={`flex flex-col h-full bg-neutral-900 ${className}`} {...props}>
      {/* Header */}
      <div className="flex flex-col gap-2 p-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-medium">AI Assistant</span>
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="space-y-4 py-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`flex max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="leading-relaxed">{message.content}</div>
                <div className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="border-t border-neutral-700 p-2">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[60px] resize-none"
            rows={2}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            size="icon"
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}