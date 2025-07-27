import { Bell } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { useState } from "react"
import { reminderOptions } from "@/constants/add-event"

interface EventRemindersProps {
    reminders: string[]
    onRemindersChange: (reminders: string[]) => void
}

export const EventReminders = ({ reminders, onRemindersChange }: EventRemindersProps) => {
    const [reminderSearch, setReminderSearch] = useState("")

    const filteredReminders = reminderOptions.filter(reminder =>
        reminder.toLowerCase().includes(reminderSearch.toLowerCase())
    )

    const handleReminderToggle = (reminder: string) => {
        onRemindersChange(
            reminders.includes(reminder)
                ? reminders.filter(r => r !== reminder)
                : [...reminders, reminder]
        )
    }

    const removeReminder = (reminder: string) => {
        onRemindersChange(reminders.filter(r => r !== reminder))
    }

    return (
        <div className="flex items-center gap-2 text-sm text-neutral-300">
            <Bell className="w-4 h-4" />
            
            {reminders.length > 0 ? (
                <div className="flex flex-wrap gap-1 flex-1">
                    {reminders.map((reminder) => (
                        <Badge 
                            key={reminder} 
                            variant="default" 
                            className="text-xs cursor-pointer text-black"
                            onClick={() => removeReminder(reminder)}
                        >
                            {reminder} ×
                        </Badge>
                    ))}
                </div>
            ) : (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-9 text-sm bg-neutral-800/50 border-neutral-700 text-neutral-400 hover:bg-neutral-700 flex-1 justify-start px-3"
                        >
                            Add reminder
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0 bg-neutral-900 border-neutral-700" align="start">
                        <Command className="bg-neutral-900">
                            <CommandInput 
                                placeholder="Search reminders..." 
                                value={reminderSearch}
                                onValueChange={setReminderSearch}
                                className="text-white"
                            />
                            <CommandList>
                                <CommandEmpty className="text-neutral-400">No reminders found.</CommandEmpty>
                                <CommandGroup>
                                    {filteredReminders.map((reminder) => (
                                        <CommandItem
                                            key={reminder}
                                            onSelect={() => handleReminderToggle(reminder)}
                                            className="flex items-center justify-between text-white hover:bg-neutral-800"
                                        >
                                            <span>{reminder}</span>
                                            {reminders.includes(reminder) && (
                                                <div className="w-4 h-4 rounded-full bg-blue-500" />
                                            )}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    )
} 