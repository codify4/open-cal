'use client';

import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { getCheckoutURL } from '@/actions/billing';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ShineBorder } from '../magicui/shine-border';

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
        <Card className="relative border-neutral-200 gap-0 bg-white dark:border-neutral-800 dark:bg-neutral-950 p-0">
            <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
            <CardHeader className="p-2 px-4">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    Upgrade to Pro
                </CardTitle>
                <CardDescription className="text-sm text-neutral-600 dark:text-neutral-400">
                    Unlock unlimited agent messages and more.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-2 px-3 pt-0">
                <SignedOut>
                    <SignInButton mode="modal">
                        <Button 
                            type="button"
                            className="w-full text-sm bg-neutral-800 hover:bg-neutral-700 text-white"
                        >
                            Sign in for Pro
                        </Button>
                    </SignInButton>
                </SignedOut>
                
                <SignedIn>
                    <Button 
                        type="button"
                        className="w-full text-xs text-left bg-neutral-800 hover:bg-neutral-700 text-white h-8 rounded-sm"
                        onClick={handleUpgrade}
                    >
                        <Sparkles className="w-3 h-3 text-white" />
                        Get Caly Pro
                    </Button>
                </SignedIn>
            </CardContent>
        </Card>
    );
};

export default Premium;
