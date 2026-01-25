"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Mail, Phone, Calendar, Sparkles } from "lucide-react"
import confetti from "canvas-confetti"
import { useEffect } from "react"

export default function CheckoutSucessoPage() {
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan')

  const planNames: Record<string, string> = {
    gym_pro: "Academia",
    trainer_pro: "Personal Trainer",
    student_premium: "Aluno Premium"
  }

  const dashboardLinks: Record<string, string> = {
    gym_pro: "/gym-admin",
    trainer_pro: "/trainer",
    student_premium: "/student"
  }

  const planName = planId ? planNames[planId] || "Premium" : "Premium"
  const dashboardLink = planId ? dashboardLinks[planId] || "/student" : "/student"

  useEffect(() => {
    // Efeito de confete
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#f97316', '#ef4444', '#22c55e', '#3b82f6']
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#f97316', '#ef4444', '#22c55e', '#3b82f6']
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <Card className="bg-white/5 border-white/10 max-w-lg w-full">
        <CardContent className="pt-8 pb-8 text-center">
          {/* Icone de sucesso */}
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          {/* Titulo */}
          <h1 className="text-3xl font-bold text-white mb-2">
            Parabens!
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Sua assinatura do plano <span className="text-orange-500 font-semibold">{planName}</span> foi confirmada!
          </p>

          {/* Info box */}
          <div className="bg-white/5 rounded-xl p-6 mb-8 text-left space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-white font-medium">Email de confirmacao</p>
                <p className="text-gray-400 text-sm">Enviamos os detalhes da sua assinatura para seu email.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Periodo de teste</p>
                <p className="text-gray-400 text-sm">Voce tem 7 dias gratuitos para explorar todas as funcionalidades.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">Acesso liberado</p>
                <p className="text-gray-400 text-sm">Voce ja pode comecar a usar a plataforma agora mesmo!</p>
              </div>
            </div>
          </div>

          {/* Botoes */}
          <div className="space-y-3">
            <Link href={dashboardLink} className="block">
              <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold">
                Acessar Meu Painel
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link href="/" className="block">
              <Button variant="outline" className="w-full h-12 border-white/20 text-gray-300 hover:bg-white/10 bg-transparent">
                Voltar para o Inicio
              </Button>
            </Link>
          </div>

          {/* Suporte */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm">
              Precisa de ajuda? Entre em contato conosco
            </p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <a href="mailto:suporte@fittransform.com.br" className="text-orange-400 hover:text-orange-300 text-sm flex items-center gap-1">
                <Mail className="w-4 h-4" />
                suporte@fittransform.com.br
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
