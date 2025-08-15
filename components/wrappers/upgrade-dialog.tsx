'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getCheckoutURL } from '@/actions/billing'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { plans } from '@/constants/pricing'
import { BorderBeam } from '@/components/magicui/border-beam'
import { Switch } from '@/components/ui/switch'
import Image from 'next/image'

export default function UpgradeDialog() {
    const { user: clerkUser, isSignedIn } = useUser()
    const currentUser = useQuery(api.auth.getCurrentUser, { clerkUserId: clerkUser?.id })
    const [open, setOpen] = useState(false)
    const [isYearly, setIsYearly] = useState(true)
    const router = useRouter()

    const proPlans = plans.filter(plan => plan.name !== 'Free')
    const monthlyPlan = proPlans.find(plan => plan.name === 'Pro')
    const yearlyPlan = proPlans.find(plan => plan.name === 'Pro Yearly')

    const currentPlan = isYearly ? {
        ...yearlyPlan,
        name: 'Pro',
        price: '10',
        period: ' / MONTH',
        originalPrice: '20',
        billingNote: 'Billed Annually',
        isYearly: true
    } : {
        ...monthlyPlan,
        period: ' / MONTH',
        isYearly: false
    }

    useEffect(() => {
        if (typeof window.createLemonSqueezy === 'function') {
          window.createLemonSqueezy()
        }
      }, [])

    useEffect(() => {
        const shouldShow = Boolean(
            isSignedIn && currentUser && !currentUser.isPro && !currentUser.hasSeenUpgradePrompt
        )
        setOpen(shouldShow)
    }, [isSignedIn, currentUser])

    const onClose = async () => {
        setOpen(false)
    }

    const handleUpgrade = async () => {
        if (!clerkUser?.id) return
        
        try {
            const variantId = isYearly 
                ? Number(process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_YEARLY_ID!)
                : Number(process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_MONTHLY_ID!)
            
            const checkoutUrl = await getCheckoutURL(variantId, {
                userId: clerkUser.id,
                email: clerkUser.primaryEmailAddress?.emailAddress || ''
            })
            
            if (checkoutUrl) {
                router.push(checkoutUrl)
            }
        } catch (error) {
            toast('Error creating a checkout.', {
                description: 'Please check the server console for more information.',
            })
        }
    }

    if (!isSignedIn || !currentUser || currentUser.isPro || currentUser.hasSeenUpgradePrompt) return null

    return (
        <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : onClose())}>
            <DialogContent className="max-w-md p-0 bg-card border rounded-xl" showCloseButton={false}>
                <DialogTitle className="sr-only">Upgrade to Pro</DialogTitle>
                <div className="relative p-6">
                    <BorderBeam
                        className="from-[#ffaa40] via-[#9c40ff] to-transparent"
                        duration={1}
                        size={400}
                    />
                    
                    <div className="flex items-center justify-between mb-6">
                        <Image src="/logo-name.svg" alt="Caly" width={70} height={60} className="rounded-full" />
                        
                        <div className="text-right">
                            <div className="flex items-center gap-3">
                                <Switch 
                                    checked={isYearly} 
                                    onCheckedChange={setIsYearly}
                                    className="focus:ring-0 data-[state=checked]:bg-white"
                                />
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        Billed Annually
                                    </span>
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-xs font-medium">
                                        50% off
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-4xl font-bold">${currentPlan?.price}</span>
                            {isYearly && (
                                <span className="ml-1 text-lg text-muted-foreground line-through">
                                    $20
                                </span>
                            )}
                            <span className="text-muted-foreground">{currentPlan?.period}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            For professionals and power users who want to supercharge their calendar and daily efficiency.
                        </p>
                    </div>

                    <ul className="space-y-3 mb-8">
                        {currentPlan?.features?.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <div className="mt-0.5 flex-shrink-0">
                                    <Check className="h-4 w-4 text-green-600" />
                                </div>
                                <span className="text-sm text-foreground leading-relaxed">
                                    {feature}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <Button 
                        onClick={handleUpgrade}
                        className="w-full py-3"
                        size="lg"
                    >
                        {currentPlan?.cta}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}


