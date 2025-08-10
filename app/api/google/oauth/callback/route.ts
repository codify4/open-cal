import { NextRequest, NextResponse } from 'next/server'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const state = url.searchParams.get('state')
  const cookieState = request.cookies.get('g_oauth_state')?.value
  const base = (process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || url.origin) as string

  if (error) {
    return NextResponse.redirect(new URL(`/calendar?error=${encodeURIComponent(error)}`, base))
  }
  if (!code) {
    return NextResponse.redirect(new URL('/calendar?error=missing_code', base))
  }
  if (!state || !cookieState || state !== cookieState) {
    return NextResponse.redirect(new URL('/calendar?error=invalid_state', base))
  }
  let uidFromState: string | null = null
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString()) as { csrf?: string; uid?: string }
    uidFromState = decoded.uid ?? null
  } catch {}

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = new URL('/api/google/oauth/callback', base).toString()
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/calendar?error=missing_google_env', base))
  }

  const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })
  const tokenJson = await tokenResp.json().catch(() => null)
  if (!tokenResp.ok || !tokenJson?.access_token) {
    return NextResponse.redirect(new URL('/calendar?error=token_exchange_failed', base))
  }

  const accessToken = tokenJson.access_token as string
  const refreshToken = (tokenJson.refresh_token as string | undefined) || undefined
  const expiresIn = Number(tokenJson.expires_in || 3600)
  const expiresAt = Date.now() + expiresIn * 1000
  const scopes = String(tokenJson.scope || '').split(' ').filter(Boolean)

  const meResp = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const me = await meResp.json().catch(() => null)
  if (!meResp.ok || !me?.id || !me?.email) {
    return NextResponse.redirect(new URL('/calendar?error=profile_fetch_failed', base))
  }

  const currentUser = await fetchQuery(api.auth.getCurrentUser, {})

  await fetchMutation(api.google.saveAccount, {
    googleUserId: String(me.id),
    email: String(me.email),
    accessToken,
    refreshToken,
    expiresAt,
    scopes,
    // Fallback when session not yet bridged to Convex
    userIdOverride: ((currentUser?.userId as any) || (uidFromState as any) || undefined),
  })

  const redirect = new URL('/calendar', base)
  const res = NextResponse.redirect(redirect)
  res.cookies.set('g_oauth_state', '', { maxAge: 0, path: '/' })
  return res
}


