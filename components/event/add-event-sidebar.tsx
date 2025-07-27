import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "../ui/button"
import { EventForm } from "./form/event-form"
import { BirthdayForm } from "./form/birthday-form"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import EventActionsDropdown from "./form/event-actions"

interface AddEventProps {
  onClick: () => void
}

const AddEventSidebar = ({ onClick }: AddEventProps) => {
  const [formType, setFormType] = useState("event")

  return (
    <div className="flex flex-col h-full text-white px-1">
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center">
          <Select value={formType} onValueChange={setFormType}>
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
        
        <div className="flex items-center gap-3">
          <EventActionsDropdown
            onCut={() => console.log("Cut event")}
            onCopy={() => console.log("Copy event")}
            onDuplicate={() => console.log("Duplicate event")}
            onDelete={() => console.log("Delete event")}
          />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:bg-neutral-800"
                onClick={onClick}
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
        {formType === "event" ? <EventForm /> : <BirthdayForm />}
      </div>
    </div>
  )
}

export default AddEventSidebar 