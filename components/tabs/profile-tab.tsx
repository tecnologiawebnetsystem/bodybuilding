"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserIcon, Bell } from "lucide-react"
import { NotificationSettings } from "@/components/notification-settings"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface UserPreferences {
  theme_primary: string
  theme_secondary: string
  theme_accent: string
  enable_gym_workouts?: boolean
  enable_running?: boolean
  enable_home_workouts?: boolean
}

interface ProfileTabProps {
  userId: string
  onLogout: () => void
  preferences: UserPreferences
}

export function ProfileTab({ userId, onLogout, preferences }: ProfileTabProps) {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  useEffect(() => {
    loadUserProfile()
  }, [userId])

  const loadUserProfile = async () => {
    try {
      const response = await fetch(`/api/user-profile?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setUserProfile(data.data)
      }
    } catch (error) {
      console.error("[v0] Error loading user profile:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p className="text-center py-8">Carregando...</p>
  }

  if (!userProfile) {
    return <p className="text-center py-8">Erro ao carregar perfil</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Seu Perfil</h2>
          <p className="text-muted-foreground">Acompanhe sua evolução</p>
        </div>
        <Button onClick={onLogout} variant="outline">
          Trocar Perfil
        </Button>
      </div>

      {/* Profile Info */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: preferences.theme_primary }}
          >
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{userProfile.name}</h3>
            <p className="text-muted-foreground">
              {userProfile.age ? `${userProfile.age} anos` : ""} • {userProfile.height}cm
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Gênero</p>
            <p className="font-semibold">{userProfile.gender === "male" ? "Masculino" : "Feminino"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Início</p>
            <p className="font-semibold">
              {userProfile.start_date ? new Date(userProfile.start_date).toLocaleDateString("pt-BR") : "-"}
            </p>
          </div>
        </div>
      </Card>

      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogTrigger asChild>
          <Button
            className="w-full bg-transparent"
            variant="outline"
            style={{ borderColor: preferences.theme_primary }}
          >
            <Bell className="w-4 h-4 mr-2" style={{ color: preferences.theme_primary }} />
            Configurar Notificações
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configurações de Notificações</DialogTitle>
            <DialogDescription>Configure lembretes para beber água e horários de treino</DialogDescription>
          </DialogHeader>
          <NotificationSettings userId={userId} preferences={preferences} />
        </DialogContent>
      </Dialog>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Peso Inicial</p>
          <p className="text-2xl font-bold">{userProfile.initial_weight || "-"} kg</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Altura</p>
          <p className="text-2xl font-bold">{userProfile.height || "-"} cm</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Peso Desejado</p>
          <p className="text-2xl font-bold" style={{ color: preferences.theme_primary }}>
            {userProfile.target_weight || "-"} kg
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">PIN</p>
          <p className="text-2xl font-bold">****</p>
        </Card>
      </div>
    </div>
  )
}
