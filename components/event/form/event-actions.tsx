import { MoreHorizontal, Scissors, Copy, Plus, Trash2 } from "lucide-react"
import { Button } from "../../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import { Kbd } from "@/components/ui/kbd"

interface EventActionsDropdownProps {
  onCut?: () => void
  onCopy?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
}

const EventActionsDropdown = ({
  onCut,
  onCopy,
  onDuplicate,
  onDelete,
}: EventActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-white hover:bg-neutral-800"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-neutral-950 border-neutral-700 text-white min-w-[180px] p-2">
        <DropdownMenuItem
          onClick={onCut}
          className="flex items-center justify-between text-white hover:bg-neutral-800 cursor-pointer p-1"
        >
          <div className="flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            <span>Cut</span>
          </div>
          <Kbd className="text-xs bg-transparent text-neutral-400 border-0 rounded-[10px]">Ctrl X</Kbd>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={onCopy}
          className="flex items-center justify-between text-white hover:bg-neutral-800 cursor-pointer p-1"
        >
          <div className="flex items-center gap-2">
            <Copy className="h-4 w-4" />
            <span>Copy</span>
          </div>
          <Kbd className="text-xs bg-transparent text-neutral-400 border-0 rounded-[10px]">Ctrl C</Kbd>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={onDuplicate}
          className="flex items-center justify-between text-white hover:bg-neutral-800 cursor-pointer p-1"
        >
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Duplicate</span>
          </div>
          <Kbd className="text-xs bg-transparent text-neutral-400 border-0 rounded-[10px]">Ctrl D</Kbd>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-neutral-700 w-11/12 mx-auto" />
        
        <DropdownMenuItem
          onClick={onDelete}
          variant="destructive"
          className="flex items-center justify-between text-red-500 hover:bg-red-500/10 cursor-pointer p-1"
        >
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" color="red" />
            <span>Delete</span>
          </div>
          <Kbd className="text-xs bg-transparent text-red-500 border-0 rounded-[10px]">delete</Kbd>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default EventActionsDropdown 