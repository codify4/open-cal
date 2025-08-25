'use server';

import { polarClient } from '@/lib/polar';

export async function getCheckoutURL(
  productId: string,
  user: { userId: string; email?: string | null }
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) throw new Error('Missing NEXT_PUBLIC_APP_URL.');
  if (!user?.userId) throw new Error('User is not authenticated.');

  try {
    const checkout = await polarClient.checkouts.create({
      products: [productId],
      successUrl: `${appUrl}/calendar?checkout_id={CHECKOUT_ID}`,
      customerEmail: user.email || undefined,
      metadata: {
        userId: user.userId,
      },
    });

    return checkout.url;
  } catch (error) {
    console.error('Error creating Polar checkout:', error);
    throw new Error('Failed to create checkout session');
  }
}

export async function getCustomerPortalURL(customerId: string) {
  if (!customerId) throw new Error('Missing customerId.');

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) throw new Error('Missing NEXT_PUBLIC_APP_URL.');
    
    return `${appUrl}/api/polar/customer-portal?customer_id=${customerId}`;
  } catch (error) {
    console.error('Error creating customer portal URL:', error);
    throw new Error('Failed to create customer portal URL');
  }
}
