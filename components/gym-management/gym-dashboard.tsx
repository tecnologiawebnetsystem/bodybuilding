"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Users, DollarSign, TrendingUp, TrendingDown, Calendar, Briefcase, UserCheck } from "lucide-react"

interface DashboardStats {
  totalStudents: number // Adicionado total de alunos
  activeStudents: number
  totalRevenue: number
  totalExpenses: number
  pendingPayments: number
  employees: number
  weeklyAttendance: number
}

export function GymDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeStudents: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    pendingPayments: 0,
    employees: 0,
    weeklyAttendance: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      const response = await fetch("/api/gym-admin/dashboard-stats")
      const data = await response.json()
      setStats({
        totalStudents: Number(data.totalStudents) || 0,
        activeStudents: Number(data.activeStudents) || 0,
        totalRevenue: Number(data.totalRevenue) || 0,
        totalExpenses: Number(data.totalExpenses) || 0,
        pendingPayments: Number(data.pendingPayments) || 0,
        employees: Number(data.employees) || 0,
        weeklyAttendance: Number(data.weeklyAttendance) || 0,
      })
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    {
      title: "Total de Alunos",
      value: stats.totalStudents,
      icon: Users,
      color: "from-indigo-500 to-indigo-600",
      textColor: "text-indigo-600",
    },
    {
      title: "Alunos Ativos",
      value: stats.activeStudents,
      icon: UserCheck,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
    },
    {
      title: "Receita Mensal",
      value: `R$ ${stats.totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      textColor: "text-green-600",
    },
    {
      title: "Despesas Mensais",
      value: `R$ ${stats.totalExpenses.toFixed(2)}`,
      icon: TrendingDown,
      color: "from-red-500 to-red-600",
      textColor: "text-red-600",
    },
    {
      title: "Pagamentos Pendentes",
      value: stats.pendingPayments,
      icon: DollarSign,
      color: "from-yellow-500 to-yellow-600",
      textColor: "text-yellow-600",
    },
    {
      title: "Funcionários",
      value: stats.employees,
      icon: Briefcase,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600",
    },
    {
      title: "Frequência Semanal",
      value: `${stats.weeklyAttendance.toFixed(0)}%`,
      icon: Calendar,
      color: "from-cyan-500 to-cyan-600",
      textColor: "text-cyan-600",
    },
  ]

  if (loading) {
    return <div className="p-8">Carregando...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-600">Visão geral da academia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Financial Summary */}
      <Card className="mt-8 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Resumo Financeiro</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200">
            <span className="text-slate-600">Receita Total</span>
            <span className="text-lg font-bold text-green-600">R$ {stats.totalRevenue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-slate-200">
            <span className="text-slate-600">Despesas Totais</span>
            <span className="text-lg font-bold text-red-600">R$ {stats.totalExpenses.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-900 font-medium">Saldo</span>
            <span
              className={`text-xl font-bold ${stats.totalRevenue - stats.totalExpenses >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              R$ {(stats.totalRevenue - stats.totalExpenses).toFixed(2)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
