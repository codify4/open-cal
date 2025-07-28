"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes";

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {

    return (
        <NextThemesProvider {...themeProps} attribute="class" defaultTheme="system" enableSystem>
            {children}
        </NextThemesProvider>
    );
}
