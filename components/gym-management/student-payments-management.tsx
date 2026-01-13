"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"

interface Payment {
  id: number
  user_id: string
  name: string
  amount: number
  payment_date: string
  due_date: string
  status: string
  method_name?: string
  notes?: string
}

export function StudentPaymentsManagement() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    try {
      const res = await fetch("/api/gym-admin/student-payments")
      const data = await res.json()
      setPayments(data)
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error)
    }
  }

  const handleMarkAsPaid = async (id: number) => {
    try {
      await fetch(`/api/gym-admin/student-payments?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid", payment_date: new Date().toISOString().split("T")[0] }),
      })
      loadPayments()
    } catch (error) {
      console.error("Erro ao marcar como pago:", error)
    }
  }

  const filteredPayments = payments.filter((p) => {
    if (filter === "all") return true
    return p.status === filter
  })

  const totalPending = payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + Number(p.amount), 0)
  const totalPaid = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">R$ {totalPending.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ {totalPaid.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {(totalPending + totalPaid).toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
          Todos
        </Button>
        <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}>
          Pendentes
        </Button>
        <Button variant={filter === "paid" ? "default" : "outline"} size="sm" onClick={() => setFilter("paid")}>
          Pagos
        </Button>
        <Button variant={filter === "overdue" ? "default" : "outline"} size="sm" onClick={() => setFilter("overdue")}>
          Atrasados
        </Button>
      </div>

      <div className="space-y-3">
        {filteredPayments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{payment.name}</div>
                  <div className="text-sm text-muted-foreground">@{payment.user_id}</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-sm text-muted-foreground">Vencimento</div>
                  <div className="font-medium">{new Date(payment.due_date).toLocaleDateString("pt-BR")}</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-sm text-muted-foreground">Valor</div>
                  <div className="font-bold text-lg">R$ {Number(payment.amount).toFixed(2)}</div>
                </div>
                <div className="flex-1 text-center">
                  {payment.status === "paid" ? (
                    <Badge className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Pago
                    </Badge>
                  ) : payment.status === "overdue" ? (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Atrasado
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Pendente
                    </Badge>
                  )}
                </div>
                <div>
                  {payment.status !== "paid" && (
                    <Button size="sm" onClick={() => handleMarkAsPaid(payment.id)}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Marcar como Pago
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
