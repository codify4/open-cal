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
    productId: v.string(),
    customerId: v.string(),
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

    let user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', args.clerkUserId))
      .unique();

    if (!user) {
      const userId = await ctx.db.insert('users', {
        clerkUserId: args.clerkUserId,
        email: '',
        isPro: true,
        planProductId: args.productId,
        polarSubscriptionId: args.subscriptionId,
        polarCustomerId: args.customerId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return { ok: true, userId, created: true };
    } else {
      await ctx.db.patch(user._id, {
        isPro: true,
        planProductId: args.productId,
        polarSubscriptionId: args.subscriptionId,
        polarCustomerId: args.customerId,
        updatedAt: Date.now(),
      });
      return { ok: true, userId: user._id, created: false };
    }
  },
});

export const markSubscriptionCanceled = mutation({
  args: {
    webhookId: v.string(),
    subscriptionId: v.string(),
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
      .withIndex('by_polarSubscriptionId', (q) => q.eq('polarSubscriptionId', args.subscriptionId))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, {
        isPro: false,
        endsAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return { ok: true };
  },
});

export const markSubscriptionRefunded = mutation({
  args: {
    webhookId: v.string(),
    subscriptionId: v.string(),
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
      .withIndex('by_polarSubscriptionId', (q) => q.eq('polarSubscriptionId', args.subscriptionId))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, {
        isPro: false,
        endsAt: Date.now(),
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
      planProductId: user.planProductId,
      polarSubscriptionId: user.polarSubscriptionId,
      polarCustomerId: user.polarCustomerId,
      billingInterval: user.billingInterval,
      renewsAt: user.renewsAt,
      endsAt: user.endsAt,
    };
  },
});
