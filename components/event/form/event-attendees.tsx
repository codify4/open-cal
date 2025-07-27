import { Users } from "lucide-react"
import { Button } from "../../ui/button"
import { Badge } from "../../ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../ui/command"
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
        <div className="flex items-center gap-2 text-sm text-neutral-300">
            <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-row items-center gap-2 w-full">
                    <Users className="w-4 h-4" />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-9 text-sm bg-neutral-800/50 border-neutral-700 text-neutral-400 hover:bg-neutral-700 flex-1 justify-start px-3"
                            >
                                Add participants
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0 bg-neutral-900 border-neutral-700" align="start">
                            <Command className="bg-neutral-900">
                                <CommandInput 
                                    placeholder="Search attendees..." 
                                    value={attendeeSearch}
                                    onValueChange={setAttendeeSearch}
                                    className="text-white"
                                />
                                <CommandList>
                                    <CommandEmpty className="text-neutral-400">No attendees found.</CommandEmpty>
                                    <CommandGroup>
                                        {filteredAttendees.map((attendee) => (
                                            <CommandItem
                                                key={attendee}
                                                onSelect={() => handleAttendeeToggle(attendee)}
                                                className="flex items-center justify-between text-white hover:bg-neutral-800"
                                            >
                                                <span>{attendee}</span>
                                                {attendees.includes(attendee) && (
                                                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                                                )}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                {
                    attendees.length > 0 && (
                        <div className="flex flex-wrap gap-1 flex-1">
                            {attendees.map((attendee) => (
                                <Badge 
                                    key={attendee} 
                                    variant="default" 
                                    className="text-xs cursor-pointer text-black"
                                    onClick={() => removeAttendee(attendee)}
                                >
                                    {attendee} ×
                                </Badge>
                            ))}
                        </div>
                    )
                }
            </div>
        </div>
    )
} 