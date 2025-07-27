import { Lock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface EventVisibilityProps {
    visibility: string
    onVisibilityChange: (visibility: string) => void
}

export const EventVisibility = ({ visibility, onVisibilityChange }: EventVisibilityProps) => {
    return (
        <div className="flex items-center gap-2 text-sm text-neutral-300">
            <Lock className="w-4 h-4" />
            <Select value={visibility} onValueChange={onVisibilityChange}>
                <SelectTrigger className="h-8 text-sm bg-neutral-800/50 border-neutral-700 hover:bg-neutral-700 flex-1">
                    <SelectValue placeholder="Default visibility" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-neutral-700">
                    <SelectItem value="default" className="text-white hover:bg-neutral-800">
                        Default visibility
                    </SelectItem>
                    <SelectItem value="public" className="text-white hover:bg-neutral-800">
                        Public
                    </SelectItem>
                    <SelectItem value="private" className="text-white hover:bg-neutral-800">
                        Private
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
} 