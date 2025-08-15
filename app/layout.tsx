import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { Geist, Lora } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { ClerkProvider } from '@clerk/nextjs';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Caly',
  description:
    'An open-source calendar, offering a fresh alternative to traditional calendar applications. Deeply integrated with AI Agents to help you manage your time and never miss an important event ever again.',
  icons: {
    icon: '/caly.svg',
    apple: '/caly.svg',
  },
  openGraph: {
    images: '/og-img.png',
    title: 'Caly',
    description:
      'An open-source calendar, offering a fresh alternative to traditional calendar applications. Deeply integrated with AI Agents to help you manage your time and never miss an important event ever again.',
    url: 'https://caly-ai.vercel.app',
    siteName: 'Caly',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caly',
    description:
      'An open-source calendar, offering a fresh alternative to traditional calendar applications. Deeply integrated with AI Agents to help you manage your time and never miss an important event ever again.',
    images: '/og-img.png',
  },
  alternates: {
    canonical: 'https://caly-ai.vercel.app',
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
                async
                crossOrigin="anonymous"
                data-client-id="UqCP74-YWv1RohnF2azYu"
                data-enable-batching="true"
                data-track-bounce-rate="true"
                data-track-engagement="true"
                data-track-interactions="true"
                data-track-web-vitals="true"
                src="https://cdn.databuddy.cc/databuddy.js"
            />
        </head>
        <body
            className={`${geist.variable} ${lora.variable} bg-neutral-950 text-foreground antialiased`}
        >
            <ClerkProvider>
                <ThemeProvider attribute="class" defaultTheme="dark">
                    {children}
                </ThemeProvider>
            </ClerkProvider>
            <Toaster duration={2000} />
            <Analytics />
        </body>
    </html>
  );
}
