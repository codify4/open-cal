'use client';

import { CreditCard } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { getCustomerPortalURL, getCheckoutURL } from '@/actions/billing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';

export function BillingSection() {
  const [loadingPortal, setLoadingPortal] = useState(false);
  const { user: clerkUser } = useUser();
  const current = useQuery(api.auth.getCurrentUser, { 
    clerkUserId: clerkUser?.id 
  });
  const subscriptionId = current?.lemonSubscriptionId as string | undefined;
  const router = useRouter();

  async function openPortal() {
    try {
      setLoadingPortal(true);
      if (!subscriptionId) return;
      const url = await getCustomerPortalURL(subscriptionId);
      if (url) window.location.href = url;
    } finally {
      setLoadingPortal(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-semibold text-neutral-900 dark:text-white text-xl">
          Billing & Subscription
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Manage your subscription and payment methods.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-white">Current Plan</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Your current subscription details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-neutral-100 dark:bg-neutral-800 p-4">
              <div className="flex items-center space-x-3">
                <Image src={'/caly.svg'} alt="caly" width={40} height={40} className='rounded-sm' />
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white">{current?.isPro ? 'Caly Pro' : 'Caly Free'}</h4>
                  {current?.isPro ? (
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">{current?.planVariantId === Number(process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_YEARLY_ID) ? '$120/year' : '$20/month'}</p>
                  ) : (
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">Limited features</p>
                  )}
                </div>
              </div>
              {current?.isPro ? (
                <Badge className="bg-green-500/20 text-green-600 dark:text-green-400" variant="secondary">Active</Badge>
              ) : (
                <Badge className="bg-neutral-500/20 text-neutral-700 dark:text-neutral-300" variant="secondary">Free</Badge>
              )}
            </div>
            {current?.isPro ? (
              <div className="text-neutral-600 dark:text-neutral-400 text-sm">
                {current?.renewsAt ? (
                  <p>Next billing date: {new Date(current.renewsAt).toLocaleDateString()}</p>
                ) : null}
                <p>
                  {current?.billingInterval === 'year' ? 'Billed yearly' : 'Billed monthly'} • Auto-renewal enabled
                </p>
              </div>
            ) : (
              <div className="text-neutral-600 dark:text-neutral-400 text-sm">
                <p>Upgrade to unlock AI agent and integrations.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-white">Subscription Actions</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Manage your subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {current?.isPro ? (
              <Button type="button" className="w-full justify-start" variant="outline" onClick={openPortal} disabled={loadingPortal}>
                <CreditCard className="mr-2 h-4 w-4" />
                {loadingPortal ? 'Opening...' : 'Manage Billing'}
              </Button>
            ) : (
              <Button
                type="button"
                className="w-full justify-start"
                variant="outline"
                onClick={async () => {
                  try {
                    const checkoutUrl = await getCheckoutURL(
                      Number(process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_MONTHLY_ID!),
                      {
                        userId: String(current?._id),
                        email: clerkUser?.primaryEmailAddress?.emailAddress as string,
                      }
                    );
                    if (checkoutUrl) router.push(checkoutUrl);
                  } catch {}
                }}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
