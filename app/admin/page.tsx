"use client"

import { useState } from "react"
import { AdminLogin } from "@/components/admin-login"
import { AdminPanel } from "@/components/admin-panel"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminUsername, setAdminUsername] = useState("")

  const handleLogin = (username: string) => {
    setAdminUsername(username)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAdminUsername("")
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return <AdminPanel adminUsername={adminUsername} onLogout={handleLogout} />
}
