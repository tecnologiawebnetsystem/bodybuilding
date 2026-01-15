"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, Calendar, Users, TrendingUp, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function MarketingCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      const response = await fetch("/api/gym-admin/campaigns")
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data.campaigns || [])
      }
    } catch (error) {
      console.error("[v0] Erro ao carregar campanhas:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: { color: "bg-gray-100 text-gray-800", label: "Rascunho" },
      scheduled: { color: "bg-blue-100 text-blue-800", label: "Agendada" },
      sent: { color: "bg-green-100 text-green-800", label: "Enviada" },
    }
    const variant = variants[status as keyof typeof variants] || variants.draft
    return <Badge className={variant.color}>{variant.label}</Badge>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campanhas de Marketing</h1>
          <p className="text-slate-600">Crie e gerencie campanhas de email e SMS para seus alunos</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Campanha
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Campanha</DialogTitle>
            </DialogHeader>
            <NewCampaignForm onSuccess={loadCampaigns} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center text-slate-500 py-8">Carregando campanhas...</p>
        ) : campaigns.length === 0 ? (
          <Card className="col-span-full p-12 text-center">
            <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhuma campanha criada</h3>
            <p className="text-slate-600 mb-4">Comece a engajar seus alunos com campanhas de marketing!</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Criar Primeira Campanha</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Nova Campanha</DialogTitle>
                </DialogHeader>
                <NewCampaignForm onSuccess={loadCampaigns} />
              </DialogContent>
            </Dialog>
          </Card>
        ) : (
          campaigns.map((campaign) => (
            <Card key={campaign.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{campaign.campaign_name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {campaign.campaign_type === "email" ? "Email" : "SMS"}
                  </Badge>
                </div>
                {getStatusBadge(campaign.status)}
              </div>

              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{campaign.message_template}</p>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-slate-700">
                  <Users className="w-4 h-4" />
                  Público: {campaign.target_audience}
                </div>
                {campaign.scheduled_date && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-4 h-4" />
                    {new Date(campaign.scheduled_date).toLocaleDateString()}
                  </div>
                )}
                {campaign.total_sent > 0 && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <TrendingUp className="w-4 h-4" />
                    Enviados: {campaign.total_sent}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {campaign.status === "draft" && (
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4 mr-1" />
                    Enviar
                  </Button>
                )}
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Editar
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

function NewCampaignForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    campaign_name: "",
    campaign_type: "email",
    target_audience: "all",
    message_template: "",
    scheduled_date: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/gym-admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({ title: "Campanha criada com sucesso!" })
        onSuccess()
      } else {
        toast({ title: "Erro ao criar campanha", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Erro de conexão", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Nome da Campanha *</Label>
          <Input
            value={formData.campaign_name}
            onChange={(e) => setFormData({ ...formData, campaign_name: e.target.value })}
            placeholder="Ex: Promoção de Verão"
            required
          />
        </div>
        <div>
          <Label>Tipo *</Label>
          <Select
            value={formData.campaign_type}
            onValueChange={(value) => setFormData({ ...formData, campaign_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="push">Push Notification</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Público Alvo *</Label>
        <Select
          value={formData.target_audience}
          onValueChange={(value) => setFormData({ ...formData, target_audience: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Alunos</SelectItem>
            <SelectItem value="active">Alunos Ativos</SelectItem>
            <SelectItem value="inactive">Alunos Inativos</SelectItem>
            <SelectItem value="new">Novos Alunos (últimos 30 dias)</SelectItem>
            <SelectItem value="leads">Apenas Leads</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Mensagem *</Label>
        <Textarea
          value={formData.message_template}
          onChange={(e) => setFormData({ ...formData, message_template: e.target.value })}
          rows={6}
          placeholder="Digite a mensagem da campanha..."
          required
        />
        <p className="text-xs text-slate-500 mt-1">
          Use &#123;&#123;nome&#125;&#125; para personalizar com o nome do aluno
        </p>
      </div>

      <div>
        <Label>Agendar Envio (opcional)</Label>
        <Input
          type="datetime-local"
          value={formData.scheduled_date}
          onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Criando..." : "Criar Campanha"}
      </Button>
    </form>
  )
}
