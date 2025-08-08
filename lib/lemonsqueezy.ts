import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js'

export function configureLemonSqueezy() {
  const requiredVars = [
    'LEMONSQUEEZY_API_KEY',
  ]
  const missing = requiredVars.filter((v) => !process.env[v])
  if (missing.length) {
    throw new Error(
      `Missing required Lemon Squeezy env: ${missing.join(', ')}. See https://docs.lemonsqueezy.com/guides/tutorials/nextjs-saas-billing`
    )
  }

  lemonSqueezySetup({ apiKey: process.env.NEXLEMONSQUEEZY_API_KEY as string })
}


