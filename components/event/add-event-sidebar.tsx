import { useState, useEffect, useRef } from "react"
import { X, Save } from "lucide-react"
import { Button } from "../ui/button"
import { EventForm } from "./form/event-form"
import { BirthdayForm } from "./form/birthday-form"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import EventActionsDropdown from "./form/event-actions"
import { Event } from "@/lib/store/calendar-store"
import { useCalendarStore } from "@/providers/calendar-store-provider"

interface AddEventProps {
  onClick: () => void
}

const AddEventSidebar = ({ onClick }: AddEventProps) => {
  const [formType, setFormType] = useState<"event" | "birthday">("event")
  const currentFormData = useRef<Partial<Event>>({})

  const {
    selectedEvent,
    isNewEvent,
    hasUnsavedChanges,
    eventCreationContext,
    updateSelectedEvent,
    closeEventSidebar,
    saveEvent
  } = useCalendarStore((state) => state)

  const isEditing = !!selectedEvent && !isNewEvent

  useEffect(() => {
    if (selectedEvent) {
      setFormType(selectedEvent.type)
    } else if (eventCreationContext?.startDate && !selectedEvent) {
      const newEvent: Event = {
        id: `event-${Date.now()}`,
        title: eventCreationContext.title || "",
        description: eventCreationContext.description || "",
        startDate: eventCreationContext.startDate,
        endDate: eventCreationContext.endDate,
        color: eventCreationContext.color || "blue",
        type: eventCreationContext.type || "event",
        location: "",
        attendees: [],
        reminders: [],
        repeat: "none",
        visibility: "public"
      }
      
      updateSelectedEvent(newEvent)
    }
  }, [selectedEvent, eventCreationContext])

  const handleClose = () => {
    closeEventSidebar()
    currentFormData.current = {}
    onClick()
  }

  const handleFormDataChange = (eventData: Partial<Event>) => {
    currentFormData.current = { ...currentFormData.current, ...eventData }
    if (selectedEvent) {
      const updatedEvent = { ...selectedEvent, ...eventData }
      updateSelectedEvent(updatedEvent)
    }
  }

  const handleManualSave = () => {
    
    if (currentFormData.current && Object.keys(currentFormData.current).length > 0) {
      let eventToSave: Event
      
      if (selectedEvent) {
        eventToSave = { ...selectedEvent, ...currentFormData.current }
      } else {
        eventToSave = {
          id: `event-${Date.now()}`,
          title: currentFormData.current.title || "",
          description: currentFormData.current.description || "",
          startDate: currentFormData.current.startDate || new Date(),
          endDate: currentFormData.current.endDate || new Date(),
          color: currentFormData.current.color || "blue",
          type: currentFormData.current.type || "event",
          location: currentFormData.current.location || "",
          attendees: currentFormData.current.attendees || [],
          reminders: currentFormData.current.reminders || [],
          repeat: currentFormData.current.repeat || "none",
          visibility: currentFormData.current.visibility || "public"
        } as Event
      }
      
      saveEvent(eventToSave)
      closeEventSidebar()
      onClick()
    }
  }

  const handleDelete = () => {
    if (isEditing && selectedEvent) {
    }
    handleClose()
  }

  return (
    <div className="flex flex-col h-full text-white px-1">
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center">
          <Select value={formType} onValueChange={(value) => setFormType(value as "event" | "birthday")}>
            <SelectTrigger className="w-32 px-2 py-0 text-sm font-semibold text-white bg-transparent border-neutral-800 hover:bg-transparent rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 border-neutral-700">
              <SelectItem value="event" className="text-white hover:bg-neutral-800 cursor-pointer">
                Event
              </SelectItem>
              <SelectItem value="birthday" className="text-white hover:bg-neutral-800 cursor-pointer">
                Birthday
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:bg-neutral-800"
                onClick={handleManualSave}
                disabled={!isNewEvent && !hasUnsavedChanges}
              >
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-neutral-950 text-white font-semibold">
              <p>Save</p>
            </TooltipContent>
          </Tooltip>

          {isEditing && (
            <EventActionsDropdown
              onCut={() => console.log("Cut event")}
              onCopy={() => console.log("Copy event")}
              onDuplicate={() => console.log("Duplicate event")}
              onDelete={handleDelete}
            />
          )}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:bg-neutral-800"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-neutral-950 text-white font-semibold">
              <p>Close</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex-1 mt-3">
        {formType === "event" ? (
          <EventForm 
            event={selectedEvent}
            onSave={handleFormDataChange}
          />
        ) : (
          <BirthdayForm 
            event={selectedEvent}
            onSave={handleFormDataChange}
          />
        )}
      </div>
    </div>
  )
}

export default AddEventSidebar 