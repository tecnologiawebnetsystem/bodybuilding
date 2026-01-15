"use client"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Dumbbell, Users, Shield, UserCircle, ArrowRight } from "lucide-react"

export default function LoginSelectionPage() {
  const profiles = [
    {
      type: "student",
      title: "Sou Aluno",
      description: "Acesse seus treinos, acompanhe sua evolução e reserve aulas",
      icon: UserCircle,
      href: "/app-mobile",
      color: "from-blue-600 to-cyan-500",
    },
    {
      type: "trainer",
      title: "Sou Personal Trainer",
      description: "Gerencie seus clientes, crie treinos e acompanhe resultados",
      icon: Dumbbell,
      href: "/trainer",
      color: "from-green-600 to-emerald-500",
    },
    {
      type: "admin",
      title: "Sou Admin da Academia",
      description: "Gestão completa: alunos, financeiro, treinos e relatórios",
      icon: Users,
      href: "/admin",
      color: "from-orange-600 to-red-500",
    },
    {
      type: "super_admin",
      title: "Sou Super Admin",
      description: "Gerenciar todas as academias e personal trainers do sistema",
      icon: Shield,
      href: "/super-admin",
      color: "from-purple-600 to-pink-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
            <Dumbbell className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Bem-vindo ao FitTransform</h1>
        <p className="text-gray-400 text-lg">Selecione como você deseja acessar o sistema</p>
      </div>

      {/* Profile Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
        {profiles.map((profile) => (
          <Link key={profile.type} href={profile.href}>
            <Card className="p-8 bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group h-full">
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${profile.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <profile.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{profile.title}</h3>
              <p className="text-gray-400 mb-6">{profile.description}</p>
              <div className="flex items-center gap-2 text-orange-500 font-semibold group-hover:gap-4 transition-all">
                Acessar <ArrowRight className="w-5 h-5" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Back to Home */}
      <Link href="/" className="mt-12 text-gray-400 hover:text-white transition">
        ← Voltar para página inicial
      </Link>
    </div>
  )
}
