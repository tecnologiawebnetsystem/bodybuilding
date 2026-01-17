"use client"

import { useState, useEffect } from "react"
import { SuperAdminPanel } from "@/components/super-admin-panel"

export default function SuperAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se está autenticado
    const adminData = localStorage.getItem("adminUser")
    if (adminData) {
      const user = JSON.parse(adminData)
      if (user.role === "super_admin") {
        setIsAuthenticated(true)
      }
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("adminUser")
    window.location.href = "/login"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h1>
          <p className="text-gray-400 mb-6">
            Você precisa estar autenticado como Super Admin para acessar esta página.
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-red-700 transition-all"
          >
            Fazer Login
          </a>
        </div>
      </div>
    )
  }

  return <SuperAdminPanel onLogout={handleLogout} />
}
