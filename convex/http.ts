import { httpRouter } from 'convex/server'
import { betterAuthComponent } from './auth'
import { auth } from '../lib/auth'

const http = httpRouter()

betterAuthComponent.registerRoutes(http, auth)

export default http