import { httpAction } from '../_generated/server'
import { api } from '../_generated/api'
import HmacSHA256 from 'crypto-js/hmac-sha256'
import Hex from 'crypto-js/enc-hex'

function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) return new Uint8Array()
  const out = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) out[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  return out
}

function safeEqual(a: Uint8Array, b: Uint8Array): boolean {
  const len = Math.max(a.length, b.length)
  let result = a.length ^ b.length
  for (let i = 0; i < len; i++) {
    const ai = i < a.length ? a[i] : 0
    const bi = i < b.length ? b[i] : 0
    result |= ai ^ bi
  }
  return result === 0
}

function verifyLemonSqueezySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  if (!secret || !signature) return false
  const digestHex = HmacSHA256(rawBody, secret).toString(Hex)
  const expected = hexToBytes(digestHex)
  const provided = /^[0-9a-fA-F]+$/.test(signature) ? hexToBytes(signature) : new Uint8Array()
  return safeEqual(expected, provided)
}

export const lemonsqueezyWebhook = httpAction(async (ctx, request) => {
  const rawBody = await request.text();
  const signature = request.headers.get('X-Signature') || request.headers.get('x-signature');
  const ok = verifyLemonSqueezySignature(rawBody, signature);
  if (!ok) return new Response('invalid signature', { status: 401 });

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response('bad json', { status: 400 });
  }

  const eventId: string | undefined =
    payload?.meta?.webhook_id ?? payload?.meta?.event_id ?? payload?.id;
  if (!eventId) return new Response('no event id', { status: 400 });

  const type: string = payload?.meta?.event_name ?? payload?.type ?? '';
  const sub = payload?.data?.attributes ?? {};
  const rel = payload?.data?.relationships ?? {};

  const lemonSubscriptionId = String(payload?.data?.id ?? '');
  const lemonCustomerId = String(rel?.customer?.data?.id ?? sub?.customer_id ?? '');
  const productId = Number(rel?.product?.data?.id ?? sub?.product_id ?? 0);
  const variantId = Number(rel?.variant?.data?.id ?? sub?.variant_id ?? 0);
  const status: any = sub?.status ?? '';
  const interval: any = sub?.billing_interval ?? sub?.renewal_billing_interval ?? '';
  const renewsAt = sub?.renews_at ? Date.parse(sub.renews_at) : undefined;
  const endsAt = sub?.ends_at ? Date.parse(sub.ends_at) : undefined;
  const trialEndsAt = sub?.trial_ends_at ? Date.parse(sub.trial_ends_at) : undefined;
  const manageUrl = sub?.urls?.customer_portal ?? sub?.urls?.update_payment_method ?? undefined;
  const updateUrl = sub?.urls?.update_payment_method ?? undefined;

  const customUserId = payload?.meta?.custom_data?.user_id ?? sub?.user_id ?? payload?.meta?.custom?.user_id;
  const userId: string | undefined = customUserId ? String(customUserId) : undefined;

  if (lemonSubscriptionId) {
    await ctx.runMutation((api as any).billing.processWebhookEvent, {
      eventId: eventId!,
      lemonSubscriptionId,
      userId,
      lemonCustomerId,
      productId,
      variantId,
      status,
      interval,
      renewsAt,
      endsAt,
      trialEndsAt,
      manageUrl,
      updateUrl,
    })
  }

  // processed inside mutation for idempotency; don't double-insert here

  return new Response('ok', { status: 200 });
})


