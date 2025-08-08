import { convexAdapter } from '@convex-dev/better-auth'
import { convex } from '@convex-dev/better-auth/plugins'
import { betterAuth } from 'better-auth'
import { betterAuthComponent } from '../convex/auth'
import type { GenericCtx } from '../convex/_generated/server'

export const auth = (ctx: GenericCtx) => betterAuth({
    database: convexAdapter(ctx, betterAuthComponent),
    plugins: [convex()],
    oauth: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
})