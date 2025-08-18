'use client'

import { ReactNode } from 'react'
import { CalendarStoreProvider } from './calendar-store-provider'
import { ChatStoreProvider } from './chat-store-provider'
import { CalendarLayoutClient } from '@/components/wrappers/calendar-layout-client'
import ConvexClientProvider from './convex-client-provider'
import { ClerkProvider } from '@clerk/nextjs'
import MultisessionAppSupport from './multi-session'

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider afterMultiSessionSingleSignOutUrl="/calendar">
            <MultisessionAppSupport>
                <ConvexClientProvider>
                    <CalendarStoreProvider>
                        <ChatStoreProvider>
                            <CalendarLayoutClient>
                                {children}
                            </CalendarLayoutClient>
                        </ChatStoreProvider>
                    </CalendarStoreProvider>
                </ConvexClientProvider>
            </MultisessionAppSupport>
        </ClerkProvider>
    )
}