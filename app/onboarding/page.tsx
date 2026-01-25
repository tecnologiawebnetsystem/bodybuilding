"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Dumbbell, CheckCircle, Users, CreditCard, Calendar, ArrowRight, 
  Building2, User, Target, ChevronLeft, ChevronRight, Check, Loader2, Copy
} from "lucide-react"

type AccountType = "gym_owner" | "trainer" | "student"

export default function OnboardingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Dados do checkout ou URL
  const [userData, setUserData] = useState<{
    name: string
    email: string
    pin: string
    planId: string
    accountType: AccountType
  } | null>(null)

  // Dados do formulario de onboarding
  const [formData, setFormData] = useState({
    phone: "",
    birthDate: "",
    gender: "",
    height: "",
    weight: "",
    targetWeight: "",
    fitnessGoal: "",
    experienceLevel: "",
    gymName: "",
    gymAddress: "",
    gymCity: "",
    gymState: "",
    gymPhone: "",
    gymDescription: "",
    specializations: [] as string[],
    certifications: "",
    bio: "",
    pricePerHour: "",
  })

  useEffect(() => {
    // Tentar recuperar dados do localStorage (vindo do checkout)
    const checkoutData = localStorage.getItem('checkout_result')
    if (checkoutData) {
      try {
        const data = JSON.parse(checkoutData)
        let accountType: AccountType = 'student'
        if (data.planId === 'gym_pro') accountType = 'gym_owner'
        else if (data.planId === 'trainer_pro') accountType = 'trainer'
        
        setUserData({
          name: data.name,
          email: data.email,
          pin: data.pin,
          planId: data.planId,
          accountType
        })
      } catch (e) {
        console.error('Error parsing checkout data')
      }
    } else {
      // Tentar recuperar da URL (fluxo antigo)
      const pin = searchParams.get("pin")
      const userId = searchParams.get("userId")
      if (pin && userId) {
        setUserData({
          name: userId,
          email: '',
          pin: pin,
          planId: 'gym_pro',
          accountType: 'gym_owner'
        })
      } else {
        // Se nao tem dados, redirecionar
        router.push('/precos')
      }
    }
  }, [searchParams, router])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalSteps = userData?.accountType === 'gym_owner' ? 4 : userData?.accountType === 'trainer' ? 5 : 4

  const handleFinish = async () => {
    setIsLoading(true)
    
    try {
      // Salvar dados do onboarding
      await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ...userData,
        })
      })
      
      // Limpar dados do checkout
      localStorage.removeItem('checkout_result')
      
      // Redirecionar para o dashboard apropriado
      if (userData?.accountType === 'gym_owner') {
        router.push('/gym-admin')
      } else if (userData?.accountType === 'trainer') {
        router.push('/trainer')
      } else {
        router.push('/student')
      }
    } catch (error) {
      // Se der erro, ainda assim redireciona
      localStorage.removeItem('checkout_result')
      router.push('/student')
    } finally {
      setIsLoading(false)
    }
  }

  const fitnessGoals = [
    "Perder peso",
    "Ganhar massa muscular", 
    "Melhorar condicionamento",
    "Manter forma",
    "Preparacao para competicao",
    "Reabilitacao",
  ]

  const experienceLevels = [
    "Iniciante (menos de 6 meses)",
    "Intermediario (6 meses a 2 anos)",
    "Avancado (mais de 2 anos)",
    "Atleta",
  ]

  const specializationOptions = [
    "Musculacao", "Funcional", "Crossfit", "Pilates", "Yoga",
    "Natacao", "Artes Marciais", "Corrida", "Calistenia", "Reabilitacao",
  ]

  const brazilStates = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ]

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  const planNames: Record<string, string> = {
    'gym_pro': 'Plano Academia',
    'trainer_pro': 'Plano Personal',
    'student_premium': 'Plano Aluno',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Fit Transform</span>
          </Link>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i} 
              className={`h-2 flex-1 max-w-16 rounded-full transition-all ${
                i + 1 <= step ? "bg-orange-500" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Content Card */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-8">
          {/* Step 1: Credenciais */}
          {step === 1 && (
            <>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Conta Criada com Sucesso!</CardTitle>
                <CardDescription>Guarde suas credenciais de acesso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Nome:</p>
                      <p className="text-white font-semibold text-lg">{userData.name}</p>
                    </div>
                    <Badge className="bg-orange-500">{planNames[userData.planId] || 'Plano'}</Badge>
                  </div>
                  
                  {userData.email && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Email:</p>
                      <p className="text-white">{userData.email}</p>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-gray-400 text-sm mb-2">Seu PIN de Acesso:</p>
                    <div className="flex items-center gap-3">
                      <p className="text-white font-mono text-4xl font-bold tracking-[0.5em]">{userData.pin}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(userData.pin)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-yellow-200 text-sm">
                    <strong>IMPORTANTE:</strong> Guarde seu PIN em local seguro. Voce usara ele para fazer login no aplicativo.
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Dados Pessoais */}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" />
                  Dados Pessoais
                </CardTitle>
                <CardDescription>Complete seu perfil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Telefone</Label>
                    <Input
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Data de Nascimento</Label>
                    <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Genero</Label>
                  <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3 for Gym Owner: Dados da Academia */}
          {step === 3 && userData.accountType === 'gym_owner' && (
            <>
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-orange-500" />
                  Dados da Academia
                </CardTitle>
                <CardDescription>Configure sua academia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Nome da Academia *</Label>
                  <Input
                    placeholder="Ex: Academia Forca Total"
                    value={formData.gymName}
                    onChange={(e) => setFormData({ ...formData, gymName: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Endereco</Label>
                  <Input
                    placeholder="Rua, numero, bairro"
                    value={formData.gymAddress}
                    onChange={(e) => setFormData({ ...formData, gymAddress: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label className="text-gray-300">Cidade</Label>
                    <Input
                      placeholder="Sao Paulo"
                      value={formData.gymCity}
                      onChange={(e) => setFormData({ ...formData, gymCity: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Estado</Label>
                    <Select value={formData.gymState} onValueChange={(v) => setFormData({ ...formData, gymState: v })}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        {brazilStates.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Telefone da Academia</Label>
                  <Input
                    placeholder="(11) 3333-3333"
                    value={formData.gymPhone}
                    onChange={(e) => setFormData({ ...formData, gymPhone: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3 for Trainer/Student: Dados Fisicos */}
          {step === 3 && (userData.accountType === 'trainer' || userData.accountType === 'student') && (
            <>
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-500" />
                  Dados Fisicos
                </CardTitle>
                <CardDescription>Para personalizar sua experiencia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Altura (cm)</Label>
                    <Input
                      type="number"
                      placeholder="175"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Peso (kg)</Label>
                    <Input
                      type="number"
                      placeholder="75"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Meta (kg)</Label>
                    <Input
                      type="number"
                      placeholder="70"
                      value={formData.targetWeight}
                      onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                {userData.accountType === 'student' && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Objetivo Principal</Label>
                      <Select value={formData.fitnessGoal} onValueChange={(v) => setFormData({ ...formData, fitnessGoal: v })}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Selecione seu objetivo" />
                        </SelectTrigger>
                        <SelectContent>
                          {fitnessGoals.map((goal) => (
                            <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Nivel de Experiencia</Label>
                      <Select value={formData.experienceLevel} onValueChange={(v) => setFormData({ ...formData, experienceLevel: v })}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Selecione seu nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
            </>
          )}

          {/* Step 4 for Trainer: Especializacoes */}
          {step === 4 && userData.accountType === 'trainer' && (
            <>
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-orange-500" />
                  Especializacoes
                </CardTitle>
                <CardDescription>Suas areas de atuacao</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Selecione suas especialidades</Label>
                  <div className="flex flex-wrap gap-2">
                    {specializationOptions.map((spec) => (
                      <Badge
                        key={spec}
                        variant={formData.specializations.includes(spec) ? "default" : "outline"}
                        className={`cursor-pointer transition ${
                          formData.specializations.includes(spec)
                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                            : "border-white/20 text-gray-300 hover:bg-white/10"
                        }`}
                        onClick={() => {
                          const newSpecs = formData.specializations.includes(spec)
                            ? formData.specializations.filter(s => s !== spec)
                            : [...formData.specializations, spec]
                          setFormData({ ...formData, specializations: newSpecs })
                        }}
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Certificacoes (CREF, cursos, etc)</Label>
                  <Textarea
                    placeholder="Liste suas certificacoes..."
                    value={formData.certifications}
                    onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                    className="bg-white/5 border-white/10 text-white min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Valor por Hora (R$)</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </CardContent>
            </>
          )}

          {/* Final Step: Funcionalidades e Confirmacao */}
          {((step === 4 && (userData.accountType === 'gym_owner' || userData.accountType === 'student')) ||
            (step === 5 && userData.accountType === 'trainer')) && (
            <>
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Tudo Pronto!
                </CardTitle>
                <CardDescription>Veja o que voce pode fazer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {userData.accountType === 'gym_owner' && [
                    { icon: Users, title: "Gestao de Alunos", desc: "Cadastre e gerencie seus alunos" },
                    { icon: Dumbbell, title: "Treinos com IA", desc: "Crie treinos personalizados" },
                    { icon: CreditCard, title: "Controle Financeiro", desc: "Gerencie pagamentos e mensalidades" },
                    { icon: Calendar, title: "Check-in Inteligente", desc: "Controle de acesso por PIN" },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <feature.icon className="w-6 h-6 text-orange-500 flex-shrink-0" />
                      <div>
                        <p className="text-white font-medium">{feature.title}</p>
                        <p className="text-gray-400 text-sm">{feature.desc}</p>
                      </div>
                    </div>
                  ))}

                  {userData.accountType === 'trainer' && [
                    { icon: Users, title: "Seus Alunos", desc: "Gerencie alunos particulares" },
                    { icon: Dumbbell, title: "Treinos com IA", desc: "Crie treinos personalizados" },
                    { icon: Calendar, title: "Agenda", desc: "Organize seus horarios" },
                    { icon: CreditCard, title: "Financeiro", desc: "Controle seus recebimentos" },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <feature.icon className="w-6 h-6 text-orange-500 flex-shrink-0" />
                      <div>
                        <p className="text-white font-medium">{feature.title}</p>
                        <p className="text-gray-400 text-sm">{feature.desc}</p>
                      </div>
                    </div>
                  ))}

                  {userData.accountType === 'student' && [
                    { icon: Dumbbell, title: "Treinos com IA", desc: "Gere treinos personalizados" },
                    { icon: Target, title: "Acompanhamento", desc: "Registre e acompanhe seu progresso" },
                    { icon: Calendar, title: "Historico", desc: "Veja seu historico de treinos" },
                    { icon: CheckCircle, title: "Conquistas", desc: "Desbloqueie badges e conquistas" },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <feature.icon className="w-6 h-6 text-orange-500 flex-shrink-0" />
                      <div>
                        <p className="text-white font-medium">{feature.title}</p>
                        <p className="text-gray-400 text-sm">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-4">
                  <p className="text-green-200 text-sm">
                    <strong>7 dias de teste gratis!</strong> Aproveite todas as funcionalidades sem compromisso.
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="p-6 pt-0 flex justify-between">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="border-white/20 text-gray-300 hover:bg-white/10"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button
                onClick={() => setStep(step + 1)}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90"
              >
                Continuar
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Finalizando...
                  </>
                ) : (
                  <>
                    Acessar Painel
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        <p className="text-center text-gray-400 text-sm">
          Precisa de ajuda?{" "}
          <Link href="/contato" className="text-orange-500 hover:underline">
            Fale com nosso suporte
          </Link>
        </p>
      </div>
    </div>
  )
}
