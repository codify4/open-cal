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
  })
    .index('by_lemonCustomerId', ['lemonCustomerId']),
  subscriptions: defineTable({
    userId: v.string(),
    lemonSubscriptionId: v.string(),
    lemonCustomerId: v.string(),
    productId: v.number(),
    variantId: v.number(),
    status: v.union(
      v.literal('active'),
      v.literal('on_trial'),
      v.literal('paused'),
      v.literal('past_due'),
      v.literal('unpaid'),
      v.literal('cancelled'),
      v.literal('expired')
    ),
    interval: v.union(v.literal('month'), v.literal('year')),
    renewsAt: v.optional(v.number()),
    endsAt: v.optional(v.number()),
    trialEndsAt: v.optional(v.number()),
    updateUrl: v.optional(v.string()),
    manageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_subscriptionId', ['lemonSubscriptionId']),
  webhookEvents: defineTable({
    eventId: v.string(),
    processedAt: v.number(),
  }).index('by_eventId', ['eventId']),
})


