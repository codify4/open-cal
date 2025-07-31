import { Copy, MoreHorizontal, Plus, Scissors, Trash2 } from 'lucide-react';
import { Kbd } from '@/components/ui/kbd';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

interface EventActionsDropdownProps {
  onCut?: () => void;
  onCopy?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
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
          className="h-8 w-8 text-white hover:bg-neutral-800"
          size="icon"
          variant="ghost"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[180px] border-neutral-700 bg-neutral-950 p-2 text-white">
        <DropdownMenuItem
          className="flex cursor-pointer items-center justify-between p-1 text-white hover:bg-neutral-800"
          onClick={onCut}
        >
          <div className="flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            <span>Cut</span>
          </div>
          <Kbd className="rounded-[10px] border-0 bg-transparent text-neutral-400 text-xs">
            Ctrl X
          </Kbd>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex cursor-pointer items-center justify-between p-1 text-white hover:bg-neutral-800"
          onClick={onCopy}
        >
          <div className="flex items-center gap-2">
            <Copy className="h-4 w-4" />
            <span>Copy</span>
          </div>
          <Kbd className="rounded-[10px] border-0 bg-transparent text-neutral-400 text-xs">
            Ctrl C
          </Kbd>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex cursor-pointer items-center justify-between p-1 text-white hover:bg-neutral-800"
          onClick={onDuplicate}
        >
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Duplicate</span>
          </div>
          <Kbd className="rounded-[10px] border-0 bg-transparent text-neutral-400 text-xs">
            Ctrl D
          </Kbd>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="mx-auto w-11/12 bg-neutral-700" />

        <DropdownMenuItem
          className="flex cursor-pointer items-center justify-between p-1 text-red-500 hover:bg-red-500/10"
          onClick={onDelete}
          variant="destructive"
        >
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" color="red" />
            <span>Delete</span>
          </div>
          <Kbd className="rounded-[10px] border-0 bg-transparent text-red-500 text-xs">
            delete
          </Kbd>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EventActionsDropdown;
