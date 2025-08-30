
import { Webhooks } from '@polar-sh/nextjs';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    console.error('=== WEBHOOK RECEIVED ===');
    console.error('Payload type:', payload.type);
    console.error('Full payload:', JSON.stringify(payload, null, 2));
  },
  onCheckoutCreated: async (checkout) => {
    console.error('=== CHECKOUT CREATED ===');
    console.error('Checkout data:', JSON.stringify(checkout, null, 2));
    
    try {
      const checkoutId = (checkout as any).data?.id;
      const customerId = (checkout as any).data?.customerId;
      const productId = (checkout as any).data?.productId;
      const amount = (checkout as any).data?.amount;
      
      console.error('Extracted checkout data:', { 
        checkoutId, 
        customerId, 
        productId, 
        amount 
      });
      
    } catch (error) {
      console.error('Error in onCheckoutCreated:', error);
    }
  },
  onSubscriptionCreated: async (subscription) => {
    console.error('=== SUBSCRIPTION CREATED ===');
    console.error('Subscription details:', JSON.stringify(subscription, null, 2));
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
      console.error('=== SUBSCRIPTION CANCELED ===');
      console.error('Subscription details:', JSON.stringify(subscription, null, 2));
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
      console.error('=== SUBSCRIPTION REVOKED ===');
      console.error('Subscription details:', JSON.stringify(subscription, null, 2));
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