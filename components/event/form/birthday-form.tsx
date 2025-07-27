import { useState } from "react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Calendar as CalendarComponent } from "../../ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Clock, RefreshCw, User } from "lucide-react"
import { format } from "date-fns"
import { EventReminders } from "./event-reminders"

export const BirthdayForm = () => {
    const [birthdayData, setBirthdayData] = useState({
        title: "",
        date: new Date(),
        recurrence: "yearly",
        account: "",
        reminders: [] as string[]
    })

    const handleSubmit = () => {
        console.log("Birthday data:", birthdayData)
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
                    onChange={(e) => setBirthdayData(prev => ({ ...prev, title: e.target.value }))}
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
                                    onSelect={(date) => date && setBirthdayData(prev => ({ ...prev, date }))}
                                    initialFocus
                                    className="bg-neutral-900 p-2"
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-300">
                    <RefreshCw className="w-4 h-4" />
                    <Select 
                        value={birthdayData.recurrence} 
                        onValueChange={(value) => setBirthdayData(prev => ({ ...prev, recurrence: value }))}
                    >
                        <SelectTrigger className="h-8 text-sm bg-neutral-800/50 border-neutral-700 text-white hover:bg-neutral-700 flex-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 border-neutral-700">
                            <SelectItem value="yearly" className="text-white hover:bg-neutral-800">
                                Every year
                            </SelectItem>
                            <SelectItem value="monthly" className="text-white hover:bg-neutral-800">
                                Every month
                            </SelectItem>
                            <SelectItem value="never" className="text-white hover:bg-neutral-800">
                                Never
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="text-xs text-neutral-400">
                        {formatRecurrence(birthdayData.recurrence)}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-neutral-300">
                <User className="w-4 h-4" />
                <Select 
                    value={birthdayData.account} 
                    onValueChange={(value) => setBirthdayData(prev => ({ ...prev, account: value }))}
                >
                    <SelectTrigger className="h-9 text-sm bg-neutral-800/50 border-neutral-700 text-white hover:bg-neutral-700 flex-1">
                        <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-700">
                        <SelectItem value="kushta.joni@gmail.com" className="text-white hover:bg-neutral-800">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                kushta.joni@gmail.com
                            </div>
                        </SelectItem>
                        <SelectItem value="work@gmail.com" className="text-white hover:bg-neutral-800">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                work@gmail.com
                            </div>
                        </SelectItem>
                        <SelectItem value="personal@gmail.com" className="text-white hover:bg-neutral-800">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                personal@gmail.com
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <EventReminders 
                reminders={birthdayData.reminders}
                onRemindersChange={(reminders) => setBirthdayData(prev => ({ ...prev, reminders }))}
            />

            <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" onClick={handleSubmit}>Create Birthday</Button>
            </div>
        </div>
    )
} 