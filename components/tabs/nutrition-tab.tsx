"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Apple, Droplets, Pill, Flame, UtensilsCrossed, Clock, Share2, ChevronDown, ChevronUp, Info, AlertCircle, CheckCircle2, Sparkles, Loader2, RefreshCw } from "lucide-react"
import { getSupplementsByUser, supplementCategories } from "@/lib/supplements-data"
import { useState, useEffect } from "react"
import { FitnessPDFGenerator, sharePDF } from "@/lib/pdf-generator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UserPreferences {
  theme_primary: string
  theme_secondary: string
  theme_accent: string
}

interface MealFood {
  description: string
  isSupplement: boolean
  isAvoid: boolean
}

interface Meal {
  id: number
  time: string
  name: string
  calories: number
  tip: string | null
  foods: MealFood[]
}

interface MealPlan {
  id: number
  name: string
  goal: string
  totalCalories: number
  proteinGoal: number
  fatGoal: number
  carbGoal: number
  waterGoal: number
  isAiGenerated: boolean
  meals: Meal[]
}

interface NutritionTabProps {
  userId: string
  preferences: UserPreferences
  userName?: string
}

interface AISupplement {
  name: string
  dosage: string
  timing: string
  benefits: string[]
  warnings?: string
  brand_suggestion?: string
}

interface AISupplementsData {
  supplements: AISupplement[]
  daily_schedule: {
    morning: string[]
    pre_workout: string[]
    post_workout: string[]
    evening: string[]
  }
}

export function NutritionTab({ userId, preferences, userName }: NutritionTabProps) {
  const supplements = getSupplementsByUser(userId)
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [aiSupplements, setAiSupplements] = useState<AISupplementsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [aiGoal, setAiGoal] = useState("emagrecimento")
  const [aiRestrictions, setAiRestrictions] = useState("")
  const [aiPreferences, setAiPreferences] = useState("")

  const [isGeneratingNutritionPDF, setIsGeneratingNutritionPDF] = useState(false)
  const [isGeneratingSupplementsPDF, setIsGeneratingSupplementsPDF] = useState(false)
  const [expandedSupplement, setExpandedSupplement] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Carregar plano alimentar e suplementos do banco
  useEffect(() => {
    loadMealPlan()
    loadAISupplements()
  }, [userId])

  const loadMealPlan = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/meal-plan?userId=${userId}`)
      const data = await response.json()
      if (data.success && data.data) {
        setMealPlan(data.data)
      } else {
        setMealPlan(null)
      }
    } catch (error) {
      console.error("[v0] Error loading meal plan:", error)
      setMealPlan(null)
    } finally {
      setLoading(false)
    }
  }

  const loadAISupplements = async () => {
    try {
      const response = await fetch(`/api/user-supplements?userId=${userId}`)
      const data = await response.json()
      if (data.success && data.data) {
        setAiSupplements({
          supplements: data.data.supplements || [],
          daily_schedule: data.data.daily_schedule || {
            morning: [],
            pre_workout: [],
            post_workout: [],
            evening: []
          }
        })
      }
    } catch (error) {
      console.error("Error loading AI supplements:", error)
    }
  }

  const handleGenerateAIPlan = async () => {
    setGenerating(true)
    try {
      const response = await fetch("/api/meal-plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          goal: aiGoal,
          restrictions: aiRestrictions,
          preferences: aiPreferences,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setShowAIDialog(false)
        await loadMealPlan()
      } else {
        alert("Erro ao gerar plano: " + data.error)
      }
    } catch (error) {
      console.error("[v0] Error generating AI plan:", error)
      alert("Erro ao gerar plano alimentar. Tente novamente.")
    } finally {
      setGenerating(false)
    }
  }

  const filteredSupplements = selectedCategory 
    ? supplements.filter(s => s.category === selectedCategory)
    : supplements

  const handleExportNutritionPDF = async () => {
    if (!mealPlan) return
    setIsGeneratingNutritionPDF(true)
    try {
      const generator = new FitnessPDFGenerator()
      const meals = mealPlan.meals.map(m => ({
        time: m.time,
        name: m.name,
        calories: m.calories,
        tip: m.tip || "",
        foods: m.foods.map(f => {
          if (f.isSupplement) return `SUPLEMENTO: ${f.description}`
          if (f.isAvoid) return f.description
          return f.description
        })
      }))

      const blob = generator.generateNutritionPDF(userName || userId, meals, mealPlan.totalCalories, {
        primary: preferences.theme_primary,
        secondary: preferences.theme_secondary,
      })

      await sharePDF(blob, `plano-nutricao-${userId}.pdf`)
    } catch (error) {
      console.error("[v0] Error generating nutrition PDF:", error)
      alert("Erro ao gerar PDF. Tente novamente.")
    } finally {
      setIsGeneratingNutritionPDF(false)
    }
  }

  const handleExportSupplementsPDF = async () => {
    setIsGeneratingSupplementsPDF(true)
    try {
      const generator = new FitnessPDFGenerator()

      const blob = generator.generateSupplementsPDF(userName || userId, supplements, {
        primary: preferences.theme_primary,
        secondary: preferences.theme_secondary,
      })

      await sharePDF(blob, `plano-suplementos-${userId}.pdf`)
    } catch (error) {
      console.error("[v0] Error generating supplements PDF:", error)
      alert("Erro ao gerar PDF. Tente novamente.")
    } finally {
      setIsGeneratingSupplementsPDF(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Nutricao & Alimentacao</h2>
          <p className="text-gray-300">Plano personalizado</p>
        </div>
        <Card className="p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-white/50" />
        </Card>
      </div>
    )
  }

  // Sem plano - mostrar opcao de usar IA
  if (!mealPlan) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Nutricao & Alimentacao</h2>
          <p className="text-gray-300">Plano personalizado</p>
        </div>
        
        <Card className="p-8 text-center bg-gradient-to-br from-white/10 to-white/5 border-white/10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${preferences.theme_primary}20` }}>
            <UtensilsCrossed className="w-8 h-8" style={{ color: preferences.theme_primary }} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Nenhum plano alimentar configurado</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Voce ainda nao tem um plano alimentar personalizado. Use nossa IA para criar um plano baseado nos seus objetivos e preferencias!
          </p>
          <Button 
            onClick={() => setShowAIDialog(true)}
            className="gap-2"
            style={{ backgroundColor: preferences.theme_primary }}
          >
            <Sparkles className="w-4 h-4" />
            Criar Plano com IA
          </Button>
        </Card>

        {/* Dialog de Geracao com IA */}
        <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
          <DialogContent className="bg-[#1a1a2e] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" style={{ color: preferences.theme_primary }} />
                Gerar Plano Alimentar com IA
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Nosso sistema de IA vai criar um plano alimentar personalizado baseado nos seus dados e preferencias.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Objetivo Principal</Label>
                <Select value={aiGoal} onValueChange={setAiGoal}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Selecione seu objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
                    <SelectItem value="hipertrofia">Hipertrofia / Ganho de Massa</SelectItem>
                    <SelectItem value="manutencao">Manutencao de Peso</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="restrictions">Restricoes Alimentares (opcional)</Label>
                <Textarea 
                  id="restrictions"
                  placeholder="Ex: Intolerancia a lactose, alergia a frutos do mar, vegetariano..."
                  value={aiRestrictions}
                  onChange={(e) => setAiRestrictions(e.target.value)}
                  className="bg-white/5 border-white/10 resize-none"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferences">Preferencias (opcional)</Label>
                <Textarea 
                  id="preferences"
                  placeholder="Ex: Prefiro refeicoes rapidas, nao gosto de peixe, treino de manha..."
                  value={aiPreferences}
                  onChange={(e) => setAiPreferences(e.target.value)}
                  className="bg-white/5 border-white/10 resize-none"
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAIDialog(false)} disabled={generating}>
                Cancelar
              </Button>
              <Button 
                onClick={handleGenerateAIPlan} 
                disabled={generating}
                style={{ backgroundColor: preferences.theme_primary }}
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar Plano
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Secao de Suplementos (mesmo sem plano) */}
        {supplements.length > 0 && (
          <SupplementsSection 
            supplements={supplements}
            filteredSupplements={filteredSupplements}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            expandedSupplement={expandedSupplement}
            setExpandedSupplement={setExpandedSupplement}
            isGeneratingSupplementsPDF={isGeneratingSupplementsPDF}
            handleExportSupplementsPDF={handleExportSupplementsPDF}
            preferences={preferences}
            userId={userId}
          />
        )}
      </div>
    )
  }

  // Tem plano - mostrar completo
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Nutricao & Alimentacao</h2>
          <div className="flex items-center gap-2">
            <p className="text-gray-300">{mealPlan.name}</p>
            {mealPlan.isAiGenerated && (
              <Badge variant="outline" className="text-xs" style={{ borderColor: preferences.theme_primary, color: preferences.theme_primary }}>
                <Sparkles className="w-3 h-3 mr-1" />
                Gerado por IA
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAIDialog(true)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Novo Plano IA
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportNutritionPDF} disabled={isGeneratingNutritionPDF}>
            {isGeneratingNutritionPDF ? (
              <>Gerando...</>
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Metas Diarias */}
      <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Metas Diarias</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Flame className="w-6 h-6 mx-auto mb-2" style={{ color: preferences.theme_primary }} />
            <p className="text-2xl font-bold text-white">{mealPlan.totalCalories}</p>
            <p className="text-sm text-gray-300">Calorias</p>
          </div>
          <div className="text-center">
            <Apple className="w-6 h-6 mx-auto mb-2" style={{ color: preferences.theme_accent }} />
            <p className="text-2xl font-bold text-white">{mealPlan.proteinGoal}g</p>
            <p className="text-sm text-gray-300">Proteina</p>
          </div>
          <div className="text-center">
            <Droplets className="w-6 h-6 mx-auto mb-2" style={{ color: preferences.theme_accent }} />
            <p className="text-2xl font-bold text-white">{mealPlan.waterGoal}L</p>
            <p className="text-sm text-gray-300">Agua</p>
          </div>
          <div className="text-center">
            <Pill className="w-6 h-6 mx-auto mb-2" style={{ color: preferences.theme_primary }} />
            <p className="text-2xl font-bold text-white">{mealPlan.fatGoal}g</p>
            <p className="text-sm text-gray-300">Gorduras</p>
          </div>
        </div>
      </Card>

      {/* Plano Alimentar */}
      <Card className="p-6 bg-white/5 border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <UtensilsCrossed className="w-6 h-6" style={{ color: preferences.theme_primary }} />
          Plano Alimentar Diario
        </h3>
        <div className="space-y-4">
          {mealPlan.meals.map((meal, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border-2 hover:border-opacity-60 transition-all bg-white/5"
              style={{ borderColor: `${preferences.theme_primary}40` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${preferences.theme_primary}, ${preferences.theme_accent})`,
                  }}
                >
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-white">{meal.name}</h4>
                  <p className="text-sm text-gray-300">{meal.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: preferences.theme_primary }}>
                    {meal.calories} kcal
                  </p>
                </div>
              </div>
              <ul className="space-y-2 ml-2">
                {meal.foods.map((food, foodIdx) => {
                  return (
                    <li key={foodIdx} className="text-sm flex items-start gap-2">
                      <span 
                        style={{ color: food.isSupplement ? "#8b5cf6" : food.isAvoid ? "#ef4444" : preferences.theme_primary }} 
                        className="mt-1"
                      >
                        {food.isSupplement ? "+" : food.isAvoid ? "!" : "-"}
                      </span>
                      <span className={`flex-1 ${food.isSupplement ? "text-purple-300 font-medium" : food.isAvoid ? "text-red-300" : "text-gray-200"}`}>
                        {food.isSupplement ? `SUPLEMENTO: ${food.description}` : food.description}
                      </span>
                    </li>
                  )
                })}
              </ul>
              {meal.tip && (
                <div className="mt-3 p-2 rounded bg-white/5 border-l-2" style={{ borderColor: preferences.theme_accent }}>
                  <p className="text-xs text-gray-400 italic">
                    <span className="text-yellow-500">Dica:</span> {meal.tip}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: `${preferences.theme_primary}20` }}>
          <p className="font-bold text-center text-lg text-white">Total Diario: {mealPlan.totalCalories} calorias</p>
        </div>
      </Card>

      {/* Dialog de Geracao com IA */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="bg-[#1a1a2e] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: preferences.theme_primary }} />
              Gerar Novo Plano com IA
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Isso vai substituir seu plano atual por um novo gerado pela IA.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Objetivo Principal</Label>
              <Select value={aiGoal} onValueChange={setAiGoal}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Selecione seu objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
                  <SelectItem value="hipertrofia">Hipertrofia / Ganho de Massa</SelectItem>
                  <SelectItem value="manutencao">Manutencao de Peso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="restrictions">Restricoes Alimentares (opcional)</Label>
              <Textarea 
                id="restrictions"
                placeholder="Ex: Intolerancia a lactose, alergia a frutos do mar, vegetariano..."
                value={aiRestrictions}
                onChange={(e) => setAiRestrictions(e.target.value)}
                className="bg-white/5 border-white/10 resize-none"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferences">Preferencias (opcional)</Label>
              <Textarea 
                id="preferences"
                placeholder="Ex: Prefiro refeicoes rapidas, nao gosto de peixe, treino de manha..."
                value={aiPreferences}
                onChange={(e) => setAiPreferences(e.target.value)}
                className="bg-white/5 border-white/10 resize-none"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAIDialog(false)} disabled={generating}>
              Cancelar
            </Button>
            <Button 
              onClick={handleGenerateAIPlan} 
              disabled={generating}
              style={{ backgroundColor: preferences.theme_primary }}
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar Plano
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Secao de Suplementos */}
      {supplements.length > 0 && (
        <SupplementsSection 
          supplements={supplements}
          filteredSupplements={filteredSupplements}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          expandedSupplement={expandedSupplement}
          setExpandedSupplement={setExpandedSupplement}
          isGeneratingSupplementsPDF={isGeneratingSupplementsPDF}
          handleExportSupplementsPDF={handleExportSupplementsPDF}
          preferences={preferences}
          userId={userId}
        />
      )}

      {/* Suplementos Gerados por IA */}
      {aiSupplements && aiSupplements.supplements.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              Suplementos Personalizados (IA)
            </h3>
            <Badge variant="outline" className="text-cyan-400 border-cyan-400">
              Gerado por IA
            </Badge>
          </div>

          {/* Cronograma Diario */}
          {(aiSupplements.daily_schedule.morning.length > 0 || 
            aiSupplements.daily_schedule.pre_workout.length > 0 ||
            aiSupplements.daily_schedule.post_workout.length > 0 ||
            aiSupplements.daily_schedule.evening.length > 0) && (
            <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {aiSupplements.daily_schedule.morning.length > 0 && (
                <div className="p-3 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-cyan-400 font-semibold text-sm">Manha</p>
                  <ul className="mt-1 space-y-1">
                    {aiSupplements.daily_schedule.morning.map((item, idx) => (
                      <li key={idx} className="text-xs text-gray-300">- {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {aiSupplements.daily_schedule.pre_workout.length > 0 && (
                <div className="p-3 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-orange-400 font-semibold text-sm">Pre-treino</p>
                  <ul className="mt-1 space-y-1">
                    {aiSupplements.daily_schedule.pre_workout.map((item, idx) => (
                      <li key={idx} className="text-xs text-gray-300">- {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {aiSupplements.daily_schedule.post_workout.length > 0 && (
                <div className="p-3 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-green-400 font-semibold text-sm">Pos-treino</p>
                  <ul className="mt-1 space-y-1">
                    {aiSupplements.daily_schedule.post_workout.map((item, idx) => (
                      <li key={idx} className="text-xs text-gray-300">- {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {aiSupplements.daily_schedule.evening.length > 0 && (
                <div className="p-3 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                  <p className="text-purple-400 font-semibold text-sm">Noite</p>
                  <ul className="mt-1 space-y-1">
                    {aiSupplements.daily_schedule.evening.map((item, idx) => (
                      <li key={idx} className="text-xs text-gray-300">- {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Lista de Suplementos */}
          <div className="space-y-3">
            {aiSupplements.supplements.map((supp, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                    <Pill className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{supp.name}</h4>
                    <p className="text-cyan-400 text-sm">{supp.dosage} - {supp.timing}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {supp.benefits.map((benefit, bIdx) => (
                        <span key={bIdx} className="px-2 py-0.5 bg-white/[0.05] rounded text-xs text-gray-400">
                          {benefit}
                        </span>
                      ))}
                    </div>
                    {supp.warnings && (
                      <div className="flex items-start gap-1 mt-2 p-2 bg-yellow-500/10 rounded">
                        <AlertCircle className="w-3 h-3 text-yellow-500 mt-0.5 shrink-0" />
                        <p className="text-yellow-200 text-xs">{supp.warnings}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Guia Rapido de Horarios */}
      <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6" style={{ color: preferences.theme_primary }} />
          Guia Rapido de Horarios - Suplementos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-white/5">
            <h4 className="font-semibold text-white mb-2">Ao Acordar / Manha</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>- Multivitaminico (com cafe da manha)</li>
              <li>- Colageno (pode ser em jejum)</li>
              <li>- Termogenico (se usar)</li>
              <li>- Vitamina D3</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <h4 className="font-semibold text-white mb-2">Pre-Treino (30min antes)</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>- Cafeina (se usar)</li>
              <li>- L-Carnitina (antes do cardio)</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <h4 className="font-semibold text-white mb-2">Durante o Treino</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>- BCAA (em 500ml de agua)</li>
              <li>- Agua (beba bastante!)</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <h4 className="font-semibold text-white mb-2">Pos-Treino (ate 30min)</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>- Whey Protein (imediato)</li>
              <li>- Creatina (pode ser junto)</li>
              <li>- Carboidrato (banana, batata doce)</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <h4 className="font-semibold text-white mb-2">Com Refeicoes</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>- Omega 3 (almoco e jantar)</li>
              <li>- CLA (dividido nas refeicoes)</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <h4 className="font-semibold text-white mb-2">Antes de Dormir</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>- Magnesio/ZMA</li>
              <li>- Glutamina (opcional)</li>
              <li>- Colageno (alternativa)</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Avisos sobre Suplementacao */}
      <Card
        className="p-6 border"
        style={{ backgroundColor: "#ef444415", borderColor: "#ef444440" }}
      >
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          Avisos Importantes sobre Suplementacao
        </h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-red-500">!</span>
            Consulte um medico antes de iniciar qualquer suplementacao
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">!</span>
            Suplementos NAO substituem uma alimentacao equilibrada
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">!</span>
            Respeite as dosagens recomendadas - mais NAO e melhor
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">!</span>
            Hidrate-se bem (minimo 3L de agua por dia)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">!</span>
            Informe seu medico sobre todos os suplementos que usa
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">!</span>
            Gestantes e lactantes devem evitar a maioria dos suplementos
          </li>
        </ul>
      </Card>

      {/* Notas de Nutricao */}
      <Card
        className="p-6 border"
        style={{ backgroundColor: `${preferences.theme_accent}10`, borderColor: `${preferences.theme_accent}30` }}
      >
        <h3 className="text-lg font-bold text-white mb-3">Dicas de Nutricao</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>- Beba pelo menos 3 litros de agua por dia</li>
          <li>- Evite carboidratos simples (acucar, pao branco, refrigerantes)</li>
          <li>- Priorize proteinas magras em todas as refeicoes</li>
          <li>- Carboidratos concentrados no pre e pos-treino</li>
          <li>- Use temperos naturais (alho, cebola, ervas) ao inves de sal</li>
          <li>- Ajuste as porcoes conforme sua fome e energia</li>
          <li>- Consulte um nutricionista para personalizar seu plano</li>
          <li className="text-white font-semibold">- IMPORTANTE: Este e um plano base, ajuste conforme necessario</li>
        </ul>
      </Card>
    </div>
  )
}

// Componente separado para a secao de suplementos
function SupplementsSection({
  supplements,
  filteredSupplements,
  selectedCategory,
  setSelectedCategory,
  expandedSupplement,
  setExpandedSupplement,
  isGeneratingSupplementsPDF,
  handleExportSupplementsPDF,
  preferences,
  userId,
}: {
  supplements: ReturnType<typeof getSupplementsByUser>
  filteredSupplements: ReturnType<typeof getSupplementsByUser>
  selectedCategory: string | null
  setSelectedCategory: (cat: string | null) => void
  expandedSupplement: string | null
  setExpandedSupplement: (name: string | null) => void
  isGeneratingSupplementsPDF: boolean
  handleExportSupplementsPDF: () => void
  preferences: UserPreferences
  userId: string
}) {
  return (
    <Card className="p-6 bg-white/5 border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Pill className="w-6 h-6" style={{ color: preferences.theme_primary }} />
          Suplementacao Recomendada
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportSupplementsPDF}
          disabled={isGeneratingSupplementsPDF}
        >
          {isGeneratingSupplementsPDF ? (
            <>Gerando...</>
          ) : (
            <>
              <Share2 className="w-4 h-4 mr-2" />
              PDF
            </>
          )}
        </Button>
      </div>

      {/* Filtro por Categoria */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge 
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedCategory(null)}
        >
          Todos ({supplements.length})
        </Badge>
        {Object.entries(supplementCategories).map(([key, cat]) => {
          const count = supplements.filter(s => s.category === key).length
          if (count === 0) return null
          return (
            <Badge 
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              className="cursor-pointer"
              style={selectedCategory === key ? { backgroundColor: cat.color } : {}}
              onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
            >
              {cat.name} ({count})
            </Badge>
          )
        })}
      </div>

      <div className="space-y-4">
        {filteredSupplements.map((supp, idx) => {
          const isExpanded = expandedSupplement === supp.name
          const catInfo = supplementCategories[supp.category as keyof typeof supplementCategories]
          
          return (
            <div
              key={idx}
              className="rounded-lg border-2 overflow-hidden transition-all"
              style={{ borderColor: `${catInfo?.color || preferences.theme_primary}40` }}
            >
              {/* Header do Suplemento */}
              <div 
                className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpandedSupplement(isExpanded ? null : supp.name)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: catInfo?.color || preferences.theme_primary }}
                  >
                    <Pill className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-lg text-white">{supp.name}</h4>
                      <Badge variant="outline" className="text-xs" style={{ borderColor: catInfo?.color, color: catInfo?.color }}>
                        {catInfo?.name}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium" style={{ color: preferences.theme_primary }}>
                      {supp.dosage} - {supp.timing}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">{supp.purpose}</p>
                  </div>
                  <div className="shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Detalhes Expandidos */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-white/10">
                  {/* Como Tomar */}
                  <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: `${catInfo?.color}15` }}>
                    <h5 className="font-semibold text-white flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4" style={{ color: catInfo?.color }} />
                      Como Tomar
                    </h5>
                    <p className="text-sm text-gray-300">{supp.howToUse}</p>
                  </div>

                  {/* Dicas */}
                  <div className="mt-4">
                    <h5 className="font-semibold text-white flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Dicas Importantes
                    </h5>
                    <ul className="space-y-2">
                      {supp.tips.map((tip, tipIdx) => (
                        <li key={tipIdx} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-green-500 mt-0.5">&#10003;</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
