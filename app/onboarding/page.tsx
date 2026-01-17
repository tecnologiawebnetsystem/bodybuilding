"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dumbbell, CheckCircle, Users, CreditCard, Calendar, ArrowRight } from "lucide-react"

export default function OnboardingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [step, setStep] = useState(1)

  const gymId = searchParams.get("gymId")
  const userId = searchParams.get("userId")
  const pin = searchParams.get("pin")

  useEffect(() => {
    if (!gymId || !userId || !pin) {
      router.push("/signup")
    }
  }, [gymId, userId, pin, router])

  const totalSteps = 3

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Conta Criada com Sucesso!</h1>
          <p className="text-gray-400 text-lg">Vamos configurar sua academia em 3 passos simples</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-2 flex-1 rounded-full ${s <= step ? "bg-orange-500" : "bg-white/10"}`}></div>
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm mb-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Suas Credenciais de Acesso</h2>
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Usuário:</p>
                  <p className="text-white font-mono text-xl font-semibold">{userId}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">PIN de Acesso:</p>
                  <p className="text-white font-mono text-3xl font-bold tracking-wider">{pin}</p>
                </div>
                <div className="bg-orange-500/20 rounded-lg p-4 mt-4">
                  <p className="text-orange-200 text-sm">
                    ⚠️ <strong>IMPORTANTE:</strong> Guarde essas credenciais em local seguro. Você precisará delas para
                    fazer login.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Principais Funcionalidades</h2>
              <div className="grid gap-4">
                {[
                  { icon: Users, title: "Gestão de Alunos", desc: "Cadastre, acompanhe e gerencie seus alunos" },
                  { icon: Dumbbell, title: "Treinos Personalizados", desc: "Crie treinos com IA ou manualmente" },
                  { icon: CreditCard, title: "Controle Financeiro", desc: "Gerencie pagamentos, planos e receitas" },
                  { icon: Calendar, title: "Aulas Coletivas", desc: "Agende aulas e gerencie reservas" },
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                    <feature.icon className="w-8 h-8 text-orange-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Tudo Pronto!</h2>
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6 space-y-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
                <p className="text-white text-lg">
                  Sua academia <strong>{gymId}</strong> está configurada e pronta para uso!
                </p>
                <div className="space-y-2 text-gray-300">
                  <p>✅ Planos padrão criados (Mensal, Trimestral, Semestral, Anual)</p>
                  <p>✅ Conta admin configurada</p>
                  <p>✅ 14 dias de teste grátis ativados</p>
                  <p>✅ Todas as funcionalidades liberadas</p>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outline"
                className="flex-1 border-white/20 text-white"
                size="lg"
              >
                Voltar
              </Button>
            )}
            {step < totalSteps ? (
              <Button
                onClick={() => setStep(step + 1)}
                className="flex-1 bg-gradient-to-r from-red-600 to-orange-500"
                size="lg"
              >
                Continuar <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/admin")}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500"
                size="lg"
              >
                Acessar Painel <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm">
          Precisa de ajuda?{" "}
          <a href="mailto:suporte@fittransform.com" className="text-orange-500 hover:underline">
            Fale com nosso suporte
          </a>
        </p>
      </div>
    </div>
  )
}
