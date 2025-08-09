import { query, mutation } from './_generated/server'
import type { Id } from './_generated/dataModel'
import { v } from 'convex/values'

export const latestSubscriptionForUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const subs = await ctx.db
      .query('subscriptions')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .order('desc')
      .take(1)

    return subs[0] ?? null
  },
})

export const setUpgradePromptSeen = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId as Id<'users'>, { hasSeenUpgradePrompt: true })
  },
})

export const markPaid = mutation({
  args: {
    webhookId: v.string(),
    userId: v.string(),
    subscriptionId: v.string(),
    variantId: v.number(),
  },
  handler: async (ctx, args) => {
    const already = await ctx.db
      .query('webhookEvents')
      .withIndex('by_eventId', (q) => q.eq('eventId', args.webhookId))
      .unique()

    if (!already) {
      await ctx.db.insert('webhookEvents', {
        eventId: args.webhookId,
        processedAt: Date.now(),
      })
    }

    if (already) return { skipped: true }

    await ctx.db.patch(args.userId as Id<'users'>, {
      isPro: true,
      planVariantId: args.variantId,
      lemonSubscriptionId: args.subscriptionId,
    } as any)

    return { ok: true }
  },
})

export const processWebhookEvent = mutation({
  args: {
    eventId: v.string(),
    lemonSubscriptionId: v.string(),
    userId: v.optional(v.string()),
    lemonCustomerId: v.optional(v.string()),
    productId: v.optional(v.number()),
    variantId: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal('active'),
        v.literal('on_trial'),
        v.literal('paused'),
        v.literal('past_due'),
        v.literal('unpaid'),
        v.literal('cancelled'),
        v.literal('expired')
      )
    ),
    interval: v.optional(v.union(v.literal('month'), v.literal('year'))),
    renewsAt: v.optional(v.number()),
    endsAt: v.optional(v.number()),
    trialEndsAt: v.optional(v.number()),
    manageUrl: v.optional(v.string()),
    updateUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const processed = await ctx.db
      .query('webhookEvents')
      .withIndex('by_eventId', (q) => q.eq('eventId', args.eventId))
      .unique()

    if (processed) return { skipped: true }

    const now = Date.now()
    const existingSub = await ctx.db
      .query('subscriptions')
      .withIndex('by_subscriptionId', (q) => q.eq('lemonSubscriptionId', args.lemonSubscriptionId))
      .unique()

    if (existingSub) {
      await ctx.db.patch(existingSub._id, {
        userId: args.userId ?? existingSub.userId,
        lemonCustomerId: args.lemonCustomerId ?? existingSub.lemonCustomerId,
        productId: args.productId ?? existingSub.productId,
        variantId: args.variantId ?? existingSub.variantId,
        status: args.status ?? existingSub.status,
        interval: (args.interval ?? existingSub.interval) as any,
        renewsAt: args.renewsAt ?? existingSub.renewsAt,
        endsAt: args.endsAt ?? existingSub.endsAt,
        trialEndsAt: args.trialEndsAt ?? existingSub.trialEndsAt,
        updateUrl: args.updateUrl ?? existingSub.updateUrl,
        manageUrl: args.manageUrl ?? existingSub.manageUrl,
        updatedAt: now,
      } as any)
    } else {
      await ctx.db.insert('subscriptions', {
        userId: args.userId ?? '',
        lemonSubscriptionId: args.lemonSubscriptionId,
        lemonCustomerId: args.lemonCustomerId ?? '',
        productId: args.productId ?? 0,
        variantId: args.variantId ?? 0,
        status: (args.status ?? 'active') as any,
        interval: (args.interval ?? 'month') as any,
        renewsAt: args.renewsAt,
        endsAt: args.endsAt,
        trialEndsAt: args.trialEndsAt,
        updateUrl: args.updateUrl,
        manageUrl: args.manageUrl,
        createdAt: now,
        updatedAt: now,
      })
    }

    if (args.userId) {
      try {
        await ctx.db.patch(args.userId as Id<'users'>, {
          lemonCustomerId: args.lemonCustomerId,
          isPro: args.status === 'active' || args.status === 'on_trial',
          billingInterval: args.interval,
          renewsAt: args.renewsAt,
          endsAt: args.endsAt,
        } as any)
      } catch {}
    }

    await ctx.db.insert('webhookEvents', {
      eventId: args.eventId,
      processedAt: now,
    })

    return { ok: true }
  },
})


