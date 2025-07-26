import { Video, Tag } from "lucide-react"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import Image from "next/image"

interface EventSettingsProps {
    meetingType: string
    calendar: string
    color: string
    onMeetingTypeChange: (meetingType: string) => void
    onCalendarChange: (calendar: string) => void
    onColorChange: (color: string) => void
}

export const EventSettings = ({
    meetingType,
    calendar,
    color,
    onMeetingTypeChange,
    onCalendarChange,
    onColorChange
}: EventSettingsProps) => {
    return (
        <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Add meeting
                </Label>
                <Select value={meetingType} onValueChange={onMeetingTypeChange}>
                    <SelectTrigger className="h-7 text-sm w-full">
                        <SelectValue placeholder="Select meeting type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="google-meet">
                            <Image src="/g-meet.svg" alt="Google Meet" width={16} height={16} />
                            Google Meet
                        </SelectItem>
                        <SelectItem value="none" disabled>Zoom (Coming soon)</SelectItem>
                        <SelectItem value="none" disabled>Teams (Coming soon)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1">
                <Label className="text-sm font-medium">Calendar</Label>
                <Select value={calendar} onValueChange={onCalendarChange}>
                    <SelectTrigger className="h-8 text-sm w-full">
                        <SelectValue placeholder="Select calendar" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="primary">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                Primary Calendar
                            </div>
                        </SelectItem>
                        <SelectItem value="work">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                Work Calendar
                            </div>
                        </SelectItem>
                        <SelectItem value="personal">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                Personal Calendar
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Color
                </Label>
                <Select value={color} onValueChange={onColorChange}>
                    <SelectTrigger className="h-7 text-sm w-full">
                        <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="blue">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                Blue
                            </div>
                        </SelectItem>
                        <SelectItem value="green">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                Green
                            </div>
                        </SelectItem>
                        <SelectItem value="red">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                Red
                            </div>
                        </SelectItem>
                        <SelectItem value="yellow">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                Yellow
                            </div>
                        </SelectItem>
                        <SelectItem value="purple">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-500" />
                                Purple
                            </div>
                        </SelectItem>
                        <SelectItem value="orange">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500" />
                                Orange
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
} 