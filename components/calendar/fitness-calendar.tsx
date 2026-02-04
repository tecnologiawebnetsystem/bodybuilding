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
  CheckCircle2,
  ExternalLink,
  AlertCircle,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"

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

interface SpinningSchedule {
  time_slot: string
  day_of_week: number
  instructor: string | null
}

interface GinasticaSchedule {
  time_slot: string
  monday: string | null
  tuesday: string | null
  wednesday: string | null
  thursday: string | null
  friday: string | null
}

interface ClassBooking {
  id: number
  class_type: "spinning" | "ginastica"
  class_date: string
  class_time: string
  instructor: string
  checked_in_app: boolean
  checked_in_gym: boolean
  reminder_sent: boolean
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
  const [spinningSchedule, setSpinningSchedule] = useState<SpinningSchedule[]>([])
  const [ginasticaSchedule, setGinasticaSchedule] = useState<GinasticaSchedule[]>([])
  const [classBookings, setClassBookings] = useState<ClassBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [selectedClass, setSelectedClass] = useState<{ type: "spinning" | "ginastica"; time: string; instructor: string; date: Date } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isClassModalOpen, setIsClassModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)

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
      const [eventsRes, classesRes, spinningRes, ginasticaRes, bookingsRes] = await Promise.all([
        fetch(`/api/calendar?userId=${userId}`),
        fetch("/api/gym-admin/classes"),
        fetch("/api/spinning"),
        fetch("/api/ginastica"),
        fetch(`/api/class-bookings?userId=${userId}`)
      ])

      const eventsData = await eventsRes.json()
      const classesData = await classesRes.json()
      const spinningData = await spinningRes.json()
      const ginasticaData = await ginasticaRes.json()
      const bookingsData = await bookingsRes.json()

      if (eventsData.success) setEvents(eventsData.data || [])
      if (classesData.success) setGymClasses(classesData.data || [])
      if (spinningData.success) setSpinningSchedule(spinningData.data || [])
      if (ginasticaData.success) setGinasticaSchedule(ginasticaData.data || [])
      if (bookingsData.success) setClassBookings(bookingsData.data || [])
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

  // Obter aulas de Spinning para uma data especifica
  const getSpinningClassesForDate = (date: Date): Array<{ time: string; instructor: string }> => {
    const dayOfWeek = date.getDay()
    // Spinning so tem aulas de segunda a sexta (1-5)
    if (dayOfWeek === 0 || dayOfWeek === 6) return []
    
    // Verifica se a data esta dentro do periodo valido (ate 31/12/2026)
    const endDate = new Date("2026-12-31")
    if (date > endDate) return []
    
    return spinningSchedule
      .filter(s => s.day_of_week === dayOfWeek && s.instructor)
      .map(s => ({ time: s.time_slot, instructor: s.instructor! }))
  }

  // Obter aulas de Ginastica para uma data especifica
  const getGinasticaClassesForDate = (date: Date): Array<{ time: string; className: string }> => {
    const dayOfWeek = date.getDay()
    // Ginastica so tem aulas de segunda a sexta (1-5)
    if (dayOfWeek === 0 || dayOfWeek === 6) return []
    
    // Verifica se a data esta dentro do periodo valido (ate 31/12/2026)
    const endDate = new Date("2026-12-31")
    if (date > endDate) return []
    
    const dayKeys: Record<number, keyof GinasticaSchedule> = {
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday"
    }
    
    const dayKey = dayKeys[dayOfWeek]
    if (!dayKey) return []
    
    return ginasticaSchedule
      .filter(g => g[dayKey])
      .map(g => ({ time: g.time_slot, className: g[dayKey]! }))
  }

  // Verificar se tem booking para uma aula
  const getBookingForClass = (type: "spinning" | "ginastica", date: Date, time: string): ClassBooking | undefined => {
    const dateStr = date.toISOString().split("T")[0]
    return classBookings.find(b => 
      b.class_type === type && 
      b.class_date === dateStr && 
      b.class_time === time
    )
  }

  // Abrir modal de detalhes da aula
  const openClassModal = (type: "spinning" | "ginastica", time: string, instructor: string, date: Date) => {
    setSelectedClass({ type, time, instructor, date })
    setIsClassModalOpen(true)
  }

  // Fazer booking de uma aula
  const bookClass = async () => {
    if (!selectedClass) return
    setCheckingIn(true)
    
    try {
      const response = await fetch("/api/class-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          classType: selectedClass.type,
          classDate: selectedClass.date.toISOString().split("T")[0],
          classTime: selectedClass.time,
          instructor: selectedClass.instructor
        })
      })
      
      const result = await response.json()
      if (result.success) {
        await loadData()
      }
    } catch (error) {
      console.error("Erro ao reservar aula:", error)
    } finally {
      setCheckingIn(false)
    }
  }

  // Check-in no app
  const checkInApp = async (bookingId: number) => {
    setCheckingIn(true)
    try {
      const response = await fetch("/api/class-bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: bookingId,
          checkedInApp: true
        })
      })
      
      const result = await response.json()
      if (result.success) {
        await loadData()
      }
    } catch (error) {
      console.error("Erro no check-in:", error)
    } finally {
      setCheckingIn(false)
    }
  }

  // Check-in na academia (marca que fez check-in no app da academia)
  const checkInGym = async (bookingId: number) => {
    setCheckingIn(true)
    try {
      const response = await fetch("/api/class-bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: bookingId,
          checkedInGym: true
        })
      })
      
      const result = await response.json()
      if (result.success) {
        await loadData()
      }
    } catch (error) {
      console.error("Erro no check-in:", error)
    } finally {
      setCheckingIn(false)
    }
  }

  // Cancelar booking
  const cancelBooking = async (bookingId: number) => {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return
    setCheckingIn(true)
    
    try {
      const response = await fetch(`/api/class-bookings?id=${bookingId}`, {
        method: "DELETE"
      })
      
      const result = await response.json()
      if (result.success) {
        await loadData()
        setIsClassModalOpen(false)
      }
    } catch (error) {
      console.error("Erro ao cancelar:", error)
    } finally {
      setCheckingIn(false)
    }
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
                  const spinningClasses = getSpinningClassesForDate(date)
                  const ginasticaClasses = getGinasticaClassesForDate(date)
                  const hasClasses = spinningClasses.length > 0 || ginasticaClasses.length > 0

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
                        {/* Aulas de Spinning */}
                        {spinningClasses.slice(0, 1).map((sc, i) => {
                          const booking = getBookingForClass("spinning", date, sc.time)
                          return (
                            <div
                              key={`spin-${i}`}
                              className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 flex items-center gap-1 ${booking ? "ring-1 ring-green-500" : ""}`}
                              style={{ backgroundColor: "#7c3aed40", color: "#a78bfa" }}
                              onClick={(e) => {
                                e.stopPropagation()
                                openClassModal("spinning", sc.time, sc.instructor, date)
                              }}
                            >
                              <Bike className="w-3 h-3 shrink-0" />
                              <span className="truncate">{sc.time}</span>
                              {booking?.checked_in_app && <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />}
                            </div>
                          )
                        })}
                        {spinningClasses.length > 1 && (
                          <div className="text-xs text-purple-400">+{spinningClasses.length - 1} spin</div>
                        )}
                        
                        {/* Aulas de Ginastica */}
                        {ginasticaClasses.slice(0, 1).map((gc, i) => {
                          const booking = getBookingForClass("ginastica", date, gc.time)
                          return (
                            <div
                              key={`gin-${i}`}
                              className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 flex items-center gap-1 ${booking ? "ring-1 ring-green-500" : ""}`}
                              style={{ backgroundColor: "#f9731640", color: "#fdba74" }}
                              onClick={(e) => {
                                e.stopPropagation()
                                openClassModal("ginastica", gc.time, gc.className, date)
                              }}
                            >
                              <Dumbbell className="w-3 h-3 shrink-0" />
                              <span className="truncate">{gc.time}</span>
                              {booking?.checked_in_app && <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />}
                            </div>
                          )
                        })}
                        {ginasticaClasses.length > 1 && (
                          <div className="text-xs text-orange-400">+{ginasticaClasses.length - 1} gin</div>
                        )}

                        {/* Eventos normais */}
                        {dayEvents.slice(0, hasClasses ? 1 : 3).map((event, i) => (
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
                const spinningClasses = getSpinningClassesForDate(date)
                const ginasticaClasses = getGinasticaClassesForDate(date)
                const hasAnyContent = dayEvents.length > 0 || spinningClasses.length > 0 || ginasticaClasses.length > 0

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
                      {/* Aulas de Spinning na semana */}
                      {spinningClasses.map((sc, i) => {
                        const booking = getBookingForClass("spinning", date, sc.time)
                        return (
                          <div
                            key={`spin-${i}`}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:opacity-80 ${booking ? "ring-1 ring-green-500" : ""}`}
                            style={{ backgroundColor: "#7c3aed20" }}
                            onClick={() => openClassModal("spinning", sc.time, sc.instructor, date)}
                          >
                            <Bike className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-medium text-white">Spinning - {sc.instructor}</span>
                            <span className="text-xs text-gray-400">{sc.time}</span>
                            {booking?.checked_in_app && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
                          </div>
                        )
                      })}
                      
                      {/* Aulas de Ginastica na semana */}
                      {ginasticaClasses.map((gc, i) => {
                        const booking = getBookingForClass("ginastica", date, gc.time)
                        return (
                          <div
                            key={`gin-${i}`}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:opacity-80 ${booking ? "ring-1 ring-green-500" : ""}`}
                            style={{ backgroundColor: "#f9731620" }}
                            onClick={() => openClassModal("ginastica", gc.time, gc.className, date)}
                          >
                            <Dumbbell className="w-4 h-4 text-orange-400" />
                            <span className="text-sm font-medium text-white">{gc.className}</span>
                            <span className="text-xs text-gray-400">{gc.time}</span>
                            {booking?.checked_in_app && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
                          </div>
                        )
                      })}
                      
                      {/* Eventos normais */}
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
                      {!hasAnyContent && (
                        <div className="text-sm text-gray-500 italic">Nenhum evento</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Sidebar - Aulas de Spinning e Ginastica */}
        <Card className="p-4 bg-white/5 border-white/10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" style={{ color: preferences.theme_primary }} />
            Minhas Aulas
          </h3>
          <p className="text-xs text-gray-400 mb-4">Clique nas aulas do calendario para reservar</p>

          {/* Proximas reservas */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Proximas Reservas</h4>
            {classBookings.filter(b => new Date(b.class_date) >= new Date()).length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma reserva</p>
            ) : (
              classBookings
                .filter(b => new Date(b.class_date) >= new Date())
                .slice(0, 5)
                .map((booking) => (
                  <div
                    key={booking.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      booking.class_type === "spinning" 
                        ? "border-purple-500/30 bg-purple-500/10" 
                        : "border-orange-500/30 bg-orange-500/10"
                    }`}
                    onClick={() => {
                      const date = new Date(booking.class_date)
                      openClassModal(
                        booking.class_type,
                        booking.class_time,
                        booking.instructor,
                        date
                      )
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white flex items-center gap-2">
                        {booking.class_type === "spinning" ? (
                          <Bike className="w-4 h-4 text-purple-400" />
                        ) : (
                          <Dumbbell className="w-4 h-4 text-orange-400" />
                        )}
                        {booking.class_type === "spinning" ? "Spinning" : booking.instructor}
                      </span>
                      {booking.checked_in_app && booking.checked_in_gym && (
                        <Badge className="bg-green-600 text-xs">OK</Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        {new Date(booking.class_date).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {booking.class_time}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <div className={`text-xs px-2 py-0.5 rounded ${booking.checked_in_app ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                        App {booking.checked_in_app ? "OK" : "-"}
                      </div>
                      <div className={`text-xs px-2 py-0.5 rounded ${booking.checked_in_gym ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                        Academia {booking.checked_in_gym ? "OK" : "-"}
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
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Bike className="w-4 h-4 text-purple-400" />
                Spinning
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Dumbbell className="w-4 h-4 text-orange-400" />
                Ginastica
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Check-in Feito
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Bell className="w-4 h-4 text-yellow-500" />
                Lembrete 1h antes
              </div>
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

      {/* Modal de Detalhes da Aula */}
      <Dialog open={isClassModalOpen} onOpenChange={setIsClassModalOpen}>
        <DialogContent className="max-w-md bg-gray-900 border-gray-700">
          {selectedClass && (() => {
            const booking = getBookingForClass(selectedClass.type, selectedClass.date, selectedClass.time)
            const isSpinning = selectedClass.type === "spinning"
            const classTime = selectedClass.time
            const classDate = selectedClass.date
            
            // Calcular se esta dentro de 1 hora antes da aula para habilitar check-in
            const classDateTime = new Date(classDate)
            const [hours, minutes] = classTime.split(":").map(Number)
            classDateTime.setHours(hours, minutes, 0, 0)
            const now = new Date()
            const oneHourBefore = new Date(classDateTime.getTime() - 60 * 60 * 1000)
            const canCheckIn = now >= oneHourBefore && now <= classDateTime

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white flex items-center gap-2">
                    {isSpinning ? (
                      <Bike className="w-5 h-5 text-purple-400" />
                    ) : (
                      <Dumbbell className="w-5 h-5 text-orange-400" />
                    )}
                    {isSpinning ? "Aula de Spinning" : selectedClass.instructor}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* Informacoes da aula */}
                  <div className={`p-4 rounded-lg ${isSpinning ? "bg-purple-500/10 border border-purple-500/30" : "bg-orange-500/10 border border-orange-500/30"}`}>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{classDate.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{classTime}</span>
                      </div>
                      {isSpinning && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-white">Instrutor: {selectedClass.instructor}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status da reserva */}
                  {booking ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-green-400 font-medium">Aula Reservada</span>
                        </div>
                        
                        {/* Aviso de lembrete */}
                        <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-lg mt-3">
                          <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="text-yellow-400 font-medium">Lembrete: Check-in 1h antes</p>
                            <p className="text-gray-400 mt-1">Faca o check-in no app da academia e depois aqui no app para confirmar sua presenca.</p>
                          </div>
                        </div>
                      </div>

                      {/* Check-ins */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Check-in Duplo</h4>
                        
                        {/* Check-in Academia */}
                        <div className={`p-3 rounded-lg border flex items-center justify-between ${booking.checked_in_gym ? "bg-green-500/10 border-green-500/30" : "bg-gray-800 border-gray-700"}`}>
                          <div className="flex items-center gap-3">
                            <ExternalLink className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-white text-sm font-medium">App da Academia</p>
                              <p className="text-gray-500 text-xs">Faca check-in no app oficial</p>
                            </div>
                          </div>
                          {booking.checked_in_gym ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={checkingIn || !canCheckIn}
                              onClick={() => checkInGym(booking.id)}
                            >
                              {canCheckIn ? "Marcar" : "Aguarde"}
                            </Button>
                          )}
                        </div>

                        {/* Check-in App */}
                        <div className={`p-3 rounded-lg border flex items-center justify-between ${booking.checked_in_app ? "bg-green-500/10 border-green-500/30" : "bg-gray-800 border-gray-700"}`}>
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-white text-sm font-medium">Este App</p>
                              <p className="text-gray-500 text-xs">Confirme aqui tambem</p>
                            </div>
                          </div>
                          {booking.checked_in_app ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={checkingIn || !canCheckIn}
                              onClick={() => checkInApp(booking.id)}
                            >
                              {canCheckIn ? "Marcar" : "Aguarde"}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Botao cancelar */}
                      <Button
                        variant="destructive"
                        className="w-full"
                        disabled={checkingIn}
                        onClick={() => cancelBooking(booking.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Cancelar Reserva
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-gray-400 text-sm">
                        Reserve esta aula para receber um lembrete 1 hora antes e poder fazer o check-in.
                      </p>
                      <Button
                        className="w-full"
                        style={{ backgroundColor: isSpinning ? "#7c3aed" : "#f97316" }}
                        disabled={checkingIn}
                        onClick={bookClass}
                      >
                        {checkingIn ? "Reservando..." : "Reservar Aula"}
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
