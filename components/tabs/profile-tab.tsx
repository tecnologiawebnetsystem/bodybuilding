"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserIcon, Bell, Lock, Mail, Trophy, TrendingUp, Dumbbell, Calendar, Award } from "lucide-react"
import { NotificationSettings } from "@/components/notification-settings"
import { GymBadge } from "@/components/gym-badge"
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
  const [stats, setStats] = useState<any>(null)
  const [gymInfo, setGymInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [newPin, setNewPin] = useState("")

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    try {
      const [profileRes, statsRes, gymRes] = await Promise.all([
        fetch(`/api/user-profile?userId=${userId}`),
        fetch(`/api/stats?userId=${userId}`),
        fetch(`/api/gym?userId=${userId}`),
      ])

      const profileData = await profileRes.json()
      const statsData = await statsRes.json()
      const gymData = await gymRes.json()

      if (profileData.success) setUserProfile(profileData.data)
      if (statsData.success) setStats(statsData.data)
      if (gymData.success) setGymInfo(gymData.data)
    } catch (error) {
      console.error("[v0] Error loading profile data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!newPin || newPin.length !== 4) {
      alert("PIN deve ter 4 dígitos")
      return
    }

    try {
      const response = await fetch("/api/user-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, pin: newPin }),
      })

      if (response.ok) {
        alert("PIN alterado com sucesso!")
        setChangePasswordOpen(false)
        setNewPin("")
      }
    } catch (error) {
      console.error("[v0] Error changing PIN:", error)
    }
  }

  if (loading) {
    return <p className="text-center py-8">Carregando...</p>
  }

  if (!userProfile) {
    return <p className="text-center py-8">Erro ao carregar perfil</p>
  }

  const weightProgress =
    userProfile.current_weight && userProfile.initial_weight
      ? (
          ((userProfile.initial_weight - userProfile.current_weight) /
            (userProfile.initial_weight - userProfile.target_weight)) *
          100
        ).toFixed(1)
      : 0

  return (
    <div className="space-y-6 pb-20">
      {/* Header com Avatar e Info Básica */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: preferences.theme_primary }}
            >
              <UserIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{userProfile.name}</h3>
              <p className="text-muted-foreground">
                {userProfile.age ? `${userProfile.age} anos` : ""} • {userProfile.height}cm •{" "}
                {userProfile.gender === "male" ? "Masculino" : "Feminino"}
              </p>
            </div>
          </div>
          <Button onClick={onLogout} variant="outline" size="sm">
            Trocar Perfil
          </Button>
        </div>

        {gymInfo && (
          <div className="mt-4">
            <GymBadge gym={gymInfo} />
          </div>
        )}
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5" style={{ color: preferences.theme_primary }} />
          Suas Conquistas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4 text-center">
            <Dumbbell className="w-6 h-6 mx-auto mb-2" style={{ color: preferences.theme_primary }} />
            <p className="text-2xl font-bold">{stats?.totalWorkouts || 0}</p>
            <p className="text-xs text-muted-foreground">Treinos</p>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2" style={{ color: preferences.theme_accent }} />
            <p className="text-2xl font-bold">{stats?.currentStreak || 0}</p>
            <p className="text-xs text-muted-foreground">Dias de Sequência</p>
          </Card>
          <Card className="p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2" style={{ color: preferences.theme_secondary }} />
            <p className="text-2xl font-bold">{stats?.totalRuns || 0}</p>
            <p className="text-xs text-muted-foreground">Corridas</p>
          </Card>
          <Card className="p-4 text-center">
            <Award className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">{weightProgress}%</p>
            <p className="text-xs text-muted-foreground">Progresso</p>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Configurações de Conta</h3>
        <div className="space-y-3">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{userProfile.email || "Não cadastrado"}</p>
                </div>
              </div>
            </div>
          </Card>

          <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
            <DialogTrigger asChild>
              <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Alterar PIN</p>
                      <p className="text-sm text-muted-foreground">Trocar senha de acesso</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Alterar
                  </Button>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Alterar PIN de Acesso</DialogTitle>
                <DialogDescription>Digite o novo PIN de 4 dígitos</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-pin">Novo PIN</Label>
                  <Input
                    id="new-pin"
                    type="password"
                    maxLength={4}
                    placeholder="Digite 4 dígitos"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <Button
                  onClick={handleChangePassword}
                  className="w-full"
                  style={{ backgroundColor: preferences.theme_primary }}
                >
                  Confirmar Alteração
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <DialogTrigger asChild>
              <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Notificações</p>
                      <p className="text-sm text-muted-foreground">Lembretes de água e treino</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Configurar
                  </Button>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Configurações de Notificações</DialogTitle>
                <DialogDescription>Configure lembretes para beber água e horários de treino</DialogDescription>
              </DialogHeader>
              <NotificationSettings userId={userId} preferences={preferences} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
