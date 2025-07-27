import { Repeat } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"

interface EventRepeatProps {
    repeat: string
    onRepeatChange: (repeat: string) => void
}

export const EventRepeat = ({ repeat, onRepeatChange }: EventRepeatProps) => {
    return (
        <div className="flex items-center gap-2 text-sm text-neutral-300">
            <Repeat className="w-4 h-4" />
            <Select value={repeat} onValueChange={onRepeatChange}>
                <SelectTrigger className="h-8 text-sm bg-neutral-800/50 border-neutral-700 text-white hover:bg-neutral-700 flex-1">
                    <SelectValue placeholder="Does not repeat" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-neutral-700">
                    <SelectItem value="none" className="text-white hover:bg-neutral-800">
                        Does not repeat
                    </SelectItem>
                    <SelectItem value="daily" className="text-white hover:bg-neutral-800">
                        Daily
                    </SelectItem>
                    <SelectItem value="weekly" className="text-white hover:bg-neutral-800">
                        Weekly
                    </SelectItem>
                    <SelectItem value="monthly" className="text-white hover:bg-neutral-800">
                        Monthly
                    </SelectItem>
                    <SelectItem value="yearly" className="text-white hover:bg-neutral-800">
                        Yearly
                    </SelectItem>
                    <SelectItem value="custom" className="text-white hover:bg-neutral-800">
                        Custom
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
} 