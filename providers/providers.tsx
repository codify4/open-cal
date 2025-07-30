"use client";

import * as React from "react";
import { CalendarStoreProvider } from "./calendar-store-provider";

export interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {

    return (
        <CalendarStoreProvider>
            {children}
        </CalendarStoreProvider>
    );
}
