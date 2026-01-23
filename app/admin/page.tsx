"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminPanel } from "@/components/admin-panel"

export default function AdminPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState<string | null>(null)
  const [gymId, setGymId] = useState<string | null>(null)

  useEffect(() => {
    // Verificar se o usuario esta logado via sessionStorage
    const userId = sessionStorage.getItem("userId")
    const storedName = sessionStorage.getItem("userName")
    const storedGymId = sessionStorage.getItem("gymId")
    const storedRole = sessionStorage.getItem("userRole")
    
    if (!userId || (storedRole !== "gym_admin" && storedRole !== "super_admin")) {
      // Nao esta logado ou nao tem permissao, redirecionar para login
      router.push("/login")
      return
    }
    
    setUserName(storedName || userId)
    setGymId(storedGymId)
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    sessionStorage.clear()
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    )
  }

  return <AdminPanel adminUsername={userName || "Admin"} onLogout={handleLogout} gymId={gymId} />
}
