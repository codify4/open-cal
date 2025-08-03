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
          className="h-8 w-8 text-foreground hover:bg-accent"
          size="icon"
          variant="ghost"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[180px] border-border bg-popover dark:bg-neutral-900 p-2 text-popover-foreground">
        <DropdownMenuItem
          className="flex cursor-pointer items-center justify-between p-1 text-popover-foreground hover:bg-accent"
          onClick={onCut}
        >
          <div className="flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            <span>Cut</span>
          </div>
          <Kbd className="rounded-[10px] border-0 bg-transparent text-muted-foreground text-xs">
            Ctrl X
          </Kbd>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex cursor-pointer items-center justify-between p-1 text-popover-foreground hover:bg-accent"
          onClick={onCopy}
        >
          <div className="flex items-center gap-2">
            <Copy className="h-4 w-4" />
            <span>Copy</span>
          </div>
          <Kbd className="rounded-[10px] border-0 bg-transparent text-muted-foreground text-xs">
            Ctrl C
          </Kbd>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex cursor-pointer items-center justify-between p-1 text-popover-foreground hover:bg-accent"
          onClick={onDuplicate}
        >
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Duplicate</span>
          </div>
          <Kbd className="rounded-[10px] border-0 bg-transparent text-muted-foreground text-xs">
            Ctrl D
          </Kbd>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="mx-auto w-11/12 bg-border" />

        <DropdownMenuItem
          className="flex cursor-pointer items-center justify-between p-1 text-destructive hover:bg-destructive/10"
          onClick={onDelete}
          variant="destructive"
        >
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-destructive" />
            <span>Delete</span>
          </div>
          <Kbd className="rounded-[10px] border-0 bg-transparent text-destructive text-xs">
            delete
          </Kbd>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EventActionsDropdown;
