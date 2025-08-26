import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

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
      .unique();

    if (existingUser) {
      return existingUser._id;
    }

    const userId = await ctx.db.insert('users', {
      clerkUserId: args.clerkUserId,
      email: args.email,
      name: args.name,
      isPro: false,
      hasSeenUpgradePrompt: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return userId;
  },
});

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
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    const updateData: any = { updatedAt: Date.now() };
    if (args.email !== undefined) updateData.email = args.email;
    if (args.name !== undefined) updateData.name = args.name;

    await ctx.db.patch(user._id, updateData);
    return user._id;
  },
});

export const getCurrentUser = query({
  args: {
    clerkUserId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.clerkUserId) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) =>
        q.eq('clerkUserId', args.clerkUserId!)
      )
      .unique();

    return user;
  },
});

export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .unique();

    return user;
  },
});

export const saveGoogleAccount = mutation({
  args: {
    clerkUserId: v.string(),
    googleUserId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', args.clerkUserId))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    const existingAccount = await ctx.db
      .query('googleAccounts')
      .withIndex('by_userId_googleUserId', (q) => 
        q.eq('userId', user._id).eq('googleUserId', args.googleUserId)
      )
      .unique();

    if (existingAccount) {
      await ctx.db.patch(existingAccount._id, {
        email: args.email,
        updatedAt: Date.now(),
      });
      return existingAccount._id;
    }
    
    const accountId = await ctx.db.insert('googleAccounts', {
      userId: user._id,
      googleUserId: args.googleUserId,
      email: args.email,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return accountId;
  },
});

export const deleteGoogleAccount = mutation({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', args.clerkUserId))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    const googleAccount = await ctx.db
      .query('googleAccounts')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .unique();

    if (googleAccount) {
      await ctx.db.delete(googleAccount._id);
    }

    return true;
  },
});

export const addGoogleAccountToCurrentUser = mutation({
  args: {
    clerkUserId: v.string(),
    googleUserId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the current user by clerkUserId
    let user = await ctx.db
      .query('users')
      .withIndex('by_clerkUserId', (q) => q.eq('clerkUserId', args.clerkUserId))
      .unique();

    // If user doesn't exist, create them
    if (!user) {
      // Check if there's an existing user with Pro status from billing
      const existingProUser = await ctx.db
        .query('users')
        .withIndex('by_email', (q) => q.eq('email', args.email))
        .filter((q) => q.eq(q.field('isPro'), true))
        .first();

      const userId = await ctx.db.insert('users', {
        clerkUserId: args.clerkUserId,
        email: args.email,
        isPro: existingProUser?.isPro ?? false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      user = await ctx.db.get(userId);
    }

    if (!user) {
      throw new Error('Failed to create or find user');
    }

    // Check if this Google account is already linked to any user
    const existingAccount = await ctx.db
      .query('googleAccounts')
      .withIndex('by_googleUserId', (q) => q.eq('googleUserId', args.googleUserId))
      .unique();

    if (existingAccount) {
      // If account exists, update it to belong to the current user
      await ctx.db.patch(existingAccount._id, {
        userId: user._id,
        email: args.email,
        updatedAt: Date.now(),
      });
      return existingAccount._id;
    }
    
    // Create new Google account linked to current user
    const accountId = await ctx.db.insert('googleAccounts', {
      userId: user._id,
      googleUserId: args.googleUserId,
      email: args.email,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return accountId;
  },
});
