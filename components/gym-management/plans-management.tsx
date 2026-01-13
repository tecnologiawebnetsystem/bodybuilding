"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Calendar } from "lucide-react"

interface Plan {
  id: number
  plan_name: string
  duration_months: number
  price: number
  description?: string
  is_active: boolean
}

export function PlansManagement() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [formData, setFormData] = useState({ plan_name: "", duration_months: "", price: "", description: "" })

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const res = await fetch("/api/gym-admin/plans")
      const data = await res.json()
      setPlans(data)
    } catch (error) {
      console.error("Erro ao carregar planos:", error)
    }
  }

  const handleSubmit = async () => {
    try {
      const url = editingPlan ? `/api/gym-admin/plans?id=${editingPlan.id}` : "/api/gym-admin/plans"
      const method = editingPlan ? "PUT" : "POST"

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          duration_months: Number.parseInt(formData.duration_months),
          price: Number.parseFloat(formData.price),
        }),
      })

      setIsDialogOpen(false)
      setEditingPlan(null)
      setFormData({ plan_name: "", duration_months: "", price: "", description: "" })
      loadPlans()
    } catch (error) {
      console.error("Erro ao salvar plano:", error)
    }
  }

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setFormData({
      plan_name: plan.plan_name,
      duration_months: plan.duration_months.toString(),
      price: plan.price.toString(),
      description: plan.description || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este plano?")) return

    try {
      await fetch(`/api/gym-admin/plans?id=${id}`, { method: "DELETE" })
      loadPlans()
    } catch (error) {
      console.error("Erro ao excluir plano:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Planos de Mensalidade</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingPlan(null)
                setFormData({ plan_name: "", duration_months: "", price: "", description: "" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Plano
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPlan ? "Editar Plano" : "Novo Plano"}</DialogTitle>
              <DialogDescription>Preencha as informações do plano de mensalidade</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome do Plano</Label>
                <Input
                  value={formData.plan_name}
                  onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
                  placeholder="Ex: Mensal"
                />
              </div>
              <div>
                <Label>Duração (meses)</Label>
                <Input
                  type="number"
                  value={formData.duration_months}
                  onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                  placeholder="1"
                />
              </div>
              <div>
                <Label>Preço Total (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="150.00"
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Opcional"
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
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{plan.plan_name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                {plan.is_active && <Badge className="bg-green-500">Ativo</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Duração
                  </span>
                  <span className="font-medium">
                    {plan.duration_months} {plan.duration_months === 1 ? "mês" : "meses"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Preço Total</span>
                  <span className="font-bold text-lg">R$ {Number(plan.price).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Por mês</span>
                  <span className="text-muted-foreground">
                    R$ {(Number(plan.price) / plan.duration_months).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => handleEdit(plan)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 bg-transparent"
                  onClick={() => handleDelete(plan.id)}
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
