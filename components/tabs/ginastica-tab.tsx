"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Dumbbell, Edit2, Save, X, CheckCircle2 } from "lucide-react"

interface UserPreferences {
  theme_primary: string
  theme_secondary: string
  theme_accent: string
}

interface GinasticaTabProps {
  userId: string
  preferences: UserPreferences
}

interface ScheduleRow {
  id?: number
  time_slot: string
  monday: string | null
  tuesday: string | null
  wednesday: string | null
  thursday: string | null
  friday: string | null
}

const TIME_SLOTS = [
  "6:00", "7:00", "7:15", "7:30", "8:00", "8:45", "9:15", "9:30", 
  "16:00", "18:00", "18:15", "18:30", "19:00", "19:15", "19:45", "20:00", "20:30", "20:45"
]

const DAYS = [
  { key: "monday", name: "SEGUNDA" },
  { key: "tuesday", name: "TERÇA" },
  { key: "wednesday", name: "QUARTA" },
  { key: "thursday", name: "QUINTA" },
  { key: "friday", name: "SEXTA" },
]

export function GinasticaTab({ userId, preferences }: GinasticaTabProps) {
  const [schedule, setSchedule] = useState<ScheduleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editingCell, setEditingCell] = useState<{ time: string; day: string } | null>(null)
  const [editValue, setEditValue] = useState("")
  const [saving, setSaving] = useState(false)
  const [successModal, setSuccessModal] = useState(false)

  useEffect(() => {
    loadSchedule()
  }, [])

  const loadSchedule = async () => {
    try {
      const response = await fetch("/api/ginastica")
      const result = await response.json()
      if (result.success) {
        setSchedule(result.data)
      }
    } catch (error) {
      console.error("[v0] Error loading ginastica schedule:", error)
    } finally {
      setLoading(false)
    }
  }

  const getClass = (timeSlot: string, dayKey: string): string | null => {
    const row = schedule.find((s) => s.time_slot === timeSlot)
    if (!row) return null
    return row[dayKey as keyof ScheduleRow] as string | null
  }

  const handleCellClick = (timeSlot: string, dayKey: string) => {
    if (!editMode) return
    setEditingCell({ time: timeSlot, day: dayKey })
    setEditValue(getClass(timeSlot, dayKey) || "")
  }

  const handleSaveCell = async () => {
    if (!editingCell) return
    setSaving(true)

    try {
      const response = await fetch("/api/ginastica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          time_slot: editingCell.time,
          day_key: editingCell.day,
          class_name: editValue.trim() || null,
        }),
      })

      const result = await response.json()
      if (result.success) {
        await loadSchedule()
        setEditingCell(null)
        setEditValue("")
      }
    } catch (error) {
      console.error("[v0] Error saving ginastica schedule:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingCell(null)
    setEditValue("")
  }

  const handleFinishEditing = () => {
    setEditMode(false)
    setSuccessModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando horarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-orange-500/30 bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-orange-900/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <Dumbbell className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1
                  className="text-3xl font-black tracking-tight"
                  style={{
                    color: "#f97316",
                    textShadow: "2px 2px 0 #7c3aed, -1px -1px 0 #7c3aed, 1px -1px 0 #7c3aed, -1px 1px 0 #7c3aed",
                  }}
                >
                  SALA DE
                </h1>
                <h1
                  className="text-4xl font-black tracking-tight -mt-1"
                  style={{
                    color: "#f97316",
                    textShadow: "3px 3px 0 #7c3aed, -1px -1px 0 #7c3aed, 1px -1px 0 #7c3aed, -1px 1px 0 #7c3aed",
                  }}
                >
                  GINASTICA
                </h1>
              </div>
            </CardTitle>
            <Button
              variant={editMode ? "default" : "outline"}
              size="sm"
              onClick={() => (editMode ? handleFinishEditing() : setEditMode(true))}
              className={editMode ? "bg-green-600 hover:bg-green-700" : "border-orange-500/50 text-orange-500"}
            >
              {editMode ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Schedule Table */}
      <Card className="border-2 border-purple-500/30 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="bg-orange-500 text-white font-bold p-3 text-center border border-orange-600 min-w-[80px]">
                    HORARIO
                  </th>
                  {DAYS.map((day) => (
                    <th
                      key={day.key}
                      className="bg-orange-500 text-white font-bold p-3 text-center border border-orange-600 min-w-[120px]"
                    >
                      {day.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((timeSlot) => (
                  <tr key={timeSlot}>
                    <td className="bg-orange-500 text-white font-bold p-2 text-center border border-orange-600 text-sm">
                      {timeSlot}
                    </td>
                    {DAYS.map((day) => {
                      const className = getClass(timeSlot, day.key)
                      const isEditing = editingCell?.time === timeSlot && editingCell?.day === day.key

                      return (
                        <td
                          key={day.key}
                          className={`p-0 border border-purple-700/50 transition-all ${
                            className ? "bg-purple-700" : "bg-purple-900/50"
                          } ${editMode && !isEditing ? "cursor-pointer hover:bg-purple-600" : ""}`}
                          onClick={() => handleCellClick(timeSlot, day.key)}
                        >
                          {isEditing ? (
                            <div className="flex items-center gap-1 p-1">
                              <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value.toUpperCase())}
                                className="h-8 text-center text-xs bg-white text-black"
                                placeholder="AULA - INSTRUTOR"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveCell()
                                  if (e.key === "Escape") handleCancelEdit()
                                }}
                              />
                              <Button
                                size="icon"
                                className="h-8 w-8 bg-green-600 hover:bg-green-700"
                                onClick={handleSaveCell}
                                disabled={saving}
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="destructive"
                                className="h-8 w-8"
                                onClick={handleCancelEdit}
                                disabled={saving}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="p-2 text-center font-semibold text-white min-h-[40px] flex items-center justify-center text-xs">
                              {className || ""}
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      {editMode && (
        <Card className="border-2 border-orange-500/30 bg-orange-500/10">
          <CardContent className="p-4">
            <p className="text-sm text-orange-200">
              <strong>Modo de edicao ativo:</strong> Clique em qualquer celula para editar. Use o formato "AULA - INSTRUTOR" (ex: PILATES - ALEX). Deixe vazio para remover a aula.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Success Modal */}
      <Dialog open={successModal} onOpenChange={setSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <DialogTitle className="text-2xl">Alteracoes Salvas!</DialogTitle>
            </div>
            <DialogDescription className="text-lg pt-2">
              O horario da Sala de Ginastica foi atualizado com sucesso.
            </DialogDescription>
          </DialogHeader>
          <Button size="lg" onClick={() => setSuccessModal(false)} className="bg-green-600 hover:bg-green-700">
            Entendi!
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
