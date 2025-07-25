'use client'

import * as React from "react"
import { 
  X, 
  Maximize2,
  Plus,
  MessageSquare
} from "lucide-react"
import { Chat } from "../ui/chat"
import { useChat } from "ai/react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { useAtom } from "jotai"
import { isChatSidebarOpenAtom } from "@/lib/atoms/chat-atom"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

export function ChatSidebar({ className, ...props }: React.ComponentProps<"div">) {
  const { messages, input, handleInputChange, handleSubmit, append, status, stop } = useChat()
  const isLoading = status === "submitted" || status === "streaming"
  const [, setIsChatSidebarOpen] = useAtom(isChatSidebarOpenAtom)

  return (
    <div className={cn("flex flex-col h-full text-white", className)} {...props}>
      <div className="flex items-center justify-between ">
        <div className="flex items-center justify-end w-full gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:bg-neutral-800"
                onClick={() => setIsChatSidebarOpen(false)}
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
              >
                <Maximize2 className="h-4 w-4" />
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