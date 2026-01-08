"use client"

import { useState } from "react"
import { PinLogin } from "@/components/pin-login"
import { Dashboard } from "@/components/dashboard"

export default function Page() {
  const [currentUser, setCurrentUser] = useState<string | null>(null)

  const handleLogin = (userId: string) => {
    setCurrentUser(userId)
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  if (!currentUser) {
    return <PinLogin onLogin={handleLogin} />
  }

  return <Dashboard userId={currentUser} onLogout={handleLogout} />
}
