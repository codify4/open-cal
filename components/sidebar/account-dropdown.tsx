'use client';

import {
  SignInButton,
  useSession,
  useSessionList,
  useUser,
} from '@clerk/nextjs';
import { ChevronRight, LogOut, Plus, User } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import {
  emailColorFromString,
  getColorClasses,
} from '@/lib/calendar-utils/calendar-color-utils';
import type { EmailAccount } from '@/types/calendar';
import { Button } from '../ui/button';

interface AccountDropdownProps {
  emailAccounts: EmailAccount[];
  selectedEmail: string;
  onEmailChange: (email: string) => void;
  userEmail?: string;
}

export function AccountDropdown({
  emailAccounts,
  selectedEmail,
  onEmailChange,
  userEmail,
}: AccountDropdownProps) {
  const { isMobile } = useSidebar();
  const selectedAccount = emailAccounts.find(
    (acc) => acc.email === selectedEmail
  );
  const canAddMoreAccounts = Boolean(emailAccounts.length === 0);

  const { sessions, setActive } = useSessionList();
  const { session: currentSession } = useSession();

  const handleSwitchAccount = async (sessionId: string) => {
    if (!setActive) return;
    try {
      await setActive({ session: sessionId });
      toast('Account switched successfully');
    } catch (error) {
      toast('Failed to switch account', { description: 'Please try again.' });
    }
  };

  const handleSignOut = async (sessionId: string) => {
    if (!setActive) return;
    try {
      await setActive({ session: sessionId });
      toast('Account signed out successfully');
    } catch (error) {
      toast('Failed to sign out', { description: 'Please try again.' });
    }
  };

  const currentUserEmail =
    currentSession?.user?.primaryEmailAddress?.emailAddress || userEmail;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="w-full cursor-pointer justify-between rounded-sm hover:bg-primary/5 hover:text-primary focus:bg-transparent focus:outline-none focus:ring-0 active:bg-transparent">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-start">
              <span className="truncate font-medium text-sm">
                {selectedAccount?.email || currentUserEmail || 'Select Account'}
              </span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isMobile ? 'end' : 'start'}
        className="w-64 bg-neutral-100 dark:bg-neutral-950"
        side={isMobile ? 'bottom' : 'right'}
      >
        {emailAccounts.length === 0 && (
          <div className="px-3 py-2 text-muted-foreground text-sm">
            No accounts connected
          </div>
        )}

        {sessions?.map((session) => {
          const isActive = session.id === currentSession?.id;
          const sessionEmail = session.user?.primaryEmailAddress?.emailAddress;

          return (
            <div className="px-3 py-2" key={session.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span
                      className={`text-sm ${isActive ? 'font-medium' : ''}`}
                    >
                      {sessionEmail || 'Unknown email'}
                    </span>
                    {isActive && (
                      <span className="text-muted-foreground text-xs">
                        Current
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!isActive && (
                    <Button
                      className="h-6 px-2 text-xs"
                      onClick={() => handleSwitchAccount(session.id)}
                      size="sm"
                      variant="ghost"
                    >
                      Switch
                    </Button>
                  )}
                  <Button
                    className="h-6 px-2 text-red-600 text-xs hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                    onClick={() => handleSignOut(session.id)}
                    size="sm"
                    variant="ghost"
                  >
                    <LogOut className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className={`mt-1 flex items-center gap-2 ${canAddMoreAccounts ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
        >
          <SignInButton mode="modal">
            <Button>
              <Plus className="h-4 w-4" />
              <span className="text-sm">
                {canAddMoreAccounts ? 'Add account' : 'Add account (Pro)'}
              </span>
            </Button>
          </SignInButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
