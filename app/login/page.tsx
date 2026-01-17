"use client"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Dumbbell, Users, UserCircle, ArrowRight, Menu, X } from "lucide-react"
import { useState } from "react"

export default function LoginSelectionPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const profiles = [
    {
      type: "student",
      title: "Sou Aluno",
      description: "Acesse seus treinos, acompanhe sua evolução e reserve aulas na sua academia",
      icon: UserCircle,
      href: "/app-mobile",
      color: "from-blue-600 to-cyan-500",
      features: ["Treinos personalizados", "Histórico de evolução", "Reserva de aulas", "Controle de água e nutrição"],
    },
    {
      type: "trainer",
      title: "Sou Personal Trainer",
      description: "Gerencie seus clientes de forma independente, crie treinos e acompanhe resultados",
      icon: Dumbbell,
      href: "/app-mobile",
      color: "from-green-600 to-emerald-500",
      features: ["Gestão de alunos", "Treinos por modalidade", "Locais de atendimento", "Controle financeiro"],
    },
    {
      type: "admin",
      title: "Sou Dono de Academia",
      description: "Gestão completa da sua academia: alunos, financeiro, treinos e relatórios",
      icon: Users,
      href: "/app-mobile",
      color: "from-orange-600 to-red-500",
      features: ["Gestão de alunos", "Controle financeiro", "Relatórios completos", "Treinos com IA"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                Fit
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                  Transform
                </span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/#funcionalidades" className="text-gray-300 hover:text-white transition">
                Funcionalidades
              </Link>
              <Link href="/blog" className="text-gray-300 hover:text-white transition">
                Blog
              </Link>
              <Link href="/sobre-nos" className="text-gray-300 hover:text-white transition">
                Sobre Nós
              </Link>
              <Link href="/contato" className="text-gray-300 hover:text-white transition">
                Contato
              </Link>
              <Link
                href="/get-started"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:from-red-700 hover:to-orange-600 transition shadow-lg"
              >
                Criar Conta
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden pt-4 pb-2 space-y-3">
              <Link href="/#funcionalidades" className="block text-gray-300 hover:text-white transition py-2">
                Funcionalidades
              </Link>
              <Link href="/blog" className="block text-gray-300 hover:text-white transition py-2">
                Blog
              </Link>
              <Link href="/sobre-nos" className="block text-gray-300 hover:text-white transition py-2">
                Sobre Nós
              </Link>
              <Link href="/contato" className="block text-gray-300 hover:text-white transition py-2">
                Contato
              </Link>
              <Link
                href="/get-started"
                className="block text-center px-6 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold"
              >
                Criar Conta
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-600/20 to-orange-500/20 border border-orange-500/30 mb-6">
              <span className="text-orange-400 text-sm font-medium">Acesso ao Sistema</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Como você deseja{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">acessar</span>
              ?
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Selecione seu perfil para entrar no sistema. Cada perfil oferece funcionalidades específicas para suas
              necessidades.
            </p>
          </div>

          {/* Profile Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {profiles.map((profile) => (
              <Link key={profile.type} href={profile.href}>
                <Card className="p-8 bg-white/5 border-white/10 hover:bg-white/10 hover:border-orange-500/30 transition-all duration-300 cursor-pointer group h-full flex flex-col">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${profile.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <profile.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{profile.title}</h3>
                  <p className="text-gray-400 mb-6 flex-grow">{profile.description}</p>

                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    {profile.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-300 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-2 text-orange-500 font-semibold group-hover:gap-4 transition-all mt-auto">
                    Acessar <ArrowRight className="w-5 h-5" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-16 text-center">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-3">Ainda não tem conta?</h3>
              <p className="text-gray-400 mb-6">
                Crie sua conta gratuitamente e comece a usar o FitTransform hoje mesmo. Academias, personal trainers e
                alunos são bem-vindos!
              </p>
              <Link
                href="/get-started"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold hover:from-red-700 hover:to-orange-600 transition shadow-lg"
              >
                Criar Minha Conta <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link href="/" className="text-gray-400 hover:text-white transition inline-flex items-center gap-2">
              ← Voltar para página inicial
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2025 FitTransform. Desenvolvido por{" "}
            <Link href="/sobre-nos" className="text-orange-500 hover:text-orange-400 transition">
              Web NetSystem
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
