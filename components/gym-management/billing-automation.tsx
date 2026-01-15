"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Send, Clock, CheckCircle2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface PendingPayment {
  id: number
  user_name: string
  amount: number
  due_date: string
  days_overdue: number
}

export function BillingAutomation() {
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPendingPayments()
  }, [])

  const loadPendingPayments = async () => {
    try {
      const res = await fetch("/api/gym-admin/billing/pending")
      const data = await res.json()
      setPendingPayments(data.payments || [])
    } catch (error) {
      console.error("Error loading pending payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateBoleto = async (paymentId: number) => {
    toast({
      title: "Gerando boleto",
      description: "O boleto está sendo gerado e será enviado por email...",
    })

    try {
      const res = await fetch("/api/gym-admin/billing/generate-boleto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "Boleto gerado com sucesso",
          description: "O boleto foi enviado para o email do aluno",
        })
        loadPendingPayments()
      }
    } catch (error) {
      toast({
        title: "Erro ao gerar boleto",
        description: "Não foi possível gerar o boleto",
        variant: "destructive",
      })
    }
  }

  const sendReminder = async (paymentId: number) => {
    toast({
      title: "Enviando lembrete",
      description: "Um lembrete de pagamento está sendo enviado ao aluno...",
    })

    try {
      const res = await fetch("/api/gym-admin/billing/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "Lembrete enviado",
          description: "O aluno receberá uma notificação",
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao enviar lembrete",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Cobrança Automatizada</h2>
        <p className="text-muted-foreground">Geração automática de boletos e lembretes de pagamento</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Pagamentos aguardando</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Atrasados</CardTitle>
            <FileText className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments.filter((p) => p.days_overdue > 0).length}</div>
            <p className="text-xs text-muted-foreground mt-1">Requerem atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R${" "}
              {pendingPayments
                .reduce((sum, p) => sum + p.amount, 0)
                .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">A receber</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pagamentos Pendentes</CardTitle>
          <CardDescription>Gere boletos e envie lembretes automaticamente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingPayments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{payment.user_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Vencimento: {new Date(payment.due_date).toLocaleDateString("pt-BR")}
                    </p>
                    {payment.days_overdue > 0 && (
                      <Badge variant="destructive" className="mt-2">
                        {payment.days_overdue} dias de atraso
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold">
                      R$ {payment.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => sendReminder(payment.id)}>
                        <Send className="w-4 h-4 mr-1" />
                        Lembrete
                      </Button>
                      <Button size="sm" onClick={() => generateBoleto(payment.id)}>
                        <FileText className="w-4 h-4 mr-1" />
                        Gerar Boleto
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {pendingPayments.length === 0 && !loading && (
              <div className="text-center py-8 text-muted-foreground">Nenhum pagamento pendente no momento</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
