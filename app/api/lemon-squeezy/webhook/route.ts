import crypto from 'node:crypto'

export async function POST(request: Request) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  if (!secret) return new Response('Missing webhook secret', { status: 500 })
  if (!convexUrl) return new Response('Missing NEXT_PUBLIC_CONVEX_URL', { status: 500 })

  const rawBody = await request.text()
  const signatureHeader = request.headers.get('X-Signature') || request.headers.get('x-signature')
  if (!signatureHeader) return new Response('Invalid request', { status: 400 })

  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(rawBody, 'utf8')
  const digestHex = hmac.digest('hex')

  const expected = Buffer.from(digestHex, 'hex')
  let provided: Buffer
  try {
    provided = Buffer.from(signatureHeader, 'hex')
  } catch {
    return new Response('Invalid request', { status: 400 })
  }
  if (expected.length !== provided.length || !crypto.timingSafeEqual(expected, provided)) {
    return new Response('Invalid request', { status: 400 })
  }

  const res = await fetch(`${convexUrl}/lemon/webhook`, {
    method: 'POST',
    headers: { 'X-Signature': signatureHeader, 'Content-Type': 'application/json' },
    body: rawBody,
    cache: 'no-store',
  })
  const text = await res.text().catch(() => '')
  return new Response(text || 'OK', { status: res.status })
}
