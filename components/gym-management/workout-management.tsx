"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dumbbell, Plus, Trash2, Edit, Sparkles, GripVertical, Clock, Repeat, Weight } from "lucide-react"
import { toast } from "sonner"

interface Exercise {
  id?: number
  exercise_name: string
  sets: number
  reps_min: number
  reps_max: number
  rest_seconds: number
  exercise_order: number
  notes: string
  weight?: number
  completed?: boolean
}

interface WorkoutDay {
  id?: number
  user_id: string
  day_of_week: number
  workout_name: string
  description: string
  exercises: Exercise[]
}

interface Student {
  user_id: string
  student_name: string
  email: string
}

const DAYS_OF_WEEK = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
]

export function WorkoutManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutDay[]>([])
  const [loading, setLoading] = useState(false)
  const [editingDay, setEditingDay] = useState<WorkoutDay | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // Buscar alunos
  useEffect(() => {
    fetchStudents()
  }, [])

  // Buscar treinos quando selecionar aluno
  useEffect(() => {
    if (selectedStudent) {
      fetchWorkoutPlan(selectedStudent)
    }
  }, [selectedStudent])

  async function fetchStudents() {
    try {
      const res = await fetch("/api/gym-admin/enrollments")
      const data = await res.json()
      setStudents(data)
    } catch (error) {
      console.error("Erro ao buscar alunos:", error)
      toast.error("Erro ao carregar alunos")
    }
  }

  async function fetchWorkoutPlan(userId: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/gym-admin/workouts/${userId}`)
      const data = await res.json()
      setWorkoutPlan(data)
    } catch (error) {
      console.error("Erro ao buscar treinos:", error)
      toast.error("Erro ao carregar treinos")
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateWithAI() {
    if (!selectedStudent) {
      toast.error("Selecione um aluno primeiro")
      return
    }

    setIsGenerating(true)
    try {
      const res = await fetch("/api/gym-admin/workouts/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedStudent }),
      })

      if (!res.ok) throw new Error("Erro ao gerar treino")

      const data = await res.json()
      setWorkoutPlan(data.workoutPlan)
      toast.success("Treino gerado com IA com sucesso! Revise e ajuste se necessário.")
    } catch (error) {
      console.error("Erro ao gerar treino:", error)
      toast.error("Erro ao gerar treino com IA")
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleSaveWorkoutDay(workoutDay: WorkoutDay) {
    try {
      const res = await fetch("/api/gym-admin/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workoutDay),
      })

      if (!res.ok) throw new Error("Erro ao salvar treino")

      toast.success("Treino salvo com sucesso!")
      fetchWorkoutPlan(selectedStudent)
      setEditDialogOpen(false)
      setEditingDay(null)
    } catch (error) {
      console.error("Erro ao salvar treino:", error)
      toast.error("Erro ao salvar treino")
    }
  }

  function handleEditDay(day: WorkoutDay) {
    setEditingDay({ ...day })
    setEditDialogOpen(true)
  }

  function handleAddExercise() {
    if (!editingDay) return

    const newExercise: Exercise = {
      exercise_name: "",
      sets: 3,
      reps_min: 8,
      reps_max: 12,
      rest_seconds: 60,
      exercise_order: editingDay.exercises.length + 1,
      notes: "",
      weight: 0,
    }

    setEditingDay({
      ...editingDay,
      exercises: [...editingDay.exercises, newExercise],
    })
  }

  function handleRemoveExercise(index: number) {
    if (!editingDay) return

    setEditingDay({
      ...editingDay,
      exercises: editingDay.exercises.filter((_, i) => i !== index),
    })
  }

  function handleUpdateExercise(index: number, field: keyof Exercise, value: any) {
    if (!editingDay) return

    const updatedExercises = [...editingDay.exercises]
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value,
    }

    setEditingDay({
      ...editingDay,
      exercises: updatedExercises,
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Treinos</h2>
          <p className="text-muted-foreground mt-2">Crie, edite e gerencie os treinos detalhados de cada aluno</p>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={handleGenerateWithAI} 
            disabled={!selectedStudent || isGenerating}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-0"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? "Gerando..." : "Gerar com IA"}
          </Button>
        </div>
      </div>

      {/* Seleção de Aluno */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Selecione o Aluno</CardTitle>
          <CardDescription>Escolha o aluno para visualizar e editar seus treinos</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um aluno..." />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.user_id} value={student.user_id}>
                  {student.student_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Plano de Treinos */}
      {selectedStudent && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
          {DAYS_OF_WEEK.map((dayName, dayIndex) => {
            const dayWorkout = workoutPlan.find((w) => w.day_of_week === dayIndex)

            return (
              <Card key={dayIndex} className="relative hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold">{dayName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dayWorkout ? (
                    <>
                      <div className="space-y-2">
                        <p className="font-semibold text-sm">{dayWorkout.workout_name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{dayWorkout.description}</p>
                      </div>

                      {dayWorkout.exercises && dayWorkout.exercises.length > 0 && (
                        <div className="text-xs text-muted-foreground bg-slate-50 px-2 py-1 rounded">
                          {dayWorkout.exercises.length} exercícios
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3 bg-transparent hover:bg-slate-50"
                        onClick={() => handleEditDay(dayWorkout)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="dashed"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setEditingDay({
                          user_id: selectedStudent,
                          day_of_week: dayIndex,
                          workout_name: "",
                          description: "",
                          exercises: [],
                        })
                        setEditDialogOpen(true)
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Adicionar
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Dialog de Edição */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDay?.workout_name || "Novo Treino"} - {editingDay && DAYS_OF_WEEK[editingDay.day_of_week]}
            </DialogTitle>
            <DialogDescription>Configure os detalhes do treino e adicione exercícios</DialogDescription>
          </DialogHeader>

          {editingDay && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Treino</Label>
                  <Input
                    value={editingDay.workout_name}
                    onChange={(e) => setEditingDay({ ...editingDay, workout_name: e.target.value })}
                    placeholder="Ex: Peito e Tríceps"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dia da Semana</Label>
                  <Select
                    value={String(editingDay.day_of_week)}
                    onValueChange={(value) => setEditingDay({ ...editingDay, day_of_week: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day, index) => (
                        <SelectItem key={index} value={String(index)}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição do Treino</Label>
                <Textarea
                  value={editingDay.description}
                  onChange={(e) => setEditingDay({ ...editingDay, description: e.target.value })}
                  placeholder="Descreva o objetivo e foco deste treino..."
                  rows={2}
                />
              </div>

              <Separator />

              {/* Lista de Exercícios */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Exercícios</h3>
                  <Button onClick={handleAddExercise} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Exercício
                  </Button>
                </div>

                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {editingDay.exercises.map((exercise, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold text-sm">Exercício {index + 1}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveExercise(index)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-2">
                              <Label>Nome do Exercício</Label>
                              <Input
                                value={exercise.exercise_name}
                                onChange={(e) => handleUpdateExercise(index, "exercise_name", e.target.value)}
                                placeholder="Ex: Supino Reto com Barra"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                <Repeat className="h-3 w-3" />
                                Séries
                              </Label>
                              <Input
                                type="number"
                                value={exercise.sets}
                                onChange={(e) => handleUpdateExercise(index, "sets", Number(e.target.value))}
                                min={1}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                <Weight className="h-3 w-3" />
                                Carga (kg)
                              </Label>
                              <Input
                                type="number"
                                value={exercise.weight || 0}
                                onChange={(e) => handleUpdateExercise(index, "weight", Number(e.target.value))}
                                min={0}
                                step={0.5}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Repetições Mínimas</Label>
                              <Input
                                type="number"
                                value={exercise.reps_min}
                                onChange={(e) => handleUpdateExercise(index, "reps_min", Number(e.target.value))}
                                min={1}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Repetições Máximas</Label>
                              <Input
                                type="number"
                                value={exercise.reps_max}
                                onChange={(e) => handleUpdateExercise(index, "reps_max", Number(e.target.value))}
                                min={1}
                              />
                            </div>

                            <div className="space-y-2 col-span-2">
                              <Label className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                Descanso (segundos)
                              </Label>
                              <Input
                                type="number"
                                value={exercise.rest_seconds}
                                onChange={(e) => handleUpdateExercise(index, "rest_seconds", Number(e.target.value))}
                                min={0}
                                step={15}
                              />
                            </div>

                            <div className="space-y-2 col-span-2">
                              <Label>Observações</Label>
                              <Textarea
                                value={exercise.notes}
                                onChange={(e) => handleUpdateExercise(index, "notes", e.target.value)}
                                placeholder="Ex: Manter cotovelos próximos ao corpo, descer até 90°..."
                                rows={2}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {editingDay.exercises.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Dumbbell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Nenhum exercício adicionado</p>
                        <p className="text-sm">Clique em "Adicionar Exercício" para começar</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => editingDay && handleSaveWorkoutDay(editingDay)}>Salvar Treino</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
