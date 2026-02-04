"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  Activity, TrendingUp, CheckCircle2, Timer, Trash2, Plus, Trophy, Target, 
  Calendar, MapPin, Flame, Award, Clock, Zap, ChevronRight
} from "lucide-react"

interface UserPreferences {
  theme_primary: string
  theme_secondary: string
  theme_accent: string
}

interface RunningTabProps {
  userId: string
  preferences: UserPreferences
}

interface RunRecord {
  id?: number
  date: string
  distance: number
  duration: number
  pace?: number
  calories?: number
  terrain?: string
}

interface RunningPlan {
  id: number
  name: string
  description: string
  goal_type: string
  duration_weeks: number
  difficulty: string
  sessions_per_week: number
  plan_data: any
}

interface Challenge {
  id: number
  name: string
  description: string
  challenge_type: string
  target_value: number
  start_date: string
  end_date: string
  reward_points: number
  current_progress?: number
  joined?: boolean
}

interface PersonalRecord {
  distance_type: string
  best_time_seconds: number
  best_pace: number
  achieved_at: string
}

export function RunningTab({ userId, preferences }: RunningTabProps) {
  const [distance, setDistance] = useState("")
  const [duration, setDuration] = useState("")
  const [terrain, setTerrain] = useState("asfalto")
  const [history, setHistory] = useState<RunRecord[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [activeTab, setActiveTab] = useState("registrar")
  const [loading, setLoading] = useState(true)
  
  // Novos estados
  const [runningPlans, setRunningPlans] = useState<RunningPlan[]>([])
  const [userPlan, setUserPlan] = useState<any>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [userChallenges, setUserChallenges] = useState<any[]>([])
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([])
  const [monthlyStats, setMonthlyStats] = useState({ distance: 0, sessions: 0, avgPace: 0 })
  const [newRunDialogOpen, setNewRunDialogOpen] = useState(false)

  useEffect(() => {
    loadAll()
  }, [userId])

  const loadAll = async () => {
    setLoading(true)
    await Promise.all([
      loadHistory(),
      loadRunningPlans(),
      loadUserPlan(),
      loadChallenges(),
      loadUserChallenges(),
      loadPersonalRecords(),
      loadMonthlyStats(),
    ])
    setLoading(false)
  }

  const loadHistory = async () => {
    try {
      const response = await fetch(`/api/running?userId=${userId}`)
      const result = await response.json()
      if (result.success) {
        setHistory(result.data)
      }
    } catch {
      // Erro silencioso
    }
  }

  const loadRunningPlans = async () => {
    try {
      const response = await fetch("/api/running-plans")
      const result = await response.json()
      if (result.success) {
        setRunningPlans(result.data || [])
      }
    } catch {
      // Erro silencioso
    }
  }

  const loadUserPlan = async () => {
    try {
      const response = await fetch(`/api/user-running-plan?userId=${userId}`)
      const result = await response.json()
      if (result.success) {
        setUserPlan(result.data)
      }
    } catch {
      // Erro silencioso
    }
  }

  const loadChallenges = async () => {
    try {
      const response = await fetch("/api/running-challenges")
      const result = await response.json()
      if (result.success) {
        setChallenges(result.data || [])
      }
    } catch {
      // Erro silencioso
    }
  }

  const loadUserChallenges = async () => {
    try {
      const response = await fetch(`/api/user-running-challenges?userId=${userId}`)
      const result = await response.json()
      if (result.success) {
        setUserChallenges(result.data || [])
      }
    } catch {
      // Erro silencioso
    }
  }

  const loadPersonalRecords = async () => {
    try {
      const response = await fetch(`/api/running-prs?userId=${userId}`)
      const result = await response.json()
      if (result.success) {
        setPersonalRecords(result.data || [])
      }
    } catch {
      // Erro silencioso
    }
  }

  const loadMonthlyStats = async () => {
    try {
      const response = await fetch(`/api/running-monthly?userId=${userId}`)
      const result = await response.json()
      if (result.success && result.data) {
        setMonthlyStats(result.data)
      }
    } catch {
      // Erro silencioso
    }
  }

  const joinChallenge = async (challengeId: number) => {
    try {
      await fetch("/api/user-running-challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, challengeId }),
      })
      loadUserChallenges()
      loadChallenges()
    } catch {
      // Erro silencioso
    }
  }

  const startPlan = async (planId: number) => {
    try {
      await fetch("/api/user-running-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, planId }),
      })
      loadUserPlan()
    } catch {
      // Erro silencioso
    }
  }

  const handleLogRun = async () => {
    if (!distance || !duration) {
      setModalMessage("Preencha distancia e duracao!")
      setModalOpen(true)
      return
    }

    const distanceNum = Number.parseFloat(distance)
    const durationNum = Number.parseInt(duration)
    const paceNum = durationNum / distanceNum // min/km
    const caloriesNum = Math.round(distanceNum * 60) // estimativa simples

    try {
      const response = await fetch("/api/running", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          distance: distanceNum,
          duration: durationNum,
          pace: paceNum,
          calories: caloriesNum,
          terrain,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setDistance("")
        setDuration("")
        setNewRunDialogOpen(false)
        await loadAll()

        setModalMessage("Corrida registrada com sucesso!")
        setModalOpen(true)
      }
    } catch {
      setModalMessage("Erro ao registrar corrida. Tente novamente.")
      setModalOpen(true)
    }
  }

  // Formatar pace (min/km) para exibicao
  const formatPace = (pace: number) => {
    const mins = Math.floor(pace)
    const secs = Math.round((pace - mins) * 60)
    return `${mins}:${secs.toString().padStart(2, "0")}/km`
  }

  // Formatar tempo em segundos para mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const prLabels: Record<string, string> = {
    "1km": "1 km",
    "5km": "5 km",
    "10km": "10 km",
    "half": "Meia Maratona",
    "full": "Maratona",
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
    } catch {
      // Erro silencioso
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
    } catch {
      // Erro silencioso
    }
  }

  const totalDistance = history.reduce((sum, run) => sum + run.distance, 0)
  const avgDistance = history.length > 0 ? totalDistance / history.length : 0

  if (loading) {
    return <p className="text-center py-8">Carregando...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Corrida</h2>
          <p className="text-gray-400 text-sm">Acompanhe seu progresso</p>
        </div>
        <Dialog open={newRunDialogOpen} onOpenChange={setNewRunDialogOpen}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: "#c2410c" }}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Corrida
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Corrida</DialogTitle>
              <DialogDescription>Adicione os detalhes da sua corrida</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Distancia (km) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="Ex: 5.0"
                />
              </div>
              <div>
                <Label>Duracao (minutos) *</Label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ex: 30"
                />
              </div>
              <div>
                <Label>Terreno</Label>
                <Select value={terrain} onValueChange={setTerrain}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asfalto">Asfalto</SelectItem>
                    <SelectItem value="trilha">Trilha</SelectItem>
                    <SelectItem value="esteira">Esteira</SelectItem>
                    <SelectItem value="grama">Grama</SelectItem>
                    <SelectItem value="areia">Areia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {distance && duration && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-sm text-green-400">
                    Pace estimado: <strong>{formatPace(Number.parseInt(duration) / Number.parseFloat(distance))}</strong>
                  </p>
                </div>
              )}
              <Button onClick={handleLogRun} className="w-full" style={{ backgroundColor: "#c2410c" }}>
                Registrar Corrida
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats do mes */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-400">Este Mes</span>
          </div>
          <p className="text-2xl font-bold text-white">{monthlyStats.distance.toFixed(1)} km</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-400">Corridas</span>
          </div>
          <p className="text-2xl font-bold text-white">{monthlyStats.sessions}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-orange-500" />
            <span className="text-xs text-gray-400">Pace Medio</span>
          </div>
          <p className="text-2xl font-bold text-white">{monthlyStats.avgPace > 0 ? formatPace(monthlyStats.avgPace) : "-"}</p>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-white/5">
          <TabsTrigger value="registrar" className="data-[state=active]:bg-green-600 text-xs">
            <Activity className="w-4 h-4 mr-1" />
            Historico
          </TabsTrigger>
          <TabsTrigger value="planos" className="data-[state=active]:bg-green-600 text-xs">
            <Calendar className="w-4 h-4 mr-1" />
            Planos
          </TabsTrigger>
          <TabsTrigger value="desafios" className="data-[state=active]:bg-green-600 text-xs">
            <Target className="w-4 h-4 mr-1" />
            Desafios
          </TabsTrigger>
          <TabsTrigger value="prs" className="data-[state=active]:bg-green-600 text-xs">
            <Trophy className="w-4 h-4 mr-1" />
            PRs
          </TabsTrigger>
        </TabsList>

        {/* TAB HISTORICO */}
        <TabsContent value="registrar" className="space-y-4 mt-6">
          {history.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <h4 className="font-semibold mb-2">Nenhuma corrida registrada</h4>
              <p className="text-muted-foreground text-sm">Clique em "Nova Corrida" para comecar</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 10).map((run, idx) => (
                <Card key={run.id || idx} className="p-4 bg-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{run.distance} km</p>
                        <p className="text-xs text-gray-400">{new Date(run.date).toLocaleDateString("pt-BR")}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{run.duration} min</p>
                      {run.pace && <p className="text-xs text-green-400">{formatPace(run.pace)}</p>}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => run.id && handleDeleteRun(run.id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB PLANOS */}
        <TabsContent value="planos" className="space-y-4 mt-6">
          {userPlan ? (
            <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{userPlan.plan_name}</h3>
                  <p className="text-sm text-gray-400">Semana {userPlan.current_week} de {userPlan.duration_weeks}</p>
                </div>
              </div>
              <Progress value={(userPlan.current_week / userPlan.duration_weeks) * 100} className="h-2 mb-3" />
              <p className="text-sm text-gray-300">Continue seguindo seu plano para alcancar seus objetivos!</p>
            </Card>
          ) : (
            <>
              <p className="text-gray-400 text-sm">Escolha um plano de treino para comecar:</p>
              {runningPlans.map((plan) => (
                <Card key={plan.id} className="p-4 bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        plan.difficulty === "beginner" ? "bg-green-500/20" : 
                        plan.difficulty === "intermediate" ? "bg-yellow-500/20" : "bg-red-500/20"
                      }`}>
                        <Target className={`w-5 h-5 ${
                          plan.difficulty === "beginner" ? "text-green-500" : 
                          plan.difficulty === "intermediate" ? "text-yellow-500" : "text-red-500"
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{plan.name}</h4>
                        <p className="text-xs text-gray-400">{plan.duration_weeks} semanas - {plan.sessions_per_week}x/semana</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => startPlan(plan.id)} style={{ backgroundColor: "#c2410c" }}>
                      Iniciar
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{plan.description}</p>
                </Card>
              ))}
            </>
          )}
        </TabsContent>

        {/* TAB DESAFIOS */}
        <TabsContent value="desafios" className="space-y-4 mt-6">
          {challenges.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-2">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">Nenhum desafio disponivel no momento</p>
            </Card>
          ) : (
            challenges.map((challenge) => {
              const userChallenge = userChallenges.find(uc => uc.challenge_id === challenge.id)
              const isJoined = !!userChallenge
              const progress = userChallenge?.current_progress || 0
              const progressPercent = Math.min(100, (progress / challenge.target_value) * 100)
              
              return (
                <Card key={challenge.id} className="p-4 bg-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{challenge.name}</h4>
                        <p className="text-xs text-gray-400">
                          {new Date(challenge.start_date).toLocaleDateString("pt-BR")} - {new Date(challenge.end_date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400">
                      {challenge.reward_points} pts
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{challenge.description}</p>
                  {isJoined ? (
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{progress.toFixed(1)} {challenge.challenge_type === "monthly_distance" ? "km" : ""}</span>
                        <span>{challenge.target_value} {challenge.challenge_type === "monthly_distance" ? "km" : ""}</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                      <p className="text-xs text-center mt-2 text-green-400">
                        {progressPercent >= 100 ? "Desafio completo!" : `${progressPercent.toFixed(0)}% concluido`}
                      </p>
                    </div>
                  ) : (
                    <Button onClick={() => joinChallenge(challenge.id)} variant="outline" className="w-full">
                      Participar do Desafio
                    </Button>
                  )}
                </Card>
              )
            })
          )}
        </TabsContent>

        {/* TAB PRs (Records Pessoais) */}
        <TabsContent value="prs" className="space-y-4 mt-6">
          <p className="text-gray-400 text-sm">Seus melhores tempos por distancia:</p>
          {personalRecords.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-2">
              <Award className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">Corra mais para registrar seus PRs!</p>
            </Card>
          ) : (
            <div className="grid gap-3">
              {personalRecords.map((pr) => (
                <Card key={pr.distance_type} className="p-4 bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{prLabels[pr.distance_type] || pr.distance_type}</h4>
                        <p className="text-xs text-gray-400">
                          {new Date(pr.achieved_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-yellow-400">{formatTime(pr.best_time_seconds)}</p>
                      <p className="text-xs text-gray-400">{formatPace(pr.best_pace)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-8 h-8" style={{ color: preferences.theme_primary }} />
              <DialogTitle className="text-2xl text-white">Corrida</DialogTitle>
            </div>
            <DialogDescription className="text-lg pt-2 text-white">{modalMessage}</DialogDescription>
          </DialogHeader>
          <Button size="lg" onClick={() => setModalOpen(false)} style={{ backgroundColor: preferences.theme_primary }}>
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
