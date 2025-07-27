import { Clock } from "lucide-react"
import { Button } from "../ui/button"
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
            <SelectTrigger className="w-full h-8 text-sm bg-neutral-800/50 border-neutral-700 text-white">
                <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] bg-neutral-900 border-neutral-700">
                {timeOptions.map((time) => (
                    <SelectItem key={time} value={time} className="text-white hover:bg-neutral-800">
                        {time}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
}

const formatDate = (date: Date) => {
    return format(date, "MMM dd")
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
        <div className="flex items-center gap-2 text-sm text-neutral-300">
            <Clock className="w-4 h-4" />
            
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-8 text-sm bg-neutral-800/50 border-neutral-700 text-white hover:bg-neutral-700"
                    >
                        {formatTime(startTime)} - {formatTime(endTime)}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-neutral-900 border-neutral-700" align="start">
                    <div className="p-2 border-b border-neutral-700">
                        <CalendarComponent
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => date && onStartDateChange(date)}
                            initialFocus
                            className="bg-neutral-900"
                        />
                    </div>
                    <div className="p-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <div className="text-xs text-neutral-400 mb-1">Start</div>
                                <TimePicker 
                                    value={startTime} 
                                    onChange={onStartTimeChange} 
                                />
                            </div>
                            <div>
                                <div className="text-xs text-neutral-400 mb-1">End</div>
                                <TimePicker 
                                    value={endTime} 
                                    onChange={onEndTimeChange} 
                                />
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            <span className="text-neutral-200">•</span>
            
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-8 text-sm bg-neutral-800/50 border-neutral-700 text-white hover:bg-neutral-700"
                    >
                        {formatDate(startDate)}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-neutral-900 border-neutral-700" align="start">
                    <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && onStartDateChange(date)}
                        initialFocus
                        className="bg-neutral-900 p-2"
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
} 