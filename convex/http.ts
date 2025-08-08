import { httpRouter } from 'convex/server'
import { betterAuthComponent } from './auth'
import { auth } from '../lib/auth'
import { lemonsqueezyWebhook } from './lemon/webhook'

const http = httpRouter()

betterAuthComponent.registerRoutes(http, auth)

http.route({
  path: '/lemon/webhook',
  method: 'POST',
  handler: lemonsqueezyWebhook,
})

export default http