import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import type { EventCardContextMenuProps } from '../types/event-card-types';

export const EventCardContextMenu = ({
  event,
  children,
  onEdit,
  onDelete,
  onDuplicate,
  onCopy,
}: EventCardContextMenuProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="bg-popover">
        <ContextMenuItem className="cursor-pointer" onClick={(e) => onEdit(e, event)}>
          Edit
        </ContextMenuItem>
        <ContextMenuItem className="cursor-pointer" onClick={() => onDuplicate(event)}>
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem className="cursor-pointer" onClick={() => onCopy(event)}>
          Copy
        </ContextMenuItem>
        <ContextMenuItem
          className="cursor-pointer text-destructive"
          onClick={() => onDelete(event)}
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
