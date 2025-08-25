
import { Webhooks } from '@polar-sh/nextjs';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    console.log('Polar webhook received:', payload);
    
    if (payload.type === 'checkout.updated') {
      const checkout = payload.data;
      if (checkout.status === 'succeeded') {
        const userId = checkout.metadata?.userId;
        const productId = checkout.products?.[0]?.id;
        const customerId = checkout.customerId;
        const subscriptionId = checkout.subscriptionId;

        if (userId && productId && customerId && subscriptionId) {
          await fetchMutation(api.billing.markPaid, {
            webhookId: `polar_${Date.now()}`,
            clerkUserId: String(userId),
            subscriptionId: String(subscriptionId),
            productId: String(productId),
            customerId: String(customerId),
          });
        }
      }
    }
  },
});