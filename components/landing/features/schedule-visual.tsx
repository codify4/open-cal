'use client'

import { useState, useEffect } from 'react'
import { Clock, Brain } from 'lucide-react'

export function SmartSchedulingVisual() {
    const [activeSlot, setActiveSlot] = useState(0)
    
    const timeSlots = [
        { 
            start: "Tue 16 12:00 AM",
            end: "Tue 16 11:59 PM",
            duration: 1440
        },
        { 
            start: "Wed 17 8:00 AM",
            end: "Wed 17 9:00 AM",
            duration: 60
        },
        { 
            start: "Thu 18 3:00 PM",
            end: "Thu 18 6:00 PM",
            duration: 180
        },
        { 
            start: "Sat 20 9:00 AM",
            end: "Sat 20 5:00 PM",
            duration: 0
        }
    ]
    
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlot((prev) => (prev + 1) % timeSlots.length)
        }, 1000)
        return () => clearInterval(interval)
    }, [])
    
    return (
        <div className="relative aspect-square w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl sm:rounded-3xl border border-white/10" />
            
            <div className="relative h-full p-4 sm:p-6 flex flex-col">
                <div className="text-center mb-4">
                    <div className="w-12 h-12 mx-auto rounded-full border border-white/20 flex items-center justify-center mb-2">
                        <Brain className="w-6 h-6 text-white/80" />
                    </div>
                    <h4 className="text-white/80 text-sm font-medium">AI Smart Scheduling</h4>
                </div>
                
                <div className="mb-4">
                    {timeSlots.map((slot, i) => {
                        const isActive = i === activeSlot
                        const isAllDay = slot.duration >= 1440
                        const hasNoFreeTime = slot.duration === 0
                        
                        return (
                            <div 
                                key={i}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-500 mb-4 ${
                                    isActive
                                        ? 'bg-white/10 border-white/30 shadow-lg shadow-white/5 scale-105'
                                        : 'bg-white/5 border-white/10 opacity-60'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    isActive 
                                        ? hasNoFreeTime
                                            ? 'bg-red-500/20 border border-red-500/30'
                                            : isAllDay 
                                                ? 'bg-green-500/20 border border-green-500/30'
                                                : 'bg-blue-500/20 border border-blue-500/30'
                                        : 'bg-white/10'
                                }`}>
                                    <Clock 
                                        className={`w-4 h-4 ${
                                            isActive 
                                                ? hasNoFreeTime
                                                    ? 'text-red-400'
                                                    : isAllDay 
                                                        ? 'text-green-400'
                                                        : 'text-blue-400'
                                                : 'text-white/60'
                                        }`} 
                                     />
                                </div>
                                <div className="flex-1">
                                    <div className="space-y-1 mb-1">
                                        <div className="text-xs text-white/70">
                                            {slot.start}
                                        </div>
                                        <div className="text-xs text-white/70">
                                            {slot.end}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs px-2 py-0.5 rounded-full text-center w-18 ${
                                        hasNoFreeTime
                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                            : isAllDay 
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                    }`}>
                                        {hasNoFreeTime ? 'Busy' : isAllDay ? 'All Day' : 'Free Time'}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}