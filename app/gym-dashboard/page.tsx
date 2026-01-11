"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, TrendingUp, Calendar, Award, Download, QrCode } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function GymDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const gymId = "fitpro" // Em produção, pegar do usuário logado

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const response = await fetch(`/api/gym/dashboard?gymId=${gymId}`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error loading dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Carregando dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Academia</h1>
            <p className="text-muted-foreground">Gestão completa dos seus alunos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">alunos cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Check-ins do Mês</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.stats?.monthlyCheckins || 0}</div>
              <p className="text-xs text-muted-foreground">check-ins este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Retenção</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.stats?.retentionRate || 0}%</div>
              <p className="text-xs text-muted-foreground">últimos 30 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.stats?.activeUsers || 0}</div>
              <p className="text-xs text-muted-foreground">ativos nos últimos 30 dias</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="ranking" className="space-y-4">
          <TabsList>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="students">Alunos</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          {/* Ranking Tab */}
          <TabsContent value="ranking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Alunos Mais Engajados</CardTitle>
                <CardDescription>Ranking baseado em pontos e frequência</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.topUsers?.map((user: any, index: number) => (
                    <div key={user.user_id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0
                              ? "bg-yellow-500 text-yellow-950"
                              : index === 1
                                ? "bg-gray-400 text-gray-950"
                                : index === 2
                                  ? "bg-orange-600 text-orange-950"
                                  : "bg-muted"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.total_checkins} check-ins | Sequência: {user.checkin_streak} dias
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-lg font-bold">
                        {user.total_points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas Semanais</CardTitle>
                <CardDescription>Check-ins por dia da semana (últimos 30 dias)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats?.weeklyStats?.map((stat: any) => (
                    <div key={stat.day_num} className="flex items-center gap-3">
                      <div className="w-24 text-sm font-medium">{stat.day_name.trim()}</div>
                      <div className="flex-1 bg-muted rounded-full h-8 relative overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full flex items-center justify-end pr-2"
                          style={{
                            width: `${Math.min((Number.parseInt(stat.checkins) / Math.max(...stats.weeklyStats.map((s: any) => Number.parseInt(s.checkins)))) * 100, 100)}%`,
                          }}
                        >
                          <span className="text-xs font-semibold text-primary-foreground">{stat.checkins}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crescimento Mensal</CardTitle>
                <CardDescription>Novos alunos por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats?.growthData?.map((data: any) => (
                    <div key={data.month} className="flex items-center justify-between p-2 rounded border">
                      <span className="font-medium">{data.month}</span>
                      <Badge>{data.new_users} novos alunos</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Alunos</CardTitle>
                <CardDescription>Lista completa de alunos cadastrados</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Funcionalidade em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Gerenciais</CardTitle>
                <CardDescription>Exportar dados e análises completas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Relatório Mensal (PDF)
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Alunos (Excel)
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Histórico de Check-ins (CSV)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
