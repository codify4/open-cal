import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
    users: defineTable({
        lemonCustomerId: v.optional(v.string()),
        isPro: v.optional(v.boolean()),
        hasSeenUpgradePrompt: v.optional(v.boolean()),
        billingInterval: v.optional(v.union(v.literal('month'), v.literal('year'))),
        renewsAt: v.optional(v.number()),
        endsAt: v.optional(v.number()),
        lemonSubscriptionId: v.optional(v.string()),
        planVariantId: v.optional(v.number()),
    }).index('by_lemonCustomerId', ['lemonCustomerId']),
    webhookEvents: defineTable({
        eventId: v.string(),
        processedAt: v.number(),
    }).index('by_eventId', ['eventId']),
})


