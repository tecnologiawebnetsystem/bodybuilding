"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { SharedHeader } from "@/components/shared-header"
import { SharedFooter } from "@/components/shared-footer"
import { 
  Check, 
  Building2, 
  User, 
  Users, 
  Sparkles, 
  Shield, 
  Clock, 
  CreditCard,
  Zap,
  BarChart3,
  Calendar,
  Dumbbell,
  Brain,
  HeartPulse,
  Trophy,
  ArrowRight
} from "lucide-react"

const plans = [
  {
    id: "gym_pro",
    name: "Academia",
    description: "Para academias de todos os portes",
    icon: Building2,
    priceMonthly: 299.99,
    priceYearly: 2999.90,
    popular: true,
    color: "from-orange-500 to-red-600",
    features: [
      { text: "Alunos ilimitados", highlight: true },
      { text: "Personal trainers ilimitados", highlight: true },
      { text: "Treinos com IA", highlight: false },
      { text: "Gestao financeira completa", highlight: false },
      { text: "Check-in digital", highlight: false },
      { text: "Relatorios avancados", highlight: false },
      { text: "App personalizado com sua marca", highlight: true },
      { text: "Suporte prioritario", highlight: false },
      { text: "Multi-unidades", highlight: false },
    ],
    cta: "Comecar Agora",
    targetAudience: "Ideal para: Academias, Studios, CrossFit Boxes"
  },
  {
    id: "trainer_pro",
    name: "Personal Trainer",
    description: "Para personal trainers autonomos",
    icon: User,
    priceMonthly: 99.00,
    priceYearly: 990.00,
    popular: false,
    color: "from-blue-500 to-cyan-500",
    features: [
      { text: "Alunos ilimitados", highlight: true },
      { text: "Treinos com IA", highlight: false },
      { text: "Agenda online", highlight: false },
      { text: "Gestao financeira", highlight: false },
      { text: "Relatorios de progresso", highlight: false },
      { text: "Suporte por email", highlight: false },
    ],
    cta: "Comecar Agora",
    targetAudience: "Ideal para: Personal Trainers, Coaches, Nutricionistas"
  },
  {
    id: "student_premium",
    name: "Aluno",
    description: "Para quem treina por conta propria",
    icon: Dumbbell,
    priceMonthly: 9.99,
    priceYearly: 99.90,
    popular: false,
    color: "from-green-500 to-emerald-500",
    features: [
      { text: "Treinos com IA personalizados", highlight: true },
      { text: "Acompanhamento de progresso", highlight: false },
      { text: "Dicas de nutricao", highlight: false },
      { text: "Historico completo de treinos", highlight: false },
      { text: "Suporte por email", highlight: false },
    ],
    cta: "Comecar Agora",
    targetAudience: "Ideal para: Atletas independentes, Praticantes de calistenia"
  },
]

const benefits = [
  {
    icon: Brain,
    title: "Treinos com IA",
    description: "Geracao automatica de treinos personalizados usando inteligencia artificial"
  },
  {
    icon: BarChart3,
    title: "Relatorios Inteligentes",
    description: "Acompanhe o progresso dos seus alunos com dashboards interativos"
  },
  {
    icon: Calendar,
    title: "Agenda Integrada",
    description: "Gerencie horarios, aulas e compromissos em um so lugar"
  },
  {
    icon: Shield,
    title: "Dados Seguros",
    description: "Seus dados protegidos com criptografia de ponta"
  },
  {
    icon: Zap,
    title: "Rapido e Intuitivo",
    description: "Interface moderna e facil de usar em qualquer dispositivo"
  },
  {
    icon: HeartPulse,
    title: "Suporte Dedicado",
    description: "Equipe pronta para ajudar quando voce precisar"
  },
]

const faqs = [
  {
    question: "Posso testar antes de assinar?",
    answer: "Sim! Todos os planos tem 7 dias de teste gratuito. Voce pode cancelar a qualquer momento durante o periodo de teste sem ser cobrado."
  },
  {
    question: "Como funciona o plano para alunos de academia?",
    answer: "Quando uma academia assina o plano Academia, todos os seus alunos tem acesso gratuito ao app. O dono da academia pode cadastrar quantos alunos quiser sem custo adicional."
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim! Nao ha fidelidade. Voce pode cancelar sua assinatura a qualquer momento e continuara tendo acesso ate o fim do periodo pago."
  },
  {
    question: "Quais formas de pagamento sao aceitas?",
    answer: "Aceitamos cartao de credito, PIX e boleto bancario. Para o plano anual, oferecemos desconto de 2 meses."
  },
  {
    question: "Um personal trainer pode trabalhar em uma academia e ter alunos particulares?",
    answer: "Sim! O personal trainer pode estar vinculado a uma ou mais academias e ainda assim ter seus proprios alunos particulares, tudo gerenciado pelo mesmo app."
  },
  {
    question: "O aluno pode trocar de academia ou personal?",
    answer: "Sim! O aluno pode ter multiplos vinculos simultaneamente ou trocar de academia/personal quando quiser, mantendo todo seu historico de treinos."
  },
]

export default function PrecosPage() {
  const [isYearly, setIsYearly] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <SharedHeader />

      {/* Hero */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-orange-500/20 text-orange-400 border-orange-500/30">
            7 dias gratis para testar
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Planos simples,{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
              precos justos
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Escolha o plano ideal para voce. Sem taxas escondidas, sem surpresas.
            Cancele quando quiser.
          </p>

          {/* Toggle Mensal/Anual */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${!isYearly ? 'text-white' : 'text-gray-400'}`}>
              Mensal
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-orange-500"
            />
            <span className={`text-sm font-medium ${isYearly ? 'text-white' : 'text-gray-400'}`}>
              Anual
            </span>
            {isYearly && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                2 meses gratis
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative bg-white/5 border-white/10 overflow-hidden transition-all duration-300 hover:scale-105 hover:border-orange-500/50 ${
                  plan.popular ? 'ring-2 ring-orange-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                      MAIS POPULAR
                    </div>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
                    <plan.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-6">
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-bold text-white">
                        {formatPrice(isYearly ? plan.priceYearly / 12 : plan.priceMonthly)}
                      </span>
                      <span className="text-gray-400">/mes</span>
                    </div>
                    {isYearly && (
                      <p className="text-sm text-gray-500 mt-1">
                        {formatPrice(plan.priceYearly)} cobrados anualmente
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          feature.highlight ? 'text-orange-500' : 'text-green-500'
                        }`} />
                        <span className={`text-sm ${
                          feature.highlight ? 'text-white font-medium' : 'text-gray-300'
                        }`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-white/10">
                    {plan.targetAudience}
                  </p>
                </CardContent>

                <CardFooter>
                  <Link href={`/cadastro?plan=${plan.id}`} className="w-full">
                    <Button 
                      className={`w-full h-12 font-semibold ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white' 
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Aluno Vinculado Info */}
          <div className="max-w-3xl mx-auto mt-12">
            <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
              <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-6">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Aluno de Academia ou Personal? Acesso Gratuito!
                  </h3>
                  <p className="text-gray-300">
                    Se sua academia ou personal trainer ja usa a Fit Transform, voce tem acesso 
                    gratuito ao app com todas as funcionalidades. Basta pedir o cadastro para 
                    seu instrutor!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-black/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Tudo que voce precisa em um so lugar
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Funcionalidades pensadas para facilitar sua vida e de seus alunos
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-4 p-6 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition"
              >
                <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Compare os planos
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Funcionalidade</th>
                  <th className="text-center py-4 px-4 text-orange-400 font-medium">Academia</th>
                  <th className="text-center py-4 px-4 text-blue-400 font-medium">Personal</th>
                  <th className="text-center py-4 px-4 text-green-400 font-medium">Aluno</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { feature: "Treinos com IA", gym: true, trainer: true, student: true },
                  { feature: "Alunos ilimitados", gym: true, trainer: true, student: false },
                  { feature: "Gestao financeira", gym: true, trainer: true, student: false },
                  { feature: "Check-in digital", gym: true, trainer: false, student: false },
                  { feature: "Relatorios avancados", gym: true, trainer: true, student: false },
                  { feature: "Multi-unidades", gym: true, trainer: false, student: false },
                  { feature: "App com sua marca", gym: true, trainer: false, student: false },
                  { feature: "Suporte prioritario", gym: true, trainer: false, student: false },
                  { feature: "Agenda online", gym: true, trainer: true, student: false },
                  { feature: "Acompanhamento de progresso", gym: true, trainer: true, student: true },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5">
                    <td className="py-4 px-4 text-gray-300">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      {row.gym ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.trainer ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.student ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="bg-white/5">
                  <td className="py-4 px-4 text-white font-semibold">Preco mensal</td>
                  <td className="py-4 px-4 text-center text-orange-400 font-bold">R$ 299,99</td>
                  <td className="py-4 px-4 text-center text-blue-400 font-bold">R$ 99,00</td>
                  <td className="py-4 px-4 text-center text-green-400 font-bold">R$ 9,99</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-black/30">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-xl bg-white/5 border border-white/10"
              >
                <h3 className="text-white font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-400 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJ2Mmgydi0yem0tNiAwaDJ2MmgtMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
            <div className="relative z-10">
              <Trophy className="w-16 h-16 mx-auto mb-6 text-white/80" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Pronto para transformar seu negocio?
              </h2>
              <p className="text-white/90 mb-8 max-w-xl mx-auto">
                Junte-se a centenas de academias e personal trainers que ja usam a Fit Transform.
                Comece seu teste gratuito de 7 dias agora!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/cadastro">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-bold w-full sm:w-auto">
                    Comecar Teste Gratuito
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contato">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold w-full sm:w-auto bg-transparent">
                    Falar com Vendas
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  )
}
