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
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, UserX, UserCheck, FileText, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
    if (
      !confirm(
        `ATENÇÃO: Deseja realmente excluir ${student.student_name}? Esta ação não pode ser desfeita e todos os dados do aluno serão perdidos.`,
      )
    )
      return

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

  const handlePrintReceipt = (student: Student) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Boleto - ${student.student_name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .info { margin: 20px 0; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd; }
            .label { font-weight: bold; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FitTransform Academia</h1>
            <h2>Boleto de Mensalidade</h2>
          </div>
          <div class="info">
            <div class="info-row">
              <span class="label">Aluno:</span>
              <span>${student.student_name}</span>
            </div>
            <div class="info-row">
              <span class="label">Plano:</span>
              <span>${student.plan_name || "N/A"}</span>
            </div>
            <div class="info-row">
              <span class="label">Valor:</span>
              <span>R$ ${Number(student.monthly_value || 0).toFixed(2)}</span>
            </div>
            <div class="info-row">
              <span class="label">Vencimento:</span>
              <span>${student.end_date ? new Date(student.end_date).toLocaleDateString("pt-BR") : "N/A"}</span>
            </div>
          </div>
          <button onclick="window.print()" style="margin-top: 30px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">Imprimir</button>
        </body>
      </html>
    `

    printWindow.document.write(receiptHTML)
    printWindow.document.close()
  }

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/gym-admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          gender: formData.get("gender"),
          height: Number(formData.get("height")),
          current_weight: Number(formData.get("weight")),
          target_weight: Number(formData.get("target_weight")),
          plan_id: Number(formData.get("plan_id")),
          gym_id: 1,
        }),
      })

      if (response.ok) {
        toast({
          title: "Aluno adicionado",
          description: "O aluno foi cadastrado com sucesso.",
        })
        setAddDialog(false)
        loadStudents()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o aluno.",
        variant: "destructive",
      })
    }
  }

  const handleEditStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch(`/api/gym-admin/students/${selectedStudent?.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          gender: formData.get("gender"),
          height: Number(formData.get("height")),
          current_weight: Number(formData.get("weight")),
          target_weight: Number(formData.get("target_weight")),
          pin: formData.get("pin"),
          age: Number(formData.get("age")),
          profile_photo_url: formData.get("profile_photo_url"),
          gym_member_id: formData.get("gym_member_id"),
          partner_gym_id: formData.get("partner_gym_id"),
          subscription_status: formData.get("subscription_status"),
          subscription_plan_id: formData.get("subscription_plan_id"),
          personal_trainer_id: formData.get("personal_trainer_id"),
          user_role: formData.get("user_role"),
        }),
      })

      if (response.ok) {
        toast({
          title: "Aluno atualizado",
          description: "Os dados do aluno foram atualizados com sucesso.",
        })
        setEditDialog(false)
        loadStudents()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o aluno.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Gestão de Alunos</h2>
            <p className="text-slate-600 mt-1">Gerencie todos os alunos matriculados na academia</p>
          </div>
          <Button
            onClick={() => setAddDialog(true)}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Aluno
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>Todos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>Ativos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inativos</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Plano</TableHead>
              <TableHead className="font-semibold">Valor Mensal</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Validade</TableHead>
              <TableHead className="font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.user_id} className="hover:bg-slate-50">
                <TableCell className="font-medium">{student.student_name}</TableCell>
                <TableCell className="text-slate-600">{student.email || "-"}</TableCell>
                <TableCell>
                  {student.plan_name ? (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {student.plan_name}
                    </Badge>
                  ) : (
                    <span className="text-slate-400">Sem plano</span>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {student.monthly_value ? `R$ ${Number(student.monthly_value).toFixed(2)}` : "-"}
                </TableCell>
                <TableCell>
                  {student.status === "active" ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ativo</Badge>
                  ) : student.status === "inactive" ? (
                    <Badge variant="secondary">Inativo</Badge>
                  ) : (
                    <Badge variant="outline">Sem matrícula</Badge>
                  )}
                </TableCell>
                <TableCell className="text-slate-600">
                  {student.end_date ? new Date(student.end_date).toLocaleDateString("pt-BR") : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleView(student)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(student)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePrintReceipt(student)}>
                        <FileText className="w-4 h-4 mr-2" />
                        Imprimir Boleto
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {student.status === "active" ? (
                        <DropdownMenuItem onClick={() => handleDeactivate(student)}>
                          <UserX className="w-4 h-4 mr-2" />
                          Desativar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleReactivate(student)}>
                          <UserCheck className="w-4 h-4 mr-2" />
                          Reativar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => handleDelete(student)}
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

      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <span>
          Exibindo {filteredStudents.length} de {students.length} alunos
        </span>
        <span>Total de alunos cadastrados: {students.length}</span>
      </div>

      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Aluno</DialogTitle>
            <DialogDescription>Informações completas do aluno</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-600">Nome</Label>
                <p className="font-medium">{selectedStudent.student_name}</p>
              </div>
              <div>
                <Label className="text-slate-600">Email</Label>
                <p className="font-medium">{selectedStudent.email || "Não informado"}</p>
              </div>
              <div>
                <Label className="text-slate-600">Gênero</Label>
                <p className="font-medium">{selectedStudent.gender}</p>
              </div>
              <div>
                <Label className="text-slate-600">Altura</Label>
                <p className="font-medium">{selectedStudent.height}cm</p>
              </div>
              <div>
                <Label className="text-slate-600">Peso Atual</Label>
                <p className="font-medium">{selectedStudent.current_weight}kg</p>
              </div>
              <div>
                <Label className="text-slate-600">Peso Meta</Label>
                <p className="font-medium">{selectedStudent.target_weight}kg</p>
              </div>
              <div>
                <Label className="text-slate-600">Plano</Label>
                <p className="font-medium">{selectedStudent.plan_name || "Sem plano"}</p>
              </div>
              <div>
                <Label className="text-slate-600">Valor Mensal</Label>
                <p className="font-medium">R$ {Number(selectedStudent.monthly_value || 0).toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-slate-600">Status</Label>
                <Badge className={selectedStudent.status === "active" ? "bg-green-100 text-green-700" : ""}>
                  {selectedStudent.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <div>
                <Label className="text-slate-600">Validade</Label>
                <p className="font-medium">
                  {selectedStudent.end_date ? new Date(selectedStudent.end_date).toLocaleDateString("pt-BR") : "N/A"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Aluno - Informações Completas</DialogTitle>
            <DialogDescription>Atualize todas as informações do aluno cadastrado</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <form onSubmit={handleEditStudent}>
              {/* Seção: Dados Pessoais */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Dados Pessoais</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nome Completo *</Label>
                    <Input name="name" defaultValue={selectedStudent.student_name} required />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input name="email" type="email" defaultValue={selectedStudent.email || ""} />
                  </div>
                  <div>
                    <Label>PIN de Acesso</Label>
                    <Input name="pin" defaultValue={""} placeholder="Digite para alterar" maxLength={6} />
                  </div>
                  <div>
                    <Label>Idade *</Label>
                    <Input name="age" type="number" defaultValue={""} required />
                  </div>
                  <div>
                    <Label>Gênero *</Label>
                    <Select name="gender" defaultValue={selectedStudent.gender}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Feminino">Feminino</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>URL Foto de Perfil</Label>
                    <Input name="profile_photo_url" type="url" defaultValue={""} placeholder="https://..." />
                  </div>
                </div>
              </div>

              {/* Seção: Dados Físicos e Metas */}
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Dados Físicos e Objetivos</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Altura (cm) *</Label>
                    <Input name="height" type="number" defaultValue={selectedStudent.height} required />
                  </div>
                  <div>
                    <Label>Peso Inicial (kg) *</Label>
                    <Input name="initial_weight" type="number" step="0.1" defaultValue={""} required />
                  </div>
                  <div>
                    <Label>Peso Atual (kg) *</Label>
                    <Input
                      name="current_weight"
                      type="number"
                      step="0.1"
                      defaultValue={selectedStudent.current_weight}
                      required
                    />
                  </div>
                  <div>
                    <Label>Peso Meta (kg) *</Label>
                    <Input
                      name="target_weight"
                      type="number"
                      step="0.1"
                      defaultValue={selectedStudent.target_weight}
                      required
                    />
                  </div>
                  <div>
                    <Label>Data de Início</Label>
                    <Input name="start_date" type="date" defaultValue={""} />
                  </div>
                  <div>
                    <Label>Membro Desde</Label>
                    <Input name="gym_member_since" type="date" defaultValue={""} />
                  </div>
                </div>
              </div>

              {/* Seção: Informações da Academia */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Informações da Academia</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ID de Membro da Academia</Label>
                    <Input name="gym_member_id" defaultValue={""} placeholder="Ex: FIT-2024-001" />
                  </div>
                  <div>
                    <Label>ID Academia Parceira</Label>
                    <Input name="partner_gym_id" defaultValue={""} />
                  </div>
                  <div>
                    <Label>Status da Assinatura</Label>
                    <Select name="subscription_status" defaultValue="">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="suspended">Suspenso</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>ID Plano de Assinatura</Label>
                    <Input name="subscription_plan_id" defaultValue={""} />
                  </div>
                </div>
              </div>

              {/* Seção: Personal Trainer e Papel */}
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Personal Trainer e Papel</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ID Personal Trainer</Label>
                    <Input name="personal_trainer_id" defaultValue={""} placeholder="ID do trainer" />
                  </div>
                  <div>
                    <Label>Papel do Usuário</Label>
                    <Select name="user_role" defaultValue="">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Aluno</SelectItem>
                        <SelectItem value="trainer">Personal Trainer</SelectItem>
                        <SelectItem value="gym_admin">Admin Academia</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setEditDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600">
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Aluno</DialogTitle>
            <DialogDescription>Preencha os dados do novo aluno</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStudent}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Nome Completo</Label>
                <Input name="name" required />
              </div>
              <div>
                <Label>Email</Label>
                <Input name="email" type="email" />
              </div>
              <div>
                <Label>Gênero</Label>
                <Select name="gender" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Altura (cm)</Label>
                <Input name="height" type="number" required />
              </div>
              <div>
                <Label>Peso Atual (kg)</Label>
                <Input name="weight" type="number" step="0.1" required />
              </div>
              <div>
                <Label>Peso Meta (kg)</Label>
                <Input name="target_weight" type="number" step="0.1" required />
              </div>
              <div className="col-span-2">
                <Label>Plano</Label>
                <Select name="plan_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={String(plan.id)}>
                        {plan.plan_name} - R$ {Number(plan.price).toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-red-500 to-red-600">
                Adicionar Aluno
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
