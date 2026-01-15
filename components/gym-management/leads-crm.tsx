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
import { UserPlus, Phone, Mail, Calendar, CheckCircle, Clock, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function LeadsCRM() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    try {
      const response = await fetch("/api/gym-admin/leads")
      if (response.ok) {
        const data = await response.json()
        setLeads(data.leads || [])
      }
    } catch (error) {
      console.error("[v0] Erro ao carregar leads:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      new: { color: "bg-blue-100 text-blue-800", label: "Novo" },
      contacted: { color: "bg-yellow-100 text-yellow-800", label: "Contatado" },
      negotiating: { color: "bg-purple-100 text-purple-800", label: "Negociando" },
      converted: { color: "bg-green-100 text-green-800", label: "Convertido" },
      lost: { color: "bg-red-100 text-red-800", label: "Perdido" },
    }
    const variant = variants[status as keyof typeof variants] || variants.new
    return <Badge className={variant.color}>{variant.label}</Badge>
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CRM de Vendas</h1>
          <p className="text-slate-600">Gerencie leads e converta prospects em alunos</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Lead</DialogTitle>
            </DialogHeader>
            <NewLeadForm onSuccess={loadLeads} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="new">Novos</SelectItem>
              <SelectItem value="contacted">Contatados</SelectItem>
              <SelectItem value="negotiating">Negociando</SelectItem>
              <SelectItem value="converted">Convertidos</SelectItem>
              <SelectItem value="lost">Perdidos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-slate-500 py-8">Carregando leads...</p>
          ) : filteredLeads.length === 0 ? (
            <p className="text-center text-slate-500 py-8">Nenhum lead encontrado</p>
          ) : (
            filteredLeads.map((lead) => (
              <Card key={lead.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">{lead.name}</h3>
                      {getStatusBadge(lead.status)}
                      {lead.source && (
                        <Badge variant="outline" className="text-xs">
                          {lead.source}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {lead.email && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4" />
                          {lead.email}
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-4 h-4" />
                          {lead.phone}
                        </div>
                      )}
                      {lead.follow_up_date && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          Follow-up: {new Date(lead.follow_up_date).toLocaleDateString()}
                        </div>
                      )}
                      {lead.created_at && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock className="w-4 h-4" />
                          Criado: {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {lead.notes && <p className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded">{lead.notes}</p>}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    {lead.status !== "converted" && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Converter
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-slate-600 mb-1">Total de Leads</p>
          <p className="text-2xl font-bold">{leads.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-600 mb-1">Novos</p>
          <p className="text-2xl font-bold text-blue-600">{leads.filter((l) => l.status === "new").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-600 mb-1">Convertidos</p>
          <p className="text-2xl font-bold text-green-600">{leads.filter((l) => l.status === "converted").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-600 mb-1">Taxa de Conversão</p>
          <p className="text-2xl font-bold text-purple-600">
            {leads.length > 0
              ? Math.round((leads.filter((l) => l.status === "converted").length / leads.length) * 100)
              : 0}
            %
          </p>
        </Card>
      </div>
    </div>
  )
}

function NewLeadForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    notes: "",
    follow_up_date: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/gym-admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({ title: "Lead criado com sucesso!" })
        onSuccess()
      } else {
        toast({ title: "Erro ao criar lead", variant: "destructive" })
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
          <Label>Nome Completo *</Label>
          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Telefone *</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Origem</Label>
          <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="indicacao">Indicação</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Data de Follow-up</Label>
        <Input
          type="date"
          value={formData.follow_up_date}
          onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
        />
      </div>

      <div>
        <Label>Observações</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Criando..." : "Criar Lead"}
      </Button>
    </form>
  )
}
