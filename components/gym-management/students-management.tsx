"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Search, CheckCircle, XCircle, UserPlus, Edit, Trash2, Eye, ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Student {
  user_id: string
  student_name: string // Corrigido de name para student_name
  gender: string
  height?: number
  current_weight?: number
  plan_name?: string
  plan_id?: number
  status?: string
  start_date?: string
  end_date?: string
  monthly_value?: number
}

interface Plan {
  id: number
  plan_name: string
  duration_months: number
  price: number
}

const WIZARD_STEPS = 6

export function StudentsManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  
  // Wizard novo aluno
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [newStudent, setNewStudent] = useState({
    // Dados basicos
    name: "",
    cpf: "",
    email: "",
    phone: "",
    age: 25,
    gender: "Masculino",
    height: 170,
    currentWeight: 70,
    targetWeight: 70,
    // Objetivo
    primaryGoal: "gain_muscle",
    goalIntensity: "moderate",
    trainingExperience: "beginner",
    // Treino academia
    gymFrequency: 4,
    preferredSplit: "abc",
    sessionDuration: 60,
    // Treino casa/calistenia
    includeHomeWorkouts: false,
    homeFrequency: 0,
    homeFocus: [] as string[],
    // Corrida
    includeRunning: false,
    runningFrequency: 0,
    runningLevel: "beginner",
    // Suplementacao
    includeSupplements: false,
    supplements: [] as string[],
    // Nutricao
    includeNutrition: false,
    dietType: "balanced",
    mealsPerDay: 4,
    foodRestrictions: [] as string[],
    // Restricoes
    injuriesLimitations: "",
  })

  useEffect(() => {
    loadStudents()
    loadPlans()
  }, [])

  const loadStudents = async () => {
    try {
      console.log("[v0] Carregando alunos...") // Debug
      const res = await fetch("/api/gym-admin/enrollments")
      const data = await res.json()
      console.log("[v0] Alunos carregados:", data) // Debug
      if (Array.isArray(data)) {
        setStudents(data)
      } else {
        console.error("[v0] API retornou objeto ao invés de array:", data)
        setStudents([])
      }
    } catch (error) {
      console.error("Erro ao carregar alunos:", error)
      setStudents([])
    }
  }

  const loadPlans = async () => {
    try {
      const res = await fetch("/api/gym-admin/plans")
      const data = await res.json()
      setPlans(data)
    } catch (error) {
      console.error("Erro ao carregar planos:", error)
    }
  }

  const handleEnrollStudent = async () => {
    if (!selectedStudent || !selectedPlanId) return

    const plan = plans.find((p) => p.id.toString() === selectedPlanId)
    if (!plan) return

    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + plan.duration_months)

    try {
      await fetch("/api/gym-admin/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: selectedStudent.user_id,
          plan_id: plan.id,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
          monthly_value: plan.price / plan.duration_months,
        }),
      })
      setIsEnrollDialogOpen(false)
      setSelectedStudent(null)
      setSelectedPlanId("")
      loadStudents()
    } catch (error) {
      console.error("Erro ao matricular aluno:", error)
    }
  }

  const handleSaveNewStudent = async () => {
    if (!newStudent.name || !newStudent.cpf) {
      toast.error("Nome e CPF sao obrigatorios")
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch("/api/gym-admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Erro ao cadastrar aluno")
      }

      toast.success("Aluno cadastrado com sucesso!")
      setIsWizardOpen(false)
      setWizardStep(1)
      setNewStudent({
        name: "", cpf: "", email: "", phone: "", age: 25, gender: "Masculino",
        height: 170, currentWeight: 70, targetWeight: 70, primaryGoal: "gain_muscle",
        goalIntensity: "moderate", trainingExperience: "beginner", gymFrequency: 4,
        preferredSplit: "abc", sessionDuration: 60, includeHomeWorkouts: false,
        homeFrequency: 0, homeFocus: [], includeRunning: false, runningFrequency: 0,
        runningLevel: "beginner", includeSupplements: false, supplements: [],
        includeNutrition: false, dietType: "balanced", mealsPerDay: 4,
        foodRestrictions: [], injuriesLimitations: "",
      })
      loadStudents()
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar aluno")
    } finally {
      setIsSaving(false)
    }
  }

  const toggleArrayItem = (field: string, value: string) => {
    const currentArray = (newStudent as any)[field] || []
    if (currentArray.includes(value)) {
      setNewStudent({ ...newStudent, [field]: currentArray.filter((item: string) => item !== value) })
    } else {
      setNewStudent({ ...newStudent, [field]: [...currentArray, value] })
    }
  }

  const handleDeleteStudent = async (userId: string) => {
    if (!confirm("Tem certeza que deseja excluir este aluno?")) return
    
    try {
      const res = await fetch(`/api/gym-admin/students/${userId}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Aluno excluido com sucesso")
        loadStudents()
      } else {
        toast.error("Erro ao excluir aluno")
      }
    } catch (error) {
      toast.error("Erro ao excluir aluno")
    }
  }

  const filteredStudents = students.filter((s) => s.student_name?.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar aluno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => setIsWizardOpen(true)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Aluno
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Mostrando {filteredStudents.length} de {students.length} alunos
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => (
          <Card key={student.user_id}>
            <CardHeader>
              <CardTitle className="text-lg">{student.student_name}</CardTitle>
              <CardDescription>@{student.user_id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Plano:</span>
                <span className="font-medium">{student.plan_name || "Sem plano"}</span>
              </div>
              {student.monthly_value && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Mensalidade:</span>
                  <span className="font-medium">R$ {Number(student.monthly_value).toFixed(2)}</span>
                </div>
              )}
              {student.end_date && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Vencimento:</span>
                  <span className="font-medium">{new Date(student.end_date).toLocaleDateString("pt-BR")}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                {student.status === "active" ? (
                  <Badge className="bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="h-3 w-3 mr-1" />
                    Inativo
                  </Badge>
                )}
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedStudent(student)
                      setIsEnrollDialogOpen(true)
                    }}
                    title="Editar plano"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteStudent(student.user_id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Excluir aluno"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {searchTerm ? "Nenhum aluno encontrado com este nome" : "Nenhum aluno matriculado ainda"}
        </div>
      )}

      <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Matrícula</DialogTitle>
            <DialogDescription>Alterar plano do aluno {selectedStudent?.student_name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Selecione o Plano</Label>
              <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um plano" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id.toString()}>
                      {plan.plan_name} - R$ {Number(plan.price).toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEnrollDialogOpen(false)} className="bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handleEnrollStudent}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* WIZARD DE NOVO ALUNO */}
      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastro de Novo Aluno</DialogTitle>
            <DialogDescription>Passo {wizardStep} de {WIZARD_STEPS}</DialogDescription>
            <Progress value={(wizardStep / WIZARD_STEPS) * 100} className="h-2 mt-2" />
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* ETAPA 1: Dados Basicos */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Dados Basicos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Nome Completo *</Label>
                    <Input value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} placeholder="Nome do aluno" />
                  </div>
                  <div>
                    <Label>CPF *</Label>
                    <Input value={newStudent.cpf} onChange={(e) => setNewStudent({...newStudent, cpf: e.target.value})} placeholder="000.000.000-00" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={newStudent.email} onChange={(e) => setNewStudent({...newStudent, email: e.target.value})} placeholder="email@exemplo.com" type="email" />
                  </div>
                  <div>
                    <Label>Telefone</Label>
                    <Input value={newStudent.phone} onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})} placeholder="(00) 00000-0000" />
                  </div>
                  <div>
                    <Label>Idade</Label>
                    <Input type="number" value={newStudent.age} onChange={(e) => setNewStudent({...newStudent, age: Number(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Sexo</Label>
                    <Select value={newStudent.gender} onValueChange={(v) => setNewStudent({...newStudent, gender: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Feminino">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Altura (cm)</Label>
                    <Input type="number" value={newStudent.height} onChange={(e) => setNewStudent({...newStudent, height: Number(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Peso Atual (kg)</Label>
                    <Input type="number" value={newStudent.currentWeight} onChange={(e) => setNewStudent({...newStudent, currentWeight: Number(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Peso Meta (kg)</Label>
                    <Input type="number" value={newStudent.targetWeight} onChange={(e) => setNewStudent({...newStudent, targetWeight: Number(e.target.value)})} />
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 2: Objetivo e Experiencia */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Objetivo e Experiencia</h3>
                <div>
                  <Label>Objetivo Principal</Label>
                  <RadioGroup value={newStudent.primaryGoal} onValueChange={(v) => setNewStudent({...newStudent, primaryGoal: v})}>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="lose_weight" id="lose" />
                        <Label htmlFor="lose">Emagrecimento</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="gain_muscle" id="gain" />
                        <Label htmlFor="gain">Ganho de Massa</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="maintain" id="maintain" />
                        <Label htmlFor="maintain">Manutencao</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="athletic" id="athletic" />
                        <Label htmlFor="athletic">Performance</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label>Intensidade Desejada</Label>
                  <Select value={newStudent.goalIntensity} onValueChange={(v) => setNewStudent({...newStudent, goalIntensity: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Leve - Progresso gradual</SelectItem>
                      <SelectItem value="moderate">Moderada - Equilibrado</SelectItem>
                      <SelectItem value="intense">Intensa - Resultados rapidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Experiencia com Treino</Label>
                  <Select value={newStudent.trainingExperience} onValueChange={(v) => setNewStudent({...newStudent, trainingExperience: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Iniciante - Menos de 6 meses</SelectItem>
                      <SelectItem value="intermediate">Intermediario - 6 meses a 2 anos</SelectItem>
                      <SelectItem value="advanced">Avancado - Mais de 2 anos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* ETAPA 3: Treino Academia */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Treino na Academia</h3>
                <div>
                  <Label>Frequencia Semanal: {newStudent.gymFrequency}x</Label>
                  <Slider value={[newStudent.gymFrequency]} onValueChange={(v) => setNewStudent({...newStudent, gymFrequency: v[0]})} max={7} step={1} className="mt-2" />
                </div>
                <div>
                  <Label>Divisao de Treino</Label>
                  <Select value={newStudent.preferredSplit} onValueChange={(v) => setNewStudent({...newStudent, preferredSplit: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_body">Full Body</SelectItem>
                      <SelectItem value="upper_lower">Upper/Lower</SelectItem>
                      <SelectItem value="abc">ABC (3 treinos)</SelectItem>
                      <SelectItem value="abcd">ABCD (4 treinos)</SelectItem>
                      <SelectItem value="ppl">Push/Pull/Legs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Duracao por Sessao: {newStudent.sessionDuration} min</Label>
                  <Slider value={[newStudent.sessionDuration]} onValueChange={(v) => setNewStudent({...newStudent, sessionDuration: v[0]})} min={30} max={120} step={15} className="mt-2" />
                </div>
              </div>
            )}

            {/* ETAPA 4: Calistenia e Corrida */}
            {wizardStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Treino em Casa / Calistenia</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={newStudent.includeHomeWorkouts} onCheckedChange={(c) => setNewStudent({...newStudent, includeHomeWorkouts: !!c})} />
                    <Label>Incluir treinos em casa</Label>
                  </div>
                  {newStudent.includeHomeWorkouts && (
                    <>
                      <div>
                        <Label>Frequencia Semanal: {newStudent.homeFrequency}x</Label>
                        <Slider value={[newStudent.homeFrequency]} onValueChange={(v) => setNewStudent({...newStudent, homeFrequency: v[0]})} max={7} step={1} className="mt-2" />
                      </div>
                      <div>
                        <Label>Foco do Treino em Casa</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {["Cardio", "Forca", "Flexibilidade", "Core"].map((focus) => (
                            <div key={focus} className="flex items-center space-x-2">
                              <Checkbox checked={newStudent.homeFocus.includes(focus)} onCheckedChange={() => toggleArrayItem("homeFocus", focus)} />
                              <Label>{focus}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-lg">Corrida / Cardio</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={newStudent.includeRunning} onCheckedChange={(c) => setNewStudent({...newStudent, includeRunning: !!c})} />
                    <Label>Incluir corrida</Label>
                  </div>
                  {newStudent.includeRunning && (
                    <>
                      <div>
                        <Label>Nivel</Label>
                        <Select value={newStudent.runningLevel} onValueChange={(v) => setNewStudent({...newStudent, runningLevel: v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Iniciante</SelectItem>
                            <SelectItem value="intermediate">Intermediario</SelectItem>
                            <SelectItem value="advanced">Avancado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Frequencia Semanal: {newStudent.runningFrequency}x</Label>
                        <Slider value={[newStudent.runningFrequency]} onValueChange={(v) => setNewStudent({...newStudent, runningFrequency: v[0]})} max={7} step={1} className="mt-2" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ETAPA 5: Suplementacao e Nutricao */}
            {wizardStep === 5 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Suplementacao</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={newStudent.includeSupplements} onCheckedChange={(c) => setNewStudent({...newStudent, includeSupplements: !!c})} />
                    <Label>Incluir suplementacao</Label>
                  </div>
                  {newStudent.includeSupplements && (
                    <div>
                      <Label>Suplementos de Interesse</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {["Whey Protein", "Creatina", "BCAA", "Pre-Treino", "Glutamina", "Multivitaminico"].map((supp) => (
                          <div key={supp} className="flex items-center space-x-2">
                            <Checkbox checked={newStudent.supplements.includes(supp)} onCheckedChange={() => toggleArrayItem("supplements", supp)} />
                            <Label>{supp}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-lg">Nutricao</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={newStudent.includeNutrition} onCheckedChange={(c) => setNewStudent({...newStudent, includeNutrition: !!c})} />
                    <Label>Incluir plano nutricional</Label>
                  </div>
                  {newStudent.includeNutrition && (
                    <>
                      <div>
                        <Label>Tipo de Dieta</Label>
                        <Select value={newStudent.dietType} onValueChange={(v) => setNewStudent({...newStudent, dietType: v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="balanced">Equilibrada</SelectItem>
                            <SelectItem value="low_carb">Low Carb</SelectItem>
                            <SelectItem value="keto">Cetogenica</SelectItem>
                            <SelectItem value="vegetarian">Vegetariana</SelectItem>
                            <SelectItem value="vegan">Vegana</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Restricoes Alimentares</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {["Lactose", "Gluten", "Frutos do Mar", "Amendoim", "Ovo"].map((rest) => (
                            <div key={rest} className="flex items-center space-x-2">
                              <Checkbox checked={newStudent.foodRestrictions.includes(rest)} onCheckedChange={() => toggleArrayItem("foodRestrictions", rest)} />
                              <Label>{rest}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ETAPA 6: Restricoes e Finalizacao */}
            {wizardStep === 6 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Restricoes e Observacoes</h3>
                <div>
                  <Label>Lesoes ou Limitacoes Fisicas</Label>
                  <Textarea 
                    value={newStudent.injuriesLimitations} 
                    onChange={(e) => setNewStudent({...newStudent, injuriesLimitations: e.target.value})} 
                    placeholder="Descreva qualquer lesao, cirurgia recente ou limitacao fisica..."
                    rows={3}
                  />
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Resumo do Cadastro</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p><strong>Nome:</strong> {newStudent.name}</p>
                    <p><strong>Objetivo:</strong> {newStudent.primaryGoal === "gain_muscle" ? "Ganho de Massa" : newStudent.primaryGoal === "lose_weight" ? "Emagrecimento" : newStudent.primaryGoal === "maintain" ? "Manutencao" : "Performance"}</p>
                    <p><strong>Frequencia Academia:</strong> {newStudent.gymFrequency}x/semana</p>
                    {newStudent.includeHomeWorkouts && <p><strong>Treino em Casa:</strong> {newStudent.homeFrequency}x/semana</p>}
                    {newStudent.includeRunning && <p><strong>Corrida:</strong> {newStudent.runningFrequency}x/semana</p>}
                    {newStudent.includeSupplements && <p><strong>Suplementos:</strong> {newStudent.supplements.join(", ") || "Nenhum selecionado"}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => wizardStep > 1 ? setWizardStep(wizardStep - 1) : setIsWizardOpen(false)} className="bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {wizardStep === 1 ? "Cancelar" : "Voltar"}
            </Button>
            {wizardStep < WIZARD_STEPS ? (
              <Button onClick={() => setWizardStep(wizardStep + 1)}>
                Proximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSaveNewStudent} disabled={isSaving} className="bg-gradient-to-r from-green-500 to-emerald-600">
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                {isSaving ? "Salvando..." : "Cadastrar Aluno"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
