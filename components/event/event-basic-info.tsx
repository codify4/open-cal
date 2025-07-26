import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"

interface EventBasicInfoProps {
    title: string
    description: string
    onTitleChange: (title: string) => void
    onDescriptionChange: (description: string) => void
}

export const EventBasicInfo = ({ 
    title, 
    description, 
    onTitleChange, 
    onDescriptionChange 
}: EventBasicInfoProps) => {
    return (
        <>
            <div className="space-y-1">
                <Label className="text-sm font-medium">Event Title</Label>
                <Input 
                    placeholder="Enter event title" 
                    className="h-8 text-sm"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                />
            </div>

            <div className="space-y-1">
                <Label className="text-sm font-medium">Description</Label>
                <Textarea 
                    placeholder="Add event description..." 
                    className="bg-muted/50 min-h-[40px] text-sm"
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                />
            </div>
        </>
    )
} 