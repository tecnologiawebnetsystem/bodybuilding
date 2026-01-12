"use client"

import type { ReactNode } from "react"

interface PageContainerProps {
  children: ReactNode
  title?: string
  subtitle?: string
  badge?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
}

export function PageContainer({ children, title, subtitle, badge, maxWidth = "2xl" }: PageContainerProps) {
  const widthClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-5xl",
    xl: "max-w-6xl",
    "2xl": "max-w-7xl",
    full: "max-w-full",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 -m-6 p-6">
      <div className={`${widthClasses[maxWidth]} mx-auto`}>
        {(title || subtitle || badge) && (
          <div className="text-center space-y-3 mb-8">
            {badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-2">
                <span className="text-sm font-medium text-slate-700">{badge}</span>
              </div>
            )}
            {title && (
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                {title}
              </h1>
            )}
            {subtitle && <p className="text-slate-600 text-lg">{subtitle}</p>}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200/50">{children}</div>
      </div>
    </div>
  )
}
