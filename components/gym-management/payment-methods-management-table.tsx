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
import { Search, Plus, MoreVertical, Edit, Trash2 } from "lucide-react"

interface PaymentMethod {
  id: number
  method_name: string
  description: string
  is_active: boolean
}

export function PaymentMethodsManagementTable() {
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newMethod, setNewMethod] = useState({ method_name: "", description: "" })

  useEffect(() => {
    loadMethods()
  }, [])

  const loadMethods = async () => {
    try {
      const res = await fetch("/api/gym-admin/payment-methods")
      const data = await res.json()
      setMethods(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erro ao carregar formas de pagamento:", error)
      setMethods([])
    }
  }

  const handleAddMethod = async () => {
    try {
      await fetch("/api/gym-admin/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMethod),
      })
      setIsAddDialogOpen(false)
      setNewMethod({ method_name: "", description: "" })
      loadMethods()
    } catch (error) {
      console.error("Erro ao adicionar forma de pagamento:", error)
    }
  }

  const filteredMethods = methods.filter((method) =>
    method.method_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar formas de pagamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Forma de Pagamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Forma de Pagamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={newMethod.method_name}
                  onChange={(e) => setNewMethod({ ...newMethod, method_name: e.target.value })}
                  placeholder="Ex: PIX"
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input
                  value={newMethod.description}
                  onChange={(e) => setNewMethod({ ...newMethod, description: e.target.value })}
                  placeholder="Descrição da forma de pagamento"
                />
              </div>
              <Button onClick={handleAddMethod} className="w-full">
                Adicionar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Forma de Pagamento</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMethods.map((method) => (
              <TableRow key={method.id}>
                <TableCell className="font-medium">{method.method_name}</TableCell>
                <TableCell>{method.description}</TableCell>
                <TableCell>
                  <Badge variant={method.is_active ? "default" : "secondary"}>
                    {method.is_active ? "Ativo" : "Inativo"}
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
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
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
