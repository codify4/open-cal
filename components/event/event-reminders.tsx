import { Bell } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Label } from "../ui/label"
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
        <div className="space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Reminders
            </Label>
            
            {reminders.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1">
                    {reminders.map((reminder) => (
                        <Badge 
                            key={reminder} 
                            variant="secondary" 
                            className="text-xs cursor-pointer hover:bg-neutral-700"
                            onClick={() => removeReminder(reminder)}
                        >
                            {reminder} ×
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
                        <Bell className="mr-2 h-4 w-4" />
                        Add reminder
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                        <CommandInput 
                            placeholder="Search reminders..." 
                            value={reminderSearch}
                            onValueChange={setReminderSearch}
                        />
                        <CommandList>
                            <CommandEmpty>No reminders found.</CommandEmpty>
                            <CommandGroup>
                                {filteredReminders.map((reminder) => (
                                    <CommandItem
                                        key={reminder}
                                        onSelect={() => handleReminderToggle(reminder)}
                                        className="flex items-center justify-between"
                                    >
                                        <span>{reminder}</span>
                                        {reminders.includes(reminder) && (
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