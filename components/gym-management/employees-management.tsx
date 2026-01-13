"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, User } from "lucide-react"

interface Employee {
  id: number
  name: string
  cpf?: string
  position?: string
  phone?: string
  email?: string
  salary?: number
  hire_date?: string
  status: string
}

export function EmployeesManagement() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    position: "",
    phone: "",
    email: "",
    salary: "",
    hire_date: "",
  })

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      const res = await fetch("/api/gym-admin/employees")
      const data = await res.json()
      setEmployees(data)
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error)
    }
  }

  const handleSubmit = async () => {
    try {
      const url = editingEmployee ? `/api/gym-admin/employees?id=${editingEmployee.id}` : "/api/gym-admin/employees"
      const method = editingEmployee ? "PUT" : "POST"

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          salary: formData.salary ? Number.parseFloat(formData.salary) : null,
        }),
      })

      setIsDialogOpen(false)
      setEditingEmployee(null)
      setFormData({ name: "", cpf: "", position: "", phone: "", email: "", salary: "", hire_date: "" })
      loadEmployees()
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error)
    }
  }

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      name: employee.name,
      cpf: employee.cpf || "",
      position: employee.position || "",
      phone: employee.phone || "",
      email: employee.email || "",
      salary: employee.salary?.toString() || "",
      hire_date: employee.hire_date || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este funcionário?")) return

    try {
      await fetch(`/api/gym-admin/employees?id=${id}`, { method: "DELETE" })
      loadEmployees()
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Funcionários</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingEmployee(null)
                setFormData({ name: "", cpf: "", position: "", phone: "", email: "", salary: "", hire_date: "" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingEmployee ? "Editar Funcionário" : "Novo Funcionário"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome Completo</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <Label>CPF</Label>
                <Input
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <Label>Cargo</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="Ex: Recepcionista"
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Salário (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Data de Contratação</Label>
                <Input
                  type="date"
                  value={formData.hire_date}
                  onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {employees.map((employee) => (
          <Card key={employee.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{employee.name}</CardTitle>
                </div>
                {employee.status === "active" && <Badge className="bg-green-500">Ativo</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="text-muted-foreground">Cargo:</span> {employee.position || "Não informado"}
              </div>
              {employee.salary && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Salário:</span> R$ {Number(employee.salary).toFixed(2)}
                </div>
              )}
              {employee.phone && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Tel:</span> {employee.phone}
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleEdit(employee)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 bg-transparent"
                  onClick={() => handleDelete(employee.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
