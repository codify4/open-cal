"use client"

import { MessageSquare, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BsRobot } from 'react-icons/bs'

const demoMessages = [
  {
    id: '1',
    role: 'user' as const,
    content: 'Schedule a meeting with the team tomorrow at 2 PM',
  },
  {
    id: '2',
    role: 'assistant' as const,
    content: 'I\'ll help you schedule that meeting. I found an available slot tomorrow at 2:00 PM. Would you like me to create the event?',
  },
  {
    id: '3',
    role: 'user' as const,
    content: 'Yes, please',
  },
  {
    id: '4',
    role: 'assistant' as const,
    content: 'Perfect! I\'ve created "Team Meeting" for tomorrow at 2:00 PM. The event has been added to your calendar.',
  },
]

export function DemoChatSidebar({ className = "" }: { className?: string }) {
  const [input, setInput] = useState('')

  return (
    <div className={`flex h-full flex-col bg-neutral-950 p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <BsRobot className="h-5 w-5 text-white/80" />
        <span className="text-white/80 font-medium">Caly Agent</span>
      </div>

      <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
        {demoMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                message.role === 'user'
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white border border-white/10'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            Find free time
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            Schedule meeting
          </Button>
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button size="sm" className="bg-white text-black hover:bg-white/90">
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
