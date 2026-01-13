"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreVertical, Edit, Trash2, Eye } from "lucide-react"

interface Plan {
  id: number
  plan_name: string
  duration_months: number
  price: number
  description: string
  is_active: boolean
}

export function PlansManagementTable() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPlan, setNewPlan] = useState({ plan_name: "", duration_months: 1, price: 0, description: "" })

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const res = await fetch("/api/gym-admin/plans")
      const data = await res.json()
      setPlans(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erro ao carregar planos:", error)
      setPlans([])
    }
  }

  const handleAddPlan = async () => {
    try {
      await fetch("/api/gym-admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newPlan, gym_id: 1 }),
      })
      setIsAddDialogOpen(false)
      setNewPlan({ plan_name: "", duration_months: 1, price: 0, description: "" })
      loadPlans()
    } catch (error) {
      console.error("Erro ao adicionar plano:", error)
    }
  }

  const handleDeletePlan = async (id: number) => {
    if (confirm("Deseja realmente excluir este plano?")) {
      try {
        await fetch("/api/gym-admin/plans", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })
        loadPlans()
      } catch (error) {
        console.error("Erro ao excluir plano:", error)
      }
    }
  }

  const filteredPlans = plans.filter((plan) => plan.plan_name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar planos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Plano
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Plano</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome do Plano</Label>
                <Input
                  value={newPlan.plan_name}
                  onChange={(e) => setNewPlan({ ...newPlan, plan_name: e.target.value })}
                  placeholder="Ex: Mensal"
                />
              </div>
              <div>
                <Label>Duração (meses)</Label>
                <Input
                  type="number"
                  value={newPlan.duration_months}
                  onChange={(e) => setNewPlan({ ...newPlan, duration_months: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Valor (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newPlan.price}
                  onChange={(e) => setNewPlan({ ...newPlan, price: Number.parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  placeholder="Descrição do plano"
                />
              </div>
              <Button onClick={handleAddPlan} className="w-full">
                Adicionar Plano
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plano</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.plan_name}</TableCell>
                <TableCell>
                  {plan.duration_months} {plan.duration_months === 1 ? "mês" : "meses"}
                </TableCell>
                <TableCell>R$ {Number(plan.price).toFixed(2)}</TableCell>
                <TableCell className="max-w-xs truncate">{plan.description}</TableCell>
                <TableCell>
                  <Badge variant={plan.is_active ? "default" : "secondary"}>
                    {plan.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePlan(plan.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
