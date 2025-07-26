import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "../ui/dialog"
import { useState } from "react"
import { EventForm } from "./event-form"

const AddEvent = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="default" 
                    className="rounded-sm w-32 h-8 text-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Event
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader className="pb-2">
                    <DialogTitle>Create New Event</DialogTitle>
                </DialogHeader>
                <EventForm onClose={() => setIsOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}

export default AddEvent 