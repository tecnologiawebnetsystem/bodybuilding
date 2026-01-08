"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Clock } from "lucide-react"
import { getWorkoutsByUser } from "@/lib/workout-data"

interface WorkoutsTabProps {
  userId: string
}

export function WorkoutsTab({ userId }: WorkoutsTabProps) {
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null)

  const workoutPlans = getWorkoutsByUser(userId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Seus Treinos</h2>
          <p className="text-muted-foreground">Plano ABC personalizado</p>
        </div>
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
              <Button
                variant={expandedWorkout === workout.name ? "secondary" : "outline"}
                onClick={() => setExpandedWorkout(expandedWorkout === workout.name ? null : workout.name)}
              >
                {expandedWorkout === workout.name ? "Fechar" : "Ver Exercícios"}
              </Button>
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
