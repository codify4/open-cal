"use client"

import React from "react"
import { Calendar, Cake } from "lucide-react"
import { Event } from "@/lib/store/calendar-store"
import { useDraggable } from "@dnd-kit/core"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCalendarStore } from "@/providers/calendar-store-provider"

interface EventCardProps {
  event: Event
  className?: string
  minimized?: boolean
}

export const EventCard = ({ 
  event, 
  className = "",
  minimized = false
}: EventCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: event
  })

  const { openEventSidebarForEdit } = useCalendarStore((state) => state)

  const handleEdit = () => {
    openEventSidebarForEdit(event)
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

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return 'Invalid time'
    }
    const hours = dateObj.getHours()
    const minutes = dateObj.getMinutes()
    const hour12 = hours % 12 || 12
    const ampm = hours < 12 ? 'AM' : 'PM'
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`
  }

  const timeDisplay = `${formatTime(event.startDate)}–${formatTime(event.endDate)}`

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
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
            ${minimized ? 'min-h-[20px] max-h-[40px] overflow-hidden' : 'min-h-[60px]'}
            ${className}
          `}
          onClick={handleEdit}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 flex items-center gap-1">
              {event.type === 'birthday' ? (
                <Cake className="h-3 w-3 text-white" />
              ) : (
                <Calendar className="h-3 w-3 text-white" />
              )}
              <h4 className="font-medium text-white truncate">
                {event.title || "Untitled Event"}
              </h4>
            </div>
          </div>

          {!minimized && (
            <div className="text-white/80 truncate mt-1">
              {timeDisplay}
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="bg-neutral-900 border-neutral-700">
        <DropdownMenuItem 
          className="text-white hover:bg-neutral-800 cursor-pointer"
          onClick={handleEdit}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-white hover:bg-neutral-800 cursor-pointer"
          onClick={() => console.log("Duplicate event:", event.id)}
        >
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-white hover:bg-neutral-800 cursor-pointer"
          onClick={() => console.log("Copy event:", event.id)}
        >
          Copy
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-400 hover:bg-red-900/20 cursor-pointer"
          onClick={() => console.log("Delete event:", event.id)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 