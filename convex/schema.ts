import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    lemonCustomerId: v.optional(v.string()),
    isPro: v.optional(v.boolean()),
    hasSeenUpgradePrompt: v.optional(v.boolean()),
    billingInterval: v.optional(v.union(v.literal('month'), v.literal('year'))),
    renewsAt: v.optional(v.number()),
    endsAt: v.optional(v.number()),
    lemonSubscriptionId: v.optional(v.string()),
    planVariantId: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_clerkUserId', ['clerkUserId'])
    .index('by_lemonCustomerId', ['lemonCustomerId'])
    .index('by_email', ['email']),
  webhookEvents: defineTable({
    eventId: v.string(),
    processedAt: v.number(),
  }).index('by_eventId', ['eventId']),
  googleAccounts: defineTable({
    userId: v.id('users'),
    googleUserId: v.string(),
    email: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    expiresAt: v.number(),
    scopes: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_email', ['email'])
    .index('by_googleUserId', ['googleUserId'])
    .index('by_userId_googleUserId', ['userId', 'googleUserId']),
});
