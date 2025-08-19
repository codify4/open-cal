import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const setUpgradePromptSeen = mutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', args.clerkUserId))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, { hasSeenUpgradePrompt: true });
    }
  },
});

export const markPaid = mutation({
  args: {
    webhookId: v.string(),
    clerkUserId: v.string(),
    subscriptionId: v.string(),
    variantId: v.number(),
  },
  handler: async (ctx, args) => {
    const already = await ctx.db
      .query('webhookEvents')
      .withIndex('by_eventId', (q) => q.eq('eventId', args.webhookId))
      .unique();

    if (!already) {
      await ctx.db.insert('webhookEvents', {
        eventId: args.webhookId,
        processedAt: Date.now(),
      });
    }

    if (already) return { skipped: true };

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', args.clerkUserId))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, {
        isPro: true,
        planVariantId: args.variantId,
        lemonSubscriptionId: args.subscriptionId,
        updatedAt: Date.now(),
      });
    }

    return { ok: true };
  },
});

export const getUserSubscription = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', args.clerkUserId))
      .unique();

    if (!user) return null;

    return {
      isPro: user.isPro,
      planVariantId: user.planVariantId,
      lemonSubscriptionId: user.lemonSubscriptionId,
      billingInterval: user.billingInterval,
      renewsAt: user.renewsAt,
      endsAt: user.endsAt,
    };
  },
});
