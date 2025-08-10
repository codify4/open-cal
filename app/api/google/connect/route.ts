import { NextRequest, NextResponse } from 'next/server'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const base = (process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin) as string
  const redirectUri = `${base}/api/google/oauth/callback`
  const scopes = [
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
    'https://www.googleapis.com/auth/calendar.freebusy',
  ]

  if (!clientId) {
    return NextResponse.json({ error: 'Missing GOOGLE_CLIENT_ID' }, { status: 400 })
  }

  const csrf = Math.random().toString(36).slice(2)
  let uid: string | null = null
  try {
    const currentUser = await fetchQuery(api.auth.getCurrentUser, {})
    uid = (currentUser?.userId as unknown as string) || null
  } catch {}
  const statePayload = { csrf, uid }
  const state = Buffer.from(JSON.stringify(statePayload)).toString('base64url')
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', scopes.join(' '))
  url.searchParams.set('access_type', 'offline')
  url.searchParams.set('prompt', 'consent')
  url.searchParams.set('include_granted_scopes', 'true')
  url.searchParams.set('state', state)

  const res = NextResponse.redirect(url.toString(), { status: 302 })
  res.cookies.set('g_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 300,
  })
  return res
}


