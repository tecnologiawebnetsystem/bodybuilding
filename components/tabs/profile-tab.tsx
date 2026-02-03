"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserIcon, Bell, Lock, Mail, Trophy, TrendingUp, Dumbbell, Calendar, Award, Camera } from "lucide-react"
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
  const [changeEmailOpen, setChangeEmailOpen] = useState(false)
  const [changeCpfOpen, setChangeCpfOpen] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [newPin, setNewPin] = useState("")
  const [currentPin, setCurrentPin] = useState("")
  const [newCpf, setNewCpf] = useState("")
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

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
      console.error(" Error loading profile data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPin || currentPin.length !== 6) {
      alert("Digite seu PIN atual (6 dígitos)")
      return
    }

    if (!newPin || newPin.length !== 6) {
      alert("O novo PIN deve ter 6 dígitos")
      return
    }

    try {
      const response = await fetch("/api/user-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, pin: newPin, currentPin }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        alert("PIN alterado com sucesso!")
        setChangePasswordOpen(false)
        setNewPin("")
        setCurrentPin("")
      } else {
        alert(data.message || "PIN atual incorreto")
      }
    } catch (error) {
      console.error(" Error changing PIN:", error)
      alert("Erro ao alterar PIN")
    }
  }

  const handleChangeEmail = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      alert("Digite um e-mail válido")
      return
    }

    try {
      const response = await fetch("/api/user-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email: newEmail }),
      })

      if (response.ok) {
        alert("E-mail alterado com sucesso!")
        setChangeEmailOpen(false)
        setNewEmail("")
        loadData() // Recarrega os dados para mostrar o novo e-mail
      } else {
        alert("Erro ao alterar e-mail")
      }
    } catch (error) {
      console.error(" Error changing email:", error)
      alert("Erro ao alterar e-mail")
    }
  }

  const handleChangeCpf = async () => {
    if (!currentPin || currentPin.length !== 6) {
      alert("Digite seu PIN atual (6 dígitos) para confirmar")
      return
    }

    // Remove formatação do CPF
    const cleanCpf = newCpf.replace(/\D/g, "")

    if (!cleanCpf || cleanCpf.length !== 11) {
      alert("Digite um CPF válido (11 dígitos)")
      return
    }

    try {
      const response = await fetch("/api/user-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, cpf: newCpf, currentPin }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        alert("CPF alterado com sucesso! Use o novo CPF no próximo login.")
        setChangeCpfOpen(false)
        setNewCpf("")
        setCurrentPin("")
        loadData()
      } else {
        alert(data.message || "Erro ao alterar CPF. Verifique seu PIN.")
      }
    } catch (error) {
      console.error(" Error changing CPF:", error)
      alert("Erro ao alterar CPF")
    }
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tamanho (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("A foto deve ter no máximo 2MB")
      return
    }

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      alert("Selecione uma imagem válida")
      return
    }

    setUploadingPhoto(true)

    try {
      // Converter para base64
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = reader.result as string

        const response = await fetch("/api/user-profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, profilePhoto: base64String }),
        })

        if (response.ok) {
          await loadData() // Recarregar para mostrar nova foto
          alert("Foto atualizada com sucesso!")
        } else {
          alert("Erro ao atualizar foto")
        }
        setUploadingPhoto(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error(" Error uploading photo:", error)
      alert("Erro ao fazer upload da foto")
      setUploadingPhoto(false)
    }
  }

  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    }
    return value
  }

  if (loading) {
    return <p className="text-center py-8">Carregando...</p>
  }

  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: preferences.theme_primary }}
        >
          <UserIcon className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-xl font-semibold">Perfil não configurado</h3>
        <p className="text-muted-foreground text-center max-w-sm">
          Configure seu perfil na aba Medidas para ver suas informações aqui.
        </p>
        <Button onClick={onLogout} style={{ backgroundColor: "#c2410c", color: "#ffffff" }}>
          Trocar Perfil
        </Button>
      </div>
    )
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
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
                style={{ backgroundColor: preferences.theme_primary }}
              >
                {userProfile.profile_photo_url ? (
                  <img
                    src={userProfile.profile_photo_url || "/placeholder.svg"}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-10 h-10 text-white" />
                )}
              </div>
              <label htmlFor="photo-upload" className="absolute -bottom-1 -right-1 cursor-pointer">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: preferences.theme_primary }}
                >
                  {uploadingPhoto ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-white" />
                  )}
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploadingPhoto}
                />
              </label>
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
          <Dialog open={changeCpfOpen} onOpenChange={setChangeCpfOpen}>
            <DialogTrigger asChild>
              <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">CPF</p>
                      <p className="text-sm text-muted-foreground">{userProfile.cpf || "Não cadastrado"}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Alterar CPF</DialogTitle>
                <DialogDescription>Digite seu novo CPF e confirme com seu PIN atual</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-cpf">Novo CPF</Label>
                  <Input
                    id="new-cpf"
                    type="text"
                    maxLength={14}
                    placeholder="000.000.000-00"
                    value={newCpf}
                    onChange={(e) => setNewCpf(formatCpf(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="current-pin-cpf">PIN Atual (6 dígitos)</Label>
                  <Input
                    id="current-pin-cpf"
                    type="password"
                    maxLength={6}
                    placeholder="Digite seu PIN atual"
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <Button
                  onClick={handleChangeCpf}
                  className="w-full"
                  className="w-full text-white"
                  style={{ backgroundColor: preferences.theme_primary }}
                >
                  Confirmar Alteração
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={changeEmailOpen} onOpenChange={setChangeEmailOpen}>
            <DialogTrigger asChild>
              <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{userProfile.email || "Não cadastrado"}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Alterar E-mail</DialogTitle>
                <DialogDescription>Digite seu novo endereço de e-mail</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-email">Novo E-mail</Label>
                  <Input
                    id="new-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleChangeEmail}
                  className="w-full"
                  className="w-full text-white"
                  style={{ backgroundColor: preferences.theme_primary }}
                >
                  Confirmar Alteração
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
            <DialogTrigger asChild>
              <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Alterar PIN</p>
                      <p className="text-sm text-muted-foreground">Trocar senha de acesso (6 dígitos)</p>
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
                <DialogDescription>Digite seu PIN atual e o novo PIN de 6 dígitos</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-pin">PIN Atual (6 dígitos)</Label>
                  <Input
                    id="current-pin"
                    type="password"
                    maxLength={6}
                    placeholder="Digite seu PIN atual"
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <div>
                  <Label htmlFor="new-pin">Novo PIN (6 dígitos)</Label>
                  <Input
                    id="new-pin"
                    type="password"
                    maxLength={6}
                    placeholder="Digite 6 dígitos"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <Button
                  onClick={handleChangePassword}
                  className="w-full"
                  className="w-full text-white"
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
