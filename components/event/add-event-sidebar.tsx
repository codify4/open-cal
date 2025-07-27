import { useState } from "react"
import { X, MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button"
import { EventForm } from "./event-form"
import { BirthdayForm } from "./birthday-form"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:bg-neutral-800"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-neutral-950 text-white font-semibold">
              <p>More options</p>
            </TooltipContent>
          </Tooltip>
          
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