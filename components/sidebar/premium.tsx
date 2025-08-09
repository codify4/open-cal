'use client';

import { Button } from '../ui/button';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { getCheckoutURL } from '@/actions/billing';
import { useRouter } from 'next/navigation';

const Premium = () => {
    const { data: session } = authClient.useSession();
    const router = useRouter();

    if (!session) return null;
    
    return (
        <Button 
            variant="outline" 
            className="flex items-center justify-start w-full py-2.5 rounded-sm text-sm font-medium text-neutral-900 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:text-neutral-200 focus:ring-0"
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
            <Sparkles className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
            <span>Upgrade to Pro</span>
        </Button>
    );
};

export default Premium;
