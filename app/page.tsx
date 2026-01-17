import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dumbbell, Users, TrendingUp, Calendar, Smartphone, CheckCircle, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-gray-950/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">FitTransform</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-300 hover:text-white transition">
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
            <Link href="/login" className="text-gray-300 hover:text-white transition">
              Fazer Login
            </Link>
            <Button size="sm" className="bg-gradient-to-r from-red-600 to-orange-500">
              <Link href="/app-mobile">Experimentar App</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-block mb-4 px-4 py-2 bg-white/5 rounded-full border border-white/10">
          <span className="text-sm text-gray-300">🚀 Sistema Completo de Gestão para Academias</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Transforme a <br />
          <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Gestão da Sua Academia
          </span>
        </h1>

        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Sistema CRM completo para academias e personal trainers. Gerencie alunos, treinos, pagamentos e expanda seu
          negócio em um só lugar.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6">
            <Link href="/get-started" className="flex items-center gap-2">
              Começar Agora <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/5 text-lg px-8 py-6 bg-transparent"
          >
            <Link href="#features">Ver Funcionalidades</Link>
          </Button>
        </div>

        {/* App Download Buttons */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <p className="text-gray-400 text-sm">Baixe o Aplicativo Mobile</p>
          <div className="flex gap-4">
            <Link
              href="/app-mobile"
              className="flex items-center gap-3 px-6 py-3 bg-black border border-white/20 rounded-xl hover:bg-white/5 transition"
            >
              <Smartphone className="w-6 h-6 text-white" />
              <div className="text-left">
                <p className="text-xs text-gray-400">Disponível no</p>
                <p className="text-sm font-semibold text-white">Google Play</p>
              </div>
            </Link>
            <Link
              href="/app-mobile"
              className="flex items-center gap-3 px-6 py-3 bg-black border border-white/20 rounded-xl hover:bg-white/5 transition"
            >
              <Smartphone className="w-6 h-6 text-white" />
              <div className="text-left">
                <p className="text-xs text-gray-400">Disponível na</p>
                <p className="text-sm font-semibold text-white">App Store</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Tudo que Você Precisa</h2>
          <p className="text-gray-400 text-lg">Gestão completa de academia em uma plataforma poderosa</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: "Gestão de Alunos",
              desc: "CRM completo com acompanhamento de leads, contratos e comunicações automatizadas",
            },
            {
              icon: Dumbbell,
              title: "Planejamento de Treinos",
              desc: "Geração de treinos com IA e acompanhamento detalhado de exercícios para cada aluno",
            },
            {
              icon: TrendingUp,
              title: "Relatórios Financeiros",
              desc: "Análises avançadas com acompanhamento de receitas, despesas e análise de lucro",
            },
            {
              icon: Calendar,
              title: "Agendamento de Aulas",
              desc: "Gestão de aulas coletivas com sistema de reservas e controle de capacidade",
            },
            {
              icon: CheckCircle,
              title: "Check-in QR Code",
              desc: "Check-in rápido de alunos com leitura de QR code e rastreamento de frequência",
            },
            {
              icon: Smartphone,
              title: "App Mobile",
              desc: "Aplicativos nativos iOS e Android para alunos acompanharem progresso em qualquer lugar",
            },
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition">
              <feature.icon className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About the App Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 bg-white/5 rounded-3xl my-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Sobre o FitTransform</h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            O FitTransform é uma plataforma completa de gestão para academias, criada para simplificar e otimizar todos
            os aspectos do seu negócio fitness
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">🎯 Para Donos de Academia</h3>
              <p className="text-gray-400">
                Gerencie múltiplas unidades, controle financeiro completo, relatórios avançados, gestão de equipe e
                muito mais. Tudo em um só lugar com interface intuitiva e moderna.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-3">💪 Para Personal Trainers</h3>
              <p className="text-gray-400">
                Portal exclusivo para criar treinos personalizados com IA, acompanhar evolução dos alunos, gerenciar
                horários e receber pagamentos de forma automatizada.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-3">📱 Para Alunos</h3>
              <p className="text-gray-400">
                App mobile completo para visualizar treinos, marcar presença com QR code, reservar aulas coletivas e
                acompanhar progresso físico em tempo real.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl">
              <h4 className="text-lg font-semibold text-white mb-2">✅ Sistema Multi-Tenant</h4>
              <p className="text-gray-300 text-sm">Perfeito para redes com várias unidades</p>
            </div>

            <div className="p-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl">
              <h4 className="text-lg font-semibold text-white mb-2">🤖 Inteligência Artificial</h4>
              <p className="text-gray-300 text-sm">Geração automática de treinos personalizados</p>
            </div>

            <div className="p-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl">
              <h4 className="text-lg font-semibold text-white mb-2">💳 Pagamentos Integrados</h4>
              <p className="text-gray-300 text-sm">Cobrança automatizada com boletos e PIX</p>
            </div>

            <div className="p-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl">
              <h4 className="text-lg font-semibold text-white mb-2">📊 Analytics Completo</h4>
              <p className="text-gray-300 text-sm">Dashboards e relatórios financeiros detalhados</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white text-lg px-12 py-6"
          >
            <Link href="/get-started" className="flex items-center gap-2">
              Começar Agora <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">FitTransform</span>
              </div>
              <p className="text-gray-400 text-sm">Sistema completo de gestão para academias e personal trainers.</p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-gray-400 hover:text-white transition text-sm">
                    Funcionalidades
                  </Link>
                </li>
                <li>
                  <Link href="/get-started" className="text-gray-400 hover:text-white transition text-sm">
                    Começar Agora
                  </Link>
                </li>
                <li>
                  <Link href="/app-mobile" className="text-gray-400 hover:text-white transition text-sm">
                    App Mobile
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Conteúdo</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition text-sm">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog?categoria=academia-treino"
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    Dicas de Treino
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog?categoria=alimentacao"
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    Nutrição
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/sobre-nos" className="text-gray-400 hover:text-white transition text-sm">
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="/contato" className="text-gray-400 hover:text-white transition text-sm">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2026 FitTransform. Todos os direitos reservados.</p>
            <p className="text-gray-500 text-xs mt-2">
              Desenvolvido por{" "}
              <Link href="/sobre-nos" className="text-orange-500 hover:text-orange-400">
                Web NetSystem
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
