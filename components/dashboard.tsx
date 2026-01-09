"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Dumbbell, Activity, BookOpen, User, CheckCircle2, Ruler, Droplet, BarChart3, Zap } from "lucide-react"
import { HomeTab } from "@/components/tabs/home-tab"
import { WorkoutsTab } from "@/components/tabs/workouts-tab"
import { RunningTab } from "@/components/tabs/running-tab"
import { NutritionTab } from "@/components/tabs/nutrition-tab"
import { ProfileTab } from "@/components/tabs/profile-tab"
import { CheckinTab } from "@/components/tabs/checkin-tab"
import { MeasurementsTab } from "@/components/tabs/measurements-tab"
import { HydrationTab } from "@/components/tabs/hydration-tab"
import { StatsTab } from "@/components/tabs/stats-tab"
import { CalisthenicsTab } from "@/components/tabs/calisthenics-tab"

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
}

const getUserPreferences = (userId: string): UserPreferences => {
  const preferencesMap: Record<string, UserPreferences> = {
    kleber: {
      theme_primary: "#3b82f6",
      theme_secondary: "#1e40af",
      theme_accent: "#06b6d4",
      enable_gym_checkin: true,
      enable_gym_workouts: true,
      enable_running: true,
      enable_home_workouts: true,
      enable_nutrition: true,
      enable_supplements: true,
      enable_measurements: true,
      enable_hydration: true,
      enable_stats: true,
    },
    pamela: {
      theme_primary: "#ec4899",
      theme_secondary: "#be185d",
      theme_accent: "#f472b6",
      enable_gym_checkin: true,
      enable_gym_workouts: true,
      enable_running: true,
      enable_home_workouts: true,
      enable_nutrition: true,
      enable_supplements: true,
      enable_measurements: true,
      enable_hydration: true,
      enable_stats: true,
    },
    juliana: {
      theme_primary: "#84cc16",
      theme_secondary: "#65a30d",
      theme_accent: "#a3e635",
      enable_gym_checkin: false,
      enable_gym_workouts: false,
      enable_running: true,
      enable_home_workouts: true,
      enable_nutrition: true,
      enable_supplements: false,
      enable_measurements: true,
      enable_hydration: true,
      enable_stats: true,
    },
  }

  return (
    preferencesMap[userId.toLowerCase()] || {
      theme_primary: "#3b82f6",
      theme_secondary: "#1e40af",
      theme_accent: "#06b6d4",
      enable_gym_checkin: true,
      enable_gym_workouts: true,
      enable_running: true,
      enable_home_workouts: true,
      enable_nutrition: true,
      enable_supplements: true,
      enable_measurements: true,
      enable_hydration: true,
      enable_stats: true,
    }
  )
}

export function Dashboard({ userId, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("home")
  const preferences = getUserPreferences(userId)

  const tabs = [
    { id: "home", label: "Início", icon: Home, color: preferences.theme_primary, enabled: true },
    {
      id: "checkin",
      label: "Check-in",
      icon: CheckCircle2,
      color: preferences.theme_accent,
      enabled: preferences.enable_gym_checkin,
    },
    {
      id: "workouts",
      label: "Treinos",
      icon: Dumbbell,
      color: preferences.theme_secondary,
      enabled: preferences.enable_gym_workouts,
    },
    {
      id: "running",
      label: "Corrida",
      icon: Activity,
      color: preferences.theme_accent,
      enabled: preferences.enable_running,
    },
    {
      id: "nutrition",
      label: "Nutrição",
      icon: BookOpen,
      color: preferences.theme_accent,
      enabled: preferences.enable_nutrition,
    },
    {
      id: "measurements",
      label: "Medidas",
      icon: Ruler,
      color: preferences.theme_primary,
      enabled: preferences.enable_measurements,
    },
    {
      id: "hydration",
      label: "Água",
      icon: Droplet,
      color: preferences.theme_accent,
      enabled: preferences.enable_hydration,
    },
    {
      id: "stats",
      label: "Stats",
      icon: BarChart3,
      color: preferences.theme_secondary,
      enabled: preferences.enable_stats,
    },
    {
      id: "calisthenics",
      label: "Casa",
      icon: Zap,
      color: preferences.theme_primary,
      enabled: preferences.enable_home_workouts,
    },
    { id: "profile", label: "Perfil", icon: User, color: preferences.theme_primary, enabled: true },
  ].filter((tab) => tab.enabled)

  return (
    <div
      className="min-h-screen pb-20"
      style={{
        background: `linear-gradient(135deg, ${preferences.theme_primary}10 0%, ${preferences.theme_secondary}10 50%, ${preferences.theme_accent}10 100%)`,
      }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b-2 border-primary/20">
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
                    className="flex-col gap-1 text-xs px-1"
                    style={{
                      color: activeTab === tab.id ? tab.color : undefined,
                      backgroundColor: activeTab === tab.id ? `${tab.color}20` : undefined,
                    }}
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
          <TabsContent value="profile" className="mt-0">
            <ProfileTab userId={userId} onLogout={onLogout} preferences={preferences} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
