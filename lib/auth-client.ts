import { createAuthClient } from 'better-auth/react'
import { convexClient, crossDomainClient } from '@convex-dev/better-auth/client/plugins'

export const authClient = createAuthClient({
  plugins: [crossDomainClient(), convexClient()],
})