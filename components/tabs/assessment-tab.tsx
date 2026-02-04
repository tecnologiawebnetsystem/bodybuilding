"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Activity, TrendingUp, TrendingDown, Calendar, Plus, ChevronRight, 
  Ruler, Scale, Heart, Zap, Target, Camera, FileText, User, ArrowUp, ArrowDown, Minus
} from "lucide-react"

interface Assessment {
  id: number
  assessment_date: string
  height: number
  weight: number
  body_fat_percentage: number
  muscle_mass: number
  waist: number
  chest: number
  hips: number
  left_arm: number
  right_arm: number
  left_thigh: number
  right_thigh: number
  flexibility_test: number
  push_ups_count: number
  sit_ups_count: number
  plank_time: number
  resting_heart_rate: number
  goals: string[]
  activity_level: string
  notes: string
}

interface AssessmentTabProps {
  userId: string
}

export function AssessmentTab({ userId }: AssessmentTabProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [formTab, setFormTab] = useState("basico")
  
  // Form state
  const [formData, setFormData] = useState({
    assessmentDate: new Date().toISOString().split("T")[0],
    height: "",
    weight: "",
    bodyFatPercentage: "",
    muscleMass: "",
    waist: "",
    chest: "",
    hips: "",
    neck: "",
    shoulders: "",
    leftArm: "",
    rightArm: "",
    leftForearm: "",
    rightForearm: "",
    leftThigh: "",
    rightThigh: "",
    leftCalf: "",
    rightCalf: "",
    flexibilityTest: "",
    pushUpsCount: "",
    sitUpsCount: "",
    plankTime: "",
    restingHeartRate: "",
    activityLevel: "moderado",
    goals: [] as string[],
    notes: ""
  })

  useEffect(() => {
    loadAssessments()
  }, [userId])

  const loadAssessments = async () => {
    try {
      const response = await fetch(`/api/physical-assessments?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setAssessments(data.data || [])
      }
    } catch (error) {
      console.error("Erro ao carregar avaliacoes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/physical-assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...formData
        })
      })
      
      const data = await response.json()
      if (data.success) {
        await loadAssessments()
        setIsModalOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Erro ao salvar avaliacao:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      assessmentDate: new Date().toISOString().split("T")[0],
      height: "",
      weight: "",
      bodyFatPercentage: "",
      muscleMass: "",
      waist: "",
      chest: "",
      hips: "",
      neck: "",
      shoulders: "",
      leftArm: "",
      rightArm: "",
      leftForearm: "",
      rightForearm: "",
      leftThigh: "",
      rightThigh: "",
      leftCalf: "",
      rightCalf: "",
      flexibilityTest: "",
      pushUpsCount: "",
      sitUpsCount: "",
      plankTime: "",
      restingHeartRate: "",
      activityLevel: "moderado",
      goals: [],
      notes: ""
    })
    setFormTab("basico")
  }

  const getComparison = (current: number, previous: number): { icon: typeof ArrowUp; color: string; diff: string } => {
    const diff = current - previous
    if (diff > 0) return { icon: ArrowUp, color: "text-green-500", diff: `+${diff.toFixed(1)}` }
    if (diff < 0) return { icon: ArrowDown, color: "text-red-500", diff: diff.toFixed(1) }
    return { icon: Minus, color: "text-gray-500", diff: "0" }
  }

  const calculateIMC = (weight: number, height: number): { value: number; classification: string; color: string } => {
    if (!weight || !height) return { value: 0, classification: "-", color: "gray" }
    const heightInMeters = height / 100
    const imc = weight / (heightInMeters * heightInMeters)
    
    let classification = ""
    let color = ""
    if (imc < 18.5) { classification = "Abaixo do peso"; color = "yellow" }
    else if (imc < 25) { classification = "Peso normal"; color = "green" }
    else if (imc < 30) { classification = "Sobrepeso"; color = "orange" }
    else { classification = "Obesidade"; color = "red" }
    
    return { value: imc, classification, color }
  }

  const latestAssessment = assessments[0]
  const previousAssessment = assessments[1]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Avaliacao Fisica</h2>
          <p className="text-gray-400">Acompanhe sua evolucao corporal</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-orange-600 to-orange-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Avaliacao
        </Button>
      </div>

      {/* Resumo da Ultima Avaliacao */}
      {latestAssessment && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
            <div className="flex items-center gap-3">
              <Scale className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Peso</p>
                <p className="text-2xl font-bold text-white">{latestAssessment.weight} kg</p>
                {previousAssessment && (() => {
                  const comp = getComparison(latestAssessment.weight, previousAssessment.weight)
                  return (
                    <p className={`text-xs ${comp.color} flex items-center gap-1`}>
                      <comp.icon className="w-3 h-3" />
                      {comp.diff} kg
                    </p>
                  )
                })()}
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">% Gordura</p>
                <p className="text-2xl font-bold text-white">{latestAssessment.body_fat_percentage || "-"}%</p>
                {previousAssessment?.body_fat_percentage && (() => {
                  const comp = getComparison(latestAssessment.body_fat_percentage, previousAssessment.body_fat_percentage)
                  return (
                    <p className={`text-xs ${comp.color} flex items-center gap-1`}>
                      <comp.icon className="w-3 h-3" />
                      {comp.diff}%
                    </p>
                  )
                })()}
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Massa Muscular</p>
                <p className="text-2xl font-bold text-white">{latestAssessment.muscle_mass || "-"} kg</p>
                {previousAssessment?.muscle_mass && (() => {
                  const comp = getComparison(latestAssessment.muscle_mass, previousAssessment.muscle_mass)
                  return (
                    <p className={`text-xs ${comp.color} flex items-center gap-1`}>
                      <comp.icon className="w-3 h-3" />
                      {comp.diff} kg
                    </p>
                  )
                })()}
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30">
            <div className="flex items-center gap-3">
              <Ruler className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-sm text-gray-400">IMC</p>
                {(() => {
                  const imc = calculateIMC(latestAssessment.weight, latestAssessment.height)
                  return (
                    <>
                      <p className="text-2xl font-bold text-white">{imc.value.toFixed(1)}</p>
                      <p className={`text-xs text-${imc.color}-400`}>{imc.classification}</p>
                    </>
                  )
                })()}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Circunferencias */}
      {latestAssessment && (
        <Card className="p-6 bg-white/5 border-white/10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Ruler className="w-5 h-5 text-orange-500" />
            Circunferencias (cm)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Peito", value: latestAssessment.chest, prev: previousAssessment?.chest },
              { label: "Cintura", value: latestAssessment.waist, prev: previousAssessment?.waist },
              { label: "Quadril", value: latestAssessment.hips, prev: previousAssessment?.hips },
              { label: "Braco E", value: latestAssessment.left_arm, prev: previousAssessment?.left_arm },
              { label: "Braco D", value: latestAssessment.right_arm, prev: previousAssessment?.right_arm },
              { label: "Coxa E", value: latestAssessment.left_thigh, prev: previousAssessment?.left_thigh },
              { label: "Coxa D", value: latestAssessment.right_thigh, prev: previousAssessment?.right_thigh },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-white/5 rounded-lg">
                <p className="text-sm text-gray-400">{item.label}</p>
                <p className="text-xl font-bold text-white">{item.value || "-"}</p>
                {item.prev && item.value && (() => {
                  const comp = getComparison(item.value, item.prev)
                  return (
                    <p className={`text-xs ${comp.color} flex items-center gap-1`}>
                      <comp.icon className="w-3 h-3" />
                      {comp.diff}
                    </p>
                  )
                })()}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Testes Fisicos */}
      {latestAssessment && (
        <Card className="p-6 bg-white/5 border-white/10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            Testes Fisicos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Flexoes", value: latestAssessment.push_ups_count, unit: "rep", icon: "💪" },
              { label: "Abdominais", value: latestAssessment.sit_ups_count, unit: "rep", icon: "🔥" },
              { label: "Prancha", value: latestAssessment.plank_time, unit: "seg", icon: "⏱️" },
              { label: "Flexibilidade", value: latestAssessment.flexibility_test, unit: "cm", icon: "🧘" },
              { label: "FC Repouso", value: latestAssessment.resting_heart_rate, unit: "bpm", icon: "❤️" },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-white/5 rounded-lg">
                <p className="text-sm text-gray-400">{item.label}</p>
                <p className="text-xl font-bold text-white">
                  {item.value || "-"} <span className="text-sm font-normal text-gray-500">{item.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Historico */}
      <Card className="p-6 bg-white/5 border-white/10">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Historico de Avaliacoes
        </h3>
        
        {assessments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Nenhuma avaliacao registrada</p>
            <p className="text-sm text-gray-500">Clique em "Nova Avaliacao" para comecar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {assessments.map((assessment, idx) => (
              <div
                key={assessment.id}
                className="p-4 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors flex items-center justify-between"
                onClick={() => setSelectedAssessment(assessment)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      Avaliacao {new Date(assessment.assessment_date).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-sm text-gray-400">
                      {assessment.weight} kg | {assessment.body_fat_percentage || "-"}% gordura
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {idx === 0 && <Badge className="bg-green-500/20 text-green-400">Mais recente</Badge>}
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal Nova Avaliacao */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Nova Avaliacao Fisica
            </DialogTitle>
          </DialogHeader>

          <Tabs value={formTab} onValueChange={setFormTab} className="mt-4">
            <TabsList className="grid grid-cols-4 bg-white/10">
              <TabsTrigger value="basico">Basico</TabsTrigger>
              <TabsTrigger value="medidas">Medidas</TabsTrigger>
              <TabsTrigger value="testes">Testes</TabsTrigger>
              <TabsTrigger value="outros">Outros</TabsTrigger>
            </TabsList>

            <TabsContent value="basico" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Data</Label>
                  <Input
                    type="date"
                    value={formData.assessmentDate}
                    onChange={(e) => setFormData({ ...formData, assessmentDate: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Altura (cm)</Label>
                  <Input
                    type="number"
                    placeholder="175"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Peso (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="75.5"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">% Gordura</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="18.5"
                    value={formData.bodyFatPercentage}
                    onChange={(e) => setFormData({ ...formData, bodyFatPercentage: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Massa Muscular (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="35.0"
                    value={formData.muscleMass}
                    onChange={(e) => setFormData({ ...formData, muscleMass: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="medidas" className="space-y-4 mt-4">
              <p className="text-sm text-gray-400 mb-4">Circunferencias em centimetros (cm)</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "neck", label: "Pescoco" },
                  { key: "shoulders", label: "Ombros" },
                  { key: "chest", label: "Peito" },
                  { key: "waist", label: "Cintura" },
                  { key: "hips", label: "Quadril" },
                  { key: "leftArm", label: "Braco Esquerdo" },
                  { key: "rightArm", label: "Braco Direito" },
                  { key: "leftForearm", label: "Antebraco E" },
                  { key: "rightForearm", label: "Antebraco D" },
                  { key: "leftThigh", label: "Coxa Esquerda" },
                  { key: "rightThigh", label: "Coxa Direita" },
                  { key: "leftCalf", label: "Panturrilha E" },
                  { key: "rightCalf", label: "Panturrilha D" },
                ].map((field) => (
                  <div key={field.key}>
                    <Label className="text-gray-300">{field.label}</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={(formData as Record<string, string>)[field.key] || ""}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="testes" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Flexoes (repeticoes)</Label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={formData.pushUpsCount}
                    onChange={(e) => setFormData({ ...formData, pushUpsCount: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Abdominais (repeticoes)</Label>
                  <Input
                    type="number"
                    placeholder="40"
                    value={formData.sitUpsCount}
                    onChange={(e) => setFormData({ ...formData, sitUpsCount: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Prancha (segundos)</Label>
                  <Input
                    type="number"
                    placeholder="60"
                    value={formData.plankTime}
                    onChange={(e) => setFormData({ ...formData, plankTime: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Flexibilidade - Banco Wells (cm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="25"
                    value={formData.flexibilityTest}
                    onChange={(e) => setFormData({ ...formData, flexibilityTest: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">FC Repouso (bpm)</Label>
                  <Input
                    type="number"
                    placeholder="65"
                    value={formData.restingHeartRate}
                    onChange={(e) => setFormData({ ...formData, restingHeartRate: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="outros" className="space-y-4 mt-4">
              <div>
                <Label className="text-gray-300">Nivel de Atividade</Label>
                <Select 
                  value={formData.activityLevel} 
                  onValueChange={(v) => setFormData({ ...formData, activityLevel: v })}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentario">Sedentario</SelectItem>
                    <SelectItem value="leve">Atividade Leve</SelectItem>
                    <SelectItem value="moderado">Atividade Moderada</SelectItem>
                    <SelectItem value="intenso">Atividade Intensa</SelectItem>
                    <SelectItem value="muito_intenso">Muito Intenso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Observacoes</Label>
                <Textarea
                  placeholder="Anotacoes sobre a avaliacao..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-white/10 border-white/20 text-white min-h-[100px]"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-gradient-to-r from-orange-600 to-orange-500"
            >
              Salvar Avaliacao
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
