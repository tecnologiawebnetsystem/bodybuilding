"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dumbbell, Loader2, Sparkles, Clock, Target, Zap, ChevronDown, ChevronUp, Save, Share2, Check, User } from "lucide-react"

interface Exercise {
  name: string
  sets: number
  reps: string
  rest: string
  muscleGroup: string
  instructions: string
  tips?: string
}

interface WarmupExercise {
  exercise: string
  duration: string
  instructions: string
}

interface Workout {
  name: string
  description: string
  duration: string
  difficulty: string
  warmup: WarmupExercise[]
  exercises: Exercise[]
  cooldown: WarmupExercise[]
  tips: string[]
}

interface UserProfile {
  height?: number
  current_weight?: number
  target_weight?: number
  gender?: string
  age?: number
}

interface WorkoutGeneratorProps {
  userProfile?: UserProfile | null
  onSave?: (title: string, data: Workout) => void
}

const goals = [
  { value: "hipertrofia", label: "Ganho de Massa" },
  { value: "emagrecimento", label: "Emagrecimento" },
  { value: "forca", label: "Forca" },
  { value: "resistencia", label: "Resistencia" },
  { value: "condicionamento", label: "Condicionamento" },
]

const levels = [
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediario" },
  { value: "avancado", label: "Avancado" },
]

const focusAreas = [
  { value: "peito", label: "Peito" },
  { value: "costas", label: "Costas" },
  { value: "ombros", label: "Ombros" },
  { value: "bracos", label: "Bracos" },
  { value: "pernas", label: "Pernas" },
  { value: "abdomen", label: "Abdomen" },
  { value: "corpo-inteiro", label: "Corpo Inteiro" },
]

const loadingSteps = [
  { text: "Analisando seu perfil...", duration: 1500 },
  { text: "Selecionando exercicios ideais...", duration: 2000 },
  { text: "Otimizando sequencia de treino...", duration: 2000 },
  { text: "Gerando instrucoes detalhadas...", duration: 1500 },
  { text: "Finalizando seu treino...", duration: 1000 },
]

export function WorkoutGenerator({ userProfile, onSave }: WorkoutGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null)
  const [loadingStep, setLoadingStep] = useState(0)
  const [saved, setSaved] = useState(false)
  
  const [formData, setFormData] = useState({
    goal: "hipertrofia",
    level: "intermediario",
    focusArea: "corpo-inteiro",
    duration: "60",
    equipment: "Academia completa",
    restrictions: "",
  })

  const [error, setError] = useState<string | null>(null)

  // Pre-preencher dados do perfil
  useEffect(() => {
    if (userProfile) {
      // Determinar objetivo baseado no peso atual vs desejado
      if (userProfile.current_weight && userProfile.target_weight) {
        if (userProfile.target_weight > userProfile.current_weight) {
          setFormData(prev => ({ ...prev, goal: "hipertrofia" }))
        } else if (userProfile.target_weight < userProfile.current_weight) {
          setFormData(prev => ({ ...prev, goal: "emagrecimento" }))
        }
      }
    }
  }, [userProfile])

  // Simular etapas de loading
  useEffect(() => {
    if (isGenerating) {
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
  }, [isGenerating])

  const handleGenerate = async () => {
    setIsGenerating(true)
    setWorkout(null)
    setError(null)
    setSaved(false)

    try {
      const response = await fetch("/api/ai/generate-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else if (data.workout) {
        setWorkout(data.workout)
      } else {
        setError("Resposta inesperada do servidor")
      }
    } catch (err) {
      console.error("Erro ao gerar treino:", err)
      setError("Erro ao conectar com o servidor. Tente novamente.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => {
    if (workout && onSave) {
      onSave(workout.name, workout)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const handleShare = async () => {
    if (!workout) return
    
    const text = `Treino: ${workout.name}\n\nExercicios:\n${workout.exercises.map((e, i) => 
      `${i + 1}. ${e.name} - ${e.sets}x${e.reps}`
    ).join('\n')}\n\nGerado por IA - Bodybuilding App`
    
    if (navigator.share) {
      try {
        await navigator.share({ title: workout.name, text })
      } catch (err) {
        // Fallback para clipboard
        navigator.clipboard.writeText(text)
      }
    } else {
      navigator.clipboard.writeText(text)
      alert("Treino copiado para a area de transferencia!")
    }
  }

  return (
    <div className="space-y-6">
      {/* Dados do Perfil */}
      {userProfile && (userProfile.current_weight || userProfile.height) && (
        <div className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-lg border border-white/[0.08]">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-400">Dados do seu perfil</p>
            <p className="text-white text-sm">
              {userProfile.current_weight && `${userProfile.current_weight}kg`}
              {userProfile.height && userProfile.current_weight && " • "}
              {userProfile.height && `${userProfile.height}cm`}
              {userProfile.gender && ` • ${userProfile.gender === "male" ? "Masculino" : "Feminino"}`}
            </p>
          </div>
          <Check className="w-5 h-5 text-green-400" />
        </div>
      )}

      {/* Form */}
      <Card className="bg-white/[0.03] border-white/[0.08]">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Objetivo */}
            <div className="space-y-2">
              <Label className="text-gray-300">Objetivo</Label>
              <select
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:border-orange-500 focus:outline-none"
              >
                {goals.map((g) => (
                  <option key={g.value} value={g.value} className="bg-gray-900">{g.label}</option>
                ))}
              </select>
            </div>

            {/* Nivel */}
            <div className="space-y-2">
              <Label className="text-gray-300">Nivel</Label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:border-orange-500 focus:outline-none"
              >
                {levels.map((l) => (
                  <option key={l.value} value={l.value} className="bg-gray-900">{l.label}</option>
                ))}
              </select>
            </div>

            {/* Area de Foco */}
            <div className="space-y-2">
              <Label className="text-gray-300">Area de Foco</Label>
              <select
                value={formData.focusArea}
                onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:border-orange-500 focus:outline-none"
              >
                {focusAreas.map((f) => (
                  <option key={f.value} value={f.value} className="bg-gray-900">{f.label}</option>
                ))}
              </select>
            </div>

            {/* Duracao */}
            <div className="space-y-2">
              <Label className="text-gray-300">Duracao (min)</Label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="30" className="bg-gray-900">30 minutos</option>
                <option value="45" className="bg-gray-900">45 minutos</option>
                <option value="60" className="bg-gray-900">60 minutos</option>
                <option value="90" className="bg-gray-900">90 minutos</option>
              </select>
            </div>

            {/* Equipamentos */}
            <div className="space-y-2 col-span-2">
              <Label className="text-gray-300">Equipamentos Disponiveis</Label>
              <input
                type="text"
                value={formData.equipment}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                placeholder="Ex: Academia completa, halteres, barra..."
                className="w-full h-10 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-gray-500 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Restricoes */}
          <div className="space-y-2">
            <Label className="text-gray-300">Restricoes ou Lesoes (opcional)</Label>
            <Textarea
              value={formData.restrictions}
              onChange={(e) => setFormData({ ...formData, restrictions: e.target.value })}
              placeholder="Ex: Dor no joelho, evitar exercicios de impacto..."
              className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-gray-500 focus:border-orange-500 min-h-[80px]"
            />
          </div>

          {/* Botao Gerar */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Gerando treino personalizado...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Gerar Treino com IA
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Loading com Etapas */}
      {isGenerating && (
        <Card className="bg-white/[0.03] border-white/[0.08] overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              {loadingSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    index < loadingStep 
                      ? "bg-green-500 text-white" 
                      : index === loadingStep 
                        ? "bg-orange-500 text-white animate-pulse" 
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

      {/* Erro */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Resultado */}
      {workout && (
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
                  Salvar Treino
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

          {/* Header do Treino */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{workout.name}</h3>
                  <p className="text-gray-400 mt-1">{workout.description}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/20 rounded-full">
                  <span className="text-orange-300 text-sm font-medium capitalize">{workout.difficulty}</span>
                </div>
              </div>
              <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span>{workout.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Target className="w-4 h-4 text-orange-400" />
                  <span>{workout.exercises.length} exercicios</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aquecimento */}
          <Card className="bg-white/[0.03] border-white/[0.08]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-orange-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Aquecimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {workout.warmup.map((item, index) => (
                <div key={index} className="p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{item.exercise}</span>
                    <span className="text-gray-400 text-sm">{item.duration}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{item.instructions}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Exercicios Principais */}
          <Card className="bg-white/[0.03] border-white/[0.08]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-orange-400" />
                Exercicios Principais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {workout.exercises.map((exercise, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-white/[0.02] rounded-lg border border-white/[0.05] hover:border-orange-500/30 transition-colors"
                >
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setExpandedExercise(expandedExercise === index ? null : index)}
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="text-white font-medium">{exercise.name}</h4>
                          <p className="text-gray-500 text-sm">{exercise.muscleGroup}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-orange-400 font-medium">{exercise.sets} x {exercise.reps}</p>
                        <p className="text-gray-500 text-sm">Descanso: {exercise.rest}</p>
                      </div>
                      {expandedExercise === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {expandedExercise === index && (
                    <div className="mt-4 pt-4 border-t border-white/[0.05] space-y-2">
                      <div>
                        <p className="text-gray-400 text-sm font-medium mb-1">Instrucoes:</p>
                        <p className="text-gray-300 text-sm">{exercise.instructions}</p>
                      </div>
                      {exercise.tips && (
                        <div>
                          <p className="text-orange-400 text-sm font-medium mb-1">Dica:</p>
                          <p className="text-gray-300 text-sm">{exercise.tips}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Volta a Calma */}
          <Card className="bg-white/[0.03] border-white/[0.08]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Volta a Calma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {workout.cooldown.map((item, index) => (
                <div key={index} className="p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{item.exercise}</span>
                    <span className="text-gray-400 text-sm">{item.duration}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{item.instructions}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Dicas */}
          {workout.tips && workout.tips.length > 0 && (
            <Card className="bg-white/[0.03] border-white/[0.08]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-yellow-400">Dicas Importantes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {workout.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300 text-sm">
                      <span className="text-yellow-400 mt-1">•</span>
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
