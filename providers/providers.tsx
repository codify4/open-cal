'use client'

import { ReactNode, useState } from 'react'
import { CalendarStoreProvider } from './calendar-store-provider'
import { ChatStoreProvider } from './chat-store-provider'
import UpgradeDialog from '@/components/wrappers/upgrade-dialog'
import { CalendarLayoutClient } from '@/components/wrappers/calendar-layout-client'
import ConvexClientProvider from './convex-client-provider'
import { ClerkProvider } from '@clerk/nextjs'

export default function Providers({ children }: { children: ReactNode }) {
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)

    return (
        <ClerkProvider>
            <ConvexClientProvider>
                <CalendarStoreProvider>
                    <ChatStoreProvider>
                        <CalendarLayoutClient>
                            {children}
                            <UpgradeDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog} />
                        </CalendarLayoutClient>
                    </ChatStoreProvider>
                </CalendarStoreProvider>
            </ConvexClientProvider>
        </ClerkProvider>
    )
}