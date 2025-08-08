'use client';

import type * as React from 'react';
import { CalendarStoreProvider } from './calendar-store-provider';
import { ChatStoreProvider } from './chat-store-provider';
import { CalendarLayoutClient } from '@/components/wrappers/calendar-layout-client';
import { authClient } from '@/lib/auth-client';
import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react';
import { ConvexReactClient } from 'convex/react';

export interface ProvidersProps {
  children: React.ReactNode;
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: ProvidersProps) {
    return (
        <ConvexBetterAuthProvider client={convex} authClient={authClient}>
            <CalendarStoreProvider>
                <ChatStoreProvider>
                    <CalendarLayoutClient>
                        {children}
                    </CalendarLayoutClient>
                </ChatStoreProvider>
            </CalendarStoreProvider>
        </ConvexBetterAuthProvider>
    )
}
