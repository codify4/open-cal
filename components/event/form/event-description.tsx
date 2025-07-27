import { Textarea } from "../../ui/textarea"
import { Button } from "../../ui/button"
import { Bold, Italic, Underline, List, ListOrdered, Link, Strikethrough } from "lucide-react"

interface EventDescriptionProps {
    description: string
    onDescriptionChange: (description: string) => void
}

export const EventDescription = ({ description, onDescriptionChange }: EventDescriptionProps) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-neutral-300">
                <div className="w-4 h-4 flex items-center justify-center">
                    <div className="w-3 h-0.5 bg-neutral-400"></div>
                </div>
                <span className="text-sm font-medium">Description</span>
            </div>
            
            <div className="border border-neutral-700 rounded-sm bg-neutral-800/50">
                <div className="flex items-center gap-1 p-2 border-b border-neutral-700">
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Bold className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Italic className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Underline className="w-3 h-3" />
                    </Button>
                    <div className="w-px h-4 bg-neutral-600 mx-1"></div>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <List className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <ListOrdered className="w-3 h-3" />
                    </Button>
                    <div className="w-px h-4 bg-neutral-600 mx-1"></div>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Link className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Strikethrough className="w-3 h-3" />
                    </Button>
                </div>
                <Textarea 
                    placeholder="Add description" 
                    className="border-0 bg-transparent text-white placeholder:text-neutral-400 text-sm resize-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[80px]"
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                />
            </div>
        </div>
    )
} 