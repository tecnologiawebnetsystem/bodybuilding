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
import { Calendar, Clock, Users, Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ClassesManagement() {
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    try {
      const response = await fetch("/api/gym-admin/classes")
      if (response.ok) {
        const data = await response.json()
        setClasses(data.classes || [])
      }
    } catch (error) {
      console.error("[v0] Erro ao carregar aulas:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDayName = (day: number) => {
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
    return days[day]
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Aulas Coletivas</h1>
          <p className="text-slate-600">Gerencie horários e capacidade das aulas</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Aula
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Aula</DialogTitle>
            </DialogHeader>
            <NewClassForm onSuccess={loadClasses} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center text-slate-500 py-8">Carregando aulas...</p>
        ) : classes.length === 0 ? (
          <p className="col-span-full text-center text-slate-500 py-8">Nenhuma aula cadastrada</p>
        ) : (
          classes.map((classItem) => (
            <Card key={classItem.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{classItem.class_name}</h3>
                  <p className="text-sm text-slate-600">{classItem.instructor}</p>
                </div>
                {classItem.is_active ? (
                  <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800">Inativa</Badge>
                )}
              </div>

              {classItem.description && <p className="text-sm text-slate-600 mb-4">{classItem.description}</p>}

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Calendar className="w-4 h-4" />
                  {getDayName(classItem.day_of_week)}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Clock className="w-4 h-4" />
                  {classItem.start_time} ({classItem.duration_minutes} min)
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Users className="w-4 h-4" />
                  {classItem.current_bookings || 0}/{classItem.max_capacity} vagas
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

function NewClassForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    class_name: "",
    instructor: "",
    description: "",
    day_of_week: "",
    start_time: "",
    duration_minutes: "60",
    max_capacity: "20",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/gym-admin/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({ title: "Aula criada com sucesso!" })
        onSuccess()
      } else {
        toast({ title: "Erro ao criar aula", variant: "destructive" })
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
          <Label>Nome da Aula *</Label>
          <Input
            value={formData.class_name}
            onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
            placeholder="Ex: Spinning"
            required
          />
        </div>
        <div>
          <Label>Instrutor</Label>
          <Input
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            placeholder="Nome do instrutor"
          />
        </div>
      </div>

      <div>
        <Label>Descrição</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Dia da Semana *</Label>
          <Select
            value={formData.day_of_week}
            onValueChange={(value) => setFormData({ ...formData, day_of_week: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Domingo</SelectItem>
              <SelectItem value="1">Segunda</SelectItem>
              <SelectItem value="2">Terça</SelectItem>
              <SelectItem value="3">Quarta</SelectItem>
              <SelectItem value="4">Quinta</SelectItem>
              <SelectItem value="5">Sexta</SelectItem>
              <SelectItem value="6">Sábado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Horário *</Label>
          <Input
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Duração (min) *</Label>
          <Input
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label>Capacidade Máxima *</Label>
        <Input
          type="number"
          value={formData.max_capacity}
          onChange={(e) => setFormData({ ...formData, max_capacity: e.target.value })}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Criando..." : "Criar Aula"}
      </Button>
    </form>
  )
}
