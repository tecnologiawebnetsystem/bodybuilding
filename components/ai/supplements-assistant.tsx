"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, Pill, Clock, AlertCircle, Check, User, Save, Share2, Info } from "lucide-react"

interface Supplement {
  name: string
  dosage: string
  timing: string
  benefits: string[]
  warnings?: string
  brand_suggestion?: string
}

interface SupplementPlan {
  goal: string
  supplements: Supplement[]
  daily_schedule: {
    morning: string[]
    pre_workout: string[]
    post_workout: string[]
    evening: string[]
  }
  total_investment: string
  tips: string[]
}

interface UserProfile {
  height?: number
  current_weight?: number
  target_weight?: number
  gender?: string
  age?: number
}

interface SupplementsAssistantProps {
  userId: string
  userProfile?: UserProfile | null
  onSave?: (title: string, data: SupplementPlan) => void
  onSaveToNutrition?: (plan: SupplementPlan) => void
}

const goals = [
  { value: "ganho-massa", label: "Ganho de Massa" },
  { value: "emagrecimento", label: "Emagrecimento" },
  { value: "performance", label: "Performance" },
  { value: "saude-geral", label: "Saude Geral" },
  { value: "recuperacao", label: "Recuperacao" },
]

const budgets = [
  { value: "economico", label: "Economico (ate R$150/mes)" },
  { value: "moderado", label: "Moderado (R$150-300/mes)" },
  { value: "completo", label: "Completo (R$300+/mes)" },
]

const experiences = [
  { value: "iniciante", label: "Nunca usei suplementos" },
  { value: "basico", label: "Uso apenas whey/creatina" },
  { value: "avancado", label: "Ja uso varios suplementos" },
]

const loadingSteps = [
  { text: "Analisando seu objetivo...", duration: 1500 },
  { text: "Selecionando suplementos ideais...", duration: 2000 },
  { text: "Calculando dosagens...", duration: 1500 },
  { text: "Montando protocolo...", duration: 1500 },
  { text: "Finalizando recomendacoes...", duration: 1000 },
]

export function SupplementsAssistant({ userId, userProfile, onSave, onSaveToNutrition }: SupplementsAssistantProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [plan, setPlan] = useState<SupplementPlan | null>(null)
  const [loadingStep, setLoadingStep] = useState(0)
  const [saved, setSaved] = useState(false)
  const [savedToNutrition, setSavedToNutrition] = useState(false)

  const [formData, setFormData] = useState({
    goal: "ganho-massa",
    budget: "moderado",
    experience: "basico",
    weight: "70",
    trainingFrequency: "5",
    restrictions: "",
  })

  // Pre-preencher dados do perfil
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        weight: userProfile.current_weight?.toString() || prev.weight,
      }))

      if (userProfile.current_weight && userProfile.target_weight) {
        if (userProfile.target_weight > userProfile.current_weight) {
          setFormData(prev => ({ ...prev, goal: "ganho-massa" }))
        } else if (userProfile.target_weight < userProfile.current_weight) {
          setFormData(prev => ({ ...prev, goal: "emagrecimento" }))
        }
      }
    }
  }, [userProfile])

  // Simular etapas de loading
  useEffect(() => {
    if (isLoading) {
      let currentStep = 0
      setLoadingStep(0)
      
      const stepInterval = setInterval(() => {
        currentStep++
        if (currentStep < loadingSteps.length) {
          setLoadingStep(currentStep)
        }
      }, loadingSteps[0].duration)
      
      return () => clearInterval(stepInterval)
    }
  }, [isLoading])

  const handleGenerate = async () => {
    setIsLoading(true)
    setPlan(null)
    setSaved(false)
    setSavedToNutrition(false)

    try {
      const response = await fetch("/api/ai/supplements-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      
      if (data.plan) {
        setPlan(data.plan)
      }
    } catch (error) {
      console.error("Erro ao gerar suplementos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    if (plan && onSave) {
      onSave(`Suplementos - ${plan.goal}`, plan)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const handleSaveToNutrition = async () => {
    if (plan) {
      try {
        const response = await fetch("/api/user-supplements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            supplements: plan.supplements,
            dailySchedule: plan.daily_schedule,
          }),
        })

        if (response.ok) {
          setSavedToNutrition(true)
          if (onSaveToNutrition) {
            onSaveToNutrition(plan)
          }
        }
      } catch (error) {
        console.error("Erro ao salvar suplementos:", error)
      }
    }
  }

  const handleShare = async () => {
    if (!plan) return
    
    const text = `Protocolo de Suplementos - ${plan.goal}\n\n${plan.supplements.map(s => 
      `${s.name}: ${s.dosage} (${s.timing})`
    ).join('\n')}\n\nGerado por IA - Bodybuilding App`
    
    if (navigator.share) {
      try {
        await navigator.share({ title: "Meus Suplementos", text })
      } catch {
        navigator.clipboard.writeText(text)
      }
    } else {
      navigator.clipboard.writeText(text)
      alert("Copiado para a area de transferencia!")
    }
  }

  return (
    <div className="space-y-6">
      {/* Dados do Perfil */}
      {userProfile && userProfile.current_weight && (
        <div className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-lg border border-white/[0.08]">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-400">Peso atual do perfil</p>
            <p className="text-white text-sm">{userProfile.current_weight}kg</p>
          </div>
          <Check className="w-5 h-5 text-green-400" />
        </div>
      )}

      {/* Formulario */}
      <Card className="bg-white/[0.03] border-white/[0.08]">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Objetivo */}
            <div className="space-y-2">
              <Label className="text-gray-300">Objetivo</Label>
              <select
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:border-cyan-500 focus:outline-none"
              >
                {goals.map((g) => (
                  <option key={g.value} value={g.value} className="bg-gray-900">{g.label}</option>
                ))}
              </select>
            </div>

            {/* Orcamento */}
            <div className="space-y-2">
              <Label className="text-gray-300">Orcamento</Label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:border-cyan-500 focus:outline-none"
              >
                {budgets.map((b) => (
                  <option key={b.value} value={b.value} className="bg-gray-900">{b.label}</option>
                ))}
              </select>
            </div>

            {/* Experiencia */}
            <div className="space-y-2">
              <Label className="text-gray-300">Experiencia</Label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:border-cyan-500 focus:outline-none"
              >
                {experiences.map((e) => (
                  <option key={e.value} value={e.value} className="bg-gray-900">{e.label}</option>
                ))}
              </select>
            </div>

            {/* Peso */}
            <div className="space-y-2">
              <Label className="text-gray-300">Peso (kg)</Label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Frequencia de Treino */}
            <div className="space-y-2 col-span-2">
              <Label className="text-gray-300">Frequencia de Treino (dias/semana)</Label>
              <select
                value={formData.trainingFrequency}
                onChange={(e) => setFormData({ ...formData, trainingFrequency: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="3" className="bg-gray-900">3 dias</option>
                <option value="4" className="bg-gray-900">4 dias</option>
                <option value="5" className="bg-gray-900">5 dias</option>
                <option value="6" className="bg-gray-900">6 dias</option>
              </select>
            </div>
          </div>

          {/* Restricoes */}
          <div className="space-y-2">
            <Label className="text-gray-300">Restricoes ou Alergias (opcional)</Label>
            <input
              type="text"
              value={formData.restrictions}
              onChange={(e) => setFormData({ ...formData, restrictions: e.target.value })}
              placeholder="Ex: Intolerancia a lactose, alergia a frutos do mar..."
              className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-gray-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Botao Gerar */}
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Gerando protocolo...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Gerar Protocolo de Suplementos
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Loading com Etapas */}
      {isLoading && (
        <Card className="bg-white/[0.03] border-white/[0.08] overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              {loadingSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    index < loadingStep 
                      ? "bg-green-500 text-white" 
                      : index === loadingStep 
                        ? "bg-cyan-500 text-white animate-pulse" 
                        : "bg-white/[0.05] text-gray-500"
                  }`}>
                    {index < loadingStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-sm">{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm ${
                    index <= loadingStep ? "text-white" : "text-gray-500"
                  }`}>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultado */}
      {plan && (
        <div className="space-y-4 animate-fade-in">
          {/* Botoes de Acao */}
          <div className="flex gap-3">
            <Button
              onClick={handleSaveToNutrition}
              disabled={savedToNutrition}
              className={`flex-1 ${
                savedToNutrition 
                  ? "bg-green-500 hover:bg-green-500" 
                  : "bg-gradient-to-r from-cyan-500 to-blue-600"
              }`}
            >
              {savedToNutrition ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Salvo na Nutricao!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar na Nutricao
                </>
              )}
            </Button>
            <Button
              onClick={handleShare}
              className="bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1]"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Header */}
          <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white capitalize">Protocolo {plan.goal.replace("-", " ")}</h3>
                  <p className="text-gray-400 mt-1">{plan.supplements.length} suplementos recomendados</p>
                </div>
                <div className="px-3 py-1 bg-cyan-500/20 rounded-full">
                  <span className="text-cyan-300 text-sm font-medium">{plan.total_investment}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Suplementos */}
          <div className="space-y-3">
            {plan.supplements.map((supplement, index) => (
              <Card key={index} className="bg-white/[0.03] border-white/[0.08]">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Pill className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{supplement.name}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="text-cyan-400">{supplement.dosage}</span>
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {supplement.timing}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {supplement.benefits.map((benefit, i) => (
                          <span key={i} className="px-2 py-1 bg-white/[0.05] rounded text-xs text-gray-400">
                            {benefit}
                          </span>
                        ))}
                      </div>
                      {supplement.warnings && (
                        <div className="flex items-start gap-2 mt-2 p-2 bg-yellow-500/10 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <p className="text-yellow-200 text-xs">{supplement.warnings}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cronograma Diario */}
          <Card className="bg-white/[0.03] border-white/[0.08]">
            <CardContent className="p-6">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Cronograma Diario
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {plan.daily_schedule.morning.length > 0 && (
                  <div className="p-3 bg-white/[0.02] rounded-lg">
                    <p className="text-cyan-400 text-sm font-medium mb-2">Manha</p>
                    {plan.daily_schedule.morning.map((item, i) => (
                      <p key={i} className="text-gray-300 text-sm">{item}</p>
                    ))}
                  </div>
                )}
                {plan.daily_schedule.pre_workout.length > 0 && (
                  <div className="p-3 bg-white/[0.02] rounded-lg">
                    <p className="text-orange-400 text-sm font-medium mb-2">Pre-treino</p>
                    {plan.daily_schedule.pre_workout.map((item, i) => (
                      <p key={i} className="text-gray-300 text-sm">{item}</p>
                    ))}
                  </div>
                )}
                {plan.daily_schedule.post_workout.length > 0 && (
                  <div className="p-3 bg-white/[0.02] rounded-lg">
                    <p className="text-green-400 text-sm font-medium mb-2">Pos-treino</p>
                    {plan.daily_schedule.post_workout.map((item, i) => (
                      <p key={i} className="text-gray-300 text-sm">{item}</p>
                    ))}
                  </div>
                )}
                {plan.daily_schedule.evening.length > 0 && (
                  <div className="p-3 bg-white/[0.02] rounded-lg">
                    <p className="text-purple-400 text-sm font-medium mb-2">Noite</p>
                    {plan.daily_schedule.evening.map((item, i) => (
                      <p key={i} className="text-gray-300 text-sm">{item}</p>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dicas */}
          {plan.tips && plan.tips.length > 0 && (
            <Card className="bg-white/[0.03] border-white/[0.08]">
              <CardContent className="p-6">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-cyan-400" />
                  Dicas Importantes
                </h4>
                <ul className="space-y-2">
                  {plan.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300 text-sm">
                      <span className="text-cyan-400">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
