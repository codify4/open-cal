import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { Geist } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OpenCal',
  description:
    'An open-source calendar, offering a fresh alternative to traditional calendar applications. Deeply integrated with AI Agents to help you manage your time and never miss an important event ever again.',
  icons: {
    icon: '/open-cal.svg',
    apple: '/open-cal.svg',
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
        className={`${geist.variable} bg-neutral-950 text-foreground antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
