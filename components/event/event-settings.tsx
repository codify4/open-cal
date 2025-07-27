import { Video, Tag, Calendar } from "lucide-react"
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
        <div className="flex flex-col gap-2 text-sm text-neutral-300">
            <div className="flex items-center gap-2 ">
                <Video className="w-4 h-4" />
                <Select value={meetingType} onValueChange={onMeetingTypeChange}>
                    <SelectTrigger className="h-8 text-sm bg-neutral-800/50 border-neutral-700 text-white hover:bg-neutral-700 w-full">
                        <SelectValue placeholder="Add meeting" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-700">
                        <SelectItem value="google-meet" className="text-white hover:bg-neutral-800">
                            <div className="flex items-center gap-2">
                                <Image src="/g-meet.svg" alt="Google Meet" width={16} height={16} />
                                Google Meet
                            </div>
                        </SelectItem>
                        <SelectItem value="none" disabled className="text-neutral-500">Zoom (Coming soon)</SelectItem>
                        <SelectItem value="none" disabled className="text-neutral-500">Teams (Coming soon)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <Select value={calendar} onValueChange={onCalendarChange}>
                    <SelectTrigger className="h-8 text-sm bg-neutral-800/50 border-neutral-700 text-white hover:bg-neutral-700 w-full">
                        <SelectValue placeholder="Calendar" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-700">
                        <SelectItem value="primary" className="text-white hover:bg-neutral-800">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                Primary Calendar
                            </div>
                        </SelectItem>
                        <SelectItem value="work" className="text-white hover:bg-neutral-800">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                Work Calendar
                            </div>
                        </SelectItem>
                        <SelectItem value="personal" className="text-white hover:bg-neutral-800">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                Personal Calendar
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <Select value={color} onValueChange={onColorChange}>
                    <SelectTrigger className="h-8 text-sm bg-neutral-800/50 border-neutral-700 text-white hover:bg-neutral-700 w-full">
                        <SelectValue placeholder="Color" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-700">
                        <SelectItem value="blue" className="text-white hover:bg-neutral-800">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                Blue
                            </div>
                        </SelectItem>
                        <SelectItem value="green" className="text-white hover:bg-neutral-800">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                Green
                            </div>
                        </SelectItem>
                        <SelectItem value="red" className="text-white hover:bg-neutral-800">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                Red
                            </div>
                        </SelectItem>
                        <SelectItem value="yellow" className="text-white hover:bg-neutral-800">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                Yellow
                            </div>
                        </SelectItem>
                        <SelectItem value="purple" className="text-white hover:bg-neutral-800">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-500" />
                                Purple
                            </div>
                        </SelectItem>
                        <SelectItem value="orange" className="text-white hover:bg-neutral-800">
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