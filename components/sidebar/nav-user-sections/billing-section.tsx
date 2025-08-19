'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { CreditCard } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getCheckoutURL, getCustomerPortalURL } from '@/actions/billing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/convex/_generated/api';

export function BillingSection() {
  const [loadingPortal, setLoadingPortal] = useState(false);
  const { user: clerkUser } = useUser();
  const current = useQuery(api.auth.getCurrentUser, {
    clerkUserId: clerkUser?.id,
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
        <h3 className="mb-2 font-semibold text-neutral-900 text-xl dark:text-white">
          Billing & Subscription
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Manage your subscription and payment methods.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-white">
              Current Plan
            </CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Your current subscription details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800">
              <div className="flex items-center space-x-3">
                <Image
                  alt="caly"
                  className="rounded-sm"
                  height={40}
                  src={'/caly.svg'}
                  width={40}
                />
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white">
                    {current?.isPro ? 'Caly Pro' : 'Caly Free'}
                  </h4>
                  {current?.isPro ? (
                    <p className="text-neutral-600 text-sm dark:text-neutral-400">
                      {current?.planVariantId ===
                      Number(
                        process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_YEARLY_ID
                      )
                        ? '$120/year'
                        : '$20/month'}
                    </p>
                  ) : (
                    <p className="text-neutral-600 text-sm dark:text-neutral-400">
                      Limited features
                    </p>
                  )}
                </div>
              </div>
              {current?.isPro ? (
                <Badge
                  className="bg-green-500/20 text-green-600 dark:text-green-400"
                  variant="secondary"
                >
                  Active
                </Badge>
              ) : (
                <Badge
                  className="bg-neutral-500/20 text-neutral-700 dark:text-neutral-300"
                  variant="secondary"
                >
                  Free
                </Badge>
              )}
            </div>
            {current?.isPro ? (
              <div className="text-neutral-600 text-sm dark:text-neutral-400">
                {current?.renewsAt ? (
                  <p>
                    Next billing date:{' '}
                    {new Date(current.renewsAt).toLocaleDateString()}
                  </p>
                ) : null}
                <p>
                  {current?.billingInterval === 'year'
                    ? 'Billed yearly'
                    : 'Billed monthly'}{' '}
                  • Auto-renewal enabled
                </p>
              </div>
            ) : (
              <div className="text-neutral-600 text-sm dark:text-neutral-400">
                <p>Upgrade to unlock AI agent and integrations.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-white">
              Subscription Actions
            </CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Manage your subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {current?.isPro ? (
              <Button
                className="w-full justify-start"
                disabled={loadingPortal}
                onClick={openPortal}
                type="button"
                variant="outline"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {loadingPortal ? 'Opening...' : 'Manage Billing'}
              </Button>
            ) : (
              <Button
                className="w-full justify-start"
                onClick={async () => {
                  try {
                    const checkoutUrl = await getCheckoutURL(
                      Number(
                        process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_MONTHLY_ID!
                      ),
                      {
                        userId: String(current?._id),
                        email: clerkUser?.primaryEmailAddress
                          ?.emailAddress as string,
                      }
                    );
                    if (checkoutUrl) router.push(checkoutUrl);
                  } catch {}
                }}
                type="button"
                variant="outline"
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
