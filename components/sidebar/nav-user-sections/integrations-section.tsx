'use client';

import { SignedIn, SignedOut, SignInButton, useClerk, useSession, useSessionList } from '@clerk/nextjs';
import { Unplug, User, Zap } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCalendarRefresh } from '@/providers/calendar-store-provider';

export function IntegrationsSection() {
  const { sessions } = useSessionList();
  const { session: currentSession } = useSession();
  const { signOut } = useClerk();
  const refreshCalendars = useCalendarRefresh();

  const handleSignOut = async (sessionId: string) => {
    try {
      if (sessionId === currentSession?.id) {
        toast('Cannot disconnect your primary account', { 
          description: 'This is your main account with pro access.' 
        });
        return;
      }

      await signOut({ sessionId });
      toast('Account disconnected successfully');
      
      if (refreshCalendars) {
        await refreshCalendars(sessionId);
      }
    } catch (error) {
      console.error('❌ Failed to disconnect account:', error);
      toast('Failed to disconnect account', { description: 'Please try again.' });
    }
  };

  return (
    <div className="scrollbar-hide max-h-[700px] lg:max-h-[560px] space-y-6 overflow-y-auto scroll-smooth pr-2">
      <div>
        <h3 className="mb-2 font-semibold text-neutral-900 text-lg sm:text-xl dark:text-white">
          Integrations
        </h3>
        <p className="text-neutral-600 text-sm sm:text-base dark:text-neutral-400">
          Connect your accounts and services to enhance your experience.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6">
        <Card className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 w-full">
          <CardHeader className="px-3">
            <CardTitle className="text-neutral-900 text-base sm:text-lg dark:text-white">
              Calendar accounts
            </CardTitle>
            <CardDescription className="text-neutral-600 text-sm dark:text-neutral-400">
              Connect your calendar services to sync events and manage schedules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-3">
            <div className="space-y-3">
              <div className="flex flex-col space-y-3 rounded-sm border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <Image
                    alt="Google Calendar"
                    height={24}
                    src="/g-cal.svg"
                    width={24}
                  />
                  <span className="font-medium text-neutral-900 text-sm sm:text-base dark:text-white">
                    Add Google Calendar account
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <SignInButton mode="modal">
                    <Button
                      className="rounded-sm dark:bg-white dark:text-black hover:bg-black/80 w-full sm:w-auto"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      <Zap className="mr-1 h-4 w-4" />
                      Connect
                    </Button>
                  </SignInButton>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 w-full">
          <CardHeader className="px-3">
            <CardTitle className="text-neutral-900 text-base sm:text-lg dark:text-white">
              Connected Accounts
            </CardTitle>
            <CardDescription className="text-neutral-600 text-sm dark:text-neutral-400">
              Manage your active account sessions and switch between accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-3">
            <SignedOut>
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <User className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
                </div>
                <p className="mb-4 text-neutral-600 text-sm dark:text-neutral-400">
                  Sign in to manage your account sessions
                </p>
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full sm:w-auto">Sign in to Manage</Button>
                </SignInButton>
              </div>
            </SignedOut>

            <SignedIn>
              {sessions && sessions.length > 0 ? (
                <div className="space-y-3">
                  {sessions.map((session) => {
                    const isActive = session.id === currentSession?.id;
                    const sessionEmail =
                      session.user?.primaryEmailAddress?.emailAddress;

                    return (
                      <div
                        className="flex flex-col space-y-3 rounded-md border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
                        key={session.id}
                      >
                        <div className="flex-1">
                          <div className="mb-2 flex items-center space-x-3">
                            <Image
                              alt="Google Calendar"
                              height={24}
                              src="/g-cal.svg"
                              width={24}
                            />
                            <span className="font-medium text-neutral-900 text-sm dark:text-white">
                              Google Calendar
                            </span>
                          </div>
                          <div className="mb-2 border-neutral-200 border-t dark:border-neutral-600" />
                          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <span className="text-neutral-900 text-sm dark:text-white break-all">
                              {sessionEmail || 'Unknown email'}
                            </span>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                              {!isActive ? (
                                <Button
                                  className="rounded-sm border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500/20 w-full sm:w-auto"
                                  onClick={() => handleSignOut(session.id)}
                                  size="sm"
                                >
                                  <Unplug className="mr-1 h-4 w-4" />
                                  Disconnect
                                </Button>
                              ) : (
                                <span className="text-xs text-neutral-500 dark:text-neutral-400 px-2 py-1">
                                  Primary Account
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <User className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <p className="text-neutral-600 text-sm dark:text-neutral-400">
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
