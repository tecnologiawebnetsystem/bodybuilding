"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, Utensils, Droplets, Clock, ChefHat, Save, Share2, Check, User } from "lucide-react"

interface Food {
  name: string
  portion: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface Meal {
  name: string
  time: string
  calories: number
  foods: Food[]
  tips?: string
}

interface MealPlan {
  dailyCalories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
  meals: Meal[]
  hydration: {
    dailyWater: number
    tips: string[]
  }
  supplements?: Array<{
    name: string
    dosage: string
    timing: string
    benefit: string
  }>
  generalTips: string[]
}

interface MealSuggestion {
  name: string
  description: string
  ingredients: Array<{ item: string; quantity: string }>
  preparation: string[]
  nutritionInfo: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  prepTime: string
  tips: string[]
}

const goals = [
  { value: "ganho-massa", label: "Ganho de Massa" },
  { value: "emagrecimento", label: "Emagrecimento" },
  { value: "manutencao", label: "Manutencao" },
  { value: "definicao", label: "Definicao" },
]

const activityLevels = [
  { value: "sedentario", label: "Sedentario" },
  { value: "leve", label: "Atividade Leve" },
  { value: "moderado", label: "Moderado" },
  { value: "intenso", label: "Intenso" },
  { value: "muito-intenso", label: "Muito Intenso" },
]

interface UserProfile {
  height?: number
  current_weight?: number
  target_weight?: number
  gender?: string
  age?: number
}

interface NutritionAssistantProps {
  userProfile?: UserProfile | null
  onSave?: (title: string, data: MealPlan | MealSuggestion) => void
}

const loadingSteps = [
  { text: "Calculando suas necessidades caloricas...", duration: 1500 },
  { text: "Definindo distribuicao de macros...", duration: 2000 },
  { text: "Selecionando alimentos ideais...", duration: 2000 },
  { text: "Montando suas refeicoes...", duration: 1500 },
  { text: "Finalizando plano alimentar...", duration: 1000 },
]

const mealTypes = [
  { value: "cafe-da-manha", label: "Cafe da Manha" },
  { value: "lanche-manha", label: "Lanche da Manha" },
  { value: "almoco", label: "Almoco" },
  { value: "lanche-tarde", label: "Lanche da Tarde" },
  { value: "jantar", label: "Jantar" },
  { value: "ceia", label: "Ceia" },
  { value: "pre-treino", label: "Pre-Treino" },
  { value: "pos-treino", label: "Pos-Treino" },
]

export function NutritionAssistant({ userProfile, onSave }: NutritionAssistantProps) {
  const [activeTab, setActiveTab] = useState<"plan" | "suggestion">("plan")
  const [isLoading, setIsLoading] = useState(false)
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [suggestion, setSuggestion] = useState<MealSuggestion | null>(null)
  const [loadingStep, setLoadingStep] = useState(0)
  const [saved, setSaved] = useState(false)

  const [planForm, setPlanForm] = useState({
    goal: "ganho-massa",
    weight: "70",
    height: "170",
    age: "30",
    gender: "masculino",
    activityLevel: "moderado",
    restrictions: "",
  })

  // Pre-preencher dados do perfil
  useEffect(() => {
    if (userProfile) {
      setPlanForm(prev => ({
        ...prev,
        weight: userProfile.current_weight?.toString() || prev.weight,
        height: userProfile.height?.toString() || prev.height,
        age: userProfile.age?.toString() || prev.age,
        gender: userProfile.gender === "male" ? "masculino" : userProfile.gender === "female" ? "feminino" : prev.gender,
      }))

      // Determinar objetivo baseado no peso
      if (userProfile.current_weight && userProfile.target_weight) {
        if (userProfile.target_weight > userProfile.current_weight) {
          setPlanForm(prev => ({ ...prev, goal: "ganho-massa" }))
        } else if (userProfile.target_weight < userProfile.current_weight) {
          setPlanForm(prev => ({ ...prev, goal: "emagrecimento" }))
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

  const [suggestionForm, setSuggestionForm] = useState({
    mealType: "almoco",
    goal: "ganho-massa",
    restrictions: "",
  })

  const handleGeneratePlan = async () => {
    setIsLoading(true)
    setMealPlan(null)

    try {
      const response = await fetch("/api/ai/nutrition-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "meal-plan", ...planForm }),
      })

      const data = await response.json()
      setMealPlan(data.mealPlan)
    } catch (error) {
      console.error("Erro ao gerar plano:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateSuggestion = async () => {
    setIsLoading(true)
    setSuggestion(null)
    setSaved(false)

    try {
      const response = await fetch("/api/ai/nutrition-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: "meal-suggestion",
          preferences: suggestionForm.mealType,
          goal: suggestionForm.goal,
          restrictions: suggestionForm.restrictions,
        }),
      })

      const data = await response.json()
      setSuggestion(data.suggestion)
    } catch (error) {
      console.error("Erro ao gerar sugestao:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    if (onSave) {
      if (mealPlan) {
        onSave(`Plano ${mealPlan.dailyCalories}kcal`, mealPlan)
      } else if (suggestion) {
        onSave(suggestion.name, suggestion)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const handleShare = async () => {
    let text = ""
    
    if (mealPlan) {
      text = `Plano Alimentar - ${mealPlan.dailyCalories}kcal/dia\n\nMacros:\n- Proteina: ${mealPlan.macros.protein}g\n- Carboidratos: ${mealPlan.macros.carbs}g\n- Gorduras: ${mealPlan.macros.fat}g\n\nRefeicoes:\n${mealPlan.meals.map(m => `- ${m.name} (${m.time}): ${m.calories}kcal`).join('\n')}\n\nGerado por IA - Bodybuilding App`
    } else if (suggestion) {
      text = `Receita: ${suggestion.name}\n\n${suggestion.description}\n\nIngredientes:\n${suggestion.ingredients.map(i => `- ${i.quantity} ${i.item}`).join('\n')}\n\nGerado por IA - Bodybuilding App`
    }
    
    if (navigator.share) {
      try {
        await navigator.share({ title: "Plano Alimentar", text })
      } catch {
        navigator.clipboard.writeText(text)
      }
    } else {
      navigator.clipboard.writeText(text)
      alert("Plano copiado para a area de transferencia!")
    }
  }

  return (
    <div className="space-y-6">
      {/* Dados do Perfil */}
      {userProfile && (userProfile.current_weight || userProfile.height) && (
        <div className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-lg border border-white/[0.08]">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-400">Dados do seu perfil aplicados</p>
            <p className="text-white text-sm">
              {userProfile.current_weight && `${userProfile.current_weight}kg`}
              {userProfile.height && userProfile.current_weight && " • "}
              {userProfile.height && `${userProfile.height}cm`}
              {userProfile.age && ` • ${userProfile.age} anos`}
            </p>
          </div>
          <Check className="w-5 h-5 text-green-400" />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/[0.03] rounded-lg border border-white/[0.08]">
        <button
          onClick={() => setActiveTab("plan")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "plan"
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Utensils className="w-4 h-4 inline mr-2" />
          Plano Alimentar
        </button>
        <button
          onClick={() => setActiveTab("suggestion")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "suggestion"
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <ChefHat className="w-4 h-4 inline mr-2" />
          Sugestao de Refeicao
        </button>
      </div>

      {/* Plano Alimentar */}
      {activeTab === "plan" && (
        <>
          <Card className="bg-white/[0.03] border-white/[0.08]">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Objetivo</Label>
                  <select
                    value={planForm.goal}
                    onChange={(e) => setPlanForm({ ...planForm, goal: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:border-green-500 focus:outline-none"
                  >
                    {goals.map((g) => (
                      <option key={g.value} value={g.value} className="bg-gray-900">{g.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Peso (kg)</Label>
                  <input
                    type="number"
                    value={planForm.weight}
                    onChange={(e) => setPlanForm({ ...planForm, weight: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Altura (cm)</Label>
                  <input
                    type="number"
                    value={planForm.height}
                    onChange={(e) => setPlanForm({ ...planForm, height: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Idade</Label>
                  <input
                    type="number"
                    value={planForm.age}
                    onChange={(e) => setPlanForm({ ...planForm, age: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Sexo</Label>
                  <select
                    value={planForm.gender}
                    onChange={(e) => setPlanForm({ ...planForm, gender: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:border-green-500 focus:outline-none"
                  >
                    <option value="masculino" className="bg-gray-900">Masculino</option>
                    <option value="feminino" className="bg-gray-900">Feminino</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Nivel de Atividade</Label>
                  <select
                    value={planForm.activityLevel}
                    onChange={(e) => setPlanForm({ ...planForm, activityLevel: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:border-green-500 focus:outline-none"
                  >
                    {activityLevels.map((a) => (
                      <option key={a.value} value={a.value} className="bg-gray-900">{a.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Restricoes Alimentares (opcional)</Label>
                <input
                  type="text"
                  value={planForm.restrictions}
                  onChange={(e) => setPlanForm({ ...planForm, restrictions: e.target.value })}
                  placeholder="Ex: Vegetariano, intolerancia a lactose, alergia a gluten..."
                  className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none"
                />
              </div>

              <Button
                onClick={handleGeneratePlan}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Gerando plano alimentar...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Gerar Plano Alimentar
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
                            ? "bg-emerald-500 text-white animate-pulse" 
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

          {/* Resultado do Plano */}
          {mealPlan && (
            <div className="space-y-4 animate-fade-in">
              {/* Botoes de Acao */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={saved}
                  className={`flex-1 ${
                    saved 
                      ? "bg-green-500 hover:bg-green-500" 
                      : "bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1]"
                  }`}
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Salvo!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Plano
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleShare}
                  className="flex-1 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1]"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>

              {/* Resumo */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-white">{mealPlan.dailyCalories}</p>
                    <p className="text-gray-400 text-sm">kcal/dia</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/[0.03] border-white/[0.08]">
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-red-400">{mealPlan.macros.protein}g</p>
                    <p className="text-gray-400 text-sm">Proteina</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/[0.03] border-white/[0.08]">
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-yellow-400">{mealPlan.macros.carbs}g</p>
                    <p className="text-gray-400 text-sm">Carboidratos</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/[0.03] border-white/[0.08]">
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-blue-400">{mealPlan.macros.fat}g</p>
                    <p className="text-gray-400 text-sm">Gorduras</p>
                  </CardContent>
                </Card>
              </div>

              {/* Refeicoes */}
              <div className="space-y-3">
                {mealPlan.meals.map((meal, index) => (
                  <Card key={index} className="bg-white/[0.03] border-white/[0.08]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Utensils className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{meal.name}</h4>
                            <p className="text-gray-500 text-sm flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {meal.time}
                            </p>
                          </div>
                        </div>
                        <span className="text-green-400 font-medium">{meal.calories} kcal</span>
                      </div>
                      <div className="space-y-2">
                        {meal.foods.map((food, fIndex) => (
                          <div key={fIndex} className="flex justify-between items-center text-sm p-2 bg-white/[0.02] rounded">
                            <span className="text-gray-300">{food.name}</span>
                            <span className="text-gray-500">{food.portion}</span>
                          </div>
                        ))}
                      </div>
                      {meal.tips && (
                        <p className="text-gray-400 text-sm mt-3 italic">{meal.tips}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Hidratacao */}
              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
                    <Droplets className="w-5 h-5" />
                    Hidratacao
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white mb-2">{mealPlan.hydration.dailyWater}L por dia</p>
                  <ul className="space-y-1">
                    {mealPlan.hydration.tips.map((tip, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-blue-400">•</span> {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Sugestao de Refeicao */}
      {activeTab === "suggestion" && (
        <>
          <Card className="bg-white/[0.03] border-white/[0.08]">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Tipo de Refeicao</Label>
                  <select
                    value={suggestionForm.mealType}
                    onChange={(e) => setSuggestionForm({ ...suggestionForm, mealType: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:border-green-500 focus:outline-none"
                  >
                    {mealTypes.map((m) => (
                      <option key={m.value} value={m.value} className="bg-gray-900">{m.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Objetivo</Label>
                  <select
                    value={suggestionForm.goal}
                    onChange={(e) => setSuggestionForm({ ...suggestionForm, goal: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:border-green-500 focus:outline-none"
                  >
                    {goals.map((g) => (
                      <option key={g.value} value={g.value} className="bg-gray-900">{g.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Restricoes</Label>
                  <input
                    type="text"
                    value={suggestionForm.restrictions}
                    onChange={(e) => setSuggestionForm({ ...suggestionForm, restrictions: e.target.value })}
                    placeholder="Ex: Sem lactose..."
                    className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>

              <Button
                onClick={handleGenerateSuggestion}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Gerando sugestao...
                  </>
                ) : (
                  <>
                    <ChefHat className="w-5 h-5 mr-2" />
                    Gerar Sugestao de Refeicao
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Resultado da Sugestao */}
          {suggestion && (
            <Card className="bg-white/[0.03] border-white/[0.08] animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl text-white">{suggestion.name}</CardTitle>
                <p className="text-gray-400">{suggestion.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {suggestion.prepTime}
                  </span>
                  <span className="text-sm text-green-400">{suggestion.nutritionInfo.calories} kcal</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Macros */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white/[0.02] rounded-lg">
                    <p className="text-red-400 font-bold">{suggestion.nutritionInfo.protein}g</p>
                    <p className="text-gray-500 text-xs">Proteina</p>
                  </div>
                  <div className="text-center p-3 bg-white/[0.02] rounded-lg">
                    <p className="text-yellow-400 font-bold">{suggestion.nutritionInfo.carbs}g</p>
                    <p className="text-gray-500 text-xs">Carbs</p>
                  </div>
                  <div className="text-center p-3 bg-white/[0.02] rounded-lg">
                    <p className="text-blue-400 font-bold">{suggestion.nutritionInfo.fat}g</p>
                    <p className="text-gray-500 text-xs">Gordura</p>
                  </div>
                </div>

                {/* Ingredientes */}
                <div>
                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                    <Apple className="w-4 h-4 text-green-400" /> Ingredientes
                  </h4>
                  <ul className="space-y-1">
                    {suggestion.ingredients.map((ing, index) => (
                      <li key={index} className="text-gray-300 text-sm flex justify-between">
                        <span>{ing.item}</span>
                        <span className="text-gray-500">{ing.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preparo */}
                <div>
                  <h4 className="text-white font-medium mb-2">Modo de Preparo</h4>
                  <ol className="space-y-2">
                    {suggestion.preparation.map((step, index) => (
                      <li key={index} className="text-gray-300 text-sm flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold shrink-0">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Dicas */}
                {suggestion.tips.length > 0 && (
                  <div>
                    <h4 className="text-yellow-400 font-medium mb-2">Dicas</h4>
                    <ul className="space-y-1">
                      {suggestion.tips.map((tip, index) => (
                        <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-yellow-400">•</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
