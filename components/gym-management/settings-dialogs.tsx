"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dialog: Dados da Academia
export function GymDataDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/gym-admin/settings/gym-data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gym_name: formData.get("gym_name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          address: formData.get("address"),
          city: formData.get("city"),
          state: formData.get("state"),
          zip_code: formData.get("zip_code"),
          cnpj: formData.get("cnpj"),
        }),
      })

      if (response.ok) {
        toast({ title: "Dados da academia atualizados com sucesso!" })
        onOpenChange(false)
      } else {
        toast({ title: "Erro ao atualizar dados", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Erro ao salvar", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Dados da Academia</DialogTitle>
          <DialogDescription>Atualize as informações cadastrais da academia</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gym_name">Nome da Academia *</Label>
              <Input id="gym_name" name="gym_name" defaultValue="FitTransform" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input id="cnpj" name="cnpj" placeholder="00.000.000/0000-00" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue="contato@fittransform.com.br" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" name="phone" placeholder="(11) 99999-9999" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço Completo</Label>
            <Input id="address" name="address" placeholder="Rua, número, complemento" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" name="city" defaultValue="São Paulo" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Select name="state" defaultValue="SP">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip_code">CEP</Label>
              <Input id="zip_code" name="zip_code" placeholder="00000-000" />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Dialog: Alterar Senha/PIN
export function ChangePasswordDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    const currentPin = formData.get("current_pin")
    const newPin = formData.get("new_pin")
    const confirmPin = formData.get("confirm_pin")

    if (newPin !== confirmPin) {
      toast({ title: "Os PINs não correspondem", variant: "destructive" })
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/gym-admin/settings/change-pin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_pin: currentPin, new_pin: newPin }),
      })

      if (response.ok) {
        toast({ title: "PIN atualizado com sucesso!" })
        onOpenChange(false)
      } else {
        toast({ title: "PIN atual incorreto", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Erro ao atualizar PIN", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar PIN de Acesso</DialogTitle>
          <DialogDescription>Crie um novo PIN para acessar o sistema</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current_pin">PIN Atual</Label>
            <Input id="current_pin" name="current_pin" type="password" maxLength={6} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_pin">Novo PIN (6 dígitos)</Label>
            <Input id="new_pin" name="new_pin" type="password" maxLength={6} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_pin">Confirmar Novo PIN</Label>
            <Input id="confirm_pin" name="confirm_pin" type="password" maxLength={6} required />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Atualizar PIN"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Dialog: Mensagens Automáticas
export function AutoMessagesDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/gym-admin/settings/auto-messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          welcome_message: formData.get("welcome_message"),
          absence_3days: formData.get("absence_3days"),
          absence_7days: formData.get("absence_7days"),
          payment_reminder: formData.get("payment_reminder"),
          birthday_message: formData.get("birthday_message"),
        }),
      })

      if (response.ok) {
        toast({ title: "Mensagens automáticas configuradas!" })
        onOpenChange(false)
      } else {
        toast({ title: "Erro ao salvar configurações", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Erro ao salvar", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mensagens Automáticas</DialogTitle>
          <DialogDescription>Configure mensagens que serão enviadas automaticamente aos alunos</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-6">
          <Tabs defaultValue="welcome">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="welcome">Boas-vindas</TabsTrigger>
              <TabsTrigger value="absence">Ausência</TabsTrigger>
              <TabsTrigger value="payment">Pagamento</TabsTrigger>
              <TabsTrigger value="birthday">Aniversário</TabsTrigger>
              <TabsTrigger value="motivation">Motivação</TabsTrigger>
            </TabsList>

            <TabsContent value="welcome" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="welcome_message">Mensagem de Boas-vindas (Novo Aluno)</Label>
                <Textarea
                  id="welcome_message"
                  name="welcome_message"
                  rows={4}
                  placeholder="Olá {nome}! Seja bem-vindo(a) à FitTransform! Estamos muito felizes em ter você conosco..."
                  defaultValue="Olá {nome}! 🎉 Seja bem-vindo(a) à FitTransform! Estamos muito felizes em ter você conosco. Sua jornada para uma vida mais saudável começa agora!"
                />
                <p className="text-xs text-slate-500">Use {"{nome}"} para o nome do aluno</p>
              </div>
            </TabsContent>

            <TabsContent value="absence" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="absence_3days">Ausência de 3 dias</Label>
                <Textarea
                  id="absence_3days"
                  name="absence_3days"
                  rows={4}
                  placeholder="Oi {nome}! Sentimos sua falta..."
                  defaultValue="Oi {nome}! 😊 Sentimos sua falta por aqui! Já faz 3 dias que não aparece. Está tudo bem? Estamos aqui para te apoiar!"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="absence_7days">Ausência de 7 dias</Label>
                <Textarea
                  id="absence_7days"
                  name="absence_7days"
                  rows={4}
                  placeholder="Olá {nome}! Estamos com saudades..."
                  defaultValue="Olá {nome}! 💪 Faz uma semana que não te vemos. Que tal voltar hoje? Lembre-se: a constância é o segredo do sucesso!"
                />
              </div>
            </TabsContent>

            <TabsContent value="payment" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="payment_reminder">Lembrete de Pagamento (3 dias antes)</Label>
                <Textarea
                  id="payment_reminder"
                  name="payment_reminder"
                  rows={4}
                  placeholder="Oi {nome}! Seu pagamento vence em..."
                  defaultValue="Oi {nome}! 📅 Seu pagamento vence em 3 dias (dia {data_vencimento}). Para sua comodidade, você pode pagar via PIX, cartão ou no caixa da academia."
                />
              </div>
            </TabsContent>

            <TabsContent value="birthday" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="birthday_message">Mensagem de Aniversário</Label>
                <Textarea
                  id="birthday_message"
                  name="birthday_message"
                  rows={4}
                  placeholder="Feliz aniversário {nome}!"
                  defaultValue="🎂 Feliz Aniversário, {nome}! 🎉 Que este novo ano seja repleto de saúde, conquistas e muita disposição! A FitTransform deseja tudo de melhor!"
                />
              </div>
            </TabsContent>

            <TabsContent value="motivation" className="space-y-4 mt-4">
              <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                <p className="text-sm text-blue-900">
                  💡 <strong>Dica:</strong> As mensagens motivacionais são enviadas aleatoriamente 2x por semana para
                  alunos ativos, com frases inspiradoras sobre exercício e saúde.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Mensagens"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Dialog: Exportar Relatórios
export function ExportReportsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [reportType, setReportType] = useState("students")

  async function handleExport() {
    setLoading(true)

    try {
      const response = await fetch(`/api/gym-admin/reports/export?type=${reportType}`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `relatorio_${reportType}_${new Date().toISOString().split("T")[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({ title: "Relatório exportado com sucesso!" })
        onOpenChange(false)
      } else {
        toast({ title: "Erro ao gerar relatório", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Erro ao exportar", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportar Relatórios</DialogTitle>
          <DialogDescription>Escolha o tipo de relatório para exportar em Excel</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tipo de Relatório</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="students">Alunos e Matrículas</SelectItem>
                <SelectItem value="payments">Pagamentos Recebidos</SelectItem>
                <SelectItem value="overdue">Pagamentos Atrasados</SelectItem>
                <SelectItem value="expenses">Despesas</SelectItem>
                <SelectItem value="attendance">Frequência</SelectItem>
                <SelectItem value="financial">Resumo Financeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
            <p className="text-sm text-slate-700">
              O relatório será exportado em formato Excel (.xlsx) com todos os dados do período atual.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={loading}>
            {loading ? "Exportando..." : "Exportar Relatório"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
