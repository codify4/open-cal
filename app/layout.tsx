import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import { Provider } from "jotai"

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
    <html lang="en" className="dark">
      <body className={`${geist.variable} antialiased bg-background text-foreground`}>
        <Provider>
          {children}
        </Provider>
        <Analytics />
      </body>
    </html>
  );
}
