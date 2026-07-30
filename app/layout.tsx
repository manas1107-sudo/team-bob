import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter_Tight } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
})

export const metadata: Metadata = {
  title: "JanSetu AI | India's AI Scheme Recommender",
  description: "Find government schemes you qualify for in under 2 minutes. JanSetu AI uses Machine Learning to match you with 100+ welfare programs.",
  keywords: ["government schemes", "welfare benefits", "PM-KISAN", "Ayushman Bharat", "India", "AI"],
  authors: [{ name: "JanSetu AI" }],
  openGraph: {
    title: "JanSetu AI | India's AI Scheme Recommender",
    description: "Find government schemes you qualify for in under 2 minutes.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
}

import { AuthProvider } from "@/lib/contexts/AuthContext"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${interTight.className} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
