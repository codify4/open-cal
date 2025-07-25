'use client'

import * as React from "react"
import { ChatMessage } from "./chat-message"
import { Chat } from "../ui/chat"
import { useChat } from "ai/react"
import { SidebarHeader, SidebarMenuButton, SidebarMenuItem, SidebarMenu } from "../ui/sidebar"
import { Command } from "lucide-react"

interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isTyping?: boolean
}

export function ChatSidebar({ className, ...props }: React.ComponentProps<"div">) {
  const [messagesChat, setMessagesChat] = React.useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
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
      content: 'I\'d be happy to help you with your project setup! What kind of project are you working on? Are you using any specific framework or technology stack?',
      role: 'assistant',
      timestamp: new Date(Date.now() - 15000)
    },
    {
      id: '4',
      content: 'I\'d be happy to help you with your project setup! What kind of project are you working on? Are you using any specific framework or technology stack?',
      role: 'assistant',
      timestamp: new Date(Date.now() - 15000)
    },
    {
      id: '5',
      content: 'I\'d be happy to help you with your project setup! What kind of project are you working on? Are you using any specific framework or technology stack?',
      role: 'assistant',
      timestamp: new Date(Date.now() - 15000)
    },
    {
      id: '6',
      content: 'I\'d be happy to help you with your project setup! What kind of project are you working on? Are you using any specific framework or technology stack?',
      role: 'assistant',
      timestamp: new Date(Date.now() - 15000)
    },
    {
      id: '7',
      content: 'I\'d be happy to help you with your project setup! What kind of project are you working on? Are you using any specific framework or technology stack?',
      role: 'assistant',
      timestamp: new Date(Date.now() - 15000)
    }
  ])
  const [inputValue, setInputValue] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, append, status, stop } =
  useChat()

const isLoading = status === "submitted" || status === "streaming"

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    }

    setMessagesChat(prev => [...prev, newMessage])
    setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'I understand your question. Let me help you with that! I can assist with coding, debugging, explaining concepts, and much more. What specific aspect would you like me to focus on?',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessagesChat(prev => [...prev, aiResponse])
    }, 2000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className={`flex flex-col h-full ${className}`} {...props}>
      <SidebarHeader className="bg-transparent border-none">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Digit</span>
                  <span className="truncate text-xs">Agent</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Chat
        className="h-full"
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isGenerating={isLoading}
        stop={stop}
        append={append}
        suggestions={[
          "Do I have free time today?",
          "Add a new task for tomorrow",
          "When is my next meeting?",
        ]}
      />
      {/* <div className="flex-1 min-h-0">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-4 p-4 pb-2">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                id={message.id}
                content={message.content}
                role={message.role}
                timestamp={message.timestamp}
              />
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-muted/50 shadow-sm">
                  <div className="h-4 w-4 text-primary" />
                </div>
                <div className="flex max-w-[85%] flex-col gap-2 rounded-2xl px-4 py-3 text-sm shadow-sm bg-muted border border-border">
                  <LoadingAnimation size="sm" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
      {messages.length <= 1 && (
        <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
      )}
      
      <div className="sticky bottom-0 border-t border-border">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          disabled={isTyping}
        />
      </div> */}
    </div>
  )
}