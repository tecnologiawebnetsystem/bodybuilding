"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Target, Flame, Calendar, Trash2, ChevronLeft, ChevronRight, Share2 } from "lucide-react"
import { weeklyCalProgram } from "@/lib/calisthenics-data"
import { julianaCalProgram } from "@/lib/calisthenics-data-juliana"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FitnessPDFGenerator, sharePDF } from "@/lib/pdf-generator"

interface UserPreferences {
  theme_primary: string
  theme_secondary: string
  theme_accent: string
}

interface CalisthenicsTabProps {
  userId: string
  preferences: UserPreferences
}

export function CalisthenicsTab({ userId, preferences }: CalisthenicsTabProps) {
  const [workoutHistory, setWorkoutHistory] = useState<any[]>([])
  const [selectedDayIndex, setSelectedDayIndex] = useState(new Date().getDay())
  const [showSuccess, setShowSuccess] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const adjustedDayIndex = selectedDayIndex === 0 ? 6 : selectedDayIndex - 1

  useEffect(() => {
    loadWorkoutHistory()
  }, [userId])

  const loadWorkoutHistory = async () => {
    try {
      const response = await fetch(`/api/calisthenics?userId=${userId}`)
      const data = await response.json()
      setWorkoutHistory(data.workouts || [])
    } catch (error) {
      console.error("[v0] Error loading calisthenics history:", error)
    }
  }

  const completeWorkout = async (workout: any) => {
    try {
      const response = await fetch("/api/calisthenics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          workoutType: `${workout.day} - ${workout.focus.join(", ")}`,
          durationMinutes: workout.duration === "DESCANSO" ? 0 : workout.duration === "60 minutos" ? 60 : 30,
          exercisesCompleted: workout.exercises.map((ex: any) => ex.name),
          difficultyLevel: "progressivo",
          notes: `Calistenia ${workout.day} - ${workout.time}`,
        }),
      })

      if (response.ok) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        loadWorkoutHistory()
      }
    } catch (error) {
      console.error("[v0] Error completing workout:", error)
    }
  }

  const deleteWorkout = async (id: number) => {
    if (!confirm("Deseja excluir este treino?")) return
    try {
      await fetch(`/api/calisthenics?id=${id}&userId=${userId}`, {
        method: "DELETE",
      })
      loadWorkoutHistory()
    } catch (error) {
      console.error("[v0] Error deleting workout:", error)
    }
  }

  const workoutProgram = userId === "juliana" ? julianaCalProgram : weeklyCalProgram
  const currentWorkout = workoutProgram[adjustedDayIndex]
  const totalWorkouts = workoutHistory.length
  const totalMinutes = workoutHistory.reduce((sum, w) => sum + (w.duration_minutes || 0), 0)

  const changeDay = (direction: number) => {
    let newDay = selectedDayIndex + direction
    if (newDay > 6) newDay = 0
    if (newDay < 0) newDay = 6
    setSelectedDayIndex(newDay)
  }

  const handleExportPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const generator = new FitnessPDFGenerator()
      const workoutProgram = userId === "juliana" ? julianaCalProgram : weeklyCalProgram

      const userName = userId === "kleber" ? "Kleber Gonçalves" : userId === "pamela" ? "Pamela Gonçalves" : "Juliana"

      const blob = generator.generateCalisthenicsWorkoutPDF(userName, workoutProgram, {
        primary: preferences.theme_primary,
        secondary: preferences.theme_secondary,
      })

      await sharePDF(blob, `treino-em-casa-${userId}.pdf`)
    } catch (error) {
      console.error("[v0] Error generating PDF:", error)
      alert("Erro ao gerar PDF. Tente novamente.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleExportCurrentDayPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const generator = new FitnessPDFGenerator()
      const userName = userId === "kleber" ? "Kleber Gonçalves" : userId === "pamela" ? "Pamela Gonçalves" : "Juliana"

      // Apenas o treino do dia atual
      const singleDayProgram = [currentWorkout]

      const blob = generator.generateCalisthenicsWorkoutPDF(userName, singleDayProgram, {
        primary: preferences.theme_primary,
        secondary: preferences.theme_secondary,
      })

      await sharePDF(blob, `treino-${currentWorkout.day.toLowerCase()}-${userId}.pdf`)
    } catch (error) {
      console.error("[v0] Error generating PDF:", error)
      alert("Erro ao gerar PDF. Tente novamente.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold" style={{ color: preferences.theme_primary }}>
          🔥 Treino em Casa
        </h1>
        <p className="text-muted-foreground">Treino exclusivo de 30min no almoço • Seg-Sex: 12h-12h30 • Sáb: 1h</p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPDF}
          disabled={isGeneratingPDF}
          className="mt-2 bg-transparent"
        >
          {isGeneratingPDF ? (
            <>Gerando PDF...</>
          ) : (
            <>
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar Programa
            </>
          )}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-3">
        <Card style={{ borderColor: preferences.theme_primary }}>
          <CardContent className="pt-6 text-center">
            <Flame className="w-8 h-8 mx-auto mb-2" style={{ color: preferences.theme_primary }} />
            <div className="text-2xl font-bold">{totalWorkouts}</div>
            <div className="text-xs text-muted-foreground">Treinos Completos</div>
          </CardContent>
        </Card>
        <Card style={{ borderColor: preferences.theme_accent }}>
          <CardContent className="pt-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2" style={{ color: preferences.theme_accent }} />
            <div className="text-2xl font-bold">{totalMinutes}</div>
            <div className="text-xs text-muted-foreground">Minutos Treinados</div>
          </CardContent>
        </Card>
      </div>

      {/* Day Selector */}
      <Card style={{ borderColor: preferences.theme_primary + "40" }}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" onClick={() => changeDay(-1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-center flex-1">
              <h3 className="text-2xl font-bold" style={{ color: preferences.theme_primary }}>
                {currentWorkout.day}
              </h3>
              <p className="text-sm text-muted-foreground">{currentWorkout.time}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCurrentDayPDF}
                disabled={isGeneratingPDF || currentWorkout.duration === "DESCANSO"}
                className="mt-2 bg-transparent"
              >
                {isGeneratingPDF ? (
                  <>Gerando...</>
                ) : (
                  <>
                    <Share2 className="w-3 h-3 mr-1" />
                    Compartilhar
                  </>
                )}
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => changeDay(1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Week Overview */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {workoutProgram.map((workout, idx) => {
              const isToday = idx === adjustedDayIndex
              const isRest = workout.duration === "DESCANSO"
              return (
                <div
                  key={idx}
                  className={`p-2 rounded cursor-pointer transition-colors ${isToday ? "font-bold" : "opacity-50"}`}
                  style={{
                    backgroundColor: isToday ? preferences.theme_primary + "20" : "transparent",
                    color: isRest ? "#999" : isToday ? preferences.theme_primary : "inherit",
                  }}
                  onClick={() => setSelectedDayIndex(idx === 6 ? 0 : idx + 1)}
                >
                  <div className="font-semibold">{workout.day.substring(0, 3)}</div>
                  <div className="text-[10px] mt-1">{workout.duration === "DESCANSO" ? "🛌" : workout.duration}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Workout Details */}
      {currentWorkout.duration === "DESCANSO" ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <div className="text-6xl mb-4">🛌</div>
            <h3 className="text-2xl font-bold mb-2">Dia de Descanso</h3>
            <p className="text-muted-foreground">{currentWorkout.focus.join(" • ")}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Treino de {currentWorkout.day}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Clock className="w-4 h-4" />
                  {currentWorkout.duration} • {currentWorkout.time}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Focus Areas */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Foco do Treino
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentWorkout.focus.map((focus, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    style={{
                      backgroundColor: preferences.theme_primary + "30",
                      color: preferences.theme_secondary,
                      fontWeight: "600",
                    }}
                  >
                    {focus}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Warmup */}
            <div>
              <h3 className="font-semibold mb-2 text-sm text-orange-600">🔥 Aquecimento (5min)</h3>
              <ul className="space-y-1 text-sm">
                {currentWorkout.warmup.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Exercises */}
            <div>
              <h3 className="font-semibold mb-3">
                💪 Exercícios ({currentWorkout.duration === "60 minutos" ? "50min" : "20min"})
              </h3>
              <div className="space-y-3">
                {currentWorkout.exercises.map((exercise, index) => (
                  <Card key={index} className="bg-muted/30">
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-sm mb-2">{exercise.name}</h4>
                      <div className="grid grid-cols-3 gap-2 text-xs mb-2 font-semibold">
                        <div>
                          <span className="text-muted-foreground">Séries:</span> {exercise.sets}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Reps:</span> {exercise.reps}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Descanso:</span> {exercise.rest}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground italic mb-2">💡 {exercise.tips}</p>
                      <div className="flex flex-wrap gap-1">
                        {exercise.benefits.map((benefit, idx) => (
                          <Badge key={idx} variant="outline" className="text-[10px]">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Cooldown */}
            <div>
              <h3 className="font-semibold mb-2 text-sm text-blue-600">❄️ Relaxamento (5min)</h3>
              <ul className="space-y-1 text-sm">
                {currentWorkout.cooldown.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Complete Button */}
            <Button
              className="w-full"
              size="lg"
              style={{ backgroundColor: preferences.theme_primary }}
              onClick={() => completeWorkout(currentWorkout)}
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />✅ Marcar {currentWorkout.day} Como Completo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Workout History */}
      {workoutHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Histórico de Treinos</CardTitle>
            <CardDescription>Seus treinos em casa registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {workoutHistory.slice(0, 10).map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{workout.workout_type}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(workout.workout_date).toLocaleDateString("pt-BR")} • {workout.duration_minutes}min
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteWorkout(workout.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: preferences.theme_primary }} />
              Treino Completo! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              Excelente trabalho! Mais um passo rumo à transformação total.
              <br />
              <span className="font-bold text-xl mt-2 block" style={{ color: preferences.theme_primary }}>
                Continue firme! 💪🔥
              </span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
