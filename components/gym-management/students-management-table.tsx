"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, UserX, UserCheck, Filter, ArrowLeft, ArrowRight, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

const WIZARD_STEPS = 6

interface Student {
  user_id: string
  student_name: string
  email: string
  gender: string
  height: number
  current_weight: number
  target_weight: number
  plan_name: string | null
  monthly_value: number | null
  start_date: string | null
  end_date: string | null
  status: string | null
  age: number
  pin: string
  profile_photo_url: string
  gym_member_id: string
  partner_gym_id: string
  subscription_status: string
  subscription_plan_id: string
  personal_trainer_id: string
  user_role: string
}

export function StudentsManagementTable() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [viewDialog, setViewDialog] = useState(false)
  const [editDialog, setEditDialog] = useState(false)
  const [addDialog, setAddDialog] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [plans, setPlans] = useState<any[]>([])
  const { toast } = useToast()
  
  // Wizard novo aluno
  const [wizardStep, setWizardStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [newStudent, setNewStudent] = useState({
    // Dados basicos
    name: "",
    cpf: "",
    pin: "",
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
    // Plano
    planId: "",
  })

  useEffect(() => {
    loadStudents()
    loadPlans()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [students, searchTerm, statusFilter])

  const loadStudents = async () => {
    try {
      const response = await fetch("/api/gym-admin/enrollments")
      const data = await response.json()
      setStudents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erro ao carregar alunos:", error)
      setStudents([])
    }
  }

  const loadPlans = async () => {
    try {
      const response = await fetch("/api/gym-admin/plans")
      const data = await response.json()
      setPlans(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erro ao carregar planos:", error)
    }
  }

  const filterStudents = () => {
    let filtered = students

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === statusFilter)
    }

    setFilteredStudents(filtered)
  }

  const handleView = (student: Student) => {
    setSelectedStudent(student)
    setViewDialog(true)
  }

  const handleEdit = (student: Student) => {
    setSelectedStudent(student)
    setEditDialog(true)
  }

  const handleDeactivate = async (student: Student) => {
    if (!confirm(`Deseja realmente desativar a matrícula de ${student.student_name}?`)) return

    try {
      const response = await fetch(`/api/gym-admin/enrollments/${student.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "inactive" }),
      })

      if (response.ok) {
        toast({
          title: "Aluno desativado",
          description: "A matrícula foi desativada com sucesso.",
        })
        loadStudents()
      } else {
        throw new Error("Falha ao desativar")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível desativar o aluno.",
        variant: "destructive",
      })
    }
  }

  const handleReactivate = async (student: Student) => {
    try {
      const response = await fetch(`/api/gym-admin/enrollments/${student.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      })

      if (response.ok) {
        toast({
          title: "Aluno reativado",
          description: "A matrícula foi reativada com sucesso.",
        })
        loadStudents()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível reativar o aluno.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (student: Student) => {
    if (!confirm(`ATENÇÃO: Deseja realmente excluir ${student.student_name}? Esta ação não pode ser desfeita.`)) return

    try {
      const response = await fetch(`/api/gym-admin/enrollments/${student.user_id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Aluno excluído",
          description: "O aluno foi removido com sucesso.",
        })
        loadStudents()
      } else {
        throw new Error("Falha ao excluir")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o aluno.",
        variant: "destructive",
      })
    }
  }

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.cpf) {
      toast({ title: "Erro", description: "Nome e CPF sao obrigatorios", variant: "destructive" })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/gym-admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Aluno cadastrado!",
          description: `PIN de acesso: ${data.pin}`,
        })
        setAddDialog(false)
        setWizardStep(1)
        resetNewStudent()
        loadStudents()
      } else {
        throw new Error(data.message || "Erro ao cadastrar")
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Nao foi possivel adicionar o aluno.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const resetNewStudent = () => {
    setNewStudent({
      name: "", cpf: "", pin: "", email: "", phone: "", age: 25, gender: "Masculino",
      height: 170, currentWeight: 70, targetWeight: 70, primaryGoal: "gain_muscle",
      goalIntensity: "moderate", trainingExperience: "beginner", gymFrequency: 4,
      preferredSplit: "abc", sessionDuration: 60, includeHomeWorkouts: false,
      homeFrequency: 0, homeFocus: [], includeRunning: false, runningFrequency: 0,
      runningLevel: "beginner", includeSupplements: false, supplements: [],
      includeNutrition: false, dietType: "balanced", mealsPerDay: 4,
      foodRestrictions: [], injuriesLimitations: "", planId: "",
    })
  }

  const toggleArrayItem = (field: string, value: string) => {
    const currentArray = (newStudent as any)[field] || []
    if (currentArray.includes(value)) {
      setNewStudent({ ...newStudent, [field]: currentArray.filter((item: string) => item !== value) })
    } else {
      setNewStudent({ ...newStudent, [field]: [...currentArray, value] })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestão de Alunos</h2>
          <p className="text-gray-400 text-sm">Gerencie todos os alunos matriculados</p>
        </div>
        <Button
          onClick={() => setAddDialog(true)}
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Aluno
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/[0.05] border-white/[0.1] text-white placeholder:text-gray-500"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-white/[0.1] text-gray-300 hover:bg-white/[0.05] bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#141414] border-white/[0.1]">
            <DropdownMenuItem onClick={() => setStatusFilter("all")} className="text-gray-300 hover:bg-white/[0.05]">
              Todos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("active")} className="text-gray-300 hover:bg-white/[0.05]">
              Ativos
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setStatusFilter("inactive")}
              className="text-gray-300 hover:bg-white/[0.05]"
            >
              Inativos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="bg-white/[0.03] rounded-xl border border-white/[0.08] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.08] hover:bg-transparent">
              <TableHead className="text-gray-400 font-medium">Nome</TableHead>
              <TableHead className="text-gray-400 font-medium">Email</TableHead>
              <TableHead className="text-gray-400 font-medium">Plano</TableHead>
              <TableHead className="text-gray-400 font-medium">Valor</TableHead>
              <TableHead className="text-gray-400 font-medium">Status</TableHead>
              <TableHead className="text-gray-400 font-medium">Validade</TableHead>
              <TableHead className="text-gray-400 font-medium text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.user_id} className="border-white/[0.08] hover:bg-white/[0.03]">
                <TableCell className="font-medium text-white">{student.student_name}</TableCell>
                <TableCell className="text-gray-400">{student.email || "-"}</TableCell>
                <TableCell>
                  {student.plan_name ? (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                      {student.plan_name}
                    </Badge>
                  ) : (
                    <span className="text-gray-500">Sem plano</span>
                  )}
                </TableCell>
                <TableCell className="font-medium text-white">
                  {student.monthly_value ? `R$ ${Number(student.monthly_value).toFixed(2)}` : "-"}
                </TableCell>
                <TableCell>
                  {student.status === "active" ? (
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/30">Ativo</Badge>
                  ) : student.status === "inactive" ? (
                    <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/30">Inativo</Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">
                      Sem matrícula
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-gray-400">
                  {student.end_date ? new Date(student.end_date).toLocaleDateString("pt-BR") : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white hover:bg-white/[0.05]"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-[#141414] border-white/[0.1]">
                      <DropdownMenuLabel className="text-gray-400 text-xs">Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/[0.08]" />
                      <DropdownMenuItem
                        onClick={() => handleView(student)}
                        className="text-gray-300 hover:bg-white/[0.05]"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEdit(student)}
                        className="text-gray-300 hover:bg-white/[0.05]"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/[0.08]" />
                      {student.status === "active" ? (
                        <DropdownMenuItem
                          onClick={() => handleDeactivate(student)}
                          className="text-yellow-400 hover:bg-white/[0.05]"
                        >
                          <UserX className="w-4 h-4 mr-2" />
                          Desativar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleReactivate(student)}
                          className="text-green-400 hover:bg-white/[0.05]"
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          Reativar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDelete(student)}
                        className="text-red-400 hover:bg-white/[0.05]"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Exibindo {filteredStudents.length} de {students.length} alunos
        </span>
        <span>Total cadastrado: {students.length}</span>
      </div>

      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="max-w-2xl bg-[#0a0a0a] border-white/[0.1]">
          <DialogHeader>
            <DialogTitle className="text-white">Detalhes do Aluno</DialogTitle>
            <DialogDescription className="text-gray-400">Informações completas</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Nome", value: selectedStudent.student_name },
                { label: "Email", value: selectedStudent.email || "Não informado" },
                { label: "Gênero", value: selectedStudent.gender },
                { label: "Altura", value: `${selectedStudent.height}cm` },
                { label: "Peso Atual", value: `${selectedStudent.current_weight}kg` },
                { label: "Peso Meta", value: `${selectedStudent.target_weight}kg` },
                { label: "Plano", value: selectedStudent.plan_name || "Sem plano" },
                { label: "Valor", value: `R$ ${Number(selectedStudent.monthly_value || 0).toFixed(2)}` },
              ].map((item, i) => (
                <div key={i}>
                  <Label className="text-gray-400 text-xs">{item.label}</Label>
                  <p className="font-medium text-white">{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={addDialog} onOpenChange={(open) => { setAddDialog(open); if (!open) { setWizardStep(1); resetNewStudent(); } }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-white/[0.1]">
          <DialogHeader>
            <DialogTitle className="text-white">Cadastro de Novo Aluno</DialogTitle>
            <DialogDescription className="text-gray-400">Passo {wizardStep} de {WIZARD_STEPS}</DialogDescription>
            <Progress value={(wizardStep / WIZARD_STEPS) * 100} className="h-2 mt-2" />
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* ETAPA 1: Dados Basicos */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-white">Dados Basicos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-gray-300">Nome Completo *</Label>
                    <Input value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} placeholder="Nome do aluno" className="bg-white/[0.05] border-white/[0.1] text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300">CPF *</Label>
                    <Input value={newStudent.cpf} onChange={(e) => setNewStudent({...newStudent, cpf: e.target.value})} placeholder="000.000.000-00" className="bg-white/[0.05] border-white/[0.1] text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300">PIN (6 digitos) - deixe vazio para gerar automatico</Label>
                    <Input value={newStudent.pin} onChange={(e) => setNewStudent({...newStudent, pin: e.target.value})} placeholder="000000" maxLength={6} className="bg-white/[0.05] border-white/[0.1] text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300">Email</Label>
                    <Input value={newStudent.email} onChange={(e) => setNewStudent({...newStudent, email: e.target.value})} placeholder="email@exemplo.com" type="email" className="bg-white/[0.05] border-white/[0.1] text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300">Telefone</Label>
                    <Input value={newStudent.phone} onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})} placeholder="(00) 00000-0000" className="bg-white/[0.05] border-white/[0.1] text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300">Idade</Label>
                    <Input type="number" value={newStudent.age} onChange={(e) => setNewStudent({...newStudent, age: Number(e.target.value)})} className="bg-white/[0.05] border-white/[0.1] text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300">Sexo</Label>
                    <Select value={newStudent.gender} onValueChange={(v) => setNewStudent({...newStudent, gender: v})}>
                      <SelectTrigger className="bg-white/[0.05] border-white/[0.1] text-white"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-[#141414] border-white/[0.1]">
                        <SelectItem value="Masculino" className="text-gray-300">Masculino</SelectItem>
                        <SelectItem value="Feminino" className="text-gray-300">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Altura (cm)</Label>
                    <Input type="number" value={newStudent.height} onChange={(e) => setNewStudent({...newStudent, height: Number(e.target.value)})} className="bg-white/[0.05] border-white/[0.1] text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300">Peso Atual (kg)</Label>
                    <Input type="number" value={newStudent.currentWeight} onChange={(e) => setNewStudent({...newStudent, currentWeight: Number(e.target.value)})} className="bg-white/[0.05] border-white/[0.1] text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300">Peso Meta (kg)</Label>
                    <Input type="number" value={newStudent.targetWeight} onChange={(e) => setNewStudent({...newStudent, targetWeight: Number(e.target.value)})} className="bg-white/[0.05] border-white/[0.1] text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300">Plano</Label>
                    <Select value={newStudent.planId} onValueChange={(v) => setNewStudent({...newStudent, planId: v})}>
                      <SelectTrigger className="bg-white/[0.05] border-white/[0.1] text-white"><SelectValue placeholder="Selecione um plano" /></SelectTrigger>
                      <SelectContent className="bg-[#141414] border-white/[0.1]">
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={String(plan.id)} className="text-gray-300">{plan.name} - R$ {plan.monthly_price}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 2: Objetivo e Experiencia */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-white">Objetivo e Experiencia</h3>
                <div>
                  <Label className="text-gray-300">Objetivo Principal</Label>
                  <RadioGroup value={newStudent.primaryGoal} onValueChange={(v) => setNewStudent({...newStudent, primaryGoal: v})}>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center space-x-2 p-3 border border-white/[0.1] rounded-lg bg-white/[0.02]">
                        <RadioGroupItem value="lose_weight" id="lose" />
                        <Label htmlFor="lose" className="text-gray-300">Emagrecimento</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border border-white/[0.1] rounded-lg bg-white/[0.02]">
                        <RadioGroupItem value="gain_muscle" id="gain" />
                        <Label htmlFor="gain" className="text-gray-300">Ganho de Massa</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border border-white/[0.1] rounded-lg bg-white/[0.02]">
                        <RadioGroupItem value="maintain" id="maintain" />
                        <Label htmlFor="maintain" className="text-gray-300">Manutencao</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border border-white/[0.1] rounded-lg bg-white/[0.02]">
                        <RadioGroupItem value="athletic" id="athletic" />
                        <Label htmlFor="athletic" className="text-gray-300">Performance</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label className="text-gray-300">Intensidade Desejada</Label>
                  <Select value={newStudent.goalIntensity} onValueChange={(v) => setNewStudent({...newStudent, goalIntensity: v})}>
                    <SelectTrigger className="bg-white/[0.05] border-white/[0.1] text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#141414] border-white/[0.1]">
                      <SelectItem value="light" className="text-gray-300">Leve - Progresso gradual</SelectItem>
                      <SelectItem value="moderate" className="text-gray-300">Moderada - Equilibrado</SelectItem>
                      <SelectItem value="intense" className="text-gray-300">Intensa - Resultados rapidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Experiencia com Treino</Label>
                  <Select value={newStudent.trainingExperience} onValueChange={(v) => setNewStudent({...newStudent, trainingExperience: v})}>
                    <SelectTrigger className="bg-white/[0.05] border-white/[0.1] text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#141414] border-white/[0.1]">
                      <SelectItem value="beginner" className="text-gray-300">Iniciante - Menos de 6 meses</SelectItem>
                      <SelectItem value="intermediate" className="text-gray-300">Intermediario - 6 meses a 2 anos</SelectItem>
                      <SelectItem value="advanced" className="text-gray-300">Avancado - Mais de 2 anos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* ETAPA 3: Treino Academia */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-white">Treino na Academia</h3>
                <div>
                  <Label className="text-gray-300">Frequencia Semanal: {newStudent.gymFrequency}x</Label>
                  <Slider value={[newStudent.gymFrequency]} onValueChange={(v) => setNewStudent({...newStudent, gymFrequency: v[0]})} max={7} min={1} step={1} className="mt-2" />
                </div>
                <div>
                  <Label className="text-gray-300">Divisao de Treino</Label>
                  <Select value={newStudent.preferredSplit} onValueChange={(v) => setNewStudent({...newStudent, preferredSplit: v})}>
                    <SelectTrigger className="bg-white/[0.05] border-white/[0.1] text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#141414] border-white/[0.1]">
                      <SelectItem value="full_body" className="text-gray-300">Full Body</SelectItem>
                      <SelectItem value="upper_lower" className="text-gray-300">Upper/Lower</SelectItem>
                      <SelectItem value="abc" className="text-gray-300">ABC (3 treinos)</SelectItem>
                      <SelectItem value="abcd" className="text-gray-300">ABCD (4 treinos)</SelectItem>
                      <SelectItem value="ppl" className="text-gray-300">Push/Pull/Legs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Duracao por Sessao: {newStudent.sessionDuration} min</Label>
                  <Slider value={[newStudent.sessionDuration]} onValueChange={(v) => setNewStudent({...newStudent, sessionDuration: v[0]})} min={30} max={120} step={15} className="mt-2" />
                </div>
              </div>
            )}

            {/* ETAPA 4: Calistenia e Corrida */}
            {wizardStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-white">Treino em Casa / Calistenia</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={newStudent.includeHomeWorkouts} onCheckedChange={(c) => setNewStudent({...newStudent, includeHomeWorkouts: !!c})} />
                    <Label className="text-gray-300">Incluir treinos em casa</Label>
                  </div>
                  {newStudent.includeHomeWorkouts && (
                    <>
                      <div>
                        <Label className="text-gray-300">Frequencia Semanal: {newStudent.homeFrequency}x</Label>
                        <Slider value={[newStudent.homeFrequency]} onValueChange={(v) => setNewStudent({...newStudent, homeFrequency: v[0]})} max={7} step={1} className="mt-2" />
                      </div>
                      <div>
                        <Label className="text-gray-300">Foco do Treino em Casa</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {["Cardio", "Forca", "Flexibilidade", "Core"].map((focus) => (
                            <div key={focus} className="flex items-center space-x-2 p-2 border border-white/[0.1] rounded bg-white/[0.02]">
                              <Checkbox checked={newStudent.homeFocus.includes(focus)} onCheckedChange={() => toggleArrayItem("homeFocus", focus)} />
                              <Label className="text-gray-300">{focus}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="space-y-4 border-t border-white/[0.1] pt-4">
                  <h3 className="font-semibold text-lg text-white">Corrida / Cardio</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={newStudent.includeRunning} onCheckedChange={(c) => setNewStudent({...newStudent, includeRunning: !!c})} />
                    <Label className="text-gray-300">Incluir corrida</Label>
                  </div>
                  {newStudent.includeRunning && (
                    <>
                      <div>
                        <Label className="text-gray-300">Nivel</Label>
                        <Select value={newStudent.runningLevel} onValueChange={(v) => setNewStudent({...newStudent, runningLevel: v})}>
                          <SelectTrigger className="bg-white/[0.05] border-white/[0.1] text-white"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-[#141414] border-white/[0.1]">
                            <SelectItem value="beginner" className="text-gray-300">Iniciante</SelectItem>
                            <SelectItem value="intermediate" className="text-gray-300">Intermediario</SelectItem>
                            <SelectItem value="advanced" className="text-gray-300">Avancado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-300">Frequencia Semanal: {newStudent.runningFrequency}x</Label>
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
                  <h3 className="font-semibold text-lg text-white">Suplementacao</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={newStudent.includeSupplements} onCheckedChange={(c) => setNewStudent({...newStudent, includeSupplements: !!c})} />
                    <Label className="text-gray-300">Incluir suplementacao</Label>
                  </div>
                  {newStudent.includeSupplements && (
                    <div>
                      <Label className="text-gray-300">Suplementos de Interesse</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {["Whey Protein", "Creatina", "BCAA", "Pre-Treino", "Glutamina", "Multivitaminico"].map((supp) => (
                          <div key={supp} className="flex items-center space-x-2 p-2 border border-white/[0.1] rounded bg-white/[0.02]">
                            <Checkbox checked={newStudent.supplements.includes(supp)} onCheckedChange={() => toggleArrayItem("supplements", supp)} />
                            <Label className="text-gray-300">{supp}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4 border-t border-white/[0.1] pt-4">
                  <h3 className="font-semibold text-lg text-white">Nutricao</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={newStudent.includeNutrition} onCheckedChange={(c) => setNewStudent({...newStudent, includeNutrition: !!c})} />
                    <Label className="text-gray-300">Incluir plano nutricional</Label>
                  </div>
                  {newStudent.includeNutrition && (
                    <>
                      <div>
                        <Label className="text-gray-300">Tipo de Dieta</Label>
                        <Select value={newStudent.dietType} onValueChange={(v) => setNewStudent({...newStudent, dietType: v})}>
                          <SelectTrigger className="bg-white/[0.05] border-white/[0.1] text-white"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-[#141414] border-white/[0.1]">
                            <SelectItem value="balanced" className="text-gray-300">Equilibrada</SelectItem>
                            <SelectItem value="low_carb" className="text-gray-300">Low Carb</SelectItem>
                            <SelectItem value="keto" className="text-gray-300">Cetogenica</SelectItem>
                            <SelectItem value="vegetarian" className="text-gray-300">Vegetariana</SelectItem>
                            <SelectItem value="vegan" className="text-gray-300">Vegana</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-300">Restricoes Alimentares</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {["Lactose", "Gluten", "Frutos do Mar", "Amendoim", "Ovo"].map((rest) => (
                            <div key={rest} className="flex items-center space-x-2 p-2 border border-white/[0.1] rounded bg-white/[0.02]">
                              <Checkbox checked={newStudent.foodRestrictions.includes(rest)} onCheckedChange={() => toggleArrayItem("foodRestrictions", rest)} />
                              <Label className="text-gray-300">{rest}</Label>
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
                <h3 className="font-semibold text-lg text-white">Restricoes e Observacoes</h3>
                <div>
                  <Label className="text-gray-300">Lesoes ou Limitacoes Fisicas</Label>
                  <Textarea 
                    value={newStudent.injuriesLimitations} 
                    onChange={(e) => setNewStudent({...newStudent, injuriesLimitations: e.target.value})} 
                    placeholder="Descreva qualquer lesao, cirurgia recente ou limitacao fisica..."
                    rows={3}
                    className="bg-white/[0.05] border-white/[0.1] text-white"
                  />
                </div>
                <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
                  <h4 className="font-semibold text-green-400 mb-2">Resumo do Cadastro</h4>
                  <div className="text-sm text-green-300 space-y-1">
                    <p><strong>Nome:</strong> {newStudent.name}</p>
                    <p><strong>CPF:</strong> {newStudent.cpf}</p>
                    <p><strong>Objetivo:</strong> {newStudent.primaryGoal === "gain_muscle" ? "Ganho de Massa" : newStudent.primaryGoal === "lose_weight" ? "Emagrecimento" : newStudent.primaryGoal === "maintain" ? "Manutencao" : "Performance"}</p>
                    <p><strong>Frequencia Academia:</strong> {newStudent.gymFrequency}x/semana</p>
                    <p><strong>Divisao:</strong> {newStudent.preferredSplit.toUpperCase()}</p>
                    {newStudent.includeHomeWorkouts && <p><strong>Calistenia:</strong> {newStudent.homeFrequency}x/semana</p>}
                    {newStudent.includeRunning && <p><strong>Corrida:</strong> {newStudent.runningFrequency}x/semana</p>}
                    {newStudent.includeSupplements && <p><strong>Suplementos:</strong> {newStudent.supplements.join(", ") || "Nenhum selecionado"}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => wizardStep > 1 ? setWizardStep(wizardStep - 1) : setAddDialog(false)} className="border-white/[0.1] text-gray-300 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {wizardStep === 1 ? "Cancelar" : "Voltar"}
            </Button>
            {wizardStep < WIZARD_STEPS ? (
              <Button onClick={() => setWizardStep(wizardStep + 1)} className="bg-gradient-to-r from-orange-500 to-red-600">
                Proximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleAddStudent} disabled={isSaving} className="bg-gradient-to-r from-green-500 to-emerald-600">
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
