"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Droplet, Plus, Minus, Settings, TrendingUp, Calendar, Flame, 
  Coffee, Leaf, Citrus, Zap, Beer, Trophy, Target
} from "lucide-react"

interface UserPreferences {
  theme_primary: string
  theme_secondary: string
  theme_accent: string
}

interface HydrationTabProps {
  userId: string
  preferences: UserPreferences
}

interface BeverageType {
  id: number
  name: string
  hydration_factor: number
  icon: string
  color: string
}

interface HydrationLog {
  id: number
  amount_ml: number
  beverage_type_id: number
  effective_ml: number
  logged_at: string
  beverage_name?: string
}

export function HydrationTab({ userId, preferences }: HydrationTabProps) {
  const [waterIntake, setWaterIntake] = useState(0)
  const [goal, setGoal] = useState(3000)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("hoje")
  const [beverageTypes, setBeverageTypes] = useState<BeverageType[]>([])
  const [todayLogs, setTodayLogs] = useState<HydrationLog[]>([])
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [streak, setStreak] = useState({ current: 0, longest: 0, totalDays: 0 })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selectedBeverage, setSelectedBeverage] = useState<BeverageType | null>(null)
  
  // Configuracoes
  const [settings, setSettings] = useState({
    dailyGoalMl: 3000,
    mlPerKg: 35,
    useWeightCalculation: false,
    reminderEnabled: false,
    reminderIntervalHours: 2,
  })

  useEffect(() => {
    loadAll()
  }, [userId])

  const loadAll = async () => {
    setLoading(true)
    await Promise.all([
      loadHydration(),
      loadBeverageTypes(),
      loadTodayLogs(),
      loadWeeklyData(),
      loadStreak(),
      loadSettings(),
    ])
    setLoading(false)
  }

  const loadHydration = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]
      const response = await fetch(`/api/hydration?userId=${userId}&date=${today}`)
      const data = await response.json()
      if (data.success) {
        setWaterIntake(data.data.water_intake_ml || 0)
        setGoal(data.data.goal_ml || 3000)
      }
    } catch (error) {
      console.error("Error loading hydration:", error)
    }
  }

  const loadBeverageTypes = async () => {
    try {
      const response = await fetch("/api/beverage-types")
      const data = await response.json()
      if (data.success) {
        setBeverageTypes(data.data || [])
        // Definir agua como padrao
        const water = data.data?.find((b: BeverageType) => b.name === "Agua")
        if (water) setSelectedBeverage(water)
      }
    } catch (error) {
      console.error("Error loading beverage types:", error)
    }
  }

  const loadTodayLogs = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]
      const response = await fetch(`/api/hydration-log?userId=${userId}&date=${today}`)
      const data = await response.json()
      if (data.success) {
        setTodayLogs(data.data || [])
      }
    } catch (error) {
      console.error("Error loading today logs:", error)
    }
  }

  const loadWeeklyData = async () => {
    try {
      const response = await fetch(`/api/hydration-weekly?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setWeeklyData(data.data || [])
      }
    } catch (error) {
      console.error("Error loading weekly data:", error)
    }
  }

  const loadStreak = async () => {
    try {
      const response = await fetch(`/api/hydration-streak?userId=${userId}`)
      const data = await response.json()
      if (data.success && data.data) {
        setStreak({
          current: data.data.current_streak || 0,
          longest: data.data.longest_streak || 0,
          totalDays: data.data.total_days_goal_met || 0,
        })
      }
    } catch (error) {
      console.error("Error loading streak:", error)
    }
  }

  const loadSettings = async () => {
    try {
      const response = await fetch(`/api/hydration-settings?userId=${userId}`)
      const data = await response.json()
      if (data.success && data.data) {
        setSettings({
          dailyGoalMl: data.data.daily_goal_ml || 3000,
          mlPerKg: data.data.ml_per_kg || 35,
          useWeightCalculation: data.data.use_weight_calculation || false,
          reminderEnabled: data.data.reminder_enabled || false,
          reminderIntervalHours: data.data.reminder_interval_hours || 2,
        })
        setGoal(data.data.daily_goal_ml || 3000)
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }

  const saveSettings = async () => {
    try {
      await fetch("/api/hydration-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...settings }),
      })
      setGoal(settings.dailyGoalMl)
      setSettingsOpen(false)
    } catch (error) {
      console.error("Error saving settings:", error)
    }
  }

  const addBeverage = async (ml: number) => {
    const beverage = selectedBeverage || beverageTypes.find(b => b.name === "Agua")
    if (!beverage) return
    
    const effectiveMl = Math.round(ml * beverage.hydration_factor)
    const newIntake = Math.min(waterIntake + effectiveMl, 10000)
    
    try {
      const today = new Date().toISOString().split("T")[0]
      
      // Registrar no log
      await fetch("/api/hydration-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          amountMl: ml,
          beverageTypeId: beverage.id,
          effectiveMl,
        }),
      })
      
      // Atualizar total do dia
      await fetch("/api/hydration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          date: today,
          waterIntakeMl: newIntake,
          goalMl: goal,
        }),
      })
      
      setWaterIntake(newIntake)
      loadTodayLogs()
      
      // Verificar se bateu a meta
      if (newIntake >= goal && waterIntake < goal) {
        updateStreak()
      }
    } catch (error) {
      console.error("Error adding beverage:", error)
    }
  }

  const updateStreak = async () => {
    try {
      await fetch("/api/hydration-streak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      loadStreak()
    } catch (error) {
      console.error("Error updating streak:", error)
    }
  }

  const removeWater = async (ml: number) => {
    const newIntake = Math.max(waterIntake - ml, 0)
    try {
      const today = new Date().toISOString().split("T")[0]
      await fetch("/api/hydration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          date: today,
          waterIntakeMl: newIntake,
          goalMl: goal,
        }),
      })
      setWaterIntake(newIntake)
    } catch (error) {
      console.error("Error removing water:", error)
    }
  }

  const getBeverageIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      droplet: Droplet,
      sparkles: Zap,
      leaf: Leaf,
      coffee: Coffee,
      citrus: Citrus,
      zap: Zap,
      beer: Beer,
    }
    return icons[iconName] || Droplet
  }

  const progressPercent = Math.min(100, (waterIntake / goal) * 100)
  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]

  if (loading) {
    return <p className="text-center py-8">Carregando...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Hidratacao</h2>
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Configuracoes de Hidratacao</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Meta Diaria (ml)</Label>
                <Input
                  type="number"
                  value={settings.dailyGoalMl}
                  onChange={(e) => setSettings({ ...settings, dailyGoalMl: parseInt(e.target.value) || 3000 })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Calcular por peso</Label>
                  <p className="text-xs text-muted-foreground">Meta = {settings.mlPerKg}ml x seu peso</p>
                </div>
                <Switch
                  checked={settings.useWeightCalculation}
                  onCheckedChange={(checked) => setSettings({ ...settings, useWeightCalculation: checked })}
                />
              </div>
              {settings.useWeightCalculation && (
                <div>
                  <Label>ml por kg de peso</Label>
                  <Input
                    type="number"
                    value={settings.mlPerKg}
                    onChange={(e) => setSettings({ ...settings, mlPerKg: parseFloat(e.target.value) || 35 })}
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Lembretes</Label>
                  <p className="text-xs text-muted-foreground">Lembrar de beber agua</p>
                </div>
                <Switch
                  checked={settings.reminderEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, reminderEnabled: checked })}
                />
              </div>
              {settings.reminderEnabled && (
                <div>
                  <Label>Intervalo (horas)</Label>
                  <Input
                    type="number"
                    value={settings.reminderIntervalHours}
                    onChange={(e) => setSettings({ ...settings, reminderIntervalHours: parseInt(e.target.value) || 2 })}
                  />
                </div>
              )}
              <Button onClick={saveSettings} className="w-full" style={{ backgroundColor: "#c2410c" }}>
                Salvar Configuracoes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Streak */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-xs text-gray-400">Sequencia</span>
          </div>
          <p className="text-2xl font-bold text-white">{streak.current} dias</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-gray-400">Recorde</span>
          </div>
          <p className="text-2xl font-bold text-white">{streak.longest} dias</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{streak.totalDays} dias</p>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-white/5">
          <TabsTrigger value="hoje" className="data-[state=active]:bg-blue-600">
            <Droplet className="w-4 h-4 mr-2" />
            Hoje
          </TabsTrigger>
          <TabsTrigger value="historico" className="data-[state=active]:bg-blue-600">
            <Calendar className="w-4 h-4 mr-2" />
            Semana
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hoje" className="space-y-6 mt-6">
          {/* Card principal */}
          <Card className="p-8 border-2 bg-white/5" style={{ borderColor: preferences.theme_accent + "30" }}>
            <div className="text-center mb-6">
              <Droplet className="w-16 h-16 mx-auto mb-4" style={{ color: preferences.theme_accent }} />
              <p className="text-6xl font-bold mb-2 text-white">{waterIntake}ml</p>
              <p className="text-gray-300">de {goal}ml</p>
            </div>

            <Progress value={progressPercent} className="h-4 mb-6" />

            {/* Selecao de bebida */}
            <div className="mb-6">
              <Label className="mb-3 block text-center">Tipo de bebida</Label>
              <div className="flex flex-wrap justify-center gap-2">
                {beverageTypes.slice(0, 6).map((beverage) => {
                  const Icon = getBeverageIcon(beverage.icon)
                  const isSelected = selectedBeverage?.id === beverage.id
                  return (
                    <Button
                      key={beverage.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedBeverage(beverage)}
                      className={`flex items-center gap-1 ${isSelected ? "" : "opacity-70"}`}
                      style={isSelected ? { backgroundColor: beverage.color || preferences.theme_accent } : {}}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs">{beverage.name}</span>
                      <span className="text-xs opacity-70">({Math.round(beverage.hydration_factor * 100)}%)</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Botoes de quantidade */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                onClick={() => addBeverage(250)}
                style={{ backgroundColor: selectedBeverage?.color || preferences.theme_accent }}
                className="h-20 flex-col gap-2 text-white"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm">+250ml</span>
                <span className="text-xs opacity-80">Copo</span>
              </Button>
              <Button
                onClick={() => addBeverage(500)}
                style={{ backgroundColor: selectedBeverage?.color || preferences.theme_accent }}
                className="h-20 flex-col gap-2 text-white"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm">+500ml</span>
                <span className="text-xs opacity-80">Garrafa</span>
              </Button>
              <Button
                onClick={() => addBeverage(1000)}
                style={{ backgroundColor: selectedBeverage?.color || preferences.theme_accent }}
                className="h-20 flex-col gap-2 text-white"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm">+1L</span>
                <span className="text-xs opacity-80">Garrafa Grande</span>
              </Button>
              <Button onClick={() => removeWater(250)} variant="outline" className="h-20 flex-col gap-2">
                <Minus className="w-5 h-5" />
                <span className="text-sm">-250ml</span>
                <span className="text-xs opacity-80">Corrigir</span>
              </Button>
            </div>

            {progressPercent >= 100 && (
              <div className="mt-6 p-4 bg-green-500/30 rounded-lg text-center border border-green-500/50">
                <p className="font-bold text-green-400">Meta de hidratacao alcancada hoje!</p>
              </div>
            )}
          </Card>

          {/* Registro do dia */}
          {todayLogs.length > 0 && (
            <Card className="p-4 bg-white/5">
              <h4 className="font-bold text-white mb-3">Registros de Hoje</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {todayLogs.map((log) => {
                  const beverage = beverageTypes.find(b => b.id === log.beverage_type_id)
                  const Icon = getBeverageIcon(beverage?.icon || "droplet")
                  return (
                    <div key={log.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color: beverage?.color || "#3b82f6" }} />
                        <span className="text-sm">{beverage?.name || "Agua"}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{log.amount_ml}ml</span>
                        {log.effective_ml !== log.amount_ml && (
                          <span className="text-xs text-muted-foreground ml-2">({log.effective_ml}ml efetivo)</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.logged_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="historico" className="space-y-6 mt-6">
          {/* Grafico semanal simplificado */}
          <Card className="p-6 bg-white/5">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Ultimos 7 Dias
            </h4>
            <div className="flex items-end justify-between gap-2 h-40">
              {weeklyData.length > 0 ? weeklyData.map((day, index) => {
                const percent = Math.min(100, (day.water_intake_ml / goal) * 100)
                const dayDate = new Date(day.date)
                const dayName = daysOfWeek[dayDate.getDay()]
                const metGoal = day.water_intake_ml >= goal
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative" style={{ height: "100px" }}>
                      <div
                        className={`absolute bottom-0 w-full rounded-t-lg transition-all ${metGoal ? "bg-green-500" : "bg-blue-500"}`}
                        style={{ height: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{dayName}</span>
                    <span className="text-xs font-medium">{day.water_intake_ml}ml</span>
                  </div>
                )
              }) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  Sem dados ainda
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span>Meta batida</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span>Abaixo da meta</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dicas */}
      <Card className="p-6 border" style={{ backgroundColor: preferences.theme_accent + "10", borderColor: preferences.theme_accent + "30" }}>
        <h3 className="font-bold text-white mb-4">Dicas de Hidratacao</h3>
        <ul className="space-y-2 text-sm text-gray-200">
          <li className="flex items-start gap-2">
            <span className="text-green-400">*</span>
            <span>Beba agua logo ao acordar para reidratar o corpo</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">*</span>
            <span>Mantenha uma garrafa sempre por perto</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">*</span>
            <span>Beba antes, durante e apos os treinos</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">*</span>
            <span>Aumente a ingestao em dias quentes ou de treino intenso</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
