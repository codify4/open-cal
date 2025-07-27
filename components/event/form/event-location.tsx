import { MapPin } from "lucide-react"
import { Input } from "../../ui/input"

interface EventLocationProps {
    location: string
    onLocationChange: (location: string) => void
}

export const EventLocation = ({ location, onLocationChange }: EventLocationProps) => {
    return (
        <div className="flex items-center gap-2 text-sm text-neutral-300">
            <MapPin className="w-4 h-4" />
            <Input 
                placeholder="Add location" 
                className="h-9 text-sm bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 px-3"
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
            />
        </div>
    )
} 