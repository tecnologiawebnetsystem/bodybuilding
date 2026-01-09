"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Bell, Droplet, Dumbbell } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface NotificationSettingsProps {
  userId: string
  preferences: any
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Dom" },
  { value: 1, label: "Seg" },
  { value: 2, label: "Ter" },
  { value: 3, label: "Qua" },
  { value: 4, label: "Qui" },
  { value: 5, label: "Sex" },
  { value: 6, label: "Sáb" },
]

export function NotificationSettings({ userId, preferences }: NotificationSettingsProps) {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [userId])

  const loadSettings = async () => {
    try {
      const response = await fetch(`/api/notifications?userId=${userId}`)
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Error loading notification settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)

      if (permission === "granted") {
        // Registrar para notificações push
        registerPushNotifications()
      }
    }
  }

  const registerPushNotifications = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        // Aqui você poderia adicionar lógica de push subscription se necessário
        console.log("Service Worker ready for push notifications")
      } catch (error) {
        console.error("Error registering push notifications:", error)
      }
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...settings }),
      })

      if (response.ok) {
        // Agendar notificações no service worker
        scheduleNotifications()
        alert("Configurações salvas com sucesso!")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Erro ao salvar configurações")
    } finally {
      setSaving(false)
    }
  }

  const scheduleNotifications = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.controller?.postMessage({
        type: "SCHEDULE_NOTIFICATIONS",
        settings: settings,
        userId: userId,
      })
    }
  }

  const toggleDay = (type: "gym_days" | "running_days" | "home_workout_days", day: number) => {
    const currentDays = settings[type] || []
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d: number) => d !== day)
      : [...currentDays, day].sort()

    setSettings({ ...settings, [type]: newDays })
  }

  if (loading) {
    return <div className="p-4">Carregando configurações...</div>
  }

  const themeColor = preferences?.theme_primary || "#3b82f6"

  return (
    <div className="space-y-4 p-4">
      {notificationPermission !== "granted" && (
        <Card className="border-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Ativar Notificações
            </CardTitle>
            <CardDescription>Para receber lembretes, você precisa permitir notificações</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={requestNotificationPermission} style={{ backgroundColor: themeColor }}>
              Permitir Notificações
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Notificações de Água */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="h-5 w-5" style={{ color: themeColor }} />
            Lembretes de Hidratação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="water-enabled">Ativar lembretes</Label>
            <Switch
              id="water-enabled"
              checked={settings?.water_notifications_enabled ?? true}
              onCheckedChange={(checked) => setSettings({ ...settings, water_notifications_enabled: checked })}
            />
          </div>

          {settings?.water_notifications_enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="water-interval">Intervalo (horas)</Label>
                <Input
                  id="water-interval"
                  type="number"
                  min="1"
                  max="8"
                  value={settings?.water_interval_hours ?? 2}
                  onChange={(e) => setSettings({ ...settings, water_interval_hours: Number.parseInt(e.target.value) })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="water-start">Início</Label>
                  <Input
                    id="water-start"
                    type="time"
                    value={settings?.water_start_time ?? "08:00:00"}
                    onChange={(e) => setSettings({ ...settings, water_start_time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="water-end">Fim</Label>
                  <Input
                    id="water-end"
                    type="time"
                    value={settings?.water_end_time ?? "22:00:00"}
                    onChange={(e) => setSettings({ ...settings, water_end_time: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Notificações de Treino */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" style={{ color: themeColor }} />
            Lembretes de Treino
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="workout-enabled">Ativar lembretes</Label>
            <Switch
              id="workout-enabled"
              checked={settings?.workout_notifications_enabled ?? true}
              onCheckedChange={(checked) => setSettings({ ...settings, workout_notifications_enabled: checked })}
            />
          </div>

          {settings?.workout_notifications_enabled && (
            <div className="space-y-6">
              {/* Academia */}
              {preferences?.enable_gym_workouts && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Academia</Label>
                  <Input
                    type="time"
                    value={settings?.gym_time ?? ""}
                    onChange={(e) => setSettings({ ...settings, gym_time: e.target.value })}
                  />
                  <div className="flex gap-2 flex-wrap">
                    {DAYS_OF_WEEK.map((day) => (
                      <Badge
                        key={day.value}
                        variant={(settings?.gym_days || []).includes(day.value) ? "default" : "outline"}
                        className="cursor-pointer"
                        style={(settings?.gym_days || []).includes(day.value) ? { backgroundColor: themeColor } : {}}
                        onClick={() => toggleDay("gym_days", day.value)}
                      >
                        {day.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Corrida */}
              {preferences?.enable_running && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Corrida</Label>
                  <Input
                    type="time"
                    value={settings?.running_time ?? ""}
                    onChange={(e) => setSettings({ ...settings, running_time: e.target.value })}
                  />
                  <div className="flex gap-2 flex-wrap">
                    {DAYS_OF_WEEK.map((day) => (
                      <Badge
                        key={day.value}
                        variant={(settings?.running_days || []).includes(day.value) ? "default" : "outline"}
                        className="cursor-pointer"
                        style={
                          (settings?.running_days || []).includes(day.value) ? { backgroundColor: themeColor } : {}
                        }
                        onClick={() => toggleDay("running_days", day.value)}
                      >
                        {day.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Treino em Casa */}
              {preferences?.enable_home_workouts && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Treino em Casa</Label>
                  <Input
                    type="time"
                    value={settings?.home_workout_time ?? ""}
                    onChange={(e) => setSettings({ ...settings, home_workout_time: e.target.value })}
                  />
                  <div className="flex gap-2 flex-wrap">
                    {DAYS_OF_WEEK.map((day) => (
                      <Badge
                        key={day.value}
                        variant={(settings?.home_workout_days || []).includes(day.value) ? "default" : "outline"}
                        className="cursor-pointer"
                        style={
                          (settings?.home_workout_days || []).includes(day.value) ? { backgroundColor: themeColor } : {}
                        }
                        onClick={() => toggleDay("home_workout_days", day.value)}
                      >
                        {day.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        onClick={saveSettings}
        disabled={saving || notificationPermission !== "granted"}
        className="w-full"
        style={{ backgroundColor: themeColor }}
      >
        {saving ? "Salvando..." : "Salvar Configurações"}
      </Button>

      {notificationPermission !== "granted" && (
        <p className="text-sm text-muted-foreground text-center">
          Permita as notificações para salvar as configurações
        </p>
      )}
    </div>
  )
}
