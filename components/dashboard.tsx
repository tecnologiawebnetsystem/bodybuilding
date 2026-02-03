"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  Dumbbell,
  Activity,
  BookOpen,
  User,
  CheckCircle2,
  Ruler,
  Droplet,
  BarChart3,
  Zap,
  MoreHorizontal,
  Sparkles,
  Bike,
  Coins,
  CalendarDays,
} from "lucide-react"

// Lazy load das tabs para evitar erros de inicializacao
const HomeTab = lazy(() => import("@/components/tabs/home-tab").then(m => ({ default: m.HomeTab })))
const WorkoutsTab = lazy(() => import("@/components/tabs/workouts-tab").then(m => ({ default: m.WorkoutsTab })))
const RunningTab = lazy(() => import("@/components/tabs/running-tab").then(m => ({ default: m.RunningTab })))
const NutritionTab = lazy(() => import("@/components/tabs/nutrition-tab").then(m => ({ default: m.NutritionTab })))
const ProfileTab = lazy(() => import("@/components/tabs/profile-tab").then(m => ({ default: m.ProfileTab })))
const CheckinTab = lazy(() => import("@/components/tabs/checkin-tab").then(m => ({ default: m.CheckinTab })))
const MeasurementsTab = lazy(() => import("@/components/tabs/measurements-tab").then(m => ({ default: m.MeasurementsTab })))
const HydrationTab = lazy(() => import("@/components/tabs/hydration-tab").then(m => ({ default: m.HydrationTab })))
const StatsTab = lazy(() => import("@/components/tabs/stats-tab").then(m => ({ default: m.StatsTab })))
const CalisthenicsTab = lazy(() => import("@/components/tabs/calisthenics-tab").then(m => ({ default: m.CalisthenicsTab })))
const MoreTab = lazy(() => import("@/components/tabs/more-tab").then(m => ({ default: m.MoreTab })))
const AiTab = lazy(() => import("@/components/tabs/ai-tab").then(m => ({ default: m.AiTab })))
const SpinningTab = lazy(() => import("@/components/tabs/spinning-tab").then(m => ({ default: m.SpinningTab })))
const GinasticaTab = lazy(() => import("@/components/tabs/ginastica-tab").then(m => ({ default: m.GinasticaTab })))
const LoyaltyTab = lazy(() => import("@/components/tabs/loyalty-tab").then(m => ({ default: m.LoyaltyTab })))
const CalendarTab = lazy(() => import("@/components/tabs/calendar-tab").then(m => ({ default: m.CalendarTab })))
const Chatbot = lazy(() => import("@/components/ai/chatbot").then(m => ({ default: m.Chatbot })))

// Componente de loading para Suspense
function TabLoading() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
    </div>
  )
}

interface DashboardProps {
  userId: string
  onLogout: () => void
}

interface UserPreferences {
  theme_primary: string
  theme_secondary: string
  theme_accent: string
  enable_gym_checkin: boolean
  enable_gym_workouts: boolean
  enable_running: boolean
  enable_home_workouts: boolean
  enable_nutrition: boolean
  enable_supplements: boolean
  enable_measurements: boolean
  enable_hydration: boolean
  enable_stats: boolean
  enable_spinning: boolean
  enable_ginastica: boolean
  enable_calendar: boolean
}

const getUserPreferences = (userId: string): UserPreferences => {
  // Calistenia Militar apenas para Kleber
  const isKleber = userId.toLowerCase() === 'kleber'
  
  const preferencesMap: Record<string, UserPreferences> = {
    kleber: {
      theme_primary: "#ef4444",
      theme_secondary: "#f97316",
      theme_accent: "#fb923c",
      enable_gym_checkin: true,
      enable_gym_workouts: true,
      enable_running: true,
      enable_home_workouts: true, // Calistenia Militar - APENAS Kleber
      enable_nutrition: true,
      enable_supplements: true,
      enable_measurements: true,
      enable_hydration: true,
      enable_stats: true,
      enable_spinning: true, // Spinning - APENAS Kleber e Pamela
      enable_ginastica: true, // Ginastica - APENAS Kleber e Pamela
      enable_calendar: true,
    },
    pamela: {
      theme_primary: "#ef4444",
      theme_secondary: "#f97316",
      theme_accent: "#fb923c",
      enable_gym_checkin: true,
      enable_gym_workouts: true,
      enable_running: true,
      enable_home_workouts: false, // SEM Calistenia
      enable_nutrition: true,
      enable_supplements: true,
      enable_measurements: true,
      enable_hydration: true,
      enable_stats: true,
      enable_spinning: true, // Spinning - APENAS Kleber e Pamela
      enable_ginastica: true, // Ginastica - APENAS Kleber e Pamela
      enable_calendar: true,
    },
    juliana: {
      theme_primary: "#ef4444",
      theme_secondary: "#f97316",
      theme_accent: "#fb923c",
      enable_gym_checkin: false,
      enable_gym_workouts: false,
      enable_running: true,
      enable_home_workouts: false, // SEM Calistenia
      enable_nutrition: true,
      enable_supplements: false,
      enable_measurements: true,
      enable_hydration: true,
      enable_stats: true,
      enable_spinning: false, // SEM Spinning
      enable_ginastica: false, // SEM Ginastica
      enable_calendar: true,
    },
  }

  return (
    preferencesMap[userId.toLowerCase()] || {
      theme_primary: "#ef4444",
      theme_secondary: "#f97316",
      theme_accent: "#fb923c",
      enable_gym_checkin: true,
      enable_gym_workouts: true,
      enable_running: true,
      enable_home_workouts: false, // Novos usuarios SEM Calistenia por padrao
      enable_nutrition: true,
      enable_supplements: true,
      enable_measurements: true,
      enable_hydration: true,
      enable_stats: true,
      enable_spinning: false, // Novos usuarios SEM Spinning por padrao
      enable_ginastica: false, // Novos usuarios SEM Ginastica por padrao
      enable_calendar: true,
    }
  )
}

export function Dashboard({ userId, onLogout }: DashboardProps) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const preferences = getUserPreferences(userId)
  
  // Montagem do componente
  useEffect(() => {
    setMounted(true)
    
    // Verificar tab salva
    const savedTab = sessionStorage.getItem("activeTab")
    if (savedTab) {
      sessionStorage.removeItem("activeTab")
      setActiveTab(savedTab)
    }
  }, [])

  // Listener para mudar de tab via evento customizado (usado pelos widgets da home)
  useEffect(() => {
    const handleChangeTab = (event: CustomEvent) => {
      setActiveTab(event.detail)
    }
    window.addEventListener('changeTab', handleChangeTab as EventListener)
    return () => {
      window.removeEventListener('changeTab', handleChangeTab as EventListener)
    }
  }, [])

  const tabs = [
    // 1. Inicio
    { id: "home", label: "Início", icon: Home, color: preferences.theme_primary, enabled: true },
    // 2. IA
    { id: "ai", label: "IA", icon: Sparkles, color: "#a855f7", enabled: true },
    // 3. Medidas
    {
      id: "measurements",
      label: "Medidas",
      icon: Ruler,
      color: preferences.theme_primary,
      enabled: preferences.enable_measurements,
    },
    // 4. Agua
    {
      id: "hydration",
      label: "Água",
      icon: Droplet,
      color: preferences.theme_accent,
      enabled: preferences.enable_hydration,
    },
    // 5. Nutricao
    {
      id: "nutrition",
      label: "Nutrição",
      icon: BookOpen,
      color: preferences.theme_accent,
      enabled: preferences.enable_nutrition,
    },
    // 6. Check-in
    {
      id: "checkin",
      label: "Check-in",
      icon: CheckCircle2,
      color: preferences.theme_accent,
      enabled: preferences.enable_gym_checkin,
    },
    // 7. Treinos
    {
      id: "workouts",
      label: "Treinos",
      icon: Dumbbell,
      color: preferences.theme_secondary,
      enabled: preferences.enable_gym_workouts,
    },
    // 8. Corrida
    {
      id: "running",
      label: "Corrida",
      icon: Activity,
      color: preferences.theme_accent,
      enabled: preferences.enable_running,
    },
    // 9. Agenda
    { id: "calendar", label: "Agenda", icon: CalendarDays, color: "#06b6d4", enabled: preferences.enable_calendar },
    // 10. Pontos
    { id: "loyalty", label: "Pontos", icon: Coins, color: "#f59e0b", enabled: true },
    // 11. Stats
    {
      id: "stats",
      label: "Stats",
      icon: BarChart3,
      color: preferences.theme_secondary,
      enabled: preferences.enable_stats,
    },
    // 12. Mais
    { id: "more", label: "Mais", icon: MoreHorizontal, color: preferences.theme_accent, enabled: true },
    // 13. Perfil
    { id: "profile", label: "Perfil", icon: User, color: preferences.theme_primary, enabled: true },
    // Tabs ocultas no menu (acessadas via widgets)
    {
      id: "calisthenics",
      label: "Calistenia",
      icon: Zap,
      color: preferences.theme_primary,
      enabled: preferences.enable_home_workouts && !["kleber", "pamela"].includes(userId?.toLowerCase() || ""),
    },
    {
      id: "spinning",
      label: "Spinning",
      icon: Bike,
      color: "#7c3aed",
      enabled: preferences.enable_spinning && !["kleber", "pamela"].includes(userId?.toLowerCase() || ""),
    },
    {
      id: "ginastica",
      label: "Ginastica",
      icon: Dumbbell,
      color: "#7c3aed",
      enabled: preferences.enable_ginastica && !["kleber", "pamela"].includes(userId?.toLowerCase() || ""),
    },
  ].filter((tab) => tab.enabled)

  // Aguardar montagem antes de renderizar
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="w-12 h-12 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Chatbot flutuante - renderizado apenas apos montagem */}
      {mounted && (
        <Suspense fallback={null}>
          <Chatbot context={`Usuario: ${userId}`} userName={userId} />
        </Suspense>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-2">
            <TabsList
              className="w-full h-16 bg-transparent gap-1 p-1"
              style={{ display: "grid", gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex-col gap-1 text-xs px-1 text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/20 data-[state=active]:to-orange-500/20 data-[state=active]:border data-[state=active]:border-orange-500/30"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px]">{tab.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <Suspense fallback={<TabLoading />}>
            <TabsContent value="home" className="mt-0">
              <HomeTab userId={userId} onLogout={onLogout} preferences={preferences} />
            </TabsContent>
            {preferences.enable_gym_checkin && (
              <TabsContent value="checkin" className="mt-0">
                <CheckinTab userId={userId} preferences={preferences} />
              </TabsContent>
            )}
            {preferences.enable_gym_workouts && (
              <TabsContent value="workouts" className="mt-0">
                <WorkoutsTab userId={userId} preferences={preferences} />
              </TabsContent>
            )}
            {preferences.enable_running && (
              <TabsContent value="running" className="mt-0">
                <RunningTab userId={userId} preferences={preferences} />
              </TabsContent>
            )}
            {preferences.enable_nutrition && (
              <TabsContent value="nutrition" className="mt-0">
                <NutritionTab userId={userId} preferences={preferences} />
              </TabsContent>
            )}
            {preferences.enable_measurements && (
              <TabsContent value="measurements" className="mt-0">
                <MeasurementsTab userId={userId} preferences={preferences} />
              </TabsContent>
            )}
            {preferences.enable_hydration && (
              <TabsContent value="hydration" className="mt-0">
                <HydrationTab userId={userId} preferences={preferences} />
              </TabsContent>
            )}
            {preferences.enable_stats && (
              <TabsContent value="stats" className="mt-0">
                <StatsTab userId={userId} preferences={preferences} />
              </TabsContent>
            )}
            {preferences.enable_home_workouts && (
              <TabsContent value="calisthenics" className="mt-0">
                <CalisthenicsTab userId={userId} preferences={preferences} />
              </TabsContent>
            )}
            {preferences.enable_spinning && (
              <TabsContent value="spinning" className="mt-0">
                <SpinningTab userId={userId} preferences={preferences} />
              </TabsContent>
            )}
            {preferences.enable_ginastica && (
              <TabsContent value="ginastica" className="mt-0">
                <GinasticaTab userId={userId} preferences={preferences} />
              </TabsContent>
            )}
            <TabsContent value="ai" className="mt-0">
              <AiTab userId={userId} preferences={preferences} />
            </TabsContent>
            {preferences.enable_calendar && (
              <TabsContent value="calendar" className="mt-0">
                <CalendarTab userId={userId} preferences={preferences} />
              </TabsContent>
            )}
            <TabsContent value="loyalty" className="mt-0">
              <LoyaltyTab userId={userId} preferences={preferences} />
            </TabsContent>
            <TabsContent value="more" className="mt-0">
              <MoreTab userId={userId} preferences={preferences} />
            </TabsContent>
            <TabsContent value="profile" className="mt-0">
              <ProfileTab userId={userId} onLogout={onLogout} preferences={preferences} />
            </TabsContent>
          </Suspense>
        </div>
      </Tabs>
    </div>
  )
}
