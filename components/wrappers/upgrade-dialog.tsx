'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getCheckoutURL } from '@/actions/billing'
import { authClient } from '@/lib/auth-client'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function UpgradeDialog() {
    const { data: session } = authClient.useSession()
    const currentUser = useQuery(api.auth.getCurrentUser, {})
    const [open, setOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (typeof window.createLemonSqueezy === 'function') {
          window.createLemonSqueezy()
        }
      }, [])

    useEffect(() => {
        const shouldShow = Boolean(
        session && currentUser && !currentUser.isPro && !currentUser.hasSeenUpgradePrompt
        )
        setOpen(shouldShow)
    }, [session, currentUser])

    const onClose = async () => {
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : onClose())}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upgrade to Pro</DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground">Unlock AI agent features and more.</div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onClose()}>Maybe later</Button>
                    <Button 
                        type="button"
                        onClick={async () => {                            
                            try {
                                const checkoutUrl = await getCheckoutURL(
                                    Number(process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_MONTHLY_ID!), 
                                    {
                                        userId: session?.user?.id as string,
                                        email: session?.user?.email as string
                                    }
                                )
                                if (checkoutUrl) {
                                    router.push(checkoutUrl)
                                }
                            } catch (error) {
                                toast('Error creating a checkout.', {
                                    description: 'Please check the server console for more information.',
                                })
                            }
                        }}
                    >
                        Upgrade
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


