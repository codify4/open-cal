import { X } from "lucide-react"
import { Button } from "../ui/button"
import { EventForm } from "./event-form"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface AddEventProps {
  onClick: () => void
}

const AddEventSidebar = ({ onClick }: AddEventProps) => {
  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-end w-full gap-3">
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
              <p>{"Close"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex-1 mt-3">
        <EventForm />
      </div>
    </div>
  )
}

export default AddEventSidebar 