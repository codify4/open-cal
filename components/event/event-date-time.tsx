import { Calendar } from "lucide-react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar as CalendarComponent } from "../ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { format } from "date-fns"

interface EventDateTimeProps {
    startDate: Date
    endDate: Date
    startTime: string
    endTime: string
    onStartDateChange: (date: Date) => void
    onEndDateChange: (date: Date) => void
    onStartTimeChange: (time: string) => void
    onEndTimeChange: (time: string) => void
}

const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
            options.push(timeString)
        }
    }
    return options
}

const TimePicker = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
    const timeOptions = generateTimeOptions()
    
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
                {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                        {time}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

const formatDateTime = (date: Date, time: string) => {
    return `${format(date, "MMM dd, yyyy")} at ${time}`
}

export const EventDateTime = ({
    startDate,
    endDate,
    startTime,
    endTime,
    onStartDateChange,
    onEndDateChange,
    onStartTimeChange,
    onEndTimeChange
}: EventDateTimeProps) => {
    return (
        <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="w-4 h-4" />
                Date & Time
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <Label className="text-sm">Start</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal h-8 text-sm"
                            >
                                <Calendar className="mr-2 h-4 w-4" />
                                {formatDateTime(startDate, startTime)}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <div className="p-3 border-b">
                                <CalendarComponent
                                    mode="single"
                                    selected={startDate}
                                    onSelect={(date) => date && onStartDateChange(date)}
                                    initialFocus
                                />
                            </div>
                            <div className="p-3">
                                <Label className="text-sm">Time</Label>
                                <TimePicker 
                                    value={startTime} 
                                    onChange={onStartTimeChange} 
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-1">
                    <Label className="text-sm">End</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal h-8 text-sm"
                            >
                                <Calendar className="mr-2 h-4 w-4" />
                                {formatDateTime(endDate, endTime)}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <div className="p-3 border-b">
                                <CalendarComponent
                                    mode="single"
                                    selected={endDate}
                                    onSelect={(date) => date && onEndDateChange(date)}
                                    initialFocus
                                />
                            </div>
                            <div className="p-3">
                                <Label className="text-sm">Time</Label>
                                <TimePicker 
                                    value={endTime} 
                                    onChange={onEndTimeChange} 
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    )
} 