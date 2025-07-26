import { Users } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { useState } from "react"
import { attendeeOptions } from "@/constants/add-event"

interface EventAttendeesProps {
    attendees: string[]
    onAttendeesChange: (attendees: string[]) => void
}

export const EventAttendees = ({ attendees, onAttendeesChange }: EventAttendeesProps) => {
    const [attendeeSearch, setAttendeeSearch] = useState("")

    const filteredAttendees = attendeeOptions.filter(attendee =>
        attendee.toLowerCase().includes(attendeeSearch.toLowerCase())
    )

    const handleAttendeeToggle = (attendee: string) => {
        onAttendeesChange(
            attendees.includes(attendee)
                ? attendees.filter(a => a !== attendee)
                : [...attendees, attendee]
        )
    }

    const removeAttendee = (attendee: string) => {
        onAttendeesChange(attendees.filter(a => a !== attendee))
    }

    return (
        <div className="space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Attendees
            </Label>
            
            {attendees.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1">
                    {attendees.map((attendee) => (
                        <Badge 
                            key={attendee} 
                            variant="secondary" 
                            className="text-xs cursor-pointer hover:bg-neutral-700"
                            onClick={() => removeAttendee(attendee)}
                        >
                            {attendee} ×
                        </Badge>
                    ))}
                </div>
            )}

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-8 text-sm"
                    >
                        <Users className="mr-2 h-4 w-4" />
                        Add attendees
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                        <CommandInput 
                            placeholder="Search attendees..." 
                            value={attendeeSearch}
                            onValueChange={setAttendeeSearch}
                        />
                        <CommandList>
                            <CommandEmpty>No attendees found.</CommandEmpty>
                            <CommandGroup>
                                {filteredAttendees.map((attendee) => (
                                    <CommandItem
                                        key={attendee}
                                        onSelect={() => handleAttendeeToggle(attendee)}
                                        className="flex items-center justify-between"
                                    >
                                        <span>{attendee}</span>
                                        {attendees.includes(attendee) && (
                                            <div className="w-4 h-4 rounded-full bg-primary" />
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
} 