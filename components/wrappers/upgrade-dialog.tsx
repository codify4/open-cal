'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getCheckoutURL } from '@/actions/billing'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Check, Sparkles } from 'lucide-react'
import { plans } from '@/constants/pricing'
import { Switch } from '@/components/ui/switch'
import Image from 'next/image'
import { toast } from 'sonner'
import { ShineBorder } from '../magicui/shine-border'

export default function UpgradeDialog() {
    const { user } = useUser()
    const router = useRouter()
    const [isYearly, setIsYearly] = useState(true)
    const [isOpen, setIsOpen] = useState(false)

    const handleUpgrade = async () => {
        if (!user?.id) {
            toast.error('Please sign in to upgrade')
            return
        }
        
        try {
            const variantId = isYearly 
                ? Number(process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_YEARLY_ID!)
                : Number(process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_MONTHLY_ID!)
            
            const checkoutUrl = await getCheckoutURL(variantId, {
                userId: user.id,
                email: user.primaryEmailAddress?.emailAddress || ''
            })
            
            if (checkoutUrl) {
                router.push(checkoutUrl)
            }
        } catch (error) {
            toast.error('Error creating checkout', {
                description: 'Please try again later.',
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    className="w-full text-xs text-left bg-neutral-800 hover:bg-neutral-700 text-white h-8 rounded-sm"
                    onClick={() => setIsOpen(true)}
                >
                    <Sparkles className="w-3 h-3 text-white" />
                    Get Caly Pro
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md p-0 bg-card border rounded-xl" showCloseButton={true}>
                <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} borderWidth={3}/>
                <DialogTitle className="sr-only">Upgrade to Pro</DialogTitle>
                <div className="relative p-6">
                    
                    
                    <div className="flex items-center justify-between mb-6">
                        <Image src="/logo-name.svg" alt="Caly" width={70} height={60} className="rounded-full" />
                        
                        <div className="text-right">
                            <div className="flex items-center gap-3">
                                <Switch 
                                    checked={isYearly} 
                                    onCheckedChange={setIsYearly}
                                    className="focus:ring-0 dark:data-[state=checked]:bg-white cursor-pointer"
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
                            <span className="text-4xl font-bold">${isYearly ? '10' : '20'}</span>
                            <span className="text-muted-foreground">per month</span>
                        </div>
                        {isYearly && (
                            <p className="text-base text-black">Billed annually at $120</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            For professionals and power users who want to supercharge their calendar and daily efficiency.
                        </p>
                    </div>

                    <ul className="space-y-3 mb-8">
                        {plans[1].features.map((feature, index) => (
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
                        className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white"
                        size="lg"
                    >
                        Get Caly Pro
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}


