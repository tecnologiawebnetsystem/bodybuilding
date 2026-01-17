"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  LogOut,
  DollarSign,
  MessageSquare,
  ChevronRight,
  Search,
  Bell,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import TrainerDashboard from "@/components/trainer-dashboard"
import { TrainerClientsManagement } from "@/components/trainer-management/clients-management"
import { TrainerWorkoutsManagement } from "@/components/trainer-management/workouts-management"
import { TrainerFinancials } from "@/components/trainer-management/financials"
import { TrainerMessages } from "@/components/trainer-management/messages"

type MenuOption = "dashboard" | "clients" | "workouts" | "financials" | "messages"

export function TrainerPanel({
  trainerName,
  trainerId,
  onLogout,
}: { trainerName: string; trainerId: string; onLogout: () => void }) {
  const [activeMenu, setActiveMenu] = useState<MenuOption>("dashboard")
  const [notifications, setNotifications] = useState(2)

  const menuItems = [
    { id: "dashboard" as MenuOption, label: "Dashboard", icon: LayoutDashboard },
    { id: "clients" as MenuOption, label: "Meus Alunos", icon: Users },
    { id: "workouts" as MenuOption, label: "Treinos", icon: Dumbbell },
    { id: "financials" as MenuOption, label: "Financeiro", icon: DollarSign },
    { id: "messages" as MenuOption, label: "Mensagens", icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col">
      <header className="bg-black/40 backdrop-blur-sm border-b border-white/10 h-16 flex items-center px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Portal Personal Trainer</h1>
            <p className="text-xs text-gray-400">Gestão de Clientes</p>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-auto px-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar alunos, treinos..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative hover:bg-white/10">
            <Bell className="w-5 h-5 text-gray-300" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-[10px] text-white flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>

          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
                {trainerName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium text-white">{trainerName}</p>
              <p className="text-xs text-gray-400">Personal Trainer</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 bg-black/40 backdrop-blur-sm border-r border-white/10 flex flex-col">
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeMenu === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all group relative ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500/20 to-red-600/20 text-white font-medium border border-orange-500/30"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-transform group-hover:scale-110 flex-shrink-0 ${isActive ? "text-orange-500" : "text-gray-400"}`}
                    />
                    <span className="text-sm flex-1">{item.label}</span>
                    {isActive && (
                      <>
                        <ChevronRight className="w-4 h-4 text-orange-500" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-r-full"></div>
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          </nav>

          <div className="p-4 border-t border-white/10">
            <Button
              variant="outline"
              className="w-full bg-white/5 hover:bg-white/10 text-white border-white/20 hover:border-white/30 transition-colors"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="p-8 min-h-full">
            {activeMenu === "dashboard" && <TrainerDashboard trainerId={trainerId} />}
            {activeMenu === "clients" && <TrainerClientsManagement trainerId={trainerId} />}
            {activeMenu === "workouts" && <TrainerWorkoutsManagement trainerId={trainerId} />}
            {activeMenu === "financials" && <TrainerFinancials trainerId={trainerId} />}
            {activeMenu === "messages" && <TrainerMessages trainerId={trainerId} />}
          </div>
        </main>
      </div>
    </div>
  )
}
