"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event, CustomEventModal } from "@/types";
import { TrashIcon, CalendarIcon, ClockIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Function to format date
const formatDate = (date: Date) => {
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

// Function to format time only
const formatTime = (date: Date) => {
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

// Color variants based on event type
const variantColors = {
  primary: {
    bg: "bg-blue-100",
    border: "border-blue-200",
    text: "text-blue-800",
  },
  danger: {
    bg: "bg-red-100",
    border: "border-red-200",
    text: "text-red-800",
  },
  success: {
    bg: "bg-green-100",
    border: "border-green-200",
    text: "text-green-800",
  },
  warning: {
    bg: "bg-yellow-100",
    border: "border-yellow-200",
    text: "text-yellow-800",
  },
};

interface EventStyledProps extends Event {
  minmized?: boolean;
  CustomEventComponent?: React.FC<Event>;
}

export default function EventStyled({
  event,
  onDelete,
}: {
  event: EventStyledProps;
  onDelete?: (id: string) => void;
}) {


  // Determine if delete button should be shown
  // Hide it for minimized events to save space, show on hover instead
  const shouldShowDeleteButton = !event?.minmized;


  // Get background color class based on color
  const getBackgroundColor = (color: string | undefined) => {
    const colorKey = color as keyof typeof variantColors || "primary";
    const colors = variantColors[colorKey] || variantColors.primary;
    return colors;
  };

  // Get color variant based on event color
  const getColorVariant = (color: string | undefined) => {
    const colorMap: Record<string, string> = {
      blue: "primary",
      red: "danger",
      green: "success",
      yellow: "warning",
    };
    return colorMap[color || "blue"] || "primary";
  };

  // Format time for display
  const formatTimeDisplay = (time: string | undefined) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get event status based on color
  const getEventStatus = (color: string | undefined) => {
    const colorMap: Record<string, string> = {
      blue: "primary",
      red: "danger",
      green: "success",
      yellow: "warning",
    };
    return colorMap[color || "blue"] || "default";
  };

  // Handle delete event
  const handleDeleteEvent = (eventId: string) => {
    if (onDelete) {
      onDelete(eventId);
    } else {
      console.log("Delete event:", eventId);
    }
  };

  // If custom event component is provided, use it
  if (event.CustomEventComponent) {
    const CustomComponent = event.CustomEventComponent;
    return <CustomComponent {...event} />;
  }

  const colors = getBackgroundColor(event.color);
  const variant = getColorVariant(event.color);
  const status = getEventStatus(event.color);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative group cursor-pointer rounded-md border p-2 text-xs transition-all duration-200 hover:shadow-md",
        colors.bg,
        colors.border,
        colors.text,
        event?.minmized ? "min-h-[20px] max-h-[40px] overflow-hidden" : "min-h-[60px]"
      )}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">
            {event.title || "Untitled Event"}
          </h4>
        </div>
        {shouldShowDeleteButton && (
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-4 w-4 p-0 ml-1"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteEvent(event.id);
            }}
          >
            <TrashIcon className="h-3 w-3" />
          </Button>
        )}
      </div>

      {!event?.minmized && (
        <div className="space-y-1">
          {!event.isAllDay && event.startTime && (
            <div className="flex items-center gap-1 text-xs">
              <ClockIcon className="h-3 w-3" />
              <span>
                {formatTimeDisplay(event.startTime)}
                {event.endTime && ` - ${formatTimeDisplay(event.endTime)}`}
              </span>
            </div>
          )}

          {event.isAllDay && (
            <div className="text-xs font-medium">
              All Day
            </div>
          )}

          {event.location && (
            <div className="text-xs truncate">
              📍 {event.location}
            </div>
          )}

          {event.attendees && event.attendees.length > 0 && (
            <div className="text-xs">
              👥 {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
            </div>
          )}

          {event.description && (
            <div className="text-xs truncate opacity-80">
              {event.description}
            </div>
          )}

          {event.type === 'birthday' && (
            <Badge variant="secondary" className="text-xs">
              🎂 Birthday
            </Badge>
          )}
        </div>
      )}

      {event.type === 'birthday' && event?.minmized && (
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
        </div>
      )}
    </motion.div>
  );
}
