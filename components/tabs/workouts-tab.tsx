"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Clock, Share2 } from "lucide-react"
import { getWorkoutsByUser } from "@/lib/workout-data"
import { FitnessPDFGenerator, sharePDF } from "@/lib/pdf-generator"

interface WorkoutsTabProps {
  userId: string
}

export function WorkoutsTab({ userId }: WorkoutsTabProps) {
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null)
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null)

  const workoutPlans = getWorkoutsByUser(userId)

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
    } catch (error) {
      console.error("[v0] Error generating PDF:", error)
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
    } catch (error) {
      console.error("[v0] Error generating PDF:", error)
      alert("Erro ao gerar PDF. Tente novamente.")
    } finally {
      setGeneratingPDF(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Seus Treinos</h2>
          <p className="text-muted-foreground">Plano ABC personalizado</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={generatingPDF === "Plano Completo"}>
          {generatingPDF === "Plano Completo" ? (
            <>Gerando...</>
          ) : (
            <>
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar Plano Completo
            </>
          )}
        </Button>
      </div>

      {/* Pre-workout cardio */}
      <Card className="p-6 bg-accent/10 border-accent/20">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-bold">Aquecimento</h3>
        </div>
        <p className="text-muted-foreground">
          <strong>Esteira - 10 minutos</strong> em ritmo moderado (6-7 km/h) antes de cada treino para preparar o corpo
        </p>
      </Card>

      {workoutPlans.map((workout) => (
        <Card key={workout.name} className="overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{workout.name}</h3>
                    <p className="text-sm text-muted-foreground">{workout.focus}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {workout.muscleGroups.map((muscle) => (
                    <Badge key={muscle} variant="secondary">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportSingleWorkout(workout)}
                  disabled={generatingPDF === workout.name}
                >
                  {generatingPDF === workout.name ? (
                    <>Gerando...</>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                    </>
                  )}
                </Button>
                <Button
                  variant={expandedWorkout === workout.name ? "secondary" : "outline"}
                  onClick={() => setExpandedWorkout(expandedWorkout === workout.name ? null : workout.name)}
                >
                  {expandedWorkout === workout.name ? "Fechar" : "Ver Exercícios"}
                </Button>
              </div>
            </div>

            {expandedWorkout === workout.name && (
              <div className="space-y-3 mt-6 pt-6 border-t">
                {workout.exercises.map((exercise, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-1">{exercise.name}</h4>
                    <p className="text-sm text-primary font-medium mb-2">{exercise.sets}</p>
                    {exercise.notes && <p className="text-sm text-muted-foreground italic">{exercise.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      ))}

      {/* Post-workout cardio */}
      <Card className="p-6 bg-accent/10 border-accent/20">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-bold">Finalização</h3>
        </div>
        <p className="text-muted-foreground">
          <strong>Esteira - 15 minutos</strong> em ritmo leve-moderado (5-6 km/h) após cada treino para queima de
          gordura
        </p>
      </Card>
    </div>
  )
}
