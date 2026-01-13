"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreVertical, MessageSquare, TrendingUp, AlertCircle, Trophy } from "lucide-react"

interface StudentAttendance {
  user_id: string
  student_name: string
  total_checkins: number
  last_checkin: string | null
  days_since_last: number
  attendance_rate: number
  status: "excellent" | "good" | "warning" | "critical"
}

export function AttendanceManagementTable() {
  const [attendance, setAttendance] = useState<StudentAttendance[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadAttendance()
  }, [])

  const loadAttendance = async () => {
    // Mock data - você pode criar uma API específica para isso
    const mockData: StudentAttendance[] = [
      {
        user_id: "kleber",
        student_name: "Kleber Gonçalves",
        total_checkins: 24,
        last_checkin: "2026-01-13",
        days_since_last: 0,
        attendance_rate: 96,
        status: "excellent",
      },
      {
        user_id: "pamela",
        student_name: "Pamela Gonçalves",
        total_checkins: 20,
        last_checkin: "2026-01-12",
        days_since_last: 1,
        attendance_rate: 80,
        status: "good",
      },
      {
        user_id: "juliana",
        student_name: "Juliana Helena",
        total_checkins: 5,
        last_checkin: "2026-01-05",
        days_since_last: 8,
        attendance_rate: 20,
        status: "critical",
      },
    ]
    setAttendance(mockData)
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      excellent: (
        <Badge className="bg-green-500">
          <Trophy className="h-3 w-3 mr-1" />
          Excelente
        </Badge>
      ),
      good: (
        <Badge className="bg-blue-500">
          <TrendingUp className="h-3 w-3 mr-1" />
          Bom
        </Badge>
      ),
      warning: (
        <Badge variant="outline" className="text-yellow-600">
          Alerta
        </Badge>
      ),
      critical: (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Crítico
        </Badge>
      ),
    }
    return badges[status as keyof typeof badges]
  }

  const getMessageSuggestion = (status: string, daysSince: number) => {
    if (status === "excellent") return "Parabéns pelo desempenho! Continue assim!"
    if (status === "good") return "Ótimo trabalho! Mantenha a frequência."
    if (status === "warning") return `Notamos que você está faltando. Vamos retomar?`
    if (status === "critical") return `Sentimos sua falta! Há ${daysSince} dias sem treinar.`
    return "Enviar mensagem personalizada"
  }

  const filteredAttendance = attendance.filter((student) =>
    student.student_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar aluno..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Total Check-ins</TableHead>
              <TableHead>Último Check-in</TableHead>
              <TableHead>Dias sem Treinar</TableHead>
              <TableHead>Taxa de Frequência</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendance.map((student) => (
              <TableRow key={student.user_id}>
                <TableCell className="font-medium">{student.student_name}</TableCell>
                <TableCell>{student.total_checkins}</TableCell>
                <TableCell>
                  {student.last_checkin ? new Date(student.last_checkin).toLocaleDateString("pt-BR") : "Nunca"}
                </TableCell>
                <TableCell>
                  <Badge variant={student.days_since_last > 7 ? "destructive" : "outline"}>
                    {student.days_since_last} dias
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${student.attendance_rate}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{student.attendance_rate}%</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(student.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <DropdownMenuItem>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <div className="flex flex-col">
                          <span className="text-sm">Enviar Mensagem</span>
                          <span className="text-xs text-muted-foreground">
                            {getMessageSuggestion(student.status, student.days_since_last)}
                          </span>
                        </div>
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
