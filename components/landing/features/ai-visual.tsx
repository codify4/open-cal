'use client'

import { useState, useEffect } from 'react'
import { Bot, Calendar, Clock, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react'

export function AIAgentVisual() {
    const [currentMessage, setCurrentMessage] = useState(0)
    
    const conversation = [
        {
            type: "user",
            text: "I need to schedule a team meeting next week",
            time: "2:30 PM"
        },
        {
            type: "ai",
            text: "I found 3 available slots next week. Would you like me to check for conflicts with your team?",
            time: "2:31 PM",
            actions: ["Check conflicts", "Show slots", "Book now"]
        },
        {
            type: "ai",
            text: "Found 2 conflicts. Here are the best options:",
            time: "2:32 PM",
            slots: [
                { time: "Mon 10:00 AM", status: "available" },
                { time: "Wed 2:00 PM", status: "available" },
                { time: "Thu 11:00 AM", status: "conflict" }
            ]
        }
    ]
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessage((prev) => (prev + 1) % conversation.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [])
    
    return (
        <div className="relative aspect-square w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl sm:rounded-3xl border border-white/10" />
            
            <div className="relative h-full p-4 sm:p-6 flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <div className="h-2 bg-white/10 rounded-full mb-1" />
                        <div className="h-1.5 bg-white/5 rounded-full w-2/3" />
                    </div>
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 space-y-3 overflow-hidden">
                    {conversation.map((msg, i) => (
                        <div key={i} className={`transition-all duration-500 ease-in-out ${
                            i === currentMessage ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
                        }`}>
                            {msg.type === "user" ? (
                                <div className="flex justify-end">
                                    <div className="bg-white/10 rounded-2xl px-3 py-2 max-w-[80%]">
                                        <p className="text-white/90 text-xs">{msg.text}</p>
                                        <span className="text-white/40 text-xs">{msg.time}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 rounded-2xl px-3 py-2 max-w-[85%] border border-white/10">
                                        <p className="text-white/80 text-xs mb-2">{msg.text}</p>
                                        
                                        {msg.actions && (
                                            <div className="flex gap-2 mb-2">
                                                {msg.actions.map((action, j) => (
                                                    <button key={j} className="px-2 py-1 bg-white/10 rounded-lg text-white/70 text-xs hover:bg-white/20 transition-colors">
                                                        {action}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {msg.slots && (
                                            <div className="space-y-1">
                                                {msg.slots.map((slot, j) => (
                                                    <div key={j} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                                                        <span className="text-white/70 text-xs">{slot.time}</span>
                                                        <div className="flex items-center gap-1">
                                                            {slot.status === "available" ? (
                                                                <CheckCircle className="w-3 h-3 text-green-400" />
                                                            ) : (
                                                                <AlertTriangle className="w-3 h-3 text-red-400" />
                                                            )}
                                                            <span className={`text-xs ${
                                                                slot.status === "available" ? "text-green-400" : "text-red-400"
                                                            }`}>
                                                                {slot.status === "available" ? "Available" : "Conflict"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        <span className="text-white/40 text-xs">{msg.time}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                
                {/* Input Area */}
                <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                            <MessageSquare className="w-3 h-3 text-white/40" />
                        </div>
                        <div className="flex-1 h-6 bg-white/10 rounded-lg" />
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                            <Calendar className="w-3 h-3 text-blue-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}