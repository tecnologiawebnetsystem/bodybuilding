"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Ruler, Trash2, Plus, User, Target, TrendingUp, TrendingDown, Camera, ImageIcon, Calendar, ArrowLeftRight, Goal } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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

  // Estados para fotos e metas
  const [progressPhotos, setProgressPhotos] = useState<any[]>([])
  const [measurementGoals, setMeasurementGoals] = useState<any[]>([])
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false)
  const [goalDialogOpen, setGoalDialogOpen] = useState(false)
  const [compareDialogOpen, setCompareDialogOpen] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<{ before: any | null; after: any | null }>({ before: null, after: null })
  const [activeTab, setActiveTab] = useState("medidas")
  
  const [photoForm, setPhotoForm] = useState({
    photoUrl: "",
    photoType: "front",
    notes: "",
    takenAt: new Date().toISOString().split("T")[0],
  })
  
  const [goalForm, setGoalForm] = useState({
    measurementType: "weight",
    targetValue: "",
    targetDate: "",
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
    const loadData = async () => {
      setLoading(true)
      try {
        // Usar API combinada para uma única chamada (mais rápido)
        const response = await fetch(`/api/measurements-data?userId=${userId}`)
        const result = await response.json()

        if (result.success && result.data?.userProfile) {
          const { userProfile: profile, measurements: meas, idealWeight } = result.data
          
          setUserProfile(profile)
          setProfileForm({
            height: profile.height || "",
            targetWeight: profile.target_weight || "",
            currentWeight: profile.current_weight || "",
            gender: profile.gender || "",
          })
          setMeasurements(meas || [])
          setIdealWeightData(idealWeight)
        } else {
          // Se a API combinada falhar, tentar carregar direto do user-profile
          const profileRes = await fetch(`/api/user-profile?userId=${userId}`)
          const profileData = await profileRes.json()
          
          if (profileData.success && profileData.data) {
            setUserProfile(profileData.data)
            setProfileForm({
              height: profileData.data.height || "",
              targetWeight: profileData.data.target_weight || "",
              currentWeight: profileData.data.current_weight || "",
              gender: profileData.data.gender || "",
            })
          } else {
            // Perfil não existe ainda - criar perfil vazio para permitir configuração
            setUserProfile({ id: null, user_id: userId, needsSetup: true })
          }
        }
      } catch (error) {
        // Tentar fallback em caso de erro
        try {
          const profileRes = await fetch(`/api/user-profile?userId=${userId}`)
          const profileData = await profileRes.json()
          if (profileData.success && profileData.data) {
            setUserProfile(profileData.data)
            setProfileForm({
              height: profileData.data.height || "",
              targetWeight: profileData.data.target_weight || "",
              currentWeight: profileData.data.current_weight || "",
              gender: profileData.data.gender || "",
            })
          }
        } catch (fallbackError) {
          // Erro silencioso no fallback - criar perfil vazio
          setUserProfile({ id: null, user_id: userId, needsSetup: true })
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [userId])

  const loadMeasurements = async () => {
    try {
      const response = await fetch(`/api/measurements?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setMeasurements(data.data)
      }
    } catch (error) {
      console.error(" Error loading measurements:", error)
    }
  }

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
      }
    } catch (error) {
      console.error(" Error loading user profile:", error)
    }
  }

  // Carregar fotos de progresso
  const loadProgressPhotos = async () => {
    try {
      const response = await fetch(`/api/progress-photos?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setProgressPhotos(data.data || [])
      }
    } catch (error) {
      console.error(" Error loading progress photos:", error)
    }
  }

  // Carregar metas de medidas
  const loadMeasurementGoals = async () => {
    try {
      const response = await fetch(`/api/measurement-goals?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setMeasurementGoals(data.data || [])
      }
    } catch (error) {
      console.error(" Error loading measurement goals:", error)
    }
  }

  // Salvar foto de progresso
  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/progress-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...photoForm }),
      })
      if (response.ok) {
        setPhotoDialogOpen(false)
        setPhotoForm({ photoUrl: "", photoType: "front", notes: "", takenAt: new Date().toISOString().split("T")[0] })
        loadProgressPhotos()
      }
    } catch (error) {
      console.error(" Error saving photo:", error)
    }
  }

  // Salvar meta de medida
  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const startValue = latestMeasurement ? latestMeasurement[goalForm.measurementType === "weight" ? "weight" : goalForm.measurementType] : null
    try {
      const response = await fetch("/api/measurement-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...goalForm, startValue }),
      })
      if (response.ok) {
        setGoalDialogOpen(false)
        setGoalForm({ measurementType: "weight", targetValue: "", targetDate: "" })
        loadMeasurementGoals()
      }
    } catch (error) {
      console.error(" Error saving goal:", error)
    }
  }

  // Carregar fotos e metas ao iniciar
  useEffect(() => {
    if (userId) {
      loadProgressPhotos()
      loadMeasurementGoals()
    }
  }, [userId])

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
      console.error(" Error updating profile:", error)
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
      console.error(" Error saving measurement:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja excluir esta medida?")) return

    try {
      await fetch(`/api/measurements?id=${id}`, { method: "DELETE" })
      loadMeasurements()
    } catch (error) {
      console.error(" Error deleting measurement:", error)
    }
  }

  const latestMeasurement = measurements[0]

  const currentIMC =
    latestMeasurement && userProfile
      ? (
          Number.parseFloat(latestMeasurement.weight) / Math.pow(Number.parseFloat(userProfile.height) / 100, 2)
        ).toFixed(1)
      : null

  if (loading || !userProfile) {
    return <div className="text-center py-8">Carregando perfil...</div>
  }

  // Usar theme_primary diretamente (não é JSON)
  const themeColor = userProfile?.theme_primary || "#3b82f6"

  // Calcular progresso das metas
  const getGoalProgress = (goal: any) => {
    if (!latestMeasurement || !goal.start_value) return 0
    const currentValue = goal.measurement_type === "weight" 
      ? latestMeasurement.weight 
      : latestMeasurement[goal.measurement_type]
    if (!currentValue) return 0
    
    const start = parseFloat(goal.start_value)
    const target = parseFloat(goal.target_value)
    const current = parseFloat(currentValue)
    
    // Se meta é diminuir (perder peso/cintura)
    if (target < start) {
      const totalToLose = start - target
      const lost = start - current
      return Math.min(100, Math.max(0, (lost / totalToLose) * 100))
    }
    // Se meta é aumentar (ganhar massa)
    const totalToGain = target - start
    const gained = current - start
    return Math.min(100, Math.max(0, (gained / totalToGain) * 100))
  }

  const measurementTypeLabels: Record<string, string> = {
    weight: "Peso (kg)",
    waist: "Cintura (cm)",
    chest: "Peito (cm)",
    hips: "Quadril (cm)",
    arm_right: "Braco (cm)",
    thigh_right: "Coxa (cm)",
  }

  return (
    <div className="space-y-6">
      {/* Header com icone */}
      <div className="text-center mb-2">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg"
          style={{ backgroundColor: themeColor }}
        >
          <Ruler className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold">Medidas Corporais</h2>
        <p className="text-muted-foreground text-sm mt-1">Acompanhe sua evolucao fisica</p>
      </div>

      {/* Sub-tabs: Medidas, Fotos, Metas */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-orange-100 p-1">
          <TabsTrigger value="medidas" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-black font-medium">
            <Ruler className="w-4 h-4 mr-2" />
            Medidas
          </TabsTrigger>
          <TabsTrigger value="fotos" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-black font-medium">
            <Camera className="w-4 h-4 mr-2" />
            Fotos
          </TabsTrigger>
          <TabsTrigger value="metas" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white text-black font-medium">
            <Goal className="w-4 h-4 mr-2" />
            Metas
          </TabsTrigger>
        </TabsList>

        {/* TAB MEDIDAS */}
        <TabsContent value="medidas" className="space-y-6 mt-6">
          {/* Botao Nova Medicao */}
          <div className="flex justify-center">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
              size="lg"
              className="shadow-md"
              style={{ backgroundColor: "#c2410c", color: "#ffffff" }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Nova Medicao
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
                <Button type="submit" className="w-full" style={{ backgroundColor: "#c2410c", color: "#ffffff" }}>
                  Salvar Medidas
                </Button>
              </form>
            </DialogContent>
        </Dialog>
      </div>

      {idealWeightData && (
        <Card className="p-6 border-0 shadow-lg" style={{ background: `linear-gradient(135deg, ${themeColor}10 0%, transparent 100%)` }}>
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: themeColor }}
            >
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold">Analise de Peso</h3>
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
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: themeColor }}
              >
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold">Medidas Atuais</h3>
            </div>
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
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: themeColor }} />
          <h3 className="text-lg font-bold">Historico de Medidas</h3>
        </div>
        {loading ? (
          <Card className="p-8 text-center">
            <div className="animate-pulse">
              <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4" />
              <div className="h-4 bg-muted rounded w-32 mx-auto" />
            </div>
          </Card>
        ) : measurements.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: themeColor + "20" }}
            >
              <Ruler className="w-8 h-8" style={{ color: themeColor }} />
            </div>
            <h4 className="font-semibold mb-2">Nenhuma medida registrada</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Clique em "Nova Medicao" para comecar a acompanhar seu progresso
            </p>
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
        </TabsContent>

        {/* TAB FOTOS DE PROGRESSO */}
        <TabsContent value="fotos" className="space-y-6 mt-6">
          {/* Botoes de acao */}
          <div className="flex flex-wrap justify-center gap-3">
            <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
              <DialogTrigger asChild>
                <Button style={{ backgroundColor: "#c2410c", color: "#ffffff" }}>
                  <Camera className="w-4 h-4 mr-2" />
                  Nova Foto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Foto de Progresso</DialogTitle>
                  <DialogDescription>Registre sua evolucao com fotos</DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePhotoSubmit} className="space-y-4">
                  <div>
                    <Label>URL da Foto *</Label>
                    <Input
                      value={photoForm.photoUrl}
                      onChange={(e) => setPhotoForm({ ...photoForm, photoUrl: e.target.value })}
                      placeholder="https://exemplo.com/foto.jpg"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use um servico de hospedagem de imagens como Imgur ou Google Fotos
                    </p>
                  </div>
                  <div>
                    <Label>Tipo de Foto</Label>
                    <Select value={photoForm.photoType} onValueChange={(v) => setPhotoForm({ ...photoForm, photoType: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="front">Frontal</SelectItem>
                        <SelectItem value="side">Lateral</SelectItem>
                        <SelectItem value="back">Costas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={photoForm.takenAt}
                      onChange={(e) => setPhotoForm({ ...photoForm, takenAt: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Observacoes</Label>
                    <Input
                      value={photoForm.notes}
                      onChange={(e) => setPhotoForm({ ...photoForm, notes: e.target.value })}
                      placeholder="Ex: Apos 30 dias de dieta"
                    />
                  </div>
                  <Button type="submit" className="w-full" style={{ backgroundColor: "#c2410c", color: "#ffffff" }}>
                    Salvar Foto
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {progressPhotos.length >= 2 && (
              <Dialog open={compareDialogOpen} onOpenChange={setCompareDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                    Comparar Fotos
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Comparar Antes e Depois</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="mb-2 block">Foto Antes</Label>
                      <Select 
                        value={selectedPhotos.before?.id?.toString() || ""} 
                        onValueChange={(v) => setSelectedPhotos({ ...selectedPhotos, before: progressPhotos.find(p => p.id.toString() === v) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma foto" />
                        </SelectTrigger>
                        <SelectContent>
                          {progressPhotos.map((photo) => (
                            <SelectItem key={photo.id} value={photo.id.toString()}>
                              {new Date(photo.taken_at).toLocaleDateString("pt-BR")} - {photo.photo_type === "front" ? "Frontal" : photo.photo_type === "side" ? "Lateral" : "Costas"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedPhotos.before && (
                        <div className="mt-4 rounded-lg overflow-hidden bg-black">
                          <img src={selectedPhotos.before.photo_url} alt="Antes" className="w-full h-auto max-h-[400px] object-contain" />
                          <p className="text-center text-sm py-2">{new Date(selectedPhotos.before.taken_at).toLocaleDateString("pt-BR")}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="mb-2 block">Foto Depois</Label>
                      <Select 
                        value={selectedPhotos.after?.id?.toString() || ""} 
                        onValueChange={(v) => setSelectedPhotos({ ...selectedPhotos, after: progressPhotos.find(p => p.id.toString() === v) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma foto" />
                        </SelectTrigger>
                        <SelectContent>
                          {progressPhotos.map((photo) => (
                            <SelectItem key={photo.id} value={photo.id.toString()}>
                              {new Date(photo.taken_at).toLocaleDateString("pt-BR")} - {photo.photo_type === "front" ? "Frontal" : photo.photo_type === "side" ? "Lateral" : "Costas"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedPhotos.after && (
                        <div className="mt-4 rounded-lg overflow-hidden bg-black">
                          <img src={selectedPhotos.after.photo_url} alt="Depois" className="w-full h-auto max-h-[400px] object-contain" />
                          <p className="text-center text-sm py-2">{new Date(selectedPhotos.after.taken_at).toLocaleDateString("pt-BR")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Grid de Fotos */}
          {progressPhotos.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: themeColor + "20" }}>
                <ImageIcon className="w-8 h-8" style={{ color: themeColor }} />
              </div>
              <h4 className="font-semibold mb-2">Nenhuma foto registrada</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Adicione fotos para acompanhar sua transformacao visual
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {progressPhotos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden">
                  <div className="relative aspect-[3/4] bg-black">
                    <img 
                      src={photo.photo_url} 
                      alt={`Foto ${photo.photo_type}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x400/1f2937/ffffff?text=Foto"
                      }}
                    />
                    <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/70 text-xs text-white">
                      {photo.photo_type === "front" ? "Frontal" : photo.photo_type === "side" ? "Lateral" : "Costas"}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm">{new Date(photo.taken_at).toLocaleDateString("pt-BR")}</p>
                    {photo.notes && <p className="text-xs text-muted-foreground mt-1">{photo.notes}</p>}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB METAS */}
        <TabsContent value="metas" className="space-y-6 mt-6">
          {/* Botao Nova Meta */}
          <div className="flex justify-center">
            <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
              <DialogTrigger asChild>
                <Button style={{ backgroundColor: "#c2410c", color: "#ffffff" }}>
                  <Target className="w-4 h-4 mr-2" />
                  Nova Meta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Definir Meta de Medida</DialogTitle>
                  <DialogDescription>Estabeleca um objetivo para acompanhar</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleGoalSubmit} className="space-y-4">
                  <div>
                    <Label>Tipo de Medida</Label>
                    <Select value={goalForm.measurementType} onValueChange={(v) => setGoalForm({ ...goalForm, measurementType: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight">Peso (kg)</SelectItem>
                        <SelectItem value="waist">Cintura (cm)</SelectItem>
                        <SelectItem value="chest">Peito (cm)</SelectItem>
                        <SelectItem value="hips">Quadril (cm)</SelectItem>
                        <SelectItem value="arm_right">Braco (cm)</SelectItem>
                        <SelectItem value="thigh_right">Coxa (cm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Valor da Meta *</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={goalForm.targetValue}
                      onChange={(e) => setGoalForm({ ...goalForm, targetValue: e.target.value })}
                      placeholder={goalForm.measurementType === "weight" ? "Ex: 75" : "Ex: 80"}
                      required
                    />
                    {latestMeasurement && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Valor atual: {latestMeasurement[goalForm.measurementType === "weight" ? "weight" : goalForm.measurementType] || "N/A"}
                        {goalForm.measurementType === "weight" ? "kg" : "cm"}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Data Alvo (opcional)</Label>
                    <Input
                      type="date"
                      value={goalForm.targetDate}
                      onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full" style={{ backgroundColor: "#c2410c", color: "#ffffff" }}>
                    Definir Meta
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Lista de Metas */}
          {measurementGoals.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: themeColor + "20" }}>
                <Target className="w-8 h-8" style={{ color: themeColor }} />
              </div>
              <h4 className="font-semibold mb-2">Nenhuma meta definida</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Defina metas para acompanhar seu progresso
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {measurementGoals.map((goal) => {
                const progress = getGoalProgress(goal)
                const currentValue = latestMeasurement 
                  ? (goal.measurement_type === "weight" ? latestMeasurement.weight : latestMeasurement[goal.measurement_type])
                  : null

                return (
                  <Card key={goal.id} className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: themeColor }}>
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold">{measurementTypeLabels[goal.measurement_type] || goal.measurement_type}</h4>
                          {goal.target_date && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Prazo: {new Date(goal.target_date).toLocaleDateString("pt-BR")}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: themeColor }}>
                          {goal.target_value}{goal.measurement_type === "weight" ? "kg" : "cm"}
                        </p>
                        <p className="text-xs text-muted-foreground">Meta</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Inicio: {goal.start_value || "N/A"}</span>
                        <span>Atual: {currentValue || "N/A"}</span>
                        <span>Meta: {goal.target_value}</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <p className="text-center text-sm font-medium" style={{ color: progress >= 100 ? "#22c55e" : themeColor }}>
                        {progress >= 100 ? "Meta Alcancada!" : `${progress.toFixed(0)}% concluido`}
                      </p>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
