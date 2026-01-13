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
import { Search, CheckCircle, XCircle, UserPlus, Edit } from "lucide-react"

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

export function StudentsManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")

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
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
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
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelectedStudent(student)
                    setIsEnrollDialogOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
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
            <Button variant="outline" onClick={() => setIsEnrollDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEnrollStudent}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
