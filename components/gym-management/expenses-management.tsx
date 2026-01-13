"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"

interface Expense {
  id: number
  description: string
  category?: string
  amount: number
  expense_date: string
  method_name?: string
  notes?: string
}

export function ExpensesManagement() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ description: "", category: "", amount: "", expense_date: "", notes: "" })

  useEffect(() => {
    loadExpenses()
  }, [])

  const loadExpenses = async () => {
    try {
      const res = await fetch("/api/gym-admin/expenses")
      const data = await res.json()
      setExpenses(data)
    } catch (error) {
      console.error("Erro ao carregar despesas:", error)
    }
  }

  const handleSubmit = async () => {
    try {
      await fetch("/api/gym-admin/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: Number.parseFloat(formData.amount),
        }),
      })

      setIsDialogOpen(false)
      setFormData({ description: "", category: "", amount: "", expense_date: "", notes: "" })
      loadExpenses()
    } catch (error) {
      console.error("Erro ao salvar despesa:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta despesa?")) return

    try {
      await fetch(`/api/gym-admin/expenses?id=${id}`, { method: "DELETE" })
      loadExpenses()
    } catch (error) {
      console.error("Erro ao excluir despesa:", error)
    }
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Despesas</h2>
          <p className="text-muted-foreground">Total: R$ {totalExpenses.toFixed(2)}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Despesa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Despesa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Descrição</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Conta de luz"
                />
              </div>
              <div>
                <Label>Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aluguel">Aluguel</SelectItem>
                    <SelectItem value="Água">Água</SelectItem>
                    <SelectItem value="Luz">Luz</SelectItem>
                    <SelectItem value="Internet">Internet</SelectItem>
                    <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                    <SelectItem value="Limpeza">Limpeza</SelectItem>
                    <SelectItem value="Manutenção">Manutenção</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Valor (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Data</Label>
                <Input
                  type="date"
                  value={formData.expense_date}
                  onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                />
              </div>
              <div>
                <Label>Observações</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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

      <div className="space-y-3">
        {expenses.map((expense) => (
          <Card key={expense.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{expense.description}</div>
                  <div className="text-sm text-muted-foreground">{expense.category}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Data</div>
                  <div>{new Date(expense.expense_date).toLocaleDateString("pt-BR")}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-red-600">- R$ {Number(expense.amount).toFixed(2)}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 ml-4 bg-transparent"
                  onClick={() => handleDelete(expense.id)}
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
