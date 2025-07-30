import { useState, useEffect } from "react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Calendar as CalendarComponent } from "../../ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Clock, RefreshCw, Repeat, User } from "lucide-react"
import { format } from "date-fns"
import { EventReminders } from "./event-reminders"
import { Event } from "@/lib/store/calendar-store"

interface BirthdayFormProps {
  event?: Event | null
  onSave?: (eventData: Partial<Event>) => void
}

export const BirthdayForm = ({ event, onSave }: BirthdayFormProps) => {
    const [birthdayData, setBirthdayData] = useState({
        title: "",
        date: new Date(),
        recurrence: "yearly",
        account: "",
        reminders: [] as Date[]
    })

    // Initialize form data when editing an event
    useEffect(() => {
        if (event) {
            setBirthdayData({
                title: event.title || "",
                date: event.startDate,
                recurrence: event.repeat || "yearly",
                account: "",
                reminders: event.reminders || []
            })
        }
    }, [event])

    // Auto-save functionality
    const updateBirthdayData = (updates: Partial<typeof birthdayData>) => {
        const newData = { ...birthdayData, ...updates }
        setBirthdayData(newData)
        
        // Trigger auto-save
        if (onSave) {
            onSave({
                title: newData.title,
                startDate: newData.date,
                endDate: newData.date,
                isAllDay: true,
                type: "birthday",
                color: "pink",
                repeat: newData.recurrence as "yearly" | "none" | "daily" | "weekly" | "monthly",
                reminders: newData.reminders
            })
        }
    }

    const formatDate = (date: Date) => {
        return format(date, "EEE MMMM d")
    }

    const formatRecurrence = (recurrence: string) => {
        switch (recurrence) {
            case "yearly":
                return `Every year on ${formatDate(birthdayData.date)}`
            case "monthly":
                return `Every month on ${format(birthdayData.date, "dd")}`
            default:
                return "Never"
        }
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="sr-only">Birthday Title</Label>
                <Input 
                    placeholder="Birthday" 
                    className="h-9 text-sm bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
                    value={birthdayData.title}
                    onChange={(e) => updateBirthdayData({ title: e.target.value })}
                />
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-neutral-300">
                    <Clock className="w-4 h-4" />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-8 rounded-sm text-sm bg-neutral-800/50 border-neutral-700 text-white hover:bg-neutral-700"
                            >
                                {formatDate(birthdayData.date)}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-neutral-900 border-neutral-700" align="start">
                            <div className="p-2 border-b border-neutral-700">
                                <CalendarComponent
                                    mode="single"
                                    selected={birthdayData.date}
                                    onSelect={(date) => date && updateBirthdayData({ date })}
                                    initialFocus
                                    className="bg-neutral-900 p-2"
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-300">
                    <Repeat className="w-4 h-4" />
                    <div className="flex text-neutral-400 h-8 items-center px-2 bg-neutral-800/50 border border-neutral-700 rounded-sm">
                        {formatRecurrence(birthdayData.recurrence)}
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-300">
                    <User className="w-4 h-4" />
                    <Select 
                        value={birthdayData.account} 
                        onValueChange={(value) => updateBirthdayData({ account: value })}
                    >
                        <SelectTrigger className="h-8 text-sm bg-neutral-800/50 border-neutral-700 text-white hover:bg-neutral-700 flex-1">
                            <SelectValue placeholder="Select account">
                                {birthdayData.account && (
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${
                                            birthdayData.account === "john.doe@gmail.com" ? "bg-red-500" :
                                            birthdayData.account === "jane.smith@outlook.com" ? "bg-blue-500" :
                                            birthdayData.account === "work@company.com" ? "bg-green-500" :
                                            birthdayData.account === "personal@icloud.com" ? "bg-purple-500" :
                                            "bg-neutral-500"
                                        }`}></div>
                                        {birthdayData.account}
                                    </div>
                                )}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 border-neutral-700">
                            <SelectItem value="john.doe@gmail.com" className="text-white hover:bg-neutral-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    john.doe@gmail.com
                                </div>
                            </SelectItem>
                            <SelectItem value="jane.smith@outlook.com" className="text-white hover:bg-neutral-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    jane.smith@outlook.com
                                </div>
                            </SelectItem>
                            <SelectItem value="work@company.com" className="text-white hover:bg-neutral-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    work@company.com
                                </div>
                            </SelectItem>
                            <SelectItem value="personal@icloud.com" className="text-white hover:bg-neutral-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                    personal@icloud.com
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <EventReminders 
                    reminders={birthdayData.reminders}
                    onRemindersChange={(reminders) => updateBirthdayData({ reminders })}
                />
            </div>
        </div>
    )
} 