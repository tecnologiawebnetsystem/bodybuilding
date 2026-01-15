"use client"

import { useState, useEffect } from "react"
import { PinLogin } from "@/components/pin-login"
import { Dashboard } from "@/components/dashboard"

export default function AppMobilePage() {
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = sessionStorage.getItem("currentUser")
    if (storedUser) {
      setCurrentUser(storedUser)
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
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!currentUser) {
    return <PinLogin onLogin={handleLogin} />
  }

  return <Dashboard userId={currentUser} onLogout={handleLogout} />
}
