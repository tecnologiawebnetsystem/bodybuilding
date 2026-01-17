"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Dumbbell, User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function GetStartedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Bem-vindo ao FitTransform
          </h1>
          <p className="text-gray-400 text-lg">Escolha seu perfil para começar</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Dono de Academia */}
          <Card
            className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer p-8"
            onClick={() => router.push("/signup/gym")}
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-orange-500 flex items-center justify-center">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Sou Dono de Academia</h3>
                <p className="text-gray-400 mb-4">
                  Gerencie sua academia completa: alunos, planos, pagamentos, funcionários e mais
                </p>
                <ul className="text-left text-sm text-gray-300 space-y-2">
                  <li>✓ Gestão de alunos ilimitados</li>
                  <li>✓ Controle financeiro completo</li>
                  <li>✓ Sistema de pagamentos</li>
                  <li>✓ Relatórios e analytics</li>
                </ul>
              </div>
              <Button className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600">
                Cadastrar Minha Academia
              </Button>
            </div>
          </Card>

          {/* Personal Trainer */}
          <Card
            className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer p-8"
            onClick={() => router.push("/signup/trainer")}
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-600 to-yellow-500 flex items-center justify-center">
                <Dumbbell className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Sou Personal Trainer</h3>
                <p className="text-gray-400 mb-4">
                  Trabalhe de forma independente: gerencie seus alunos, treinos e locais de atendimento
                </p>
                <ul className="text-left text-sm text-gray-300 space-y-2">
                  <li>✓ Cadastro MEI/CNPJ próprio</li>
                  <li>✓ Múltiplos locais de atendimento</li>
                  <li>✓ Treinos personalizados</li>
                  <li>✓ Controle de suplementação</li>
                </ul>
              </div>
              <Button className="w-full bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600">
                Cadastrar como Personal
              </Button>
            </div>
          </Card>

          {/* Aluno */}
          <Card
            className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer p-8"
            onClick={() => router.push("/signup/student")}
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-600 to-red-500 flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Sou Aluno</h3>
                <p className="text-gray-400 mb-4">
                  Cadastre-se para começar a treinar com academia ou personal trainer particular
                </p>
                <ul className="text-left text-sm text-gray-300 space-y-2">
                  <li>✓ Acesso ao app mobile</li>
                  <li>✓ Acompanhamento de treinos</li>
                  <li>✓ Evolução e progresso</li>
                  <li>✓ Vincule-se depois com PT ou academia</li>
                </ul>
              </div>
              <Button className="w-full bg-gradient-to-r from-yellow-600 to-red-500 hover:from-yellow-700 hover:to-red-600">
                Cadastrar como Aluno
              </Button>
            </div>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400">
            Já tem conta?{" "}
            <button
              onClick={() => router.push("/app-mobile")}
              className="text-orange-500 hover:text-orange-400 font-semibold"
            >
              Fazer Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
