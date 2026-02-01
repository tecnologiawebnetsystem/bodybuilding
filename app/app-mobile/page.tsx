"use client"

import { useState, useEffect } from "react"
import { PinLogin } from "@/components/pin-login"
import { Dashboard } from "@/components/dashboard"

export default function AppMobilePage() {
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] AppMobilePage useEffect starting")
    // Verificar ambas as chaves para compatibilidade com /entrar e pin-login
    const storedUser = sessionStorage.getItem("currentUser") || sessionStorage.getItem("userId")
    console.log("[v0] AppMobilePage storedUser:", storedUser)
    if (storedUser) {
      setCurrentUser(storedUser)
      // Sincronizar ambas as chaves
      sessionStorage.setItem("currentUser", storedUser)
      sessionStorage.setItem("userId", storedUser)
    }
    setLoading(false)
  }, [])

  const handleLogin = (userId: string) => {
    setCurrentUser(userId)
    sessionStorage.setItem("currentUser", userId)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    sessionStorage.removeItem("currentUser")
    sessionStorage.removeItem("userId")
  }

  if (loading) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center bg-[#0a0a0a]">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-4 animate-pulse">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </div>
        <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!currentUser) {
    return <PinLogin onLogin={handleLogin} />
  }

  return <Dashboard userId={currentUser} onLogout={handleLogout} />
}
