import { Plus, Sparkles } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
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
      <SignedIn>
        <ContextMenuItem className="cursor-pointer py-2" onClick={handleAddEvent}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </ContextMenuItem>
        <ContextMenuItem className="cursor-pointer py-2" onClick={handleAskAI}>
          <Sparkles className="mr-2 h-4 w-4" />
          Ask AI
        </ContextMenuItem>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <ContextMenuItem className="cursor-pointer py-2">
            <Plus className="mr-2 h-4 w-4" />
            Sign in to Add Event
          </ContextMenuItem>
        </SignInButton>
        <SignInButton mode="modal">
          <ContextMenuItem className="cursor-pointer py-2">
            <Sparkles className="mr-2 h-4 w-4" />
            Sign in to Ask AI
          </ContextMenuItem>
        </SignInButton>
      </SignedOut>
    </>
  );
};
