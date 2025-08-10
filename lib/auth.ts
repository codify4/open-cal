import { convexAdapter } from '@convex-dev/better-auth'
import { convex, crossDomain } from '@convex-dev/better-auth/plugins'
import { betterAuth } from 'better-auth'
import { betterAuthComponent } from '../convex/auth'
import type { GenericCtx } from '../convex/_generated/server'

export const auth = (ctx: GenericCtx) =>
	betterAuth({
		database: convexAdapter(ctx, betterAuthComponent),
		plugins: [
			convex(),
			crossDomain({ siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' }),
		],
		trustedOrigins: [
			process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
			process.env.NEXT_PUBLIC_CONVEX_SITE_URL || '',
			'https://24f67c73cc1c04e043140a3945238ffb.loophole.site',
		].filter(Boolean) as string[],
		socialProviders: {
			google: {
				clientId: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				scopes: [
					'openid',
					'https://www.googleapis.com/auth/userinfo.email',
					'https://www.googleapis.com/auth/userinfo.profile',
					'https://www.googleapis.com/auth/calendar.events',
					'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
					'https://www.googleapis.com/auth/calendar.freebusy',
				],
                access_type: 'offline',
				prompt: 'select_account+consent',
				include_granted_scopes: 'true',
			},
		},
	})