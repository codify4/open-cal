"use server";

import { api } from "@/convex/_generated/api";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { createCheckout, lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

export async function configureLemonSqueezy() {
    const requiredVars = [
      'LEMONSQUEEZY_API_KEY',
    ]
    const missing = requiredVars.filter((v) => !process.env[v])
    if (missing.length) {
      throw new Error(
        `Missing required Lemon Squeezy env: ${missing.join(', ')}. See https://docs.lemonsqueezy.com/guides/tutorials/nextjs-saas-billing`
      )
    }
  
    lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY as string })
}

export async function getCheckoutURL(variantId: string, embed = false): Promise<string> {
    await configureLemonSqueezy()
    
    const user = await fetchQuery(api.auth.getCurrentUser, {})
    if (!user) throw new Error('Unauthorized')

    const storeId = process.env.LEMONSQUEEZY_STORE_ID as string | undefined
    if (!storeId) throw new Error('LEMONSQUEEZY_STORE_ID not set')

    const checkout = await createCheckout(storeId, variantId, {
        checkoutOptions: { embed, media: false, logo: !embed },
        checkoutData: {
            email: (user as any)?.email ?? undefined,
            custom: { user_id: (user as any)?.userId },
        },
        productOptions: {
            enabledVariants: [variantId],
            redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/calendar`,
            receiptButtonText: 'Go to Dashboard',
            receiptThankYouNote: 'Thank you for upgrading!',
        },
    } as any)

    const url = (checkout as any)?.data?.data?.attributes?.url as string | undefined
    if (!url) throw new Error('Failed to create checkout')
    return url
}


