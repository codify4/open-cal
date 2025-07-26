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
  title: "Digit",
  description: "An open-source AI calendar, offering a fresh alternative to traditional calendar applications.",
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
