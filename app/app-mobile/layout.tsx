import type React from "react"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "FitTransform - App",
  description: "Seu app de fitness e treinos personalizados",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FitTransform",
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
}

export default function AppMobileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen min-h-[100dvh] bg-[#0a0a0a] text-white antialiased">{children}</div>
}
