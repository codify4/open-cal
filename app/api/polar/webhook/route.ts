
import { Webhooks } from '@polar-sh/nextjs';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
  },
  onSubscriptionCreated: async (subscription) => {
    try {
      const userId = (subscription as any).data?.metadata?.userId;
      const productId = (subscription as any).data?.productId;
      const customerId = (subscription as any).data?.customerId;
      const subscriptionId = (subscription as any).data?.id;

      if (userId && productId && customerId && subscriptionId) {
        await fetchMutation(api.billing.markPaid, {
          webhookId: `polar_sub_created_${Date.now()}`,
          clerkUserId: String(userId),
          subscriptionId: String(subscriptionId),
          productId: String(productId),
          customerId: String(customerId),
        });
      }
    } catch (error) {
    }
  },
  onSubscriptionCanceled: async (subscription) => {
    try {
      const subscriptionId = (subscription as any).data?.id;

      if (subscriptionId) {
        await fetchMutation(api.billing.markSubscriptionCanceled, {
          webhookId: `polar_sub_canceled_${Date.now()}`,
          subscriptionId: String(subscriptionId),
        });
      }
    } catch (error) {
    }
  },
  onSubscriptionRevoked: async (subscription) => {
    try {
      const subscriptionId = (subscription as any).data?.id;

      if (subscriptionId) {
        await fetchMutation(api.billing.markSubscriptionCanceled, {
          webhookId: `polar_sub_revoked_${Date.now()}`,
          subscriptionId: String(subscriptionId),
        });
      }
    } catch (error) {
    }
  },
});