import { Plus, Sparkles } from 'lucide-react';
import { ContextMenuItem } from '@/components/ui/context-menu';

interface CalendarContextMenuItemsProps {
  onAddEvent: () => void;
  onAskAI?: () => void;
  session: any;
  onClose?: () => void;
}

export const CalendarContextMenuItems = ({
  onAddEvent,
  onAskAI,
  session,
  onClose,
}: CalendarContextMenuItemsProps) => {
  const handleAskAI = () => {
    if (!session?.user) {
      return;
    }
    if (onAskAI) {
      onAskAI();
    }
    onClose?.();
  };

  const handleAddEvent = () => {
    if (!session?.user) {
      return;
    }
    onAddEvent();
    onClose?.();
  };

  return (
    <>
      <ContextMenuItem className="cursor-pointer py-2" onClick={handleAddEvent}>
        <Plus className="mr-2 h-4 w-4" />
        Add Event
      </ContextMenuItem>
      <ContextMenuItem className="cursor-pointer py-2" onClick={handleAskAI}>
        <Sparkles className="mr-2 h-4 w-4" />
        Ask AI
      </ContextMenuItem>
    </>
  );
};
