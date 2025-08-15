import { query, mutation } from './_generated/server'
import type { Id } from './_generated/dataModel'
import { v } from 'convex/values'

export const createUser = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', args.clerkUserId))
      .unique()

    if (existingUser) {
      return existingUser._id
    }

    const userId = await ctx.db.insert('users', {
      clerkUserId: args.clerkUserId,
      email: args.email,
      name: args.name,
      isPro: false,
      hasSeenUpgradePrompt: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return userId
  },
})

export const updateUser = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', args.clerkUserId))
      .unique()

    if (!user) {
      throw new Error('User not found')
    }

    const updateData: any = { updatedAt: Date.now() }
    if (args.email !== undefined) updateData.email = args.email
    if (args.name !== undefined) updateData.name = args.name

    await ctx.db.patch(user._id, updateData)
    return user._id
  },
})

export const getCurrentUser = query({
  args: {
    clerkUserId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.clerkUserId) return null

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', args.clerkUserId))
      .unique()

    return user
  },
})

export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .unique()

    return user
  },
})