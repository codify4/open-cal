import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "next-themes";
import Script from "next/script";

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist",
    display: "swap",
});

export const metadata: Metadata = {
    title: "OpenCal",
    description: "An open-source calendar, offering a fresh alternative to traditional calendar applications. Deeply integrated with AI Agents to help you manage your time and never miss an important event ever again.",
    icons: {
        icon: "/icon.png",
        apple: "/icon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <Script
                    src="https://cdn.databuddy.cc/databuddy.js"
                    data-client-id="UqCP74-YWv1RohnF2azYu"
                    data-track-interactions="true"
                    data-track-engagement="true"
                    data-track-bounce-rate="true"
                    data-track-web-vitals="true"
                    data-enable-batching="true"
                    crossOrigin="anonymous"
                    async
                />
            </head>
            <body className={`${geist.variable} antialiased bg-background text-foreground`}>
                <ThemeProvider attribute="class" defaultTheme="dark">
                    {children}
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    );
}
