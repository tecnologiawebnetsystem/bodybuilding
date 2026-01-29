"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Flame, TrendingDown, Calendar, CheckCircle2, Activity, LogOut, Wine, X, Copy, Check, QrCode } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProgressionAlert } from "@/components/progression-alert"
import { QRAccessCard } from "@/components/qr-access-card"

interface HomeTabProps {
  userId: string
  onLogout: () => void
}

export function HomeTab({ userId, onLogout }: HomeTabProps) {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [currentWeight, setCurrentWeight] = useState(0)
  const [todayWorkout, setTodayWorkout] = useState<string | null>(null)
  const [todayWorkoutDescription, setTodayWorkoutDescription] = useState<string>("")
  const [hasWorkoutToday, setHasWorkoutToday] = useState(false)
  const [hasRunToday, setHasRunToday] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showDrinkModal, setShowDrinkModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Dados do Drink exclusivo para Kleber e Pamela
  const drinkData: Record<string, { mat: string; senha: string }> = {
    kleber: { mat: "2216", senha: "1209" },
    pamela: { mat: "2217", senha: "2805" },
  }

  const userDrink = drinkData[userId.toLowerCase()]

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    try {
      const profileResponse = await fetch(`/api/user-profile?userId=${userId}`)
      const profileData = await profileResponse.json()
      if (profileData.success) {
        setUserProfile(profileData.data)
        if (profileData.data.current_weight) {
          setCurrentWeight(Number.parseFloat(profileData.data.current_weight))
        }
      }

      if (!profileData.data?.current_weight) {
        const measurementsResponse = await fetch(`/api/measurements?userId=${userId}`)
        const measurementsData = await measurementsResponse.json()
        if (measurementsData.success && measurementsData.data.length > 0) {
          const latestWeight = Number.parseFloat(measurementsData.data[0].weight)
          setCurrentWeight(latestWeight)
        } else {
          const weightResponse = await fetch(`/api/weight?userId=${userId}`)
          const weightData = await weightResponse.json()
          if (weightData.logs && weightData.logs.length > 0) {
            setCurrentWeight(Number.parseFloat(weightData.logs[0].weight))
          }
        }
      }

      const today = new Date().toISOString().split("T")[0]
      const checkinResponse = await fetch(`/api/checkin?userId=${userId}&limit=5`)
      const checkinData = await checkinResponse.json()

      if (checkinData.success) {
        const todayCheckins = checkinData.data.filter((c: any) => c.checkin_date.startsWith(today))
        setHasWorkoutToday(todayCheckins.some((c: any) => c.checkin_type === "workout"))
        setHasRunToday(todayCheckins.some((c: any) => c.checkin_type === "running"))
      }

      const scheduleResponse = await fetch(`/api/workout-schedule?userId=${userId}`)
      const scheduleData = await scheduleResponse.json()

      if (scheduleData.success && scheduleData.data.length > 0) {
        const dayOfWeek = new Date().getDay()
        const todaySchedule = scheduleData.data.find((s: any) => s.day_of_week === dayOfWeek)

        if (todaySchedule) {
          setTodayWorkout(todaySchedule.workout_name)
          setTodayWorkoutDescription(todaySchedule.description || "")
        } else {
          setTodayWorkout("Não definido")
          setTodayWorkoutDescription("Configure seu cronograma semanal")
        }
      } else {
        setTodayWorkout("Não definido")
        setTodayWorkoutDescription("Configure seu cronograma semanal")
      }
    } catch (error) {
      console.error("[v0] Error loading home data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !userProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    )
  }

  const initialWeight = Number.parseFloat(userProfile.initial_weight) || currentWeight
  const targetWeight = Number.parseFloat(userProfile.target_weight) || currentWeight
  const heightCm = Number.parseFloat(userProfile.height) || 170
  const userName = userProfile.name
  const theme = { primary: "#3b82f6", secondary: "#8b5cf6", accent: "#06b6d4", success: "#10b981" }

  const weightLoss = initialWeight - currentWeight
  const totalGoal = initialWeight - targetWeight
  const progressPercent = Math.max(0, Math.min(100, (weightLoss / totalGoal) * 100))
  const currentIMC = currentWeight / Math.pow(heightCm / 100, 2)

  const defaultGoals =
    userProfile.gender === "female"
      ? [
          "Perder gordura de forma saudável",
          "Ganhar definição muscular",
          "Melhorar resistência física",
          "Manter hábitos saudáveis",
        ]
      : [
          "Perder peso e ganhar massa magra",
          "Melhorar desempenho nos treinos",
          "Aumentar resistência cardiovascular",
          "Manter disciplina e consistência",
        ]

  return (
    <div className="space-y-6">
      <ProgressionAlert userId={userId} />

      <Card
        className="p-6 text-white"
        style={{
          background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary}, ${theme.accent})`,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Olá, {userName.split(" ")[0]}!</h1>
            <p className="text-white/90">Vamos conquistar seus objetivos hoje!</p>
          </div>
          <Button onClick={onLogout} variant="secondary" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </Card>

      <Card
        className="p-6 border-2"
        style={{
          borderColor: theme.primary + "30",
          background: `linear-gradient(to bottom right, ${theme.primary}20, ${theme.accent}10, ${theme.secondary}20)`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Peso Atual</p>
            <h2 className="text-4xl font-bold" style={{ color: theme.primary }}>
              {currentWeight.toFixed(1)}kg
            </h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Meta</p>
            <h2 className="text-4xl font-bold" style={{ color: theme.accent }}>
              {targetWeight}kg
            </h2>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-bold">
              {weightLoss.toFixed(1)}kg / {totalGoal}kg
            </span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t" style={{ borderColor: theme.primary + "20" }}>
          <div className="text-center">
            <TrendingDown className="w-6 h-6 mx-auto mb-1" style={{ color: theme.success }} />
            <p className="text-xs text-muted-foreground">Perdidos</p>
            <p className="text-lg font-bold">{weightLoss.toFixed(1)}kg</p>
          </div>
          <div className="text-center">
            <Target className="w-6 h-6 mx-auto mb-1" style={{ color: theme.primary }} />
            <p className="text-xs text-muted-foreground">Restantes</p>
            <p className="text-lg font-bold">{Math.max(0, totalGoal - weightLoss).toFixed(1)}kg</p>
          </div>
          <div className="text-center">
            <Trophy className="w-6 h-6 mx-auto mb-1" style={{ color: theme.accent }} />
            <p className="text-xs text-muted-foreground">IMC Atual</p>
            <p className="text-lg font-bold">{currentIMC.toFixed(1)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Seus Objetivos</h3>
        <div className="space-y-2">
          {defaultGoals.map((goal: string, idx: number) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Target className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm">{goal}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card
        className="p-6 border-2"
        style={{
          borderColor: theme.accent + "30",
          background: `linear-gradient(to bottom, var(--card), ${theme.accent}05)`,
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5" style={{ color: theme.primary }} />
          <h3 className="text-xl font-bold">Hoje</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: hasWorkoutToday ? theme.success : theme.primary }}
              >
                {hasWorkoutToday ? (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                ) : (
                  <Flame className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <p className="font-semibold">{todayWorkout}</p>
                <p className="text-sm text-muted-foreground">{todayWorkoutDescription || "Musculação"}</p>
              </div>
            </div>
            {hasWorkoutToday && (
              <span className="text-sm font-medium" style={{ color: theme.success }}>
                Completo ✓
              </span>
            )}
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: hasRunToday ? theme.success : theme.accent }}
              >
                {hasRunToday ? (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                ) : (
                  <Activity className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <p className="font-semibold">Corrida</p>
                <p className="text-sm text-muted-foreground">Cardio diário</p>
              </div>
            </div>
            {hasRunToday && (
              <span className="text-sm font-medium" style={{ color: theme.success }}>
                Completo ✓
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Widget QR Code Catraca */}
      <Card
        className="p-6 cursor-pointer hover:scale-[1.02] transition-transform border-2"
        style={{
          borderColor: "#7c3aed",
          background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #8b5cf6 100%)",
        }}
        onClick={() => setShowQRModal(true)}
      >
        <div className="flex items-center gap-4 text-white">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <QrCode className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Acesso Catraca</h3>
            <p className="text-white/80 text-sm">Toque para ver seu QR Code</p>
          </div>
        </div>
      </Card>

      {/* Widget Drink - Apenas para Kleber e Pamela */}
      {userDrink && (
        <Card
          className="p-6 cursor-pointer hover:scale-[1.02] transition-transform border-2"
          style={{
            borderColor: "#f97316",
            background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #f97316 100%)",
          }}
          onClick={() => setShowDrinkModal(true)}
        >
          <div className="flex items-center gap-4 text-white">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Wine className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Drink</h3>
              <p className="text-white/80 text-sm">Toque para ver suas credenciais</p>
            </div>
          </div>
        </Card>
      )}

      {/* Modal QR Code Catraca */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <QRAccessCard userId={userId} userName={userProfile?.name || userId} />
        </DialogContent>
      </Dialog>

      {/* Modal Drink */}
      <Dialog open={showDrinkModal} onOpenChange={setShowDrinkModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Wine className="w-6 h-6 text-purple-500" />
              Drink - Credenciais
            </DialogTitle>
          </DialogHeader>
          
          {userDrink && (
            <div className="space-y-4 mt-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-orange-500/10 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Matricula</p>
                    <p className="text-3xl font-bold text-purple-600">{userDrink.mat}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(userDrink.mat, "mat")}
                    className="h-10 w-10"
                  >
                    {copiedField === "mat" ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Senha</p>
                    <p className="text-3xl font-bold text-orange-500">{userDrink.senha}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(userDrink.senha, "senha")}
                    className="h-10 w-10"
                  >
                    {copiedField === "senha" ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Toque no icone para copiar
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card
        className="p-6 text-white border-2"
        style={{
          background: `linear-gradient(to right, ${theme.secondary}, ${theme.secondary}90, ${theme.primary}80)`,
          borderColor: theme.secondary,
        }}
      >
        <p className="text-lg font-medium text-center text-balance italic">
          {userProfile.gender === "female"
            ? '"Você é mais forte do que pensa. Cada treino te aproxima da melhor versão de você! 💪"'
            : '"O corpo alcança o que a mente acredita. Você já começou, continue forte! 💪"'}
        </p>
      </Card>
    </div>
  )
}
