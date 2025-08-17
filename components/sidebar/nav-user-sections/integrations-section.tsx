'use client';

import { Plus } from 'lucide-react';
import { useQuery } from 'convex/react';
import { useUser } from '@clerk/nextjs';
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
  const current = useQuery(api.auth.getCurrentUser, { 
    clerkUserId: clerkUser?.id 
  });
  
  const handleAddAccount = () => {
    if (!current?.isPro && accounts.length >= 1) return;
    onAddAccount();
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
            <CardTitle className="text-neutral-900 dark:text-white">Google Calendar</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Connect your Google Calendar accounts to sync events and manage
              your schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SignedOut>
              <div className="text-center py-8">
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Sign in to connect your Google Calendar
                </p>
                <SignInButton mode="modal">
                  <Button variant="outline">
                    Sign in to Connect
                  </Button>
                </SignInButton>
              </div>
            </SignedOut>
            
            <SignedIn>
              {accounts.length > 0 && (
                <div className="space-y-3">
                  {accounts.map((account) => (
                    <div
                      className="flex items-center justify-between rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3"
                      key={account.email}
                    >
                      <div className="flex items-center space-x-3">
                        <Image src={'g-cal.svg'} alt={account.email} width={32} height={32} />
                        <div>
                          <h4 className="font-semibold text-neutral-900 dark:text-white">
                            {account.email}
                          </h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                className="w-full justify-start border-neutral-300 dark:border-neutral-600 border-dashed hover:border-neutral-400 dark:hover:border-neutral-500"
                onClick={handleAddAccount}
                variant="outline"
                disabled={!current?.isPro && accounts.length >= 1}
              >
                <Plus className="mr-2 h-4 w-4" />
                {!current?.isPro && accounts.length >= 1 ? 'Upgrade to add more accounts' : 'Connect Another Google Calendar Account'}
              </Button>
            </SignedIn>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
