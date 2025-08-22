import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Copy, MessageSquare, Pencil, Trash, Trash2 } from 'lucide-react';
import type { EventCardContextMenuProps } from '../types/event-card-types';

export const EventCardContextMenu = ({
  event,
  children,
  onEdit,
  onDelete,
  onDuplicate,
  onAskAI,
}: EventCardContextMenuProps) => {
    return (
        <ContextMenu>
            <ContextMenuTrigger>{children}</ContextMenuTrigger>
            <ContextMenuContent className="bg-popover">
                <ContextMenuItem className="cursor-pointer" onClick={() => onAskAI(event)}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Ask AI
                </ContextMenuItem>
                <ContextMenuItem className="cursor-pointer" onClick={(e) => onEdit(e, event)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </ContextMenuItem>
                <ContextMenuItem className="cursor-pointer" onClick={() => onDuplicate(event)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                </ContextMenuItem>
                <ContextMenuItem
                    className="cursor-pointer"
                    onClick={() => onDelete(event)}
                >
                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                    <span className="text-destructive">Delete</span>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};
