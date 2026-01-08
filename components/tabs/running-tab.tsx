"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Activity, TrendingUp, CheckCircle2, Timer, Trash2 } from "lucide-react"
import { userProfiles } from "@/lib/user-profiles"

interface RunningTabProps {
  userId: string
}

interface RunRecord {
  id?: number
  date: string
  distance: number
  duration: number
}

export function RunningTab({ userId }: RunningTabProps) {
  const [distance, setDistance] = useState("")
  const [duration, setDuration] = useState("")
  const [history, setHistory] = useState<RunRecord[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const profile = userProfiles[userId]

  useEffect(() => {
    loadHistory()
  }, [userId])

  const loadHistory = async () => {
    try {
      const response = await fetch(`/api/running?userId=${userId}`)
      const result = await response.json()
      if (result.success) {
        setHistory(result.data)
      }
    } catch (error) {
      console.error("[v0] Error loading running history:", error)
    }
  }

  const handleLogRun = async () => {
    if (!distance || !duration) {
      setModalMessage("Preencha distância e duração!")
      setModalOpen(true)
      return
    }

    try {
      const response = await fetch("/api/running", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          distance: Number.parseFloat(distance),
          duration: Number.parseInt(duration),
        }),
      })

      const result = await response.json()
      if (result.success) {
        setDistance("")
        setDuration("")
        await loadHistory()

        setModalMessage("Corrida registrada com sucesso! Continue assim! 🏃‍♂️")
        setModalOpen(true)
      }
    } catch (error) {
      console.error("[v0] Error logging run:", error)
      setModalMessage("Erro ao registrar corrida. Tente novamente.")
      setModalOpen(true)
    }
  }

  const handleDeleteRun = async (runId: number) => {
    if (!confirm("Tem certeza que deseja excluir esta corrida?")) return

    try {
      const response = await fetch(`/api/running?id=${runId}`, {
        method: "DELETE",
      })

      const result = await response.json()
      if (result.success) {
        await loadHistory()
        setModalMessage("Corrida excluída com sucesso!")
        setModalOpen(true)
      }
    } catch (error) {
      console.error("[v0] Error deleting run:", error)
    }
  }

  const handleClearHistory = async () => {
    if (!confirm("Tem certeza que deseja excluir TODO o histórico de corridas?")) return

    try {
      const response = await fetch(`/api/running/clear?userId=${userId}`, {
        method: "DELETE",
      })

      const result = await response.json()
      if (result.success) {
        await loadHistory()
        setModalMessage("Histórico limpo com sucesso!")
        setModalOpen(true)
      }
    } catch (error) {
      console.error("[v0] Error clearing history:", error)
    }
  }

  const totalDistance = history.reduce((sum, run) => sum + run.distance, 0)
  const avgDistance = history.length > 0 ? totalDistance / history.length : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Plano de Corrida</h2>
        <p className="text-muted-foreground">Progressão gradual - começando devagar após 15 anos</p>
      </div>

      {/* Running Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5" style={{ color: profile.theme.primary }} />
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <p className="text-2xl font-bold">{totalDistance.toFixed(1)} km</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" style={{ color: profile.theme.accent }} />
            <p className="text-sm text-muted-foreground">Média</p>
          </div>
          <p className="text-2xl font-bold">{avgDistance.toFixed(1)} km</p>
        </Card>
      </div>

      {/* Progressive Plan */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Plano Progressivo (Semanas 1-8)</h3>
        <div className="space-y-3">
          {[
            {
              week: "Semana 1-2",
              distance: "2-3 km",
              pace: "Leve (6-7 min/km)",
              notes: "Foco em completar, não em velocidade",
            },
            { week: "Semana 3-4", distance: "3-4 km", pace: "Leve-Moderado", notes: "Aumentar distância gradualmente" },
            { week: "Semana 5-6", distance: "4-5 km", pace: "Moderado", notes: "Manter consistência" },
            { week: "Semana 7-8", distance: "5-6 km", pace: "Moderado", notes: "Corpo adaptado, pronto para mais" },
          ].map((plan, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{plan.week}</h4>
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: `${profile.theme.accent}30` }}
                >
                  {plan.distance}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Ritmo: {plan.pace}</p>
              <p className="text-sm italic">{plan.notes}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Log Run */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Registrar Corrida</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Distância (km)</label>
            <Input
              type="number"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="Ex: 3.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Duração (minutos)</label>
            <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Ex: 25" />
          </div>
          <Button
            onClick={handleLogRun}
            className="w-full"
            size="lg"
            style={{ backgroundColor: profile.theme.primary }}
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Registrar Corrida
          </Button>
        </div>
      </Card>

      {history.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Histórico Recente</h3>
            <Button variant="destructive" size="sm" onClick={handleClearHistory}>
              <Trash2 className="w-4 h-4 mr-1" />
              Limpar Tudo
            </Button>
          </div>
          <div className="space-y-2">
            {history
              .slice(-10)
              .reverse()
              .map((run, idx) => (
                <div key={run.id || idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Timer className="w-5 h-5" style={{ color: profile.theme.primary }} />
                    <div>
                      <p className="font-medium">{new Date(run.date).toLocaleDateString("pt-BR")}</p>
                      <p className="text-sm text-muted-foreground">{run.duration} minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold" style={{ color: profile.theme.primary }}>
                      {run.distance} km
                    </p>
                    <Button variant="ghost" size="sm" onClick={() => run.id && handleDeleteRun(run.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-8 h-8" style={{ color: profile.theme.success }} />
              <DialogTitle className="text-2xl">Corrida</DialogTitle>
            </div>
            <DialogDescription className="text-lg pt-2">{modalMessage}</DialogDescription>
          </DialogHeader>
          <Button size="lg" onClick={() => setModalOpen(false)} style={{ backgroundColor: profile.theme.primary }}>
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
