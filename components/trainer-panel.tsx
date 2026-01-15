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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Portal Personal Trainer</h1>
            <p className="text-xs text-slate-600">Gestão de Clientes</p>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-auto px-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Buscar alunos, treinos..."
              className="pl-10 bg-slate-50 border-slate-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-slate-600" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full text-[10px] text-white flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                {trainerName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium text-slate-900">{trainerName}</p>
              <p className="text-xs text-slate-600">Personal Trainer</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
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
                        ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-medium shadow-sm"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-transform group-hover:scale-110 flex-shrink-0 ${isActive ? "text-blue-600" : "text-slate-500"}`}
                    />
                    <span className="text-sm flex-1">{item.label}</span>
                    {isActive && (
                      <>
                        <ChevronRight className="w-4 h-4 text-blue-600" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"></div>
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          </nav>

          <div className="p-4 border-t border-slate-200">
            <Button
              variant="outline"
              className="w-full bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
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
