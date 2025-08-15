'use client'

import { ReactNode } from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth } from '@clerk/nextjs'
import { CalendarStoreProvider } from './calendar-store-provider'
import { ChatStoreProvider } from './chat-store-provider'
import UpgradeDialog from '@/components/wrappers/upgrade-dialog'
import { CalendarLayoutClient } from '@/components/wrappers/calendar-layout-client'

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <CalendarStoreProvider>
                <ChatStoreProvider>
                    <CalendarLayoutClient>
                        {children}
                        <UpgradeDialog />
                    </CalendarLayoutClient>
                </ChatStoreProvider>
            </CalendarStoreProvider>
        </ConvexProviderWithClerk>
    )
}