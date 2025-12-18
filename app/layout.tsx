import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import StructuredData from "@/components/structured-data"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "USAP - Minimal Messenger",
    template: "%s | USAP"
  },
  description: "Experience lightning-fast, minimalist messaging with USAP. No clutter, just pure communication. Join thousands who've simplified their messaging experience.",
  keywords: ["messaging", "chat", "messenger", "minimal", "simple", "real-time", "communication", "USAP"],
  authors: [{ name: "Raven", url: "https://github.com/ravvdevv" }],
  creator: "Raven (ravvdevv)",
  publisher: "USAP",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://usap.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://usap.vercel.app",
    title: "USAP - Minimal Messenger",
    description: "Experience lightning-fast, minimalist messaging with USAP. No clutter, just pure communication.",
    siteName: "USAP",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "USAP - Minimal Messenger App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "USAP - Minimal Messenger",
    description: "Experience lightning-fast, minimalist messaging with USAP. No clutter, just pure communication.",
    images: ["/og-image.png"],
    creator: "@usap_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#5bbad5" },
    ],
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
