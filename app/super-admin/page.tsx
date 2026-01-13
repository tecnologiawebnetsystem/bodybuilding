"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users, UserCheck, BarChart3 } from "lucide-react"

export default function SuperAdminPage() {
  const [stats, setStats] = useState({ totalGyms: 0, totalTrainers: 0, totalStudents: 0, topGyms: [] })
  const [view, setView] = useState<"dashboard" | "gyms" | "trainers">("dashboard")

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    const res = await fetch("/api/super-admin/stats")
    const data = await res.json()
    setStats(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Painel Super Admin</h1>
          <p className="text-slate-600">Sistema de Gestão FitTransform SaaS</p>
          <p className="text-sm text-slate-500 mt-1">Usuário: superadmin | PIN: 999999</p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={view === "dashboard" ? "default" : "outline"}
            onClick={() => setView("dashboard")}
            className="gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </Button>
          <Button variant={view === "gyms" ? "default" : "outline"} onClick={() => setView("gyms")} className="gap-2">
            <Building2 className="h-4 w-4" />
            Academias
          </Button>
          <Button
            variant={view === "trainers" ? "default" : "outline"}
            onClick={() => setView("trainers")}
            className="gap-2"
          >
            <UserCheck className="h-4 w-4" />
            Personal Trainers
          </Button>
        </div>

        {view === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total de Academias</CardTitle>
                <Building2 className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalGyms}</div>
                <p className="text-xs text-muted-foreground mt-1">Academias ativas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Personal Trainers</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalTrainers}</div>
                <p className="text-xs text-muted-foreground mt-1">Trainers cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalStudents}</div>
                <p className="text-xs text-muted-foreground mt-1">Alunos no sistema</p>
              </CardContent>
            </Card>
          </div>
        )}

        {view === "dashboard" && (
          <Card>
            <CardHeader>
              <CardTitle>Top Academias por Alunos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topGyms.map((gym: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">{gym.gym_name}</span>
                    <span className="text-sm text-slate-600">{gym.students} alunos</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {view === "gyms" && (
          <div>
            <p className="text-slate-600 p-4 bg-white rounded-lg">Gestão de Academias - Em desenvolvimento</p>
          </div>
        )}

        {view === "trainers" && (
          <div>
            <p className="text-slate-600 p-4 bg-white rounded-lg">Gestão de Personal Trainers - Em desenvolvimento</p>
          </div>
        )}
      </div>
    </div>
  )
}
