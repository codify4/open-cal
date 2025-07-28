"use client"

import React from "react"
import { useAtom } from "jotai"
import { Clock, MapPin, Users, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { selectedEventAtom, eventsAtom, Event } from "@/lib/atoms/event-atom"
import { useDraggable } from "@dnd-kit/core"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

interface EventCardProps {
  event: Event
  className?: string
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  className = "" 
}) => {
  const [, setSelectedEvent] = useAtom(selectedEventAtom)
  const [events, setEvents] = useAtom(eventsAtom)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: event
  })

  const handleEdit = () => {
    setSelectedEvent(event)
  }

  const formatTime = (time: string) => {
    if (!time) return ""
    const [hours, minutes] = time.split(":")
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500 border-blue-600",
      green: "bg-green-500 border-green-600", 
      purple: "bg-purple-500 border-purple-600",
      orange: "bg-orange-500 border-orange-600",
      red: "bg-red-500 border-red-600",
      pink: "bg-pink-500 border-pink-600",
      yellow: "bg-yellow-500 border-yellow-600",
      gray: "bg-gray-500 border-gray-600"
    }
    return colorMap[color] || colorMap.blue
  }

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={setNodeRef}
          style={style}
          {...listeners}
          {...attributes}
          className={`
            relative group cursor-pointer rounded-md border p-2 text-xs
            hover:shadow-md transition-all duration-200
            ${getColorClasses(event.color)}
            ${event.isAllDay ? 'border-l-4' : ''}
            ${isDragging ? 'opacity-50' : ''}
            ${className}
          `}
          onClick={handleEdit}
        >
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white truncate">
                {event.title || "Untitled Event"}
              </h4>
            </div>
          </div>

          <div className="space-y-1">
            {!event.isAllDay && event.startTime && (
              <div className="flex items-center gap-1 text-white/90">
                <Clock className="h-3 w-3" />
                <span>
                  {formatTime(event.startTime)}
                  {event.endTime && ` - ${formatTime(event.endTime)}`}
                </span>
              </div>
            )}

            {event.isAllDay && (
              <div className="text-white/90 font-medium">
                All Day
              </div>
            )}

            {event.location && (
              <div className="flex items-center gap-1 text-white/90">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{event.location}</span>
              </div>
            )}

            {event.attendees && event.attendees.length > 0 && (
              <div className="flex items-center gap-1 text-white/90">
                <Users className="h-3 w-3" />
                <span>{event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}</span>
              </div>
            )}

            {event.description && (
              <div className="text-white/80 truncate">
                {event.description}
              </div>
            )}
          </div>

          {event.type === 'birthday' && (
            <div className="absolute top-1 right-1">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="bg-neutral-900 border-neutral-700">
        <ContextMenuItem 
          className="text-white hover:bg-neutral-800 cursor-pointer"
          onClick={() => console.log("Duplicate event:", event.id)}
        >
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem 
          className="text-white hover:bg-neutral-800 cursor-pointer"
          onClick={() => console.log("Copy event:", event.id)}
        >
          Copy
        </ContextMenuItem>
        <ContextMenuItem 
          className="text-red-400 hover:bg-red-900/20 cursor-pointer"
          onClick={() => {
            setEvents(prev => prev.filter(e => e.id !== event.id))
          }}
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
} 