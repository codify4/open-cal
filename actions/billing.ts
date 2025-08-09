"use server";
import { lemonSqueezySetup, getSubscription, getCustomer } from '@lemonsqueezy/lemonsqueezy.js'

export async function getCheckoutURL(
  variantId: number,
  user: { userId: string; email?: string | null }
) {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const appUrl = process.env.APP_URL;

  if (!apiKey) throw new Error("Missing LEMONSQUEEZY_API_KEY.");
  if (!storeId) throw new Error("Missing LEMONSQUEEZY_STORE_ID.");
  if (!appUrl) throw new Error("Missing APP_URL.");
  if (!user?.userId) throw new Error("User is not authenticated.");

  const url = 'https://api.lemonsqueezy.com/v1/checkouts';
  const body = {
    data: {
      type: 'checkouts',
      attributes: {
        product_options: {
          redirect_url: `${appUrl}/calendar`,
          receipt_button_text: 'Go to Calendar',
          receipt_thank_you_note: 'Thank you for subscribing to Caly!'
        },
        checkout_options: {
          embed: false,
          media: false,
          logo: true
        },
        checkout_data: {
          email: user.email ?? undefined,
          custom: { user_id: user.userId }
        }
      },
      relationships: {
        store: { data: { type: 'stores', id: String(storeId) } },
        variant: { data: { type: 'variants', id: String(variantId) } }
      }
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json'
    },
    body: JSON.stringify(body)
  });

  const json = await response.json().catch(() => null);
  if (!response.ok) {
    const detail =
      json?.errors?.[0]?.detail ||
      json?.error?.message ||
      `HTTP ${response.status}`;
    throw new Error(detail);
  }

  const checkoutUrl = json?.data?.attributes?.url;
  if (!checkoutUrl) throw new Error('Missing checkout URL');
  return checkoutUrl as string;
}

export async function getCustomerPortalURL(subscriptionId: string) {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY
    if (!apiKey) throw new Error('Missing LEMONSQUEEZY_API_KEY.')
    if (!subscriptionId) throw new Error('Missing subscriptionId.')
        
    lemonSqueezySetup({ apiKey });
    const { data } = await getSubscription(subscriptionId);
    console.log(data?.data.attributes.urls)
    return data?.data.attributes.urls.customer_portal
}