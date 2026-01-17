"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Briefcase,
  UserCheck,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface DashboardStats {
  totalStudents: number
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
      change: "+5%",
      up: true,
    },
    {
      title: "Alunos Ativos",
      value: stats.activeStudents,
      icon: UserCheck,
      color: "from-blue-500 to-blue-600",
      change: "+12%",
      up: true,
    },
    {
      title: "Receita Mensal",
      value: `R$ ${stats.totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      change: "+8%",
      up: true,
    },
    {
      title: "Despesas Mensais",
      value: `R$ ${stats.totalExpenses.toFixed(2)}`,
      icon: TrendingDown,
      color: "from-red-500 to-red-600",
      change: "-3%",
      up: false,
    },
    {
      title: "Pagamentos Pendentes",
      value: stats.pendingPayments,
      icon: DollarSign,
      color: "from-yellow-500 to-yellow-600",
      change: "+2",
      up: false,
    },
    {
      title: "Funcionários",
      value: stats.employees,
      icon: Briefcase,
      color: "from-purple-500 to-purple-600",
      change: "0",
      up: true,
    },
    {
      title: "Frequência Semanal",
      value: `${stats.weeklyAttendance.toFixed(0)}%`,
      icon: Calendar,
      color: "from-cyan-500 to-cyan-600",
      change: "+4%",
      up: true,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Visão Geral</h2>
        <p className="text-gray-400 text-sm">Resumo da performance da academia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className="bg-white/[0.03] border-white/[0.08] p-5 hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.up ? (
                      <ArrowUpRight className="w-3 h-3 text-green-400" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-xs ${stat.up ? "text-green-400" : "text-red-400"}`}>{stat.change}</span>
                    <span className="text-xs text-gray-500">vs mês anterior</span>
                  </div>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="bg-white/[0.03] border-white/[0.08] p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Resumo Financeiro</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
            <span className="text-gray-400">Receita Total</span>
            <span className="text-lg font-bold text-green-400">R$ {stats.totalRevenue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
            <span className="text-gray-400">Despesas Totais</span>
            <span className="text-lg font-bold text-red-400">R$ {stats.totalExpenses.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">Saldo</span>
            <span
              className={`text-xl font-bold ${stats.totalRevenue - stats.totalExpenses >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              R$ {(stats.totalRevenue - stats.totalExpenses).toFixed(2)}
            </span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-white/[0.03] border-white/[0.08] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            {[
              { action: "Novo aluno matriculado", time: "há 2 horas", type: "success" },
              { action: "Pagamento recebido - R$ 149,90", time: "há 3 horas", type: "success" },
              { action: "Check-in realizado", time: "há 4 horas", type: "info" },
              { action: "Aluno cancelou matrícula", time: "há 1 dia", type: "warning" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.type === "success"
                        ? "bg-green-400"
                        : item.type === "warning"
                          ? "bg-yellow-400"
                          : "bg-blue-400"
                    }`}
                  />
                  <span className="text-sm text-gray-300">{item.action}</span>
                </div>
                <span className="text-xs text-gray-500">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-white/[0.03] border-white/[0.08] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Metas do Mês</h3>
          <div className="space-y-4">
            {[
              { label: "Novos Alunos", current: 12, target: 20, color: "bg-orange-500" },
              { label: "Receita", current: 42500, target: 50000, color: "bg-green-500", isMoney: true },
              { label: "Retenção", current: 85, target: 90, color: "bg-blue-500", isPercent: true },
            ].map((goal, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{goal.label}</span>
                  <span className="text-white">
                    {goal.isMoney ? `R$ ${goal.current.toLocaleString()}` : goal.current}
                    {goal.isPercent && "%"} / {goal.isMoney ? `R$ ${goal.target.toLocaleString()}` : goal.target}
                    {goal.isPercent && "%"}
                  </span>
                </div>
                <div className="w-full bg-white/[0.1] rounded-full h-2">
                  <div
                    className={`${goal.color} h-2 rounded-full transition-all`}
                    style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
