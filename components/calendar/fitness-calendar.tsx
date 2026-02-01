"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Repeat,
  Bell,
  Dumbbell,
  Bike,
  Heart,
  X,
  Edit2,
  Trash2,
  Check,
} from "lucide-react"

interface CalendarEvent {
  id: number
  user_id: string
  title: string
  description?: string
  event_type: "workout" | "gym_class" | "personal" | "reminder"
  start_date: string
  start_time?: string
  end_time?: string
  recurrence_type: "none" | "daily" | "weekly" | "monthly"
  recurrence_end_date?: string
  recurrence_days?: number[]
  color: string
  notify_before: number
  location?: string
  gym_class_id?: number
}

interface GymClass {
  id: number
  name: string
  type: string
  day_of_week: number
  start_time: string
  end_time: string
  instructor: string
  max_capacity: number
  location: string
}

interface FitnessCalendarProps {
  userId: string
  preferences: {
    theme_primary: string
    theme_accent: string
  }
}

const DAYS_OF_WEEK = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
const DAYS_FULL = ["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"]
const MONTHS = [
  "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

const EVENT_COLORS = [
  { name: "Azul", value: "#3b82f6" },
  { name: "Verde", value: "#22c55e" },
  { name: "Vermelho", value: "#ef4444" },
  { name: "Roxo", value: "#8b5cf6" },
  { name: "Laranja", value: "#f97316" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Ciano", value: "#06b6d4" },
  { name: "Amarelo", value: "#eab308" },
]

const EVENT_TYPES = [
  { value: "workout", label: "Treino", icon: Dumbbell },
  { value: "gym_class", label: "Aula Academia", icon: Bike },
  { value: "personal", label: "Pessoal", icon: Heart },
  { value: "reminder", label: "Lembrete", icon: Bell },
]

export function FitnessCalendar({ userId, preferences }: FitnessCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week">("month")
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [gymClasses, setGymClasses] = useState<GymClass[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "personal",
    startDate: "",
    startTime: "",
    endTime: "",
    recurrenceType: "none",
    recurrenceEndDate: "",
    recurrenceDays: [] as number[],
    color: "#3b82f6",
    notifyBefore: 30,
    location: "",
    gymClassId: null as number | null,
  })

  // Carregar eventos e aulas
  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    setLoading(true)
    try {
      const [eventsRes, classesRes] = await Promise.all([
        fetch(`/api/calendar?userId=${userId}`),
        fetch("/api/gym-admin/classes")
      ])

      const eventsData = await eventsRes.json()
      const classesData = await classesRes.json()

      if (eventsData.success) setEvents(eventsData.data || [])
      if (classesData.success) setGymClasses(classesData.data || [])
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calcular dias do mes
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = firstDay.getDay()
    const days: Date[] = []

    // Dias do mes anterior
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i))
    }

    // Dias do mes atual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    // Dias do proximo mes para completar a grid
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push(new Date(year, month + 1, i))
    }

    return days
  }, [currentDate])

  // Calcular dias da semana
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      return d
    })
  }, [currentDate])

  // Obter eventos para uma data especifica
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = date.toISOString().split("T")[0]
    const dayOfWeek = date.getDay()

    return events.filter(event => {
      // Evento unico
      if (event.recurrence_type === "none") {
        return event.start_date === dateStr
      }

      // Evento diario
      if (event.recurrence_type === "daily") {
        const startDate = new Date(event.start_date)
        const endDate = event.recurrence_end_date ? new Date(event.recurrence_end_date) : null
        return date >= startDate && (!endDate || date <= endDate)
      }

      // Evento semanal
      if (event.recurrence_type === "weekly") {
        const startDate = new Date(event.start_date)
        const endDate = event.recurrence_end_date ? new Date(event.recurrence_end_date) : null
        const eventDays = event.recurrence_days || [new Date(event.start_date).getDay()]
        return date >= startDate && (!endDate || date <= endDate) && eventDays.includes(dayOfWeek)
      }

      // Evento mensal
      if (event.recurrence_type === "monthly") {
        const startDate = new Date(event.start_date)
        const endDate = event.recurrence_end_date ? new Date(event.recurrence_end_date) : null
        return date >= startDate && (!endDate || date <= endDate) && date.getDate() === startDate.getDate()
      }

      return false
    })
  }

  // Obter aulas da academia para um dia da semana
  const getGymClassesForDay = (dayOfWeek: number): GymClass[] => {
    return gymClasses.filter(gc => gc.day_of_week === dayOfWeek)
  }

  // Navegacao
  const goToPrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    } else {
      const newDate = new Date(currentDate)
      newDate.setDate(currentDate.getDate() - 7)
      setCurrentDate(newDate)
    }
  }

  const goToNext = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    } else {
      const newDate = new Date(currentDate)
      newDate.setDate(currentDate.getDate() + 7)
      setCurrentDate(newDate)
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Abrir modal para novo evento
  const openNewEventModal = (date?: Date) => {
    const targetDate = date || new Date()
    setFormData({
      title: "",
      description: "",
      eventType: "personal",
      startDate: targetDate.toISOString().split("T")[0],
      startTime: "",
      endTime: "",
      recurrenceType: "none",
      recurrenceEndDate: "",
      recurrenceDays: [],
      color: "#3b82f6",
      notifyBefore: 30,
      location: "",
      gymClassId: null,
    })
    setSelectedEvent(null)
    setIsEditMode(false)
    setIsModalOpen(true)
  }

  // Abrir modal para editar evento
  const openEditEventModal = (event: CalendarEvent) => {
    setFormData({
      title: event.title,
      description: event.description || "",
      eventType: event.event_type,
      startDate: event.start_date,
      startTime: event.start_time || "",
      endTime: event.end_time || "",
      recurrenceType: event.recurrence_type,
      recurrenceEndDate: event.recurrence_end_date || "",
      recurrenceDays: event.recurrence_days || [],
      color: event.color,
      notifyBefore: event.notify_before,
      location: event.location || "",
      gymClassId: event.gym_class_id || null,
    })
    setSelectedEvent(event)
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  // Adicionar aula da academia ao calendario
  const addGymClassToCalendar = (gymClass: GymClass) => {
    setFormData({
      title: gymClass.name,
      description: `Instrutor: ${gymClass.instructor}`,
      eventType: "gym_class",
      startDate: getNextDateForDayOfWeek(gymClass.day_of_week),
      startTime: gymClass.start_time,
      endTime: gymClass.end_time,
      recurrenceType: "weekly",
      recurrenceEndDate: "",
      recurrenceDays: [gymClass.day_of_week],
      color: gymClass.type === "spinning" ? "#f97316" : "#ec4899",
      notifyBefore: 60,
      location: gymClass.location,
      gymClassId: gymClass.id,
    })
    setSelectedEvent(null)
    setIsEditMode(false)
    setIsModalOpen(true)
  }

  // Obter proxima data para um dia da semana
  const getNextDateForDayOfWeek = (dayOfWeek: number): string => {
    const today = new Date()
    const diff = (dayOfWeek - today.getDay() + 7) % 7
    const nextDate = new Date(today)
    nextDate.setDate(today.getDate() + diff)
    return nextDate.toISOString().split("T")[0]
  }

  // Salvar evento
  const saveEvent = async () => {
    try {
      const payload = {
        ...(isEditMode && selectedEvent ? { id: selectedEvent.id } : {}),
        userId,
        title: formData.title,
        description: formData.description,
        eventType: formData.eventType,
        startDate: formData.startDate,
        startTime: formData.startTime || null,
        endTime: formData.endTime || null,
        recurrenceType: formData.recurrenceType,
        recurrenceEndDate: formData.recurrenceEndDate || null,
        recurrenceDays: formData.recurrenceDays.length > 0 ? formData.recurrenceDays : null,
        color: formData.color,
        notifyBefore: formData.notifyBefore,
        location: formData.location || null,
        gymClassId: formData.gymClassId,
      }

      const response = await fetch("/api/calendar", {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (result.success) {
        loadData()
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error("Erro ao salvar evento:", error)
    }
  }

  // Deletar evento
  const deleteEvent = async (eventId: number) => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return

    try {
      const response = await fetch(`/api/calendar?id=${eventId}`, {
        method: "DELETE",
      })

      const result = await response.json()
      if (result.success) {
        loadData()
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error("Erro ao deletar evento:", error)
    }
  }

  // Toggle dia da semana para recorrencia
  const toggleRecurrenceDay = (day: number) => {
    setFormData(prev => ({
      ...prev,
      recurrenceDays: prev.recurrenceDays.includes(day)
        ? prev.recurrenceDays.filter(d => d !== day)
        : [...prev.recurrenceDays, day]
    }))
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: preferences.theme_primary }} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header do Calendario */}
      <Card className="p-4 bg-white/5 border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={goToPrevious}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNext}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <h2 className="text-xl font-bold text-white">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button variant="ghost" size="sm" onClick={goToToday}>
              Hoje
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-white/10 rounded-lg p-1">
              <Button
                variant={viewMode === "month" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("month")}
              >
                Mes
              </Button>
              <Button
                variant={viewMode === "week" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("week")}
              >
                Semana
              </Button>
            </div>
            <Button onClick={() => openNewEventModal()} style={{ backgroundColor: preferences.theme_primary }}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Evento
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Calendario Principal */}
        <Card className="lg:col-span-3 p-4 bg-white/5 border-white/10">
          {viewMode === "month" ? (
            <>
              {/* Header dias da semana */}
              <div className="grid grid-cols-7 mb-2">
                {DAYS_OF_WEEK.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid do calendario */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, idx) => {
                  const dayEvents = getEventsForDate(date)
                  const dayClasses = getGymClassesForDay(date.getDay())
                  const hasEvents = dayEvents.length > 0 || (isCurrentMonth(date) && dayClasses.length > 0)

                  return (
                    <div
                      key={idx}
                      className={`min-h-[100px] p-1 rounded-lg border transition-all cursor-pointer hover:border-white/30 ${
                        isToday(date)
                          ? "border-2"
                          : "border-white/5"
                      } ${!isCurrentMonth(date) ? "opacity-40" : ""}`}
                      style={isToday(date) ? { borderColor: preferences.theme_primary } : {}}
                      onClick={() => {
                        setSelectedDate(date)
                        openNewEventModal(date)
                      }}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday(date) ? "text-white" : "text-gray-300"}`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event, i) => (
                          <div
                            key={i}
                            className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
                            style={{ backgroundColor: event.color + "40", color: event.color }}
                            onClick={(e) => {
                              e.stopPropagation()
                              openEditEventModal(event)
                            }}
                          >
                            {event.start_time && <span className="font-medium">{event.start_time.slice(0,5)} </span>}
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-400">+{dayEvents.length - 3} mais</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            /* Visualizacao Semanal */
            <div className="space-y-2">
              {weekDays.map((date, idx) => {
                const dayEvents = getEventsForDate(date)
                const dayClasses = getGymClassesForDay(date.getDay())

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${isToday(date) ? "border-2" : "border-white/10"}`}
                    style={isToday(date) ? { borderColor: preferences.theme_primary } : {}}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${isToday(date) ? "" : "text-gray-300"}`} style={isToday(date) ? { color: preferences.theme_primary } : {}}>
                          {date.getDate()}
                        </span>
                        <span className="text-sm text-gray-400">{DAYS_FULL[date.getDay()]}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => openNewEventModal(date)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {dayEvents.map((event, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 rounded cursor-pointer hover:opacity-80"
                          style={{ backgroundColor: event.color + "20" }}
                          onClick={() => openEditEventModal(event)}
                        >
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: event.color }} />
                          <span className="text-sm font-medium text-white">{event.title}</span>
                          {event.start_time && (
                            <span className="text-xs text-gray-400">{event.start_time.slice(0,5)}</span>
                          )}
                          {event.recurrence_type !== "none" && (
                            <Repeat className="w-3 h-3 text-gray-400 ml-auto" />
                          )}
                        </div>
                      ))}
                      {dayEvents.length === 0 && dayClasses.length === 0 && (
                        <div className="text-sm text-gray-500 italic">Nenhum evento</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Sidebar - Aulas da Academia */}
        <Card className="p-4 bg-white/5 border-white/10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Dumbbell className="w-5 h-5" style={{ color: preferences.theme_primary }} />
            Aulas da Academia
          </h3>
          <p className="text-xs text-gray-400 mb-4">Clique para adicionar ao seu calendario</p>

          <div className="space-y-3">
            {gymClasses.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma aula cadastrada</p>
            ) : (
              gymClasses.map((gc) => (
                <div
                  key={gc.id}
                  className="p-3 rounded-lg border border-white/10 hover:border-white/30 cursor-pointer transition-all"
                  onClick={() => addGymClassToCalendar(gc)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-white">{gc.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {gc.type === "spinning" ? "Spinning" : "Ginastica"}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      {DAYS_FULL[gc.day_of_week]}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {gc.start_time?.slice(0,5)} - {gc.end_time?.slice(0,5)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {gc.location}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Legenda */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Legenda</h4>
            <div className="space-y-2">
              {EVENT_TYPES.map(type => (
                <div key={type.value} className="flex items-center gap-2 text-xs text-gray-300">
                  <type.icon className="w-4 h-4" />
                  {type.label}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Modal de Evento */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" style={{ color: preferences.theme_primary }} />
              {isEditMode ? "Editar Evento" : "Novo Evento"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="text-gray-300">Titulo</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nome do evento"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label className="text-gray-300">Descricao</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalhes do evento"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Tipo</Label>
                <Select value={formData.eventType} onValueChange={(v) => setFormData({ ...formData, eventType: v })}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300">Cor</Label>
                <Select value={formData.color} onValueChange={(v) => setFormData({ ...formData, color: v })}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: formData.color }} />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_COLORS.map(color => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }} />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Data</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Hora Inicio</Label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Hora Fim</Label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Repeticao</Label>
              <Select value={formData.recurrenceType} onValueChange={(v) => setFormData({ ...formData, recurrenceType: v })}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nao repetir</SelectItem>
                  <SelectItem value="daily">Diariamente</SelectItem>
                  <SelectItem value="weekly">Semanalmente</SelectItem>
                  <SelectItem value="monthly">Mensalmente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.recurrenceType === "weekly" && (
              <div>
                <Label className="text-gray-300 mb-2 block">Repetir nos dias</Label>
                <div className="flex gap-1">
                  {DAYS_OF_WEEK.map((day, idx) => (
                    <Button
                      key={idx}
                      type="button"
                      variant={formData.recurrenceDays.includes(idx) ? "default" : "outline"}
                      size="sm"
                      className="w-10 h-10 p-0"
                      onClick={() => toggleRecurrenceDay(idx)}
                      style={formData.recurrenceDays.includes(idx) ? { backgroundColor: preferences.theme_primary } : {}}
                    >
                      {day.charAt(0)}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {formData.recurrenceType !== "none" && (
              <div>
                <Label className="text-gray-300">Repetir ate (opcional)</Label>
                <Input
                  type="date"
                  value={formData.recurrenceEndDate}
                  onChange={(e) => setFormData({ ...formData, recurrenceEndDate: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            )}

            <div>
              <Label className="text-gray-300">Local (opcional)</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Academia, Sala 1"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label className="text-gray-300">Notificar antes (minutos)</Label>
              <Select value={String(formData.notifyBefore)} onValueChange={(v) => setFormData({ ...formData, notifyBefore: Number(v) })}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                  <SelectItem value="1440">1 dia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            {isEditMode && selectedEvent && (
              <Button
                variant="destructive"
                onClick={() => deleteEvent(selectedEvent.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveEvent} style={{ backgroundColor: preferences.theme_primary }}>
              <Check className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
