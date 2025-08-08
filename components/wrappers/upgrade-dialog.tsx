'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getCheckoutURL } from '@/actions/billing'
import { authClient } from '@/lib/auth-client'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function UpgradeDialog() {
  const { data: session } = authClient.useSession()
  const currentUser = useQuery(api.auth.getCurrentUser, {})
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const shouldShow = Boolean(
      session && currentUser && !currentUser.isPro && !currentUser.hasSeenUpgradePrompt
    )
    setOpen(shouldShow)
  }, [session, currentUser])

  const onUpgrade = async () => {
    const url = await getCheckoutURL(process.env.NEXT_PUBLIC_LEMONSQUEEZY_MONTHLY_PRODUCT_ID as string)
    window.LemonSqueezy.Url.Open(url)
  }

  const onClose = async () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : onClose())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to Premium</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">Unlock AI agent features and more.</div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onClose()}>Maybe later</Button>
          <Button type="button" onClick={() => onUpgrade()}>Upgrade</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


