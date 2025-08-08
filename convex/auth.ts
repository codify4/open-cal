import { BetterAuth, type AuthFunctions } from '@convex-dev/better-auth'
import { api, components, internal } from './_generated/api'
import { query } from './_generated/server'
import type { Id, DataModel } from './_generated/dataModel'

const authFunctions: AuthFunctions = internal.auth

export const betterAuthComponent = new BetterAuth(components.betterAuth, {
  authFunctions,
})

export const { createUser, updateUser, deleteUser, createSession } =
  betterAuthComponent.createAuthFunctions<DataModel>({
    onCreateUser: async (ctx) => ctx.db.insert('users', {}),
    onDeleteUser: async (ctx, userId) => {
      await ctx.db.delete(userId as Id<'users'>)
    },
  })

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userMetadata = await betterAuthComponent.getAuthUser(ctx)
    if (!userMetadata) return null

    const user = await ctx.db.get(userMetadata.userId as Id<'users'>)
    return { ...user, ...userMetadata }
  },
})
