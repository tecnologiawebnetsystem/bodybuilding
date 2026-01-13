"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreVertical, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface Payment {
  id: number
  student_name: string
  amount: number
  due_date: string
  payment_date: string | null
  status: string
  days_overdue?: number
}

export function StudentPaymentsManagementTable() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    try {
      const res = await fetch("/api/gym-admin/student-payments")
      const data = await res.json()
      setPayments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error)
      setPayments([])
    }
  }

  const getStatusBadge = (status: string, daysOverdue?: number) => {
    if (status === "paid") {
      return (
        <Badge className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Pago
        </Badge>
      )
    }
    if (daysOverdue && daysOverdue > 0) {
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          {daysOverdue} dias de atraso
        </Badge>
      )
    }
    return (
      <Badge variant="outline">
        <AlertCircle className="h-3 w-3 mr-1" />
        Pendente
      </Badge>
    )
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.student_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por aluno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="all">Todos</option>
          <option value="pending">Pendentes</option>
          <option value="paid">Pagos</option>
          <option value="overdue">Atrasados</option>
        </select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Data Pagamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.student_name || "N/A"}</TableCell>
                <TableCell>R$ {Number(payment.amount).toFixed(2)}</TableCell>
                <TableCell>{new Date(payment.due_date).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>
                  {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString("pt-BR") : "-"}
                </TableCell>
                <TableCell>{getStatusBadge(payment.status, payment.days_overdue)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Imprimir Boleto
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmar Pagamento
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
