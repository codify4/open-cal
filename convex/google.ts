import { mutation, query, action, internalQuery, internalMutation } from './_generated/server'
import { v } from 'convex/values'
import { betterAuthComponent } from './auth'
import type { Id } from './_generated/dataModel'
import { internal } from './_generated/api'

export const saveAccount = mutation({
  args: {
    googleUserId: v.string(),
    email: v.string(),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    expiresAt: v.number(),
    scopes: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const authUser = await betterAuthComponent.getAuthUser(ctx)
    if (!authUser) throw new Error('Unauthorized')

    const existing = await ctx.db
      .query('googleAccounts')
      .withIndex('by_userId_googleUserId', (q) =>
        q.eq('userId', authUser.userId as Id<'users'>).eq('googleUserId', args.googleUserId),
      )
      .unique()

    const now = Date.now()
    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        expiresAt: args.expiresAt,
        scopes: args.scopes,
        updatedAt: now,
      })
      return { ok: true, updated: true }
    }

    await ctx.db.insert('googleAccounts', {
      userId: authUser.userId as Id<'users'>,
      googleUserId: args.googleUserId,
      email: args.email,
      accessToken: args.accessToken,
      refreshToken: args.refreshToken,
      expiresAt: args.expiresAt,
      scopes: args.scopes,
      createdAt: now,
      updatedAt: now,
    } as any)

    return { ok: true, created: true }
  },
})

export const getAccounts = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await betterAuthComponent.getAuthUser(ctx)
    if (!authUser) return []
    const accounts = await ctx.db
      .query('googleAccounts')
      .withIndex('by_userId', (q) => q.eq('userId', authUser.userId as Id<'users'>))
      .collect()
    return accounts.map((a) => ({
      _id: a._id,
      email: a.email,
      googleUserId: a.googleUserId,
      expiresAt: a.expiresAt,
      scopes: a.scopes,
    }))
  },
})

export const getAccountById = internalQuery({
  args: { accountId: v.id('googleAccounts') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.accountId)
  },
})

export const updateAccountTokens = internalMutation({
  args: {
    accountId: v.id('googleAccounts'),
    accessToken: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.accountId, {
      accessToken: args.accessToken,
      expiresAt: args.expiresAt,
      updatedAt: Date.now(),
    })
  },
})

function mapHexToColor(hex: string): 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange' {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return 'blue'
  const r = Number.parseInt(clean.slice(0, 2), 16)
  const g = Number.parseInt(clean.slice(2, 4), 16)
  const b = Number.parseInt(clean.slice(4, 6), 16)
  if (r >= g && r >= b) return 'red'
  if (g >= r && g >= b) return 'green'
  if (b >= r && b >= g) return 'blue'
  return 'blue'
}

export const listCalendars = action({
  args: { accountId: v.id('googleAccounts') },
  handler: async (ctx, args) => {
    const account = await ctx.runQuery(internal.google.getAccountById, { accountId: args.accountId })
    if (!account) return []

    let accessToken = account.accessToken as string
    const now = Date.now()
    if (account.expiresAt <= now + 60000 && account.refreshToken) {
      const clientId = process.env.GOOGLE_CLIENT_ID
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET
      if (clientId && clientSecret) {
        const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: account.refreshToken as string,
            grant_type: 'refresh_token',
          }),
        })
        const tokenJson = (await tokenResp.json().catch(() => null)) as { access_token?: string; expires_in?: number } | null
        if (tokenResp.ok && tokenJson?.access_token) {
          accessToken = tokenJson.access_token
          const expiresAt = Date.now() + ((tokenJson.expires_in || 3600) * 1000)
          await ctx.runMutation(internal.google.updateAccountTokens, { accountId: args.accountId, accessToken, expiresAt })
        }
      }
    }

    const resp = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const json = (await resp.json().catch(() => null)) as { items?: Array<Record<string, unknown>> } | null
    if (!resp.ok || !json?.items) return []

    const calendars = json.items.map((item: any) => {
      const id = String(item.id ?? '')
      const name = String(item.summary ?? id)
      const hex = typeof item.backgroundColor === 'string' ? (item.backgroundColor as string) : '#4285F4'
      const color = mapHexToColor(hex)
      return { id, name, color, isVisible: true as const, type: 'calendar' as const }
    })
    return calendars
  },
})

function toISODate(date: Date) {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

async function getValidAccessToken(ctx: any, account: any) {
  let accessToken = account.accessToken as string
  const now = Date.now()
  if (account.expiresAt <= now + 60000 && account.refreshToken) {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    if (clientId && clientSecret) {
      const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: account.refreshToken as string,
          grant_type: 'refresh_token',
        }),
      })
      const tokenJson = (await tokenResp.json().catch(() => null)) as { access_token?: string; expires_in?: number } | null
      if (tokenResp.ok && tokenJson?.access_token) {
        accessToken = tokenJson.access_token
        const expiresAt = Date.now() + ((tokenJson.expires_in || 3600) * 1000)
        await ctx.runMutation(internal.google.updateAccountTokens, { accountId: account._id, accessToken, expiresAt })
      }
    }
  }
  return accessToken
}

function googleEventToLocalEvent(item: any, calendarId: string, accountEmail: string) {
  const isAllDay = !!item.start?.date || !!item.end?.date
  const startDate = isAllDay
    ? new Date(`${item.start?.date}T00:00:00Z`)
    : new Date(item.start?.dateTime || item.start?.date)
  const endDate = isAllDay
    ? new Date(`${item.end?.date}T23:59:00Z`)
    : new Date(item.end?.dateTime || item.end?.date || item.start?.dateTime)
  return {
    id: String(item.id || ''),
    title: String(item.summary || ''),
    description: typeof item.description === 'string' ? item.description : undefined,
    startDate,
    endDate,
    color: 'blue',
    type: 'event' as const,
    location: typeof item.location === 'string' ? item.location : undefined,
    attendees: Array.isArray(item.attendees) ? item.attendees.map((a: any) => a.email).filter(Boolean) : [],
    reminders: [],
    repeat: 'none' as const,
    visibility: (item.visibility === 'private' ? 'private' : 'public') as 'public' | 'private',
    isAllDay,
    account: accountEmail,
    calendar: calendarId,
  }
}

export const listEvents = action({
  args: {
    accountId: v.id('googleAccounts'),
    calendarId: v.string(),
    timeMin: v.string(),
    timeMax: v.string(),
  },
  handler: async (ctx, args): Promise<any[]> => {
    const account: any = await ctx.runQuery(internal.google.getAccountById, { accountId: args.accountId })
    if (!account) return []
    const accessToken = await getValidAccessToken(ctx, account)
    const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(args.calendarId)}/events`)
    url.searchParams.set('singleEvents', 'true')
    url.searchParams.set('orderBy', 'startTime')
    url.searchParams.set('maxResults', '2500')
    url.searchParams.set('timeMin', args.timeMin)
    url.searchParams.set('timeMax', args.timeMax)
    const resp = await fetch(url.toString(), { headers: { Authorization: `Bearer ${accessToken}` } })
    const json = (await resp.json().catch(() => null)) as { items?: any[] } | null
    if (!resp.ok || !json?.items) return []
    return json.items.map((item) => googleEventToLocalEvent(item, args.calendarId, account.email))
  },
})

export const createEvent = action({
  args: {
    accountId: v.id('googleAccounts'),
    calendarId: v.string(),
    event: v.object({
      title: v.string(),
      description: v.optional(v.string()),
      startDate: v.string(),
      endDate: v.string(),
      isAllDay: v.optional(v.boolean()),
      location: v.optional(v.string()),
      attendees: v.optional(v.array(v.string())),
      visibility: v.optional(v.union(v.literal('public'), v.literal('private'))),
    }),
  },
  handler: async (ctx, args): Promise<any> => {
    const account: any = await ctx.runQuery(internal.google.getAccountById, { accountId: args.accountId })
    if (!account) throw new Error('Account not found')
    const accessToken = await getValidAccessToken(ctx, account)
    const isAllDay = !!args.event.isAllDay
    const start = new Date(args.event.startDate)
    const end = new Date(args.event.endDate)
    const body: any = {
      summary: args.event.title,
      description: args.event.description,
      location: args.event.location,
      visibility: args.event.visibility === 'private' ? 'private' : 'public',
      attendees: (args.event.attendees || []).map((email) => ({ email })),
    }
    if (isAllDay) {
      const startDate = toISODate(start)
      const endDate = toISODate(new Date(end.getTime() + 24 * 60 * 60 * 1000))
      body.start = { date: startDate }
      body.end = { date: endDate }
    } else {
      body.start = { dateTime: start.toISOString() }
      body.end = { dateTime: end.toISOString() }
    }
    const resp = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(args.calendarId)}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
    })
    const json = (await resp.json().catch(() => null)) as any
    if (!resp.ok || !json) throw new Error('Create failed')
    return googleEventToLocalEvent(json, args.calendarId, account.email)
  },
})

export const updateEvent = action({
  args: {
    accountId: v.id('googleAccounts'),
    calendarId: v.string(),
    eventId: v.string(),
    patch: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      startDate: v.optional(v.string()),
      endDate: v.optional(v.string()),
      isAllDay: v.optional(v.boolean()),
      location: v.optional(v.string()),
      attendees: v.optional(v.array(v.string())),
      visibility: v.optional(v.union(v.literal('public'), v.literal('private'))),
    }),
  },
  handler: async (ctx, args): Promise<any> => {
    const account: any = await ctx.runQuery(internal.google.getAccountById, { accountId: args.accountId })
    if (!account) throw new Error('Account not found')
    const accessToken = await getValidAccessToken(ctx, account)
    const body: any = {}
    if (args.patch.title !== undefined) body.summary = args.patch.title
    if (args.patch.description !== undefined) body.description = args.patch.description
    if (args.patch.location !== undefined) body.location = args.patch.location
    if (args.patch.visibility !== undefined) body.visibility = args.patch.visibility
    if (args.patch.attendees !== undefined) body.attendees = args.patch.attendees.map((email) => ({ email }))
    if (args.patch.startDate || args.patch.endDate || args.patch.isAllDay !== undefined) {
      const isAllDay = !!args.patch.isAllDay
      const start = args.patch.startDate ? new Date(args.patch.startDate) : undefined
      const end = args.patch.endDate ? new Date(args.patch.endDate) : undefined
      if (isAllDay && (start || end)) {
        const startDate = start ? toISODate(start) : undefined
        const endDate = end ? toISODate(new Date(end.getTime() + 24 * 60 * 60 * 1000)) : undefined
        if (startDate) body.start = { date: startDate }
        if (endDate) body.end = { date: endDate }
      } else {
        if (start) body.start = { dateTime: start.toISOString() }
        if (end) body.end = { dateTime: end.toISOString() }
      }
    }
    const resp = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(args.calendarId)}/events/${encodeURIComponent(args.eventId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
    })
    const json = (await resp.json().catch(() => null)) as any
    if (!resp.ok || !json) throw new Error('Update failed')
    return googleEventToLocalEvent(json, args.calendarId, account.email)
  },
})

export const deleteEvent = action({
  args: {
    accountId: v.id('googleAccounts'),
    calendarId: v.string(),
    eventId: v.string(),
  },
  handler: async (ctx, args): Promise<{ ok: true }> => {
    const account: any = await ctx.runQuery(internal.google.getAccountById, { accountId: args.accountId })
    if (!account) throw new Error('Account not found')
    const accessToken = await getValidAccessToken(ctx, account)
    const resp = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(args.calendarId)}/events/${encodeURIComponent(args.eventId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!resp.ok && resp.status !== 204) throw new Error('Delete failed')
    return { ok: true }
  },
})

export const freeBusy = action({
  args: {
    accountId: v.id('googleAccounts'),
    timeMin: v.string(),
    timeMax: v.string(),
    calendars: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args): Promise<any> => {
    const account: any = await ctx.runQuery(internal.google.getAccountById, { accountId: args.accountId })
    if (!account) return [] as any
    const accessToken = await getValidAccessToken(ctx, account)
    const body = {
      timeMin: args.timeMin,
      timeMax: args.timeMax,
      items: (args.calendars || ['primary']).map((id) => ({ id })),
    }
    const resp = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
    })
    const json = (await resp.json().catch(() => null)) as any
    if (!resp.ok || !json) return [] as any
    return json.calendars || {}
  },
})


