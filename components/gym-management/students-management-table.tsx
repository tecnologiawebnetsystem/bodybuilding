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
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, UserX, UserCheck, Filter } from "lucide-react"
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

      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="max-w-lg bg-[#0a0a0a] border-white/[0.1]">
          <DialogHeader>
            <DialogTitle className="text-white">Novo Aluno</DialogTitle>
            <DialogDescription className="text-gray-400">Cadastre um novo aluno</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div>
              <Label className="text-gray-300">Nome Completo</Label>
              <Input name="name" required className="bg-white/[0.05] border-white/[0.1] text-white" />
            </div>
            <div>
              <Label className="text-gray-300">Email</Label>
              <Input name="email" type="email" className="bg-white/[0.05] border-white/[0.1] text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Gênero</Label>
                <Select name="gender">
                  <SelectTrigger className="bg-white/[0.05] border-white/[0.1] text-white">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141414] border-white/[0.1]">
                    <SelectItem value="M" className="text-gray-300">
                      Masculino
                    </SelectItem>
                    <SelectItem value="F" className="text-gray-300">
                      Feminino
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Plano</Label>
                <Select name="plan_id">
                  <SelectTrigger className="bg-white/[0.05] border-white/[0.1] text-white">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141414] border-white/[0.1]">
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={String(plan.id)} className="text-gray-300">
                        {plan.name} - R$ {plan.monthly_price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-gray-300">Altura (cm)</Label>
                <Input name="height" type="number" className="bg-white/[0.05] border-white/[0.1] text-white" />
              </div>
              <div>
                <Label className="text-gray-300">Peso Atual</Label>
                <Input
                  name="weight"
                  type="number"
                  step="0.1"
                  className="bg-white/[0.05] border-white/[0.1] text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Peso Meta</Label>
                <Input
                  name="target_weight"
                  type="number"
                  step="0.1"
                  className="bg-white/[0.05] border-white/[0.1] text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddDialog(false)}
                className="border-white/[0.1] text-gray-300"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-orange-500 to-red-600">
                Cadastrar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
