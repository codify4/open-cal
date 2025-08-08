"use node"
import { httpAction } from '../_generated/server'
import { api } from '../_generated/api'
import crypto from 'node:crypto'

function verifyLemonSqueezySignature(rawBody: string, signature: string | null): boolean {
  if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) return false;
  if (!signature) return false;
  const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET);
  hmac.update(rawBody, 'utf8');
  const digest = hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(digest, 'hex'));
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

  const eventId: string | undefined = payload?.meta?.event_id ?? payload?.id;
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


