"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Flame, TrendingDown, Calendar, CheckCircle2, Activity, LogOut, Wine, X, Copy, Check, QrCode, Coins, Star, Zap, Bike, Dumbbell } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProgressionAlert } from "@/components/progression-alert"
import { QRAccessCard } from "@/components/qr-access-card"

interface HomeTabProps {
  userId: string
  onLogout: () => void
  preferences?: {
    theme_primary: string
    theme_secondary: string
    theme_accent: string
  }
}

export function HomeTab({ userId, onLogout, preferences }: HomeTabProps) {
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
  const [loyaltyData, setLoyaltyData] = useState<{
    total_points: number
    current_level: string
    cashback_balance: number
    current_streak: number
  } | null>(null)
  const [progressionData, setProgressionData] = useState<any>(null)

  // Dados do Drink exclusivo para Kleber e Pamela
  const drinkData: Record<string, { mat: string; senha: string }> = {
    kleber: { mat: "2216", senha: "1209" },
    pamela: { mat: "2217", senha: "2805" },
  }

  const userDrink = drinkData[userId?.toLowerCase() || ""]

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
      // Carregar TODOS os dados em paralelo para performance maxima
      const [profileResponse, checkinResponse, scheduleResponse, loyaltyResponse, progressionResponse] = await Promise.all([
        fetch(`/api/user-profile?userId=${userId}`),
        fetch(`/api/checkin?userId=${userId}&limit=5`),
        fetch(`/api/workout-schedule?userId=${userId}`),
        fetch(`/api/loyalty?userId=${userId}`),
        fetch(`/api/progression?userId=${userId}`)
      ])

      const [profileData, checkinData, scheduleData, loyaltyJson, progressionJson] = await Promise.all([
        profileResponse.json(),
        checkinResponse.json(),
        scheduleResponse.json(),
        loyaltyResponse.json(),
        progressionResponse.json()
      ])

      // Processar perfil
      if (profileData.success && profileData.data) {
        setUserProfile(profileData.data)
        if (profileData.data.current_weight) {
          setCurrentWeight(Number.parseFloat(profileData.data.current_weight))
        }
      }

      // Processar check-ins de hoje
      if (checkinData.success && checkinData.data) {
        const today = new Date().toISOString().split("T")[0]
        const todayCheckins = checkinData.data.filter((c: any) => c.checkin_date?.startsWith(today))
        setHasWorkoutToday(todayCheckins.some((c: any) => c.checkin_type === "workout"))
        setHasRunToday(todayCheckins.some((c: any) => c.checkin_type === "running"))
      }

      // Processar cronograma
      if (scheduleData.success && scheduleData.data && scheduleData.data.length > 0) {
        const dayOfWeek = new Date().getDay()
        const todaySchedule = scheduleData.data.find((s: any) => s.day_of_week === dayOfWeek)

        if (todaySchedule) {
          setTodayWorkout(todaySchedule.workout_name)
          setTodayWorkoutDescription(todaySchedule.description || "")
        } else {
          setTodayWorkout("Nao definido")
          setTodayWorkoutDescription("Configure seu cronograma semanal")
        }
      } else {
        setTodayWorkout("Nao definido")
        setTodayWorkoutDescription("Configure seu cronograma semanal")
      }

      // Processar fidelidade
      if (loyaltyJson.success && loyaltyJson.data?.points) {
        setLoyaltyData(loyaltyJson.data.points)
      }

      // Processar progression
      if (progressionJson.success && progressionJson.data) {
        setProgressionData(progressionJson.data)
      }
    } catch {
      // Erro silencioso
    } finally {
      setLoading(false)
    }
  }

  // Theme sempre disponivel, nao depende do loading
  const theme = { 
    primary: preferences?.theme_primary || "#ef4444", 
    secondary: preferences?.theme_secondary || "#f97316", 
    accent: preferences?.theme_accent || "#fb923c", 
    success: "#10b981" 
  }

  // Valores com fallback para skeleton - mostrar interface imediatamente
  const initialWeight = userProfile ? Number.parseFloat(userProfile.initial_weight) || currentWeight : 0
  const targetWeight = userProfile ? Number.parseFloat(userProfile.target_weight) || currentWeight : 0
  const heightCm = userProfile ? Number.parseFloat(userProfile.height) || 170 : 170
  const userName = userProfile?.name || userId

  const weightLoss = initialWeight - currentWeight
  const totalGoal = initialWeight - targetWeight
  // Proteção contra divisão por zero
  const progressPercent = totalGoal > 0 ? Math.max(0, Math.min(100, (weightLoss / totalGoal) * 100)) : 0
  const currentIMC = heightCm > 0 ? currentWeight / Math.pow(heightCm / 100, 2) : 0

  const defaultGoals =
    userProfile?.gender === "female"
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
      <ProgressionAlert userId={userId} initialData={progressionData} preferences={{ theme_primary: theme.primary, theme_secondary: theme.secondary, theme_accent: theme.accent }} />

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
            <p className="text-lg font-bold">{(weightLoss || 0).toFixed(1)}kg</p>
          </div>
          <div className="text-center">
            <Target className="w-6 h-6 mx-auto mb-1" style={{ color: theme.primary }} />
            <p className="text-xs text-muted-foreground">Restantes</p>
            <p className="text-lg font-bold">{Math.max(0, (totalGoal - weightLoss) || 0).toFixed(1)}kg</p>
          </div>
          <div className="text-center">
            <Trophy className="w-6 h-6 mx-auto mb-1" style={{ color: theme.accent }} />
            <p className="text-xs text-muted-foreground">IMC Atual</p>
            <p className="text-lg font-bold">{(currentIMC || 0).toFixed(1)}</p>
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
                <p className="font-semibold">{todayWorkout || "Carregando..."}</p>
                <p className="text-sm text-muted-foreground">{todayWorkoutDescription || "Musculacao"}</p>
              </div>
            </div>
            {hasWorkoutToday && (
              <span className="text-sm font-medium" style={{ color: theme.success }}>
                Completo
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
                <p className="text-sm text-muted-foreground">Cardio diario</p>
              </div>
            </div>
            {hasRunToday && (
              <span className="text-sm font-medium" style={{ color: theme.success }}>
                Completo
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Widget Pontos de Fidelidade */}
      {loyaltyData && (
        <Card
          className="p-6 cursor-pointer hover:scale-[1.02] transition-transform border-2"
          style={{
            borderColor: "#f59e0b",
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
          }}
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <Coins className="w-8 h-8" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Seus Pontos</p>
                <h3 className="text-3xl font-bold">{loyaltyData.total_points?.toLocaleString() || 0}</h3>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end mb-1">
                <Star className="w-4 h-4" />
                <span className="font-semibold">{loyaltyData.current_level || "Bronze"}</span>
              </div>
              <p className="text-white/70 text-sm">R${Number(loyaltyData.cashback_balance || 0).toFixed(2)} cashback</p>
              {loyaltyData.current_streak > 0 && (
                <p className="text-white/70 text-xs mt-1">{loyaltyData.current_streak} dias seguidos</p>
              )}
            </div>
          </div>
        </Card>
      )}

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

      {/* Widgets Calistenia, Spinning, Ginastica - Apenas para Kleber e Pamela */}
      {["kleber", "pamela"].includes(userId?.toLowerCase() || "") && (
        <>
          {/* Widget Calistenia - apenas Kleber tem acesso */}
          {(userId?.toLowerCase() || "") === "kleber" && (
            <Card
              className="p-6 cursor-pointer hover:scale-[1.02] transition-transform border-2"
              style={{
                borderColor: "#ef4444",
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)",
              }}
              onClick={() => {
                const event = new CustomEvent('changeTab', { detail: 'calisthenics' });
                window.dispatchEvent(event);
              }}
            >
              <div className="flex items-center gap-4 text-white">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <Zap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Calistenia</h3>
                  <p className="text-white/80 text-sm">Treino militar de peso corporal</p>
                </div>
              </div>
            </Card>
          )}

          {/* Widget Spinning */}
          <Card
            className="p-6 cursor-pointer hover:scale-[1.02] transition-transform border-2"
            style={{
              borderColor: "#7c3aed",
              background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)",
            }}
            onClick={() => {
              const event = new CustomEvent('changeTab', { detail: 'spinning' });
              window.dispatchEvent(event);
            }}
          >
            <div className="flex items-center gap-4 text-white">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <Bike className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Spinning</h3>
                <p className="text-white/80 text-sm">Horarios das aulas de bike</p>
              </div>
            </div>
          </Card>

          {/* Widget Ginastica */}
          <Card
            className="p-6 cursor-pointer hover:scale-[1.02] transition-transform border-2"
            style={{
              borderColor: "#f97316",
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
            }}
            onClick={() => {
              const event = new CustomEvent('changeTab', { detail: 'ginastica' });
              window.dispatchEvent(event);
            }}
          >
            <div className="flex items-center gap-4 text-white">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <Dumbbell className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Ginastica</h3>
                <p className="text-white/80 text-sm">Quadro de aulas da sala</p>
              </div>
            </div>
          </Card>
        </>
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
