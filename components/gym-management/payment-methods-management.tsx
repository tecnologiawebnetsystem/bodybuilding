"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, CreditCard } from "lucide-react"

interface PaymentMethod {
  id: number
  method_name: string
  description?: string
  is_active: boolean
}

export function PaymentMethodsManagement() {
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const [formData, setFormData] = useState({ method_name: "", description: "" })

  useEffect(() => {
    loadMethods()
  }, [])

  const loadMethods = async () => {
    try {
      const res = await fetch("/api/gym-admin/payment-methods")
      const data = await res.json()
      setMethods(data)
    } catch (error) {
      console.error("Erro ao carregar métodos:", error)
    }
  }

  const handleSubmit = async () => {
    try {
      const url = editingMethod
        ? `/api/gym-admin/payment-methods?id=${editingMethod.id}`
        : "/api/gym-admin/payment-methods"
      const method = editingMethod ? "PUT" : "POST"

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      setIsDialogOpen(false)
      setEditingMethod(null)
      setFormData({ method_name: "", description: "" })
      loadMethods()
    } catch (error) {
      console.error("Erro ao salvar método:", error)
    }
  }

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method)
    setFormData({ method_name: method.method_name, description: method.description || "" })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este método de pagamento?")) return

    try {
      await fetch(`/api/gym-admin/payment-methods?id=${id}`, { method: "DELETE" })
      loadMethods()
    } catch (error) {
      console.error("Erro ao excluir método:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Formas de Pagamento</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingMethod(null)
                setFormData({ method_name: "", description: "" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Forma
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMethod ? "Editar Forma de Pagamento" : "Nova Forma de Pagamento"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={formData.method_name}
                  onChange={(e) => setFormData({ ...formData, method_name: e.target.value })}
                  placeholder="Ex: PIX"
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {methods.map((method) => (
          <Card key={method.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{method.method_name}</CardTitle>
                </div>
                {method.is_active && <Badge className="bg-green-500">Ativo</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {method.description && <p className="text-sm text-muted-foreground">{method.description}</p>}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleEdit(method)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 bg-transparent"
                  onClick={() => handleDelete(method.id)}
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
