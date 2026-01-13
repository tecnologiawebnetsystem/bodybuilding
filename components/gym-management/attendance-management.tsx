"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, XCircle } from "lucide-react"

interface AttendanceRecord {
  user_id: string
  name: string
  last_checkin?: string
  total_checkins: number
}

export function AttendanceManagement() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])

  useEffect(() => {
    loadAttendance()
  }, [])

  const loadAttendance = async () => {
    try {
      // Simulação - substituir por API real
      const mockData: AttendanceRecord[] = [
        { user_id: "kleber", name: "Kleber Gonçalves", last_checkin: "2024-01-12", total_checkins: 15 },
        { user_id: "pamela", name: "Pamela Gonçalves", last_checkin: "2024-01-11", total_checkins: 12 },
        { user_id: "juliana", name: "Juliana Helena", last_checkin: "2024-01-10", total_checkins: 8 },
      ]
      setAttendance(mockData)
    } catch (error) {
      console.error("Erro ao carregar frequência:", error)
    }
  }

  const isActive = (lastCheckin?: string) => {
    if (!lastCheckin) return false
    const daysDiff = Math.floor((new Date().getTime() - new Date(lastCheckin).getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff <= 3
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Frequência dos Alunos</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {attendance.map((record) => (
          <Card key={record.user_id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{record.name}</CardTitle>
                {isActive(record.last_checkin) ? (
                  <Badge className="bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="h-3 w-3 mr-1" />
                    Inativo
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Último check-in
                </span>
                <span className="font-medium">
                  {record.last_checkin ? new Date(record.last_checkin).toLocaleDateString("pt-BR") : "Nunca"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total de visitas</span>
                <span className="font-bold text-lg">{record.total_checkins}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
