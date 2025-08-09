import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json("Required env secrets not set!", { status: 400 });
  }

  const rawBody = await request.text();
  const signature = Buffer.from(
    request.headers.get("X-Signature") ?? "",
    "hex"
  );

  if (signature.length === 0 || rawBody.length === 0) {
    return NextResponse.json("Invalid request", { status: 400 });
  }

  const hmac = Buffer.from(
    crypto.createHmac("sha256", secret).update(rawBody).digest("hex"),
    "hex"
  );

  if (!crypto.timingSafeEqual(hmac, signature)) {
    return NextResponse.json("Invalid request", { status: 400 });
  }

  let data: any
  try {
    data = JSON.parse(rawBody)
  } catch {
    return NextResponse.json("Invalid request", { status: 400 })
  }

  const eventName = data?.meta?.event_name
  if (eventName && eventName !== "subscription_created") {
    return NextResponse.json("OK", { status: 200 })
  }

  const webhookId = data?.meta?.webhook_id || data?.meta?.event_id || data?.id
  const userId =
    data?.meta?.custom_data?.user_id ||
    data?.meta?.custom?.user_id ||
    data?.data?.attributes?.user_id
  const subscriptionId = data?.data?.id
  const variantFromAttr = data?.data?.attributes?.variant_id
  const variantFromRel = data?.data?.relationships?.variant?.data?.id
  const variantIdRaw = variantFromAttr ?? variantFromRel
  const variantId = Number(variantIdRaw)

  if (!webhookId || !userId || !subscriptionId || Number.isNaN(variantId)) {
    return NextResponse.json("Invalid request", { status: 400 })
  }

  await fetchMutation(api.billing.markPaid, {
    webhookId: String(webhookId),
    userId: String(userId),
    subscriptionId: String(subscriptionId),
    variantId: Number(variantId),
  })

  return NextResponse.json("OK", { status: 200 })
}
