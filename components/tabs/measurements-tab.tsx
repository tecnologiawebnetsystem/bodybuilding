"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Ruler, Trash2, Plus, User, Target, TrendingUp, TrendingDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MeasurementsTabProps {
  userId: string
}

export function MeasurementsTab({ userId }: MeasurementsTabProps) {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [idealWeightData, setIdealWeightData] = useState<any>(null)
  const [measurements, setMeasurements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)

  const [profileForm, setProfileForm] = useState({
    height: "",
    targetWeight: "",
    currentWeight: "",
    gender: "",
  })

  const [formData, setFormData] = useState({
    measurementDate: new Date().toISOString().split("T")[0],
    weight: "",
    neck: "",
    chest: "",
    waist: "",
    hips: "",
    armLeft: "",
    armRight: "",
    thighLeft: "",
    thighRight: "",
    bodyFatPercentage: "",
    notes: "",
  })

  useEffect(() => {
    loadUserProfile()
    loadMeasurements()
  }, [userId])

  const loadUserProfile = async () => {
    try {
      const response = await fetch(`/api/user-profile?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setUserProfile(data.data)
        setProfileForm({
          height: data.data.height || "",
          targetWeight: data.data.target_weight || "",
          currentWeight: data.data.current_weight || "",
          gender: data.data.gender || "",
        })
        loadIdealWeight()
      }
    } catch (error) {
      console.error("[v0] Error loading user profile:", error)
    }
  }

  const loadIdealWeight = async () => {
    try {
      const response = await fetch(`/api/ideal-weight?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setIdealWeightData(data.data)
      }
    } catch (error) {
      console.error("[v0] Error loading ideal weight:", error)
    }
  }

  const loadMeasurements = async () => {
    try {
      const response = await fetch(`/api/measurements?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setMeasurements(data.data)
      }
    } catch (error) {
      console.error("[v0] Error loading measurements:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/user-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          height: profileForm.height,
          targetWeight: profileForm.targetWeight,
          currentWeight: profileForm.currentWeight,
          gender: profileForm.gender,
        }),
      })

      if (response.ok) {
        setProfileDialogOpen(false)
        loadUserProfile()
      }
    } catch (error) {
      console.error("[v0] Error updating profile:", error)
    }
  }

  const calculateBodyFat = () => {
    if (!userProfile) return ""

    const weight = Number.parseFloat(formData.weight)
    const waist = Number.parseFloat(formData.waist)
    const neck = Number.parseFloat(formData.neck)
    const hips = Number.parseFloat(formData.hips)
    const heightCm = Number.parseFloat(userProfile.height)

    if (!weight || !waist || !neck || !heightCm) {
      return ""
    }

    let bodyFat = 0

    if (userProfile.gender === "male") {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(heightCm)) - 450
    } else {
      if (!hips) return ""
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.221 * Math.log10(heightCm)) - 450
    }

    return bodyFat.toFixed(1)
  }

  useEffect(() => {
    const bf = calculateBodyFat()
    if (bf) {
      setFormData((prev) => ({ ...prev, bodyFatPercentage: bf }))
    }
  }, [formData.weight, formData.waist, formData.neck, formData.hips, userProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...formData }),
      })

      if (response.ok) {
        setDialogOpen(false)
        setFormData({
          measurementDate: new Date().toISOString().split("T")[0],
          weight: "",
          neck: "",
          chest: "",
          waist: "",
          hips: "",
          armLeft: "",
          armRight: "",
          thighLeft: "",
          thighRight: "",
          bodyFatPercentage: "",
          notes: "",
        })
        loadMeasurements()
      }
    } catch (error) {
      console.error("[v0] Error saving measurement:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja excluir esta medida?")) return

    try {
      await fetch(`/api/measurements?id=${id}`, { method: "DELETE" })
      loadMeasurements()
    } catch (error) {
      console.error("[v0] Error deleting measurement:", error)
    }
  }

  const latestMeasurement = measurements[0]

  const currentIMC =
    latestMeasurement && userProfile
      ? (
          Number.parseFloat(latestMeasurement.weight) / Math.pow(Number.parseFloat(userProfile.height) / 100, 2)
        ).toFixed(1)
      : null

  if (!userProfile) {
    return <div className="text-center py-8">Carregando perfil...</div>
  }

  const themeColor = userProfile.theme ? JSON.parse(userProfile.theme).primary : "#3b82f6"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Medidas Corporais</h2>
        <div className="flex gap-2">
          <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <User className="w-4 h-4 mr-2" />
                Perfil
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configurar Perfil</DialogTitle>
                <DialogDescription>Atualize seus dados pessoais para cálculos precisos</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <Label>Altura (cm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={profileForm.height}
                    onChange={(e) => setProfileForm({ ...profileForm, height: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Peso Atual (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={profileForm.currentWeight}
                    onChange={(e) => setProfileForm({ ...profileForm, currentWeight: e.target.value })}
                    placeholder="Seu peso atual"
                    required
                  />
                </div>
                <div>
                  <Label>Peso Desejado (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={profileForm.targetWeight}
                    onChange={(e) => setProfileForm({ ...profileForm, targetWeight: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Sexo</Label>
                  <Select
                    value={profileForm.gender}
                    onValueChange={(value) => setProfileForm({ ...profileForm, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" style={{ backgroundColor: themeColor }}>
                  Salvar Perfil
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ backgroundColor: themeColor, color: "white" }}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Medição
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Medidas</DialogTitle>
                <DialogDescription>Registre suas medidas corporais para acompanhar o progresso</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={formData.measurementDate}
                      onChange={(e) => setFormData({ ...formData, measurementDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Peso (kg) *</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Pescoço (cm) *</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.neck}
                      onChange={(e) => setFormData({ ...formData, neck: e.target.value })}
                      placeholder="Para calcular BF%"
                      required
                    />
                  </div>
                  <div>
                    <Label>Cintura (cm) *</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.waist}
                      onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                      placeholder="Para calcular BF%"
                      required
                    />
                  </div>
                  {userProfile.gender === "female" && (
                    <div>
                      <Label>Quadril (cm) *</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.hips}
                        onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                        placeholder="Para calcular BF%"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <Label>% Gordura (calculado automaticamente)</Label>
                    <Input
                      type="text"
                      value={
                        formData.bodyFatPercentage
                          ? `${formData.bodyFatPercentage}%`
                          : "Preencha peso, pescoço e cintura"
                      }
                      readOnly
                      className="bg-muted"
                      style={{ backgroundColor: themeColor + "20", fontWeight: "bold" }}
                    />
                  </div>
                  <div>
                    <Label>Peito (cm)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.chest}
                      onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                    />
                  </div>
                  {userProfile.gender === "male" && (
                    <div>
                      <Label>Quadril (cm)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.hips}
                        onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                      />
                    </div>
                  )}
                  <div>
                    <Label>Braço Esquerdo (cm)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.armLeft}
                      onChange={(e) => setFormData({ ...formData, armLeft: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Braço Direito (cm)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.armRight}
                      onChange={(e) => setFormData({ ...formData, armRight: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Coxa Esquerda (cm)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.thighLeft}
                      onChange={(e) => setFormData({ ...formData, thighLeft: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Coxa Direita (cm)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.thighRight}
                      onChange={(e) => setFormData({ ...formData, thighRight: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Observações</Label>
                    <Input
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Ex: Medido pela manhã em jejum"
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  * Campos obrigatórios para cálculo automático do percentual de gordura
                </p>
                <Button type="submit" className="w-full" style={{ backgroundColor: themeColor }}>
                  Salvar Medidas
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {idealWeightData && (
        <Card className="p-6 border-2" style={{ borderColor: themeColor + "30" }}>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5" style={{ color: themeColor }} />
            <h3 className="text-lg font-bold">Análise de Peso</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Peso Ideal Médio</p>
              <p className="text-2xl font-bold" style={{ color: themeColor }}>
                {idealWeightData.averageIdealWeight}kg
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sua Meta</p>
              <p className="text-2xl font-bold">{idealWeightData.userTargetWeight}kg</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Faixa Saudável Min</p>
              <p className="text-xl font-bold text-muted-foreground">{idealWeightData.minHealthyWeight}kg</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Faixa Saudável Max</p>
              <p className="text-xl font-bold text-muted-foreground">{idealWeightData.maxHealthyWeight}kg</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm">
              <strong>Altura:</strong> {idealWeightData.height}cm | <strong>Sexo:</strong>{" "}
              {idealWeightData.gender === "male" ? "Masculino" : "Feminino"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              O peso ideal é calculado pela média das fórmulas de Devine, Robinson e Miller
            </p>
          </div>
        </Card>
      )}

      {latestMeasurement && (
        <Card className="p-6 border-2" style={{ borderColor: themeColor + "30" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Medidas Atuais</h3>
            {currentIMC && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">IMC Atual</p>
                <p className="text-2xl font-bold" style={{ color: themeColor }}>
                  {currentIMC}
                </p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {latestMeasurement.weight && (
              <div>
                <p className="text-sm text-muted-foreground">Peso</p>
                <p className="text-2xl font-bold">{latestMeasurement.weight}kg</p>
              </div>
            )}
            {latestMeasurement.body_fat_percentage && (
              <div>
                <p className="text-sm text-muted-foreground">% Gordura</p>
                <p className="text-2xl font-bold">{latestMeasurement.body_fat_percentage}%</p>
              </div>
            )}
            {latestMeasurement.chest && (
              <div>
                <p className="text-sm text-muted-foreground">Peito</p>
                <p className="text-2xl font-bold">{latestMeasurement.chest}cm</p>
              </div>
            )}
            {latestMeasurement.waist && (
              <div>
                <p className="text-sm text-muted-foreground">Cintura</p>
                <p className="text-2xl font-bold">{latestMeasurement.waist}cm</p>
              </div>
            )}
            {latestMeasurement.hips && (
              <div>
                <p className="text-sm text-muted-foreground">Quadril</p>
                <p className="text-2xl font-bold">{latestMeasurement.hips}cm</p>
              </div>
            )}
            {latestMeasurement.arm_right && (
              <div>
                <p className="text-sm text-muted-foreground">Braço</p>
                <p className="text-2xl font-bold">{latestMeasurement.arm_right}cm</p>
              </div>
            )}
            {latestMeasurement.thigh_right && (
              <div>
                <p className="text-sm text-muted-foreground">Coxa</p>
                <p className="text-2xl font-bold">{latestMeasurement.thigh_right}cm</p>
              </div>
            )}
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-bold">Histórico de Medidas</h3>
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Carregando...</p>
        ) : measurements.length === 0 ? (
          <Card className="p-8 text-center">
            <Ruler className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhuma medida registrada ainda</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {measurements.map((m, index) => {
              const previousMeasurement = measurements[index + 1]
              const weightDiff = previousMeasurement
                ? Number.parseFloat(m.weight) - Number.parseFloat(previousMeasurement.weight)
                : 0
              const waistDiff =
                previousMeasurement && m.waist && previousMeasurement.waist
                  ? Number.parseFloat(m.waist) - Number.parseFloat(previousMeasurement.waist)
                  : 0

              return (
                <Card key={m.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-lg">
                        {new Date(m.measurement_date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      {m.notes && <p className="text-sm text-muted-foreground mt-1">{m.notes}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(m.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {m.weight && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Peso</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-lg font-bold" style={{ color: themeColor }}>
                            {m.weight}kg
                          </p>
                          {weightDiff !== 0 && (
                            <span
                              className={`text-xs flex items-center ${weightDiff > 0 ? "text-red-500" : "text-green-500"}`}
                            >
                              {weightDiff > 0 ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {Math.abs(weightDiff).toFixed(1)}kg
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {m.body_fat_percentage && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">% Gordura</p>
                        <p className="text-lg font-bold">{m.body_fat_percentage}%</p>
                      </div>
                    )}

                    {m.waist && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Cintura</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-lg font-bold">{m.waist}cm</p>
                          {waistDiff !== 0 && (
                            <span
                              className={`text-xs flex items-center ${waistDiff > 0 ? "text-red-500" : "text-green-500"}`}
                            >
                              {waistDiff > 0 ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {Math.abs(waistDiff).toFixed(1)}cm
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {m.chest && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Peito</p>
                        <p className="text-lg font-bold">{m.chest}cm</p>
                      </div>
                    )}

                    {m.arm_right && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Braço</p>
                        <p className="text-lg font-bold">{m.arm_right}cm</p>
                      </div>
                    )}

                    {m.hips && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Quadril</p>
                        <p className="text-lg font-bold">{m.hips}cm</p>
                      </div>
                    )}

                    {m.thigh_right && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Coxa</p>
                        <p className="text-lg font-bold">{m.thigh_right}cm</p>
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
