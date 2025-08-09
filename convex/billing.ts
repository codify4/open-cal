import { mutation } from './_generated/server'
import type { Id } from './_generated/dataModel'
import { v } from 'convex/values'

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


