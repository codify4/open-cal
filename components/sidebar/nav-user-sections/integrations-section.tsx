'use client';

import { User, Unplug, ArrowLeftRight, Plus, ExternalLink, Zap } from 'lucide-react';
import { useQuery } from 'convex/react';
import { useUser, useSessionList, useSession } from '@clerk/nextjs';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { toast } from 'sonner';
import type { EmailAccount, CalendarEntry } from '@/types/calendar';

interface IntegrationsSectionProps {
  accounts: EmailAccount[];
  calendars: CalendarEntry[];
  onAddAccount: () => void;
}

export function IntegrationsSection({
  accounts,
  calendars,
  onAddAccount,
}: IntegrationsSectionProps) {
  const { user: clerkUser } = useUser();
  const { sessions, setActive } = useSessionList();
  const { session: currentSession } = useSession();
  const current = useQuery(api.auth.getCurrentUser, { 
    clerkUserId: clerkUser?.id 
  });
  
  const handleAddAccount = () => {
    if (!current?.isPro && accounts.length >= 1) return;
    onAddAccount();
  };

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
  
  return (
    <div className="scrollbar-hide max-h-[560px] space-y-6 overflow-y-auto scroll-smooth pr-2">
      <div>
        <h3 className="mb-2 font-semibold text-neutral-900 dark:text-white text-xl">Integrations</h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Connect your accounts and services to enhance your experience.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-white">Calendar accounts</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Connect your calendar services to sync events and manage schedules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-sm border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-4">
                <div className="flex items-center space-x-3">
                  <Image src="/g-cal.svg" alt="Google Calendar" width={24} height={24} />
                  <span className="text-neutral-900 dark:text-white font-medium">
                    Add Google Calendar account
                  </span>
                </div>
                <div className="flex items-center gap-3">
                    <SignInButton mode="modal">
                        <Button
                            size="sm"
                            className="bg-black hover:bg-black/80 text-white rounded-sm"
                            onClick={(e) => e.preventDefault()}
                        >
                            <Zap className="h-4 w-4 mr-1" />
                            Connect
                        </Button>
                    </SignInButton>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-white">Connected Accounts</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Manage your active account sessions and switch between accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SignedOut>
              <div className="text-center py-8">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <User className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Sign in to manage your account sessions
                </p>
                <SignInButton mode="modal">
                  <Button variant="outline">
                    Sign in to Manage
                  </Button>
                </SignInButton>
              </div>
            </SignedOut>
            
            <SignedIn>
              {sessions && sessions.length > 0 ? (
                <div className="space-y-3">
                  {sessions.map((session) => {
                    const isActive = session.id === currentSession?.id;
                    const sessionEmail = session.user?.primaryEmailAddress?.emailAddress;
                    
                    return (
                      <div
                        className="flex items-center justify-between rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4"
                        key={session.id}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Image src="/g-cal.svg" alt="Google Calendar" width={24} height={24} />
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              Google Calendar
                            </span>
                          </div>
                          <div className="border-t border-neutral-200 dark:border-neutral-600 mb-2"></div>
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-900 dark:text-white text-sm">
                                {sessionEmail || 'Unknown email'}
                            </span>
                            <div className="flex items-center gap-2">
                                {!isActive && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSwitchAccount(session.id)}
                                        className="rounded-sm text-primary border-primary/20 hover:bg-primary/5"
                                    >
                                        <ArrowLeftRight className="h-4 w-4 mr-1" />
                                        Switch
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    onClick={() => handleSignOut(session.id)}
                                    className="rounded-sm bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500"
                                >
                                    <Unplug className="h-4 w-4 mr-1" />
                                    Disconnect
                                </Button>
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <User className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    No active sessions found
                  </p>
                </div>
              )}
            </SignedIn>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
