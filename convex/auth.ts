import { query, mutation } from './_generated/server'
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
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', args.clerkUserId!))
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

export const getGoogleAccessToken = query({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', args.clerkUserId))
      .unique()

    if (!user) return null

    const googleAccount = await ctx.db
      .query('googleAccounts')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .unique()

    if (!googleAccount) return null

    if (googleAccount.expiresAt < Date.now()) {
      return null
    }

    return googleAccount.accessToken
  },
})

export const saveGoogleAccount = mutation({
  args: {
    clerkUserId: v.string(),
    googleUserId: v.string(),
    email: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    expiresAt: v.number(),
    scopes: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', args.clerkUserId))
      .unique()

    if (!user) {
      throw new Error('User not found')
    }

    const existingAccount = await ctx.db
      .query('googleAccounts')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .unique()

    if (existingAccount) {
      await ctx.db.patch(existingAccount._id, {
        googleUserId: args.googleUserId,
        email: args.email,
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        expiresAt: args.expiresAt,
        scopes: args.scopes,
        updatedAt: Date.now(),
      })
      return existingAccount._id
    } else {
      const accountId = await ctx.db.insert('googleAccounts', {
        userId: user._id,
        googleUserId: args.googleUserId,
        email: args.email,
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        expiresAt: args.expiresAt,
        scopes: args.scopes,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      return accountId
    }
  },
})

export const deleteGoogleAccount = mutation({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', args.clerkUserId))
      .unique()

    if (!user) {
      throw new Error('User not found')
    }

    const googleAccount = await ctx.db
      .query('googleAccounts')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .unique()

    if (googleAccount) {
      await ctx.db.delete(googleAccount._id)
    }

    return true
  },
})