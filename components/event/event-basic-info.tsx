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
        <div className="space-y-2">
            <Label className="sr-only">Event Title</Label>
            <Input 
                placeholder="Title" 
                className="h-9 text-sm bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
            />

            <Label className="sr-only">Event Description</Label>
            <Textarea 
                placeholder="Add description..." 
                className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-400 text-sm resize-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[60px]"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
            />
        </div>
    )
} 