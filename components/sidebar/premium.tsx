'use client';

import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ShineBorder } from '../magicui/shine-border';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import UpgradeDialog from '../wrappers/upgrade-dialog';

const Premium = () => {
  const { user } = useUser();
  const currentUser = useQuery(api.auth.getCurrentUser, {
    clerkUserId: user?.id,
  });

  if (currentUser?.isPro) return null;

  return (
    <Card className="relative gap-0 border-neutral-200 bg-white p-0 dark:border-neutral-800 dark:bg-neutral-950">
      <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} />
      <CardHeader className="p-2 px-4">
        <CardTitle className="flex items-center gap-2 font-medium text-sm">
          Upgrade to Pro
        </CardTitle>
        <CardDescription className="text-neutral-600 text-sm dark:text-neutral-400">
          Unlock unlimited agent messages and more.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 px-3 pt-0">
        <SignedOut>
          <SignInButton mode="modal">
            <Button
              className="w-full bg-neutral-800 text-sm text-white hover:bg-neutral-700"
              type="button"
            >
              Sign in for Pro
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UpgradeDialog />
        </SignedIn>
      </CardContent>
    </Card>
  );
};

export default Premium;
