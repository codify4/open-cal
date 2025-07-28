import { useState, useEffect, useRef } from "react"
import { X, Save } from "lucide-react"
import { Button } from "../ui/button"
import { EventForm } from "./form/event-form"
import { BirthdayForm } from "./form/birthday-form"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import EventActionsDropdown from "./form/event-actions"
import { useAtom } from "jotai"
import { 
  selectedEventAtom, 
  isEventSidebarOpenAtom,
  eventCreationContextAtom
} from "@/lib/atoms/event-atom"
import { Event } from "@/types"
import { useScheduler } from "@/providers/schedular-provider"

interface AddEventProps {
  onClick: () => void
}

const AddEventSidebar = ({ onClick }: AddEventProps) => {
  const [formType, setFormType] = useState<"event" | "birthday">("event")
  const [selectedEvent, setSelectedEvent] = useAtom(selectedEventAtom)
  const [isEventSidebarOpen, setIsEventSidebarOpen] = useAtom(isEventSidebarOpenAtom)
  const [eventCreationContext] = useAtom(eventCreationContextAtom)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isNewEvent, setIsNewEvent] = useState(false)
  const { handlers } = useScheduler()
  const currentFormData = useRef<Partial<Event>>({})

  // Determine if we're editing an existing event or creating a new one
  const isEditing = !!selectedEvent && !isNewEvent

  // Update form type based on selected event
  useEffect(() => {
    if (selectedEvent) {
      setFormType(selectedEvent.type)
    } else if (eventCreationContext?.targetDate) {
      const newEvent: Event = {
        id: `event-${Date.now()}`,
        title: "",
        description: "",
        startDate: eventCreationContext.targetDate,
        endDate: eventCreationContext.targetDate,
        startTime: "09:00",
        endTime: "10:00",
        isAllDay: false,
        color: "blue",
        type: "event",
        position: eventCreationContext.clickPosition ? {
          x: eventCreationContext.clickPosition.x,
          y: eventCreationContext.clickPosition.y
        } : undefined
      }
      
      console.log('Creating new event in sidebar:', newEvent)
      setSelectedEvent(newEvent)
      setIsNewEvent(true)
      // The scheduler provider will manage the events array
    }
  }, [selectedEvent, eventCreationContext])

  const handleClose = () => {
    setSelectedEvent(null)
    setIsEventSidebarOpen(false)
    localStorage.setItem('isEventSidebarOpen', 'false')
    setHasUnsavedChanges(false)
    setIsNewEvent(false)
    currentFormData.current = {}
    onClick()
  }

  const handleFormDataChange = (eventData: Partial<Event>) => {
    // Store the form data without saving to scheduler
    currentFormData.current = { ...currentFormData.current, ...eventData }
    setHasUnsavedChanges(true)
  }

  const handleManualSave = () => {
    // Save the current form data to the scheduler
    if (selectedEvent && currentFormData.current) {
      const updatedEvent = { ...selectedEvent, ...currentFormData.current } as Event
      
      if (isNewEvent) {
        // This is a new event that was just created, update it in the scheduler
        handlers.handleUpdateEvent(updatedEvent, selectedEvent.id)
        setIsNewEvent(false) // Mark it as no longer new
      } else {
        // This is an existing event being edited
        handlers.handleUpdateEvent(updatedEvent, selectedEvent.id)
      }
      
      setHasUnsavedChanges(false)
    }
  }

  const handleDelete = () => {
    if (isEditing && selectedEvent) {
      handlers.handleDeleteEvent(selectedEvent.id)
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
          {/* Save Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:bg-neutral-800"
                onClick={handleManualSave}
                disabled={!hasUnsavedChanges}
              >
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-neutral-950 text-white font-semibold">
              <p>Save</p>
            </TooltipContent>
          </Tooltip>

          {/* Actions Dropdown */}
          {isEditing && (
            <EventActionsDropdown
              onCut={() => console.log("Cut event")}
              onCopy={() => console.log("Copy event")}
              onDuplicate={() => console.log("Duplicate event")}
              onDelete={handleDelete}
            />
          )}
          
          {/* Close Button */}
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
            onDataChange={() => setHasUnsavedChanges(true)}
          />
        ) : (
          <BirthdayForm 
            event={selectedEvent}
            onSave={handleFormDataChange}
            onDataChange={() => setHasUnsavedChanges(true)}
          />
        )}
      </div>
    </div>
  )
}

export default AddEventSidebar 