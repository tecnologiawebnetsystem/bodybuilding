"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users, TrendingUp, MapPin, Mail, Award, Dumbbell } from "lucide-react"

interface WelcomeDashboardProps {
  userData: {
    user: {
      userId: string
      name: string
      email: string
      role: string
      gym: {
        id: number
        name: string
        city: string
        state: string
        email: string
      } | null
    }
    stats: any
  }
  onContinue: () => void
}

export function WelcomeDashboard({ userData, onContinue }: WelcomeDashboardProps) {
  const { user, stats } = userData
  const isSuperAdmin = user.role === "super_admin"
  const isGymAdmin = user.role === "gym_admin"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header de Boas-vindas */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Bem-vindo, {user.name}!</h1>
          <p className="text-lg text-slate-600">
            {isSuperAdmin && "Você está conectado como Super Administrador"}
            {isGymAdmin && user.gym && `Academia ${user.gym.name}`}
          </p>
        </div>

        {/* Informações da Academia */}
        {user.gym && (
          <Card className="p-6 mb-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">{user.gym.name}</h2>
                    <p className="text-blue-100">Sua Academia</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {user.gym.city}, {user.gym.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.gym.email}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <Award className="w-12 h-12" />
              </div>
            </div>
          </Card>
        )}

        {/* Estatísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {isSuperAdmin && (
            <>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <Building2 className="w-10 h-10 text-blue-600" />
                  <span className="text-3xl font-bold text-slate-900">{stats.totalGyms}</span>
                </div>
                <h3 className="text-sm font-medium text-slate-600">Academias Ativas</h3>
                <p className="text-xs text-slate-500 mt-1">Total de academias no sistema</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <Dumbbell className="w-10 h-10 text-green-600" />
                  <span className="text-3xl font-bold text-slate-900">{stats.totalTrainers}</span>
                </div>
                <h3 className="text-sm font-medium text-slate-600">Personal Trainers</h3>
                <p className="text-xs text-slate-500 mt-1">Total de trainers cadastrados</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-10 h-10 text-purple-600" />
                  <span className="text-3xl font-bold text-slate-900">{stats.totalStudents}</span>
                </div>
                <h3 className="text-sm font-medium text-slate-600">Alunos Totais</h3>
                <p className="text-xs text-slate-500 mt-1">Todos os alunos do sistema</p>
              </Card>
            </>
          )}

          {isGymAdmin && (
            <>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-10 h-10 text-blue-600" />
                  <span className="text-3xl font-bold text-slate-900">{stats.totalStudents}</span>
                </div>
                <h3 className="text-sm font-medium text-slate-600">Alunos Cadastrados</h3>
                <p className="text-xs text-slate-500 mt-1">Total de alunos na sua academia</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <Award className="w-10 h-10 text-green-600" />
                  <span className="text-3xl font-bold text-slate-900">{stats.activeEnrollments}</span>
                </div>
                <h3 className="text-sm font-medium text-slate-600">Matrículas Ativas</h3>
                <p className="text-xs text-slate-500 mt-1">Alunos com matrícula ativa</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-10 h-10 text-purple-600" />
                  <span className="text-3xl font-bold text-slate-900">R$ {stats.monthlyRevenue?.toFixed(2)}</span>
                </div>
                <h3 className="text-sm font-medium text-slate-600">Receita Mensal</h3>
                <p className="text-xs text-slate-500 mt-1">Mensalidades ativas</p>
              </Card>
            </>
          )}
        </div>

        {/* Botão de Continuar */}
        <div className="text-center">
          <Button size="lg" onClick={onContinue} className="px-8">
            Acessar Painel de Gestão
          </Button>
          <p className="text-sm text-slate-500 mt-4">Você será redirecionado para o painel completo de administração</p>
        </div>
      </div>
    </div>
  )
}
