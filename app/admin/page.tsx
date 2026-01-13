"use client"

import { useState } from "react"
import { AdminLogin } from "@/components/admin-login"
import { WelcomeDashboard } from "@/components/welcome-dashboard"
import { AdminPanel } from "@/components/admin-panel"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  const handleLogin = (data: any) => {
    setUserData(data)
    setShowWelcome(true)
  }

  const handleContinue = () => {
    setShowWelcome(false)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setShowWelcome(false)
    setUserData(null)
  }

  if (!userData) {
    return <AdminLogin onLogin={handleLogin} />
  }

  if (showWelcome) {
    return <WelcomeDashboard userData={userData} onContinue={handleContinue} />
  }

  if (isAuthenticated) {
    return <AdminPanel adminUsername={userData.user.name} onLogout={handleLogout} />
  }

  return null
}
