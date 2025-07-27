import { Briefcase } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface EventAvailabilityProps {
    availability: string
    onAvailabilityChange: (availability: string) => void
}

export const EventAvailability = ({ availability, onAvailabilityChange }: EventAvailabilityProps) => {
    return (
        <div className="flex items-center gap-2 text-sm text-neutral-300">
            <Briefcase className="w-4 h-4" />
            <Select value={availability} onValueChange={onAvailabilityChange}>
                <SelectTrigger className="h-8 text-sm bg-neutral-800/50 border-neutral-700 hover:bg-neutral-700 flex-1">
                    <SelectValue placeholder="Busy" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-neutral-700">
                    <SelectItem value="busy" className="text-white hover:bg-neutral-800">
                        Busy
                    </SelectItem>
                    <SelectItem value="free" className="text-white hover:bg-neutral-800">
                        Free
                    </SelectItem>
                    <SelectItem value="tentative" className="text-white hover:bg-neutral-800">
                        Tentative
                    </SelectItem>
                    <SelectItem value="out-of-office" className="text-white hover:bg-neutral-800">
                        Out of office
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
} 