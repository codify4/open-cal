'use client';

import { Button } from '../ui/button';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { getCheckoutURL } from '@/actions/billing';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { TextShimmer } from '@/components/agent/text-shimmer';

const Premium = () => {
    const { user } = useUser();
    const router = useRouter();
    const currentUser = useQuery(api.auth.getCurrentUser, { 
      clerkUserId: user?.id 
    });
    
    if (currentUser?.isPro) return null;
    
    const handleUpgrade = async () => {
        if (!user || !currentUser) return;
        
        try {
            const checkoutUrl = await getCheckoutURL(
                Number(process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_MONTHLY_ID!), 
                {
                    userId: String(currentUser._id),
                    email: user.primaryEmailAddress?.emailAddress as string
                }
            );
            if (checkoutUrl) {
                router.push(checkoutUrl);
            }
        } catch (error) {
            toast.error('Error creating checkout', {
                description: 'Please try again later.',
            });
        }
    };
    
    return (
        <>
            <SignedOut>
                <SignInButton mode="modal">
                    <Button 
                        type="button"
                        variant="outline" 
                        className="group relative flex items-center justify-start w-full py-3 rounded-lg text-sm border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900 transition-all duration-200 focus:ring-0"
                    >
                        <div className="flex items-center gap-2.5">
                            <Sparkles className="w-4 h-4 text-neutral-600 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-100 transition-colors" />
                            <TextShimmer 
                                className="text-sm"
                                duration={2}
                            >
                                Sign in for Pro
                            </TextShimmer>
                        </div>
                    </Button>
                </SignInButton>
            </SignedOut>
            
            <SignedIn>
                <Button 
                    type="button"
                    variant="outline" 
                    className="group relative flex items-center justify-start w-full py-3 rounded-lg text-sm border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900 transition-all duration-200 focus:ring-0"
                    onClick={handleUpgrade}
                >
                    <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-neutral-600 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-100 transition-colors" />
                        <TextShimmer 
                            className="text-sm"
                            duration={2}
                        >
                            Get Caly Pro
                        </TextShimmer>
                    </div>
                </Button>
            </SignedIn>
        </>
    );
};

export default Premium;
