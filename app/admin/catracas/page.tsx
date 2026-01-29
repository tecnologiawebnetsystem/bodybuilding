"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  ArrowLeft,
  Scan,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Activity,
  RefreshCw,
  Plus,
  Settings,
  Wifi,
  WifiOff
} from "lucide-react"
import Link from "next/link"

interface AccessLog {
  id: number
  user_id: string
  user_name: string
  profile_photo_url: string
  turnstile_name: string
  turnstile_location: string
  access_type: string
  auth_method: string
  status: string
  denial_reason: string
  accessed_at: string
}

interface Stats {
  entries_today: number
  denials_today: number
  unique_users_today: number
}

export default function CatracasAdminPage() {
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [stats, setStats] = useState<Stats>({ entries_today: 0, denials_today: 0, unique_users_today: 0 })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchData()
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/turnstile/logs?limit=100")
      const data = await res.json()
      if (data.success) {
        setLogs(data.logs)
        setStats(data.stats)
      }
    } catch (error) {
      console.error("[v0] Error fetching logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  const getAuthMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      qrcode: "QR Code",
      rfid: "Cartao RFID",
      biometric: "Biometria",
      pin: "PIN",
      cpf: "CPF",
      manual: "Manual"
    }
    return labels[method] || method
  }

  const getDenialLabel = (reason: string) => {
    const labels: Record<string, string> = {
      USUARIO_NAO_ENCONTRADO: "Usuario nao cadastrado",
      PAGAMENTO_PENDENTE: "Mensalidade pendente",
      DIA_NAO_PERMITIDO: "Dia nao permitido",
      HORARIO_NAO_PERMITIDO: "Fora do horario"
    }
    return labels[reason] || reason
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Scan className="h-6 w-6 text-primary" />
                  Controle de Catracas
                </h1>
                <p className="text-muted-foreground">Monitoramento de acessos em tempo real</p>
              </div>
            </div>
            <Button onClick={handleRefresh} variant="outline" className="gap-2">
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Entradas Hoje</p>
                  <p className="text-3xl font-bold text-green-600">{stats.entries_today || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bloqueios Hoje</p>
                  <p className="text-3xl font-bold text-red-600">{stats.denials_today || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alunos Unicos</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.unique_users_today || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="logs">
          <TabsList>
            <TabsTrigger value="logs" className="gap-2">
              <Activity className="h-4 w-4" />
              Logs de Acesso
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Settings className="h-4 w-4" />
              Configuracoes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Historico de Acessos</CardTitle>
                <CardDescription>Ultimas passagens registradas nas catracas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hora</TableHead>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Catraca</TableHead>
                      <TableHead>Metodo</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Nenhum acesso registrado ainda
                        </TableCell>
                      </TableRow>
                    ) : (
                      logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{formatTime(log.accessed_at)}</p>
                              <p className="text-xs text-muted-foreground">{formatDate(log.accessed_at)}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {log.profile_photo_url ? (
                                <img 
                                  src={log.profile_photo_url} 
                                  alt={log.user_name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                  <Users className="w-4 h-4" />
                                </div>
                              )}
                              <span>{log.user_name || log.user_id || "Desconhecido"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{log.turnstile_name}</p>
                              <p className="text-xs text-muted-foreground">{log.turnstile_location}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getAuthMethodLabel(log.auth_method)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {log.status === "granted" ? (
                              <Badge className="bg-green-500 hover:bg-green-600">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Liberado
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                                <XCircle className="w-3 h-3" />
                                {getDenialLabel(log.denial_reason)}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="mt-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Integracao com Catracas</CardTitle>
                  <CardDescription>Configure a comunicacao com o hardware</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Endpoint da API</h4>
                    <code className="text-sm bg-background p-2 rounded block">
                      POST /api/turnstile/validate
                    </code>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Exemplo de Requisicao</h4>
                    <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
{`{
  "turnstile_code": "CAT-001",
  "auth_method": "qrcode",  // qrcode, rfid, biometric, pin, cpf
  "credential": "FT1234ABCD5678EF",
  "direction": "entry"  // entry ou exit
}`}
                    </pre>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Exemplo de Resposta</h4>
                    <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
{`// Sucesso
{
  "granted": true,
  "display": "OLA KLEBER",
  "user_name": "Kleber Silva"
}

// Bloqueio
{
  "granted": false,
  "reason": "PAGAMENTO_PENDENTE",
  "display": "PGTO PENDENTE"
}`}
                    </pre>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Marcas Compativeis</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Henry</Badge>
                      <Badge variant="outline">Control iD</Badge>
                      <Badge variant="outline">Topdata</Badge>
                      <Badge variant="outline">Dimep</Badge>
                      <Badge variant="outline">Madis</Badge>
                      <Badge variant="outline">Telemática</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Metodos de Identificacao</CardTitle>
                  <CardDescription>Formas de autenticacao suportadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-1">QR Code Dinamico</h5>
                      <p className="text-sm text-muted-foreground">
                        Aluno mostra QR Code no celular. Token renovado a cada 24h.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-1">Cartao RFID/NFC</h5>
                      <p className="text-sm text-muted-foreground">
                        Cartao ou pulseira de aproximacao cadastrada.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-1">Biometria Digital</h5>
                      <p className="text-sm text-muted-foreground">
                        Leitor de impressao digital integrado.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-1">PIN / CPF</h5>
                      <p className="text-sm text-muted-foreground">
                        Digita codigo numerico no teclado da catraca.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
