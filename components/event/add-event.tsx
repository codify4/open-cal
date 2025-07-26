import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "../ui/dialog"
import { useState } from "react"
import { EventForm } from "./event-form"

interface AddEventProps {
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
    trigger?: React.ReactNode
}

const AddEvent = ({ isOpen, onOpenChange, trigger }: AddEventProps) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false)
    
    const controlled = isOpen !== undefined && onOpenChange !== undefined
    const dialogOpen = controlled ? isOpen : internalIsOpen
    const setDialogOpen = controlled ? onOpenChange : setInternalIsOpen

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            {trigger ? (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            ) : (
                <DialogTrigger asChild>
                    <Button 
                        variant="default" 
                        className="rounded-sm w-32 h-8 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        New Event
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader className="pb-2">
                    <DialogTitle>Create New Event</DialogTitle>
                </DialogHeader>
                <EventForm onClose={() => setDialogOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}

export default AddEvent 