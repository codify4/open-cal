import { Plus, Sparkles } from 'lucide-react';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { authClient } from '@/lib/auth-client';

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
  onClose 
}: CalendarContextMenuItemsProps) => {
  const handleAskAI = () => {
    if (!session) {
      authClient.signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/calendar`,
        errorCallbackURL: `${window.location.origin}/calendar`,
        newUserCallbackURL: `${window.location.origin}/calendar`,
      });
    } else if (onAskAI) {
      onAskAI();
    }
    onClose?.();
  };

  return (
    <>
      <ContextMenuItem
        className="cursor-pointer py-2"
        onClick={() => {
          onAddEvent();
          onClose?.();
        }}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Event
      </ContextMenuItem>
      <ContextMenuItem
        className="cursor-pointer py-2"
        onClick={handleAskAI}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Ask AI
      </ContextMenuItem>
    </>
  );
};
