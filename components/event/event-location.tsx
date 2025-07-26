import { MapPin } from "lucide-react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

interface EventLocationProps {
    location: string
    onLocationChange: (location: string) => void
}

export const EventLocation = ({ location, onLocationChange }: EventLocationProps) => {
    return (
        <div className="space-y-1">
            <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
            </Label>
            <Input 
                placeholder="Add location" 
                className="h-8 text-sm"
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
            />
        </div>
    )
} 