"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Trophy, Building2, DumbbellIcon, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { UserRole } from "@/lib/user-roles"

interface MoreTabProps {
  userId: string
  preferences: {
    theme_primary: string
    theme_secondary: string
    theme_accent: string
  }
}

export function MoreTab({ userId, preferences }: MoreTabProps) {
  const [userRole, setUserRole] = useState<UserRole>("student")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const response = await fetch(`/api/user/role?userId=${userId}`)
        const data = await response.json()
        setUserRole(data.role || "student")
      } catch (error) {
        console.error("Erro ao buscar role:", error)
        setUserRole("student")
      } finally {
        setLoading(false)
      }
    }
    fetchUserRole()
  }, [userId])

  const allFeatures = [
    {
      id: "achievements",
      title: "Conquistas e Badges",
      description: "Veja suas conquistas e badges desbloqueados",
      icon: Trophy,
      gradient: "from-amber-500 to-orange-600",
      link: "/achievements",
      roles: ["student", "trainer", "gym_owner", "admin"] as UserRole[],
    },
    {
      id: "gym_dashboard",
      title: "Dashboard da Academia",
      description: "Painel completo para academias parceiras",
      icon: Building2,
      gradient: "from-violet-500 to-purple-600",
      link: "/gym-dashboard",
      badge: "B2B",
      badgeColor: "bg-violet-100 text-violet-700",
      roles: ["gym_owner", "admin"] as UserRole[], // Apenas gym_owner e admin
    },
    {
      id: "trainer",
      title: "Painel Personal Trainer",
      description: "Gerencie seus alunos e treinos personalizados",
      icon: DumbbellIcon,
      gradient: "from-pink-500 to-rose-600",
      link: "/trainer",
      badge: "Pro",
      badgeColor: "bg-pink-100 text-pink-700",
      roles: ["trainer", "gym_owner", "admin"] as UserRole[], // Apenas trainer, gym_owner e admin
    },
    {
      id: "privacy",
      title: "Privacidade e LGPD",
      description: "Gerencie seus dados e privacidade",
      icon: Shield,
      gradient: "from-slate-500 to-gray-600",
      link: "/privacy",
      roles: ["student", "trainer", "gym_owner", "admin"] as UserRole[], // Todos podem acessar
    },
  ]

  const features = allFeatures.filter((feature) => feature.roles.includes(userRole))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 -m-6 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando recursos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 -m-6 p-6">
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-slate-700">
            {userRole === "student" && "Conta de Aluno"}
            {userRole === "trainer" && "Conta Personal Trainer"}
            {userRole === "gym_owner" && "Conta Academia"}
            {userRole === "admin" && "Conta Administrador"}
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Explore Mais Funcionalidades
        </h1>
        <p className="text-slate-600 text-lg">Acesse todos os recursos do FitTransform</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Link key={feature.id} href={feature.link}>
              <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 bg-white h-full">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <CardHeader className="relative space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {feature.badge && (
                      <Badge className={`${feature.badgeColor} border-0 font-medium`}>{feature.badge}</Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600 leading-relaxed">{feature.description}</CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="relative">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className={`bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                      Acessar agora
                    </span>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-emerald-100">Recursos Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{features.length} Módulos</div>
            <p className="text-sm text-emerald-100 mt-1">Personalizados para você</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-amber-100">Gamificação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">15 Conquistas</div>
            <p className="text-sm text-amber-100 mt-1">Desbloqueie todas!</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-100">Conformidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">LGPD 100%</div>
            <p className="text-sm text-blue-100 mt-1">Seus dados protegidos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
