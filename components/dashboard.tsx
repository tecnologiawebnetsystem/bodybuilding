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
import { userProfiles } from "@/lib/user-profiles"

interface DashboardProps {
  userId: string
  onLogout: () => void
}

export function Dashboard({ userId, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("home")
  const profile = userProfiles[userId]

  const themeColors = profile.theme

  return (
    <div
      className="min-h-screen pb-20"
      style={{
        background: `linear-gradient(135deg, ${themeColors.gradient.from} 0%, ${themeColors.gradient.via} 50%, ${themeColors.gradient.to} 100%)`,
      }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b-2 border-primary/20">
          <div className="max-w-7xl mx-auto px-2">
            <TabsList
              className={`w-full grid ${profile.id === "kleber" ? "grid-cols-10" : "grid-cols-9"} h-16 bg-transparent gap-1 p-1`}
            >
              <TabsTrigger
                value="home"
                className="flex-col gap-1 text-xs px-1"
                style={{
                  color: activeTab === "home" ? themeColors.primary : undefined,
                  backgroundColor: activeTab === "home" ? `${themeColors.primary}20` : undefined,
                }}
              >
                <Home className="w-4 h-4" />
                <span className="text-[10px]">Início</span>
              </TabsTrigger>
              <TabsTrigger
                value="checkin"
                className="flex-col gap-1 text-xs px-1"
                style={{
                  color: activeTab === "checkin" ? themeColors.success : undefined,
                  backgroundColor: activeTab === "checkin" ? `${themeColors.success}20` : undefined,
                }}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px]">Check-in</span>
              </TabsTrigger>
              <TabsTrigger
                value="workouts"
                className="flex-col gap-1 text-xs px-1"
                style={{
                  color: activeTab === "workouts" ? themeColors.secondary : undefined,
                  backgroundColor: activeTab === "workouts" ? `${themeColors.secondary}20` : undefined,
                }}
              >
                <Dumbbell className="w-4 h-4" />
                <span className="text-[10px]">Treinos</span>
              </TabsTrigger>
              <TabsTrigger
                value="running"
                className="flex-col gap-1 text-xs px-1"
                style={{
                  color: activeTab === "running" ? themeColors.accent : undefined,
                  backgroundColor: activeTab === "running" ? `${themeColors.accent}20` : undefined,
                }}
              >
                <Activity className="w-4 h-4" />
                <span className="text-[10px]">Corrida</span>
              </TabsTrigger>
              <TabsTrigger
                value="nutrition"
                className="flex-col gap-1 text-xs px-1"
                style={{
                  color: activeTab === "nutrition" ? themeColors.success : undefined,
                  backgroundColor: activeTab === "nutrition" ? `${themeColors.success}20` : undefined,
                }}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-[10px]">Nutrição</span>
              </TabsTrigger>
              <TabsTrigger
                value="measurements"
                className="flex-col gap-1 text-xs px-1"
                style={{
                  color: activeTab === "measurements" ? themeColors.primary : undefined,
                  backgroundColor: activeTab === "measurements" ? `${themeColors.primary}20` : undefined,
                }}
              >
                <Ruler className="w-4 h-4" />
                <span className="text-[10px]">Medidas</span>
              </TabsTrigger>
              <TabsTrigger
                value="hydration"
                className="flex-col gap-1 text-xs px-1"
                style={{
                  color: activeTab === "hydration" ? themeColors.accent : undefined,
                  backgroundColor: activeTab === "hydration" ? `${themeColors.accent}20` : undefined,
                }}
              >
                <Droplet className="w-4 h-4" />
                <span className="text-[10px]">Água</span>
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="flex-col gap-1 text-xs px-1"
                style={{
                  color: activeTab === "stats" ? themeColors.secondary : undefined,
                  backgroundColor: activeTab === "stats" ? `${themeColors.secondary}20` : undefined,
                }}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-[10px]">Stats</span>
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="flex-col gap-1 text-xs px-1"
                style={{
                  color: activeTab === "profile" ? themeColors.primary : undefined,
                  backgroundColor: activeTab === "profile" ? `${themeColors.primary}20` : undefined,
                }}
              >
                <User className="w-4 h-4" />
                <span className="text-[10px]">Perfil</span>
              </TabsTrigger>
              {profile.id === "kleber" && (
                <TabsTrigger
                  value="calisthenics"
                  className="flex-col gap-1 text-xs px-1"
                  style={{
                    color: activeTab === "calisthenics" ? themeColors.warning : undefined,
                    backgroundColor: activeTab === "calisthenics" ? `${themeColors.warning}20` : undefined,
                  }}
                >
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px]">Calis</span>
                </TabsTrigger>
              )}
            </TabsList>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <TabsContent value="home" className="mt-0">
            <HomeTab userId={userId} onLogout={onLogout} />
          </TabsContent>
          <TabsContent value="checkin" className="mt-0">
            <CheckinTab userId={userId} />
          </TabsContent>
          <TabsContent value="workouts" className="mt-0">
            <WorkoutsTab userId={userId} />
          </TabsContent>
          <TabsContent value="running" className="mt-0">
            <RunningTab userId={userId} />
          </TabsContent>
          <TabsContent value="nutrition" className="mt-0">
            <NutritionTab userId={userId} />
          </TabsContent>
          <TabsContent value="measurements" className="mt-0">
            <MeasurementsTab userId={userId} />
          </TabsContent>
          <TabsContent value="hydration" className="mt-0">
            <HydrationTab userId={userId} />
          </TabsContent>
          <TabsContent value="stats" className="mt-0">
            <StatsTab userId={userId} />
          </TabsContent>
          <TabsContent value="profile" className="mt-0">
            <ProfileTab userId={userId} onLogout={onLogout} />
          </TabsContent>
          {profile.id === "kleber" && (
            <TabsContent value="calisthenics" className="mt-0">
              <CalisthenicsTab userId={userId} />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  )
}
