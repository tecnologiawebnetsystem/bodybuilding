"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Dumbbell, Clock, Share2, Sparkles, ChevronDown, ChevronUp, Play, X, Info } from "lucide-react"
import { getWorkoutsByUser, Exercise } from "@/lib/workout-data"
import { FitnessPDFGenerator, sharePDF } from "@/lib/pdf-generator"
import { getExerciseGif, ExerciseMedia } from "@/lib/exercise-gifs"

interface AIWorkout {
  name: string
  description: string
  duration: string
  difficulty: string
  warmup: Array<{ exercise: string; duration: string; instructions: string }>
  exercises: Array<{
    name: string
    sets: number
    reps: string
    rest: string
    muscleGroup: string
    instructions: string
    tips?: string
  }>
  cooldown: Array<{ exercise: string; duration: string; instructions: string }>
}

interface AIWorkoutPlan {
  type: string
  description: string
  workouts: AIWorkout[]
}

interface WorkoutsTabProps {
  userId: string
}

export function WorkoutsTab({ userId }: WorkoutsTabProps) {
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null)
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null)
  const [aiWorkoutPlan, setAiWorkoutPlan] = useState<AIWorkoutPlan | null>(null)
  const [expandedAIWorkout, setExpandedAIWorkout] = useState<number>(0)
  const [expandedAIExercise, setExpandedAIExercise] = useState<number | null>(null)
  const [loadingAI, setLoadingAI] = useState(true)
  const [selectedExercise, setSelectedExercise] = useState<{ name: string; sets: string; notes: string; media: ExerciseMedia | null } | null>(null)
  const [isGifModalOpen, setIsGifModalOpen] = useState(false)

  // Abrir modal com GIF do exercicio
  const openExerciseGif = (exercise: { name: string; sets: string; notes: string }) => {
    const media = getExerciseGif(exercise.name)
    setSelectedExercise({ ...exercise, media })
    setIsGifModalOpen(true)
  }

  const workoutPlans = getWorkoutsByUser(userId)

  // Carregar treinos da IA
  useEffect(() => {
    const loadAIWorkouts = async () => {
      setLoadingAI(true)
      try {
        const response = await fetch(`/api/user-workouts?userId=${userId}`)
        const data = await response.json()
        if (data.success && data.plan?.plan_data) {
          setAiWorkoutPlan(data.plan.plan_data)
        }
      } catch (error) {
        console.error("Error loading AI workouts:", error)
      } finally {
        setLoadingAI(false)
      }
    }
    loadAIWorkouts()
  }, [userId])

  const handleExportPDF = async () => {
    setGeneratingPDF("Plano Completo")
    try {
      const generator = new FitnessPDFGenerator()

      const userName = userId === "kleber" ? "Kleber Gonçalves" : userId === "pamela" ? "Pamela Gonçalves" : "Juliana"

      const schedule = [
        {
          day: "Segunda-feira",
          workoutName: "Treino A - Peito/Tríceps",
          description: workoutPlans.find((w) => w.name === "Treino A")?.focus,
        },
        {
          day: "Terça-feira",
          workoutName: "Treino B - Costas/Bíceps",
          description: workoutPlans.find((w) => w.name === "Treino B")?.focus,
        },
        {
          day: "Quarta-feira",
          workoutName: "Treino C - Pernas/Ombros",
          description: workoutPlans.find((w) => w.name === "Treino C")?.focus,
        },
        {
          day: "Quinta-feira",
          workoutName: "Treino A - Peito/Tríceps",
          description: workoutPlans.find((w) => w.name === "Treino A")?.focus,
        },
        {
          day: "Sexta-feira",
          workoutName: "Treino B - Costas/Bíceps",
          description: workoutPlans.find((w) => w.name === "Treino B")?.focus,
        },
      ]

      const blob = generator.generateGymWorkoutPDF(userName, schedule, { primary: "#3b82f6", secondary: "#1e40af" })

      await sharePDF(blob, `treino-musculacao-${userId}.pdf`)
    } catch {
      alert("Erro ao gerar PDF. Tente novamente.")
    } finally {
      setGeneratingPDF(null)
    }
  }

  const handleExportSingleWorkout = async (workout: any) => {
    setGeneratingPDF(workout.name)
    try {
      const generator = new FitnessPDFGenerator()
      const userName = userId === "kleber" ? "Kleber Gonçalves" : userId === "pamela" ? "Pamela Gonçalves" : "Juliana"

      const theme =
        userId === "kleber"
          ? { primary: "#3b82f6", secondary: "#1e40af" }
          : userId === "pamela"
            ? { primary: "#ec4899", secondary: "#be185d" }
            : { primary: "#84cc16", secondary: "#65a30d" }

      const blob = generator.generateGymWorkoutPDF(userName, workout, theme)
      await sharePDF(blob, `${workout.name.toLowerCase().replace(/\s+/g, "-")}-${userId}.pdf`)
    } catch {
      alert("Erro ao gerar PDF. Tente novamente.")
    } finally {
      setGeneratingPDF(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-black p-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Seus Treinos</h2>
          <p className="text-gray-300">Plano ABC personalizado</p>
        </div>
        <Button
          size="sm"
          onClick={handleExportPDF}
          disabled={generatingPDF === "Plano Completo"}
          style={{ backgroundColor: "#c2410c", color: "#ffffff" }}
        >
          {generatingPDF === "Plano Completo" ? (
            <>Gerando...</>
          ) : (
            <>
              <Share2 className="w-4 h-4 mr-2 text-white" />
              Compartilhar Plano Completo
            </>
          )}
        </Button>
      </div>

      {/* Pre-workout cardio */}
      <Card className="p-6 bg-white/5 border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-white">Aquecimento</h3>
        </div>
        <p className="text-gray-300">
          <strong className="text-white">Esteira - 10 minutos</strong> em ritmo moderado (6-7 km/h) antes de cada treino
          para preparar o corpo
        </p>
      </Card>

      {workoutPlans.map((workout) => (
        <Card key={workout.name} className="overflow-hidden bg-white/5 border-white/10">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-orange-500 flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{workout.name}</h3>
                    <p className="text-sm text-gray-300">{workout.focus}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {workout.muscleGroups.map((muscle) => (
                    <Badge key={muscle} variant="secondary" className="text-white">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleExportSingleWorkout(workout)}
                  disabled={generatingPDF === workout.name}
                  style={{ backgroundColor: "#c2410c", color: "#ffffff" }}
                >
                  {generatingPDF === workout.name ? (
                    <>Gerando...</>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-white" />
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setExpandedWorkout(expandedWorkout === workout.name ? null : workout.name)}
                  style={{ backgroundColor: "#c2410c", color: "#ffffff" }}
                >
                  {expandedWorkout === workout.name ? "Fechar" : "Ver Exercícios"}
                </Button>
              </div>
            </div>

            {expandedWorkout === workout.name && (
              <div className="space-y-3 mt-6 pt-6 border-t border-white/10">
                {workout.exercises.map((exercise, idx) => {
                  const hasGif = !!getExerciseGif(exercise.name)
                  return (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-lg bg-white/5 ${hasGif ? "cursor-pointer hover:bg-white/10 transition-colors" : ""}`}
                      onClick={() => hasGif && openExerciseGif(exercise)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white">{exercise.name}</h4>
                            {hasGif && (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                                <Play className="w-3 h-3" />
                                Ver GIF
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-orange-400 font-medium mt-1">{exercise.sets}</p>
                          {exercise.notes && <p className="text-sm text-gray-300 italic mt-1">{exercise.notes}</p>}
                        </div>
                        {hasGif && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                            onClick={(e) => {
                              e.stopPropagation()
                              openExerciseGif(exercise)
                            }}
                          >
                            <Play className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </Card>
      ))}

      {/* Post-workout cardio */}
      <Card className="p-6 bg-white/5 border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-white">Finalização</h3>
        </div>
        <p className="text-gray-300">
          <strong className="text-white">Esteira - 15 minutos</strong> em ritmo leve-moderado (5-6 km/h) após cada
          treino para queima de gordura
        </p>
      </Card>

      {/* Treinos Gerados por IA */}
      {aiWorkoutPlan && (
        <div className="space-y-4 mt-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Plano {aiWorkoutPlan.type} (IA)</h3>
              <p className="text-gray-400 text-sm">{aiWorkoutPlan.description}</p>
            </div>
          </div>

          {/* Seletor de Treinos IA */}
          {aiWorkoutPlan.workouts.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {aiWorkoutPlan.workouts.map((workout, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setExpandedAIWorkout(index)
                    setExpandedAIExercise(null)
                  }}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all ${
                    expandedAIWorkout === index
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-white/[0.05] text-gray-400 hover:text-white"
                  }`}
                >
                  Treino {String.fromCharCode(65 + index)}
                </button>
              ))}
            </div>
          )}

          {/* Treino IA Selecionado */}
          {aiWorkoutPlan.workouts[expandedAIWorkout] && (
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-white">{aiWorkoutPlan.workouts[expandedAIWorkout].name}</h4>
                    <p className="text-gray-400 text-sm mt-1">{aiWorkoutPlan.workouts[expandedAIWorkout].description}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-purple-400 text-sm flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {aiWorkoutPlan.workouts[expandedAIWorkout].duration}
                      </span>
                      <Badge variant="outline" className="text-purple-300 border-purple-500/30">
                        {aiWorkoutPlan.workouts[expandedAIWorkout].exercises.length} exercicios
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Aquecimento */}
                {aiWorkoutPlan.workouts[expandedAIWorkout].warmup?.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-orange-400 font-semibold mb-2 text-sm">Aquecimento</h5>
                    <div className="space-y-2">
                      {aiWorkoutPlan.workouts[expandedAIWorkout].warmup.map((item, idx) => (
                        <div key={idx} className="p-3 bg-white/[0.03] rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-white">{item.exercise}</span>
                            <span className="text-gray-400 text-sm">{item.duration}</span>
                          </div>
                          <p className="text-gray-500 text-xs mt-1">{item.instructions}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exercicios */}
                <div className="space-y-3">
                  {aiWorkoutPlan.workouts[expandedAIWorkout].exercises.map((exercise, idx) => (
                    <div 
                      key={idx}
                      className="p-4 bg-white/[0.03] rounded-lg hover:bg-white/[0.05] transition-colors"
                    >
                      <div 
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => setExpandedAIExercise(expandedAIExercise === idx ? null : idx)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                            {idx + 1}
                          </span>
                          <div>
                            <h5 className="text-white font-medium">{exercise.name}</h5>
                            <p className="text-gray-500 text-xs">{exercise.muscleGroup}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-purple-400 font-medium">{exercise.sets}x{exercise.reps}</p>
                            <p className="text-gray-500 text-xs">{exercise.rest}</p>
                          </div>
                          {expandedAIExercise === idx ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      
                      {expandedAIExercise === idx && (
                        <div className="mt-3 pt-3 border-t border-white/[0.05]">
                          <p className="text-gray-400 text-sm">{exercise.instructions}</p>
                          {exercise.tips && (
                            <p className="text-purple-300 text-sm mt-2">Dica: {exercise.tips}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Volta a Calma */}
                {aiWorkoutPlan.workouts[expandedAIWorkout].cooldown?.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-green-400 font-semibold mb-2 text-sm">Volta a Calma</h5>
                    <div className="space-y-2">
                      {aiWorkoutPlan.workouts[expandedAIWorkout].cooldown.map((item, idx) => (
                        <div key={idx} className="p-3 bg-white/[0.03] rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-white">{item.exercise}</span>
                            <span className="text-gray-400 text-sm">{item.duration}</span>
                          </div>
                          <p className="text-gray-500 text-xs mt-1">{item.instructions}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Mensagem se nao tem treinos IA */}
      {!loadingAI && !aiWorkoutPlan && workoutPlans.length === 0 && (
        <Card className="p-8 bg-white/[0.03] border-white/[0.08] border-dashed text-center">
          <Sparkles className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">Nenhum treino personalizado ainda</p>
          <p className="text-gray-500 text-sm mt-1">
            Va ate a aba IA e gere seu plano de treino personalizado
          </p>
        </Card>
      )}

      {/* Modal com GIF do Exercicio */}
      <Dialog open={isGifModalOpen} onOpenChange={setIsGifModalOpen}>
        <DialogContent className="max-w-lg bg-gray-900 border-gray-700">
          {selectedExercise && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-orange-500" />
                  {selectedExercise.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* GIF do Exercicio */}
                {selectedExercise.media?.gifUrl ? (
                  <div className="relative rounded-lg overflow-hidden bg-black">
                    <img
                      src={selectedExercise.media.gifUrl}
                      alt={`Como fazer ${selectedExercise.name}`}
                      className="w-full h-auto max-h-[300px] object-contain mx-auto"
                      onError={(e) => {
                        // Fallback se o GIF nao carregar
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300/1f2937/ffffff?text=GIF+Indisponivel"
                      }}
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-gray-300">
                      GIF Animado
                    </div>
                  </div>
                ) : (
                  <div className="h-[200px] bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Info className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">GIF nao disponivel para este exercicio</p>
                    </div>
                  </div>
                )}

                {/* Informacoes do Exercicio */}
                <div className="space-y-3">
                  {/* Series e Repeticoes */}
                  <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <p className="text-orange-400 font-bold">{selectedExercise.sets}</p>
                  </div>

                  {/* Musculo Alvo */}
                  {selectedExercise.media?.muscleTarget && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                        Musculo: {selectedExercise.media.muscleTarget}
                      </Badge>
                      {selectedExercise.media.equipment && (
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                          {selectedExercise.media.equipment}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Dicas */}
                  {selectedExercise.notes && (
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-sm text-gray-300">
                        <span className="text-white font-medium">Dica: </span>
                        {selectedExercise.notes}
                      </p>
                    </div>
                  )}

                  {/* Instrucoes Detalhadas */}
                  {selectedExercise.media?.instructions && selectedExercise.media.instructions.length > 0 && (
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-white font-medium mb-2">Como executar:</p>
                      <ol className="space-y-1">
                        {selectedExercise.media.instructions.map((instruction, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-orange-500 font-bold">{idx + 1}.</span>
                            {instruction}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
