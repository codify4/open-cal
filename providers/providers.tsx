'use client';

import type * as React from 'react';
import { CalendarStoreProvider } from './calendar-store-provider';
import { ChatStoreProvider } from './chat-store-provider';
import { CalendarLayoutClient } from '@/components/wrappers/calendar-layout-client';

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <CalendarStoreProvider>
      <ChatStoreProvider>
        <CalendarLayoutClient>
          {children}
        </CalendarLayoutClient>
      </ChatStoreProvider>
    </CalendarStoreProvider>
  )
}
