"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Building2, User, ArrowLeft, ArrowRight, Check, Loader2, Crown } from "lucide-react"

type AccountType = "student" | "trainer" | "gym_owner"

interface Plan {
  code: string
  name: string
  price: number
  features: string[]
  popular?: boolean
}

const plans: Record<AccountType, Plan[]> = {
  student: [
    { code: "student_free", name: "Gratuito", price: 0, features: ["Treinos basicos", "Acompanhamento de progresso", "Historico de treinos"] },
    { code: "student_premium", name: "Premium", price: 29.90, features: ["Treinos com IA", "Nutricao personalizada", "Suporte prioritario", "Sem anuncios"], popular: true },
  ],
  trainer: [
    { code: "trainer_basic", name: "Starter", price: 67, features: ["Ate 10 alunos", "Treinos basicos", "Agenda simples"] },
    { code: "trainer_pro", name: "Professional", price: 127, features: ["Ate 50 alunos", "Treinos com IA", "Financeiro completo", "Agenda avancada"], popular: true },
    { code: "trainer_business", name: "Business", price: 197, features: ["Alunos ilimitados", "Todas funcionalidades", "API acesso", "Suporte VIP"] },
  ],
  gym_owner: [
    { code: "gym_starter", name: "Starter", price: 197, features: ["Ate 50 alunos", "3 trainers", "Check-in basico", "Financeiro"] },
    { code: "gym_pro", name: "Professional", price: 347, features: ["Ate 200 alunos", "10 trainers", "Check-in QR/Facial", "Relatorios"], popular: true },
    { code: "gym_enterprise", name: "Enterprise", price: 597, features: ["Alunos ilimitados", "Trainers ilimitados", "Multi-unidades", "API completa", "Suporte dedicado"] },
  ],
}

export default function CadastroPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [accountType, setAccountType] = useState<AccountType | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    cpf: "",
    // Campos especificos
    gymName: "",
    gymCnpj: "",
    gymAddress: "",
    trainerCref: "",
    trainerSpecialties: "",
  })

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas nao coincidem")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/unified-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountType,
          planCode: selectedPlan,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar conta")
      }

      // Redirecionar baseado no tipo de conta
      if (accountType === "gym_owner") {
        router.push("/gym-admin")
      } else if (accountType === "trainer") {
        router.push("/trainer")
      } else {
        router.push("/student")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
            <ArrowLeft size={20} />
            Voltar ao inicio
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Criar sua conta na{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">
              Fit Transform
            </span>
          </h1>
          <p className="text-gray-400">Escolha seu perfil e comece sua jornada fitness</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s 
                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white" 
                    : "bg-gray-800 text-gray-500"
                }`}>
                  {step > s ? <Check size={20} /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-1 mx-2 rounded ${step > s ? "bg-orange-500" : "bg-gray-800"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* Step 1: Escolher tipo de conta */}
        {step === 1 && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card 
              className={`cursor-pointer transition-all border-2 ${
                accountType === "student" 
                  ? "border-orange-500 bg-orange-500/10" 
                  : "border-white/10 bg-white/5 hover:border-white/30"
              }`}
              onClick={() => setAccountType("student")}
            >
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                  <User className="text-white" size={32} />
                </div>
                <CardTitle className="text-white">Sou Aluno</CardTitle>
                <CardDescription>
                  Quero treinar e acompanhar meu progresso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Treinos personalizados</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Acompanhamento de peso</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Historico de treinos</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Pode vincular a academia/personal</li>
                </ul>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all border-2 ${
                accountType === "trainer" 
                  ? "border-orange-500 bg-orange-500/10" 
                  : "border-white/10 bg-white/5 hover:border-white/30"
              }`}
              onClick={() => setAccountType("trainer")}
            >
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="text-white" size={32} />
                </div>
                <CardTitle className="text-white">Sou Personal Trainer</CardTitle>
                <CardDescription>
                  Quero gerenciar meus alunos e treinos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Cadastro de alunos</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Criacao de treinos com IA</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Controle financeiro</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Pode trabalhar em academias</li>
                </ul>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all border-2 ${
                accountType === "gym_owner" 
                  ? "border-orange-500 bg-orange-500/10" 
                  : "border-white/10 bg-white/5 hover:border-white/30"
              }`}
              onClick={() => setAccountType("gym_owner")}
            >
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="text-white" size={32} />
                </div>
                <CardTitle className="text-white">Tenho Academia</CardTitle>
                <CardDescription>
                  Quero gerenciar minha academia completa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Gestao de alunos</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Check-in automatico</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Financeiro completo</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Equipe de trainers</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Escolher plano */}
        {step === 2 && accountType && (
          <div className="grid md:grid-cols-3 gap-6">
            {plans[accountType].map((plan) => (
              <Card 
                key={plan.code}
                className={`cursor-pointer transition-all border-2 relative ${
                  selectedPlan === plan.code 
                    ? "border-orange-500 bg-orange-500/10" 
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
                onClick={() => setSelectedPlan(plan.code)}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 border-0">
                    <Crown size={12} className="mr-1" /> Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-white">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">
                      {plan.price === 0 ? "Gratis" : `R$ ${plan.price.toFixed(2).replace(".", ",")}`}
                    </span>
                    {plan.price > 0 && <span className="text-gray-400">/mes</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300">
                        <Check size={16} className="text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Step 3: Dados pessoais */}
        {step === 3 && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Seus dados</CardTitle>
              <CardDescription>Preencha as informacoes para criar sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Nome completo *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome completo"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Telefone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">CPF</Label>
                  <Input
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Senha *</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimo 6 caracteres"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Confirmar senha *</Label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Repita a senha"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              {/* Campos especificos para academia */}
              {accountType === "gym_owner" && (
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-white font-semibold mb-4">Dados da Academia</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Nome da Academia *</Label>
                      <Input
                        value={formData.gymName}
                        onChange={(e) => setFormData({ ...formData, gymName: e.target.value })}
                        placeholder="Nome da sua academia"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">CNPJ</Label>
                      <Input
                        value={formData.gymCnpj}
                        onChange={(e) => setFormData({ ...formData, gymCnpj: e.target.value })}
                        placeholder="00.000.000/0000-00"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-gray-300">Endereco</Label>
                      <Input
                        value={formData.gymAddress}
                        onChange={(e) => setFormData({ ...formData, gymAddress: e.target.value })}
                        placeholder="Endereco completo"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Campos especificos para trainer */}
              {accountType === "trainer" && (
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-white font-semibold mb-4">Dados Profissionais</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">CREF (opcional)</Label>
                      <Input
                        value={formData.trainerCref}
                        onChange={(e) => setFormData({ ...formData, trainerCref: e.target.value })}
                        placeholder="000000-G/SP"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Especialidades</Label>
                      <Input
                        value={formData.trainerSpecialties}
                        onChange={(e) => setFormData({ ...formData, trainerSpecialties: e.target.value })}
                        placeholder="Musculacao, Funcional, etc"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <Button 
              variant="outline" 
              onClick={() => setStep(step - 1)}
              className="border-white/20 text-gray-300 hover:bg-white/10"
            >
              <ArrowLeft size={18} className="mr-2" />
              Voltar
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button 
              onClick={() => {
                if (step === 1 && !accountType) {
                  setError("Selecione um tipo de conta")
                  return
                }
                if (step === 2 && !selectedPlan) {
                  setError("Selecione um plano")
                  return
                }
                setError("")
                setStep(step + 1)
              }}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            >
              Continuar
              <ArrowRight size={18} className="ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={loading || !formData.name || !formData.email || !formData.password}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Criando conta...
                </>
              ) : (
                <>
                  Criar minha conta
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </Button>
          )}
        </div>

        {/* Login link */}
        <p className="text-center text-gray-400 mt-8">
          Ja tem uma conta?{" "}
          <Link href="/entrar" className="text-orange-500 hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
}
