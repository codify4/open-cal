'use client'

import * as React from "react"
import { 
  X, 
  Maximize2,
  Plus,
  MessageSquare,
  Minimize2
} from "lucide-react"
import { Chat } from "../ui/chat"
import { useChat } from "ai/react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface ChatSidebarProps {
  isFullscreen: boolean
  onToggleFullscreen: () => void
}

export function ChatSidebar({ className, isFullscreen, onToggleFullscreen, ...props }: React.ComponentProps<"div"> & ChatSidebarProps) {
  const { messages, input, handleInputChange, handleSubmit, append, status, stop } = useChat()
  const isLoading = status === "submitted" || status === "streaming"

  return (
    <div 
      className={cn(
        "flex flex-col h-full text-white",
        isFullscreen ? "w-full max-w-4xl mx-auto" : "w-full",
        className
      )} 
      {...props}
    >
      <div className="flex items-center justify-between ">
        <div className="flex items-center justify-end w-full gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:bg-neutral-800"
                onClick={onToggleFullscreen}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-neutral-950 text-white font-semibold">
              <p>Close</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:bg-neutral-800"
                onClick={onToggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-neutral-950 text-white font-semibold">
              <p>Fullscreen</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 px-2 py-1 bg-neutral-800 rounded-md">
                <MessageSquare className="h-4 w-4 text-white" />
                <span className="text-sm text-white">0</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-neutral-950 text-white font-semibold">
              <p>Messages left</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:bg-neutral-800"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-neutral-950 text-white font-semibold">
              <p>Add</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex-1 mt-3">
        <Chat
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isGenerating={isLoading}
          stop={stop}
          append={append}
          suggestions={[
            "free time for coffee",
            "work meetings",
            "add a new task",
            "meeting with Mike",
            "pr review",
            "mom's birthday",
          ]}
          className="h-full bg-transparent"
        />
      </div>
    </div>
  )
}