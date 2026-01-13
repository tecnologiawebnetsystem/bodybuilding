"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  DollarSign,
  CreditCard,
  Calendar,
  TrendingUp,
  TrendingDown,
  UserCheck,
  Building2,
  Receipt,
  Briefcase,
} from "lucide-react"
import Link from "next/link"

export default function GymAdminPage() {
  const [stats, setStats] = useState({
    activeStudents: 0,
    monthlyRevenue: 0,
    monthlyExpenses: 0,
    pendingPayments: 0,
    employees: 0,
    weeklyAttendance: 0,
  })

  return (
    <PageLayout backTo="/">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistema de Gestão - FitTransform</h1>
            <p className="text-gray-600">Painel completo para gerenciar sua academia</p>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8" />
                <TrendingUp className="w-5 h-5 opacity-80" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.activeStudents}</div>
              <div className="text-green-100">Alunos Ativos</div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8" />
                <TrendingUp className="w-5 h-5 opacity-80" />
              </div>
              <div className="text-3xl font-bold mb-1">R$ {stats.monthlyRevenue.toFixed(2)}</div>
              <div className="text-blue-100">Receita Mensal</div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-red-500 to-rose-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <Receipt className="w-8 h-8" />
                <TrendingDown className="w-5 h-5 opacity-80" />
              </div>
              <div className="text-3xl font-bold mb-1">R$ {stats.monthlyExpenses.toFixed(2)}</div>
              <div className="text-red-100">Despesas Mensais</div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-500 to-amber-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <CreditCard className="w-8 h-8" />
                <Calendar className="w-5 h-5 opacity-80" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.pendingPayments}</div>
              <div className="text-orange-100">Pagamentos Pendentes</div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-500 to-violet-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <Briefcase className="w-8 h-8" />
                <Users className="w-5 h-5 opacity-80" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.employees}</div>
              <div className="text-purple-100">Funcionários</div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <UserCheck className="w-8 h-8" />
                <TrendingUp className="w-5 h-5 opacity-80" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.weeklyAttendance}%</div>
              <div className="text-teal-100">Frequência Semanal</div>
            </Card>
          </div>

          {/* Management Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/gym-admin/students">
              <Card className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-500">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gestão de Alunos</h3>
                <p className="text-gray-600 text-sm mb-4">Cadastro, matrículas e controle de planos</p>
                <Button className="w-full">Acessar</Button>
              </Card>
            </Link>

            <Link href="/gym-admin/payments">
              <Card className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-green-500">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pagamentos de Alunos</h3>
                <p className="text-gray-600 text-sm mb-4">Mensalidades, inadimplência e cobranças</p>
                <Button className="w-full bg-green-600 hover:bg-green-700">Acessar</Button>
              </Card>
            </Link>

            <Link href="/gym-admin/plans">
              <Card className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-500">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mb-4">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Planos de Mensalidade</h3>
                <p className="text-gray-600 text-sm mb-4">Criar e gerenciar planos e valores</p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Acessar</Button>
              </Card>
            </Link>

            <Link href="/gym-admin/payment-methods">
              <Card className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-orange-500">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-4">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Formas de Pagamento</h3>
                <p className="text-gray-600 text-sm mb-4">Gerenciar métodos aceitos pela academia</p>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">Acessar</Button>
              </Card>
            </Link>

            <Link href="/gym-admin/employees">
              <Card className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-indigo-500">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-4">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Funcionários</h3>
                <p className="text-gray-600 text-sm mb-4">Cadastro, salários e folha de pagamento</p>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Acessar</Button>
              </Card>
            </Link>

            <Link href="/gym-admin/expenses">
              <Card className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-red-500">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mb-4">
                  <Receipt className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Despesas</h3>
                <p className="text-gray-600 text-sm mb-4">Controle de gastos operacionais</p>
                <Button className="w-full bg-red-600 hover:bg-red-700">Acessar</Button>
              </Card>
            </Link>

            <Link href="/gym-admin/attendance">
              <Card className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-teal-500">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mb-4">
                  <UserCheck className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Frequência</h3>
                <p className="text-gray-600 text-sm mb-4">Monitorar presença dos alunos</p>
                <Button className="w-full bg-teal-600 hover:bg-teal-700">Acessar</Button>
              </Card>
            </Link>

            <Link href="/gym-admin/reports">
              <Card className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-pink-500">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-4">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Relatórios</h3>
                <p className="text-gray-600 text-sm mb-4">Análises financeiras e operacionais</p>
                <Button className="w-full bg-pink-600 hover:bg-pink-700">Acessar</Button>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
