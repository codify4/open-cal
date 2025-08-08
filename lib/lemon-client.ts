'use client'

type Interval = 'month' | 'year'

 function getPublicVariantId(interval: Interval): string {
  const id =
    interval === 'month'
      ? process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_MONTHLY_ID
      : process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_YEARLY_ID
  if (!id) throw new Error('Variant ID not configured')
  return String(id)
}

function getPublicStoreDomain(): string {
  const domain = process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_DOMAIN
  if (!domain) throw new Error('NEXT_PUBLIC_LEMONSQUEEZY_STORE_DOMAIN not set')
  return domain
}

export function openLemonCheckout(
  interval: Interval,
  opts?: { email?: string; userId?: string }
) {
  const variantId = getPublicVariantId(interval)
  const domain = getPublicStoreDomain()

  const params = new URLSearchParams()
  if (opts?.email) params.set('checkout[email]', opts.email)
  if (opts?.userId) params.set('checkout[custom][user_id]', opts.userId)

  const url = `https://${domain}.lemonsqueezy.com/checkout/buy/${variantId}?${params.toString()}`

  const w = window as unknown as {
    LemonSqueezy?: { Url?: { Open?: (u: string) => void } }
  }
  if (w?.LemonSqueezy?.Url?.Open) {
    w.LemonSqueezy.Url.Open(url)
  } else {
    window.location.href = url
  }
}



