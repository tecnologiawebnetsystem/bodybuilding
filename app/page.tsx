import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dumbbell, Users, TrendingUp, Calendar, Smartphone, CheckCircle, ArrowRight, Star, Play, Shield, Zap, Clock, CreditCard, BarChart3, Menu, BookOpen } from "lucide-react"
import { MobileMenu } from "@/components/mobile-menu"
import { Chatbot } from "@/components/chatbot"
import { OrganizationSchema, SoftwareApplicationSchema, WebsiteSchema, FAQSchema } from "@/components/seo/json-ld"

// FAQs para SEO
const faqs = [
  {
    question: "O que e o FitTransform?",
    answer: "FitTransform e a plataforma mais completa de gestao para academias e personal trainers do Brasil. Oferece gestao de alunos, treinos com IA, controle financeiro, agendamento e muito mais."
  },
  {
    question: "O FitTransform funciona em quais cidades?",
    answer: "O FitTransform atende academias em todo o Brasil, com forte presenca no Vale do Paraiba, incluindo Taubate, Cacapava, Pindamonhangaba, Sao Jose dos Campos, Jacarei e regiao."
  },
  {
    question: "Quanto custa o FitTransform?",
    answer: "O FitTransform oferece planos a partir de R$ 49,90/mes para personal trainers e R$ 149,90/mes para academias. Oferecemos teste gratuito de 14 dias sem necessidade de cartao de credito."
  },
  {
    question: "O FitTransform gera treinos automaticos?",
    answer: "Sim! O FitTransform utiliza Inteligencia Artificial para gerar treinos personalizados para cada aluno, considerando objetivos, nivel de experiencia, equipamentos disponiveis e restricoes."
  },
  {
    question: "Posso gerenciar multiplas unidades da academia?",
    answer: "Sim! O plano Enterprise permite gerenciar multiplas unidades com relatorios consolidados, controle de acesso por unidade e dashboard centralizado."
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Schema.org JSON-LD para SEO */}
      <OrganizationSchema />
      <SoftwareApplicationSchema />
      <WebsiteSchema />
      <FAQSchema faqs={faqs} />
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 py-2 px-4 text-center">
        <p className="text-white text-sm font-medium">
          Novidade: Gerador de Treinos com IA agora disponivel para todas as academias
          <Link href="/get-started" className="ml-2 underline hover:no-underline">Saiba mais</Link>
        </p>
      </div>

      {/* Header */}
      <header className="border-b border-white/[0.08] backdrop-blur-xl sticky top-0 z-50 bg-[#0a0a0a]/90">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">FitTransform</span>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="#features" className="text-gray-400 hover:text-white transition text-sm font-medium">
              Funcionalidades
            </Link>
            <Link href="/precos" className="text-gray-400 hover:text-white transition text-sm font-medium">
              Precos
            </Link>
            <Link href="#testimonials" className="text-gray-400 hover:text-white transition text-sm font-medium">
              Depoimentos
            </Link>
            <Link href="/blog" className="text-gray-400 hover:text-white transition text-sm font-medium">
              Blog
            </Link>
            <Link href="/sobre-nos" className="text-gray-400 hover:text-white transition text-sm font-medium">
              Sobre Nos
            </Link>
            <Link href="/contato" className="text-gray-400 hover:text-white transition text-sm font-medium">
              Contato
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/entrar" className="hidden md:block text-gray-300 hover:text-white transition text-sm font-medium">
              Entrar
            </Link>
            <Button className="hidden sm:flex bg-white text-black hover:bg-gray-100 font-semibold shadow-lg">
              <Link href="/precos">Ver Planos</Link>
            </Button>
            <MobileMenu />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-300">+500 academias ja utilizam o FitTransform</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
              A plataforma completa para{" "}
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent">
                sua academia
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Gerencie alunos, treinos, pagamentos e muito mais. Tudo em uma unica plataforma intuitiva e poderosa.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-8 h-14 font-semibold shadow-xl shadow-white/10 group">
                <Link href="/get-started" className="flex items-center gap-2">
                  Comecar Gratis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5 text-lg px-8 h-14 bg-transparent font-medium group"
              >
                <Link href="#demo" className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Ver Demo
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Dados protegidos</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-500" />
                <span>Sem cartao para testar</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Setup em 5 minutos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Metrics */}
      <section className="border-y border-white/[0.08] bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">500+</p>
              <p className="text-gray-500">Academias ativas</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">50k+</p>
              <p className="text-gray-500">Alunos cadastrados</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">98%</p>
              <p className="text-gray-500">Satisfacao dos clientes</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">R$2M+</p>
              <p className="text-gray-500">Processados/mes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-16 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-500 text-sm mb-8">Empresas que confiam no FitTransform</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale">
            <span className="text-2xl font-bold text-white">SmartFit</span>
            <span className="text-2xl font-bold text-white">BlueFit</span>
            <span className="text-2xl font-bold text-white">BodyTech</span>
            <span className="text-2xl font-bold text-white">Selfit</span>
            <span className="text-2xl font-bold text-white">Bio Ritmo</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-orange-500 font-semibold mb-4 text-sm uppercase tracking-wider">Funcionalidades</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Tudo que voce precisa em um so lugar</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Ferramentas poderosas para transformar a gestao da sua academia e impulsionar seus resultados</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Gestao de Alunos",
                desc: "CRM completo com leads, contratos e comunicacao automatizada",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Dumbbell,
                title: "Treinos com IA",
                desc: "Geracao automatica de treinos personalizados para cada aluno",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: BarChart3,
                title: "Relatorios Financeiros",
                desc: "DRE, fluxo de caixa, inadimplencia e projecoes",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Calendar,
                title: "Agendamento",
                desc: "Aulas coletivas, reservas e controle de capacidade",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Zap,
                title: "Check-in Rapido",
                desc: "QR Code e biometria para entrada de alunos",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Smartphone,
                title: "App Mobile",
                desc: "iOS e Android para alunos acompanharem tudo",
                color: "from-indigo-500 to-purple-500"
              },
            ].map((feature, i) => (
              <div key={i} className="group p-8 bg-white/[0.03] border border-white/[0.08] rounded-2xl hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 bg-gradient-to-b from-transparent via-orange-950/10 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-orange-500 font-semibold mb-4 text-sm uppercase tracking-wider">Depoimentos</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">O que nossos clientes dizem</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Carlos Silva",
                role: "Dono - Academia Power Fit",
                text: "Depois que implementamos o FitTransform, nossa retencao de alunos aumentou 40%. O sistema de cobranca automatica eliminou a inadimplencia.",
                rating: 5
              },
              {
                name: "Ana Oliveira",
                role: "Personal Trainer",
                text: "A geracao de treinos com IA economiza horas do meu trabalho. Meus alunos adoram acompanhar o progresso pelo app.",
                rating: 5
              },
              {
                name: "Roberto Santos",
                role: "Gerente - Rede FitLife",
                text: "Gerenciamos 5 unidades com facilidade. Os relatorios financeiros sao completos e nos ajudam a tomar decisoes estrategicas.",
                rating: 5
              },
            ].map((testimonial, i) => (
              <div key={i} className="p-8 bg-white/[0.03] border border-white/[0.08] rounded-2xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-orange-500 font-semibold mb-4 text-sm uppercase tracking-wider">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Perguntas Frequentes</h2>
            <p className="text-gray-400 text-lg">Tudo que voce precisa saber sobre o FitTransform</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-white font-medium text-left pr-4">{faq.question}</h3>
                  <span className="text-orange-500 group-open:rotate-180 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Pronto para transformar sua academia?</h2>
          <p className="text-xl text-gray-400 mb-12">Comece gratuitamente e veja os resultados em poucos dias</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-10 h-14 font-semibold">
              <Link href="/get-started" className="flex items-center gap-2">
                Comecar Gratis <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 text-lg px-10 h-14 bg-transparent">
              <Link href="/contato">Falar com Vendas</Link>
            </Button>
          </div>

          <p className="text-gray-500 text-sm">Sem cartao de credito. Cancele quando quiser.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">FitTransform</span>
              </div>
              <p className="text-gray-500 text-sm mb-6 max-w-xs">A plataforma mais completa para gestao de academias e personal trainers do Brasil.</p>
              <div className="flex gap-4">
                <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Produto</h4>
              <ul className="space-y-3">
                <li><Link href="#features" className="text-gray-500 hover:text-white transition text-sm">Funcionalidades</Link></li>
                <li><Link href="/get-started" className="text-gray-500 hover:text-white transition text-sm">Comecar Agora</Link></li>
                <li><Link href="/app-mobile" className="text-gray-500 hover:text-white transition text-sm">App Mobile</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-white transition text-sm">API</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Recursos</h4>
              <ul className="space-y-3">
                <li><Link href="/blog" className="text-gray-500 hover:text-white transition text-sm">Blog</Link></li>
                <li><Link href="/blog?categoria=academia-treino" className="text-gray-500 hover:text-white transition text-sm">Dicas de Treino</Link></li>
                <li><Link href="/blog?categoria=alimentacao" className="text-gray-500 hover:text-white transition text-sm">Nutricao</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-white transition text-sm">Central de Ajuda</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Empresa</h4>
              <ul className="space-y-3">
                <li><Link href="/sobre-nos" className="text-gray-500 hover:text-white transition text-sm">Sobre Nos</Link></li>
                <li><Link href="/contato" className="text-gray-500 hover:text-white transition text-sm">Contato</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-white transition text-sm">Carreiras</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-white transition text-sm">Privacidade</Link></li>
              </ul>
            </div>
          </div>

<div className="border-t border-white/[0.08] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
  <p className="text-gray-500 text-sm">2026 FitTransform. Todos os direitos reservados.</p>
  <p className="text-gray-600 text-xs">
  Desenvolvido com excelencia por{" "}
  <Link href="/sobre-nos" className="text-orange-500 hover:text-orange-400 font-medium">
  Web NetSystem
              </Link>
            </p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}
