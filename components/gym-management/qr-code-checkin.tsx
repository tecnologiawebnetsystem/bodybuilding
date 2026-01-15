"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Camera, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function QRCodeCheckin() {
  const [scanning, setScanning] = useState(false)
  const [lastCheckin, setLastCheckin] = useState<any>(null)

  const startScanning = () => {
    setScanning(true)
    toast({
      title: "Scanner ativado",
      description: "Posicione o QR Code do aluno na câmera",
    })

    // Simular scan após 2 segundos
    setTimeout(() => {
      processCheckin("kleber")
    }, 2000)
  }

  const processCheckin = async (userId: string) => {
    try {
      const res = await fetch("/api/gym-admin/checkin/qr-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, timestamp: new Date().toISOString() }),
      })

      const data = await res.json()

      if (data.success) {
        setLastCheckin(data.checkin)
        toast({
          title: "Check-in realizado",
          description: `${data.checkin.user_name} fez check-in com sucesso`,
        })
      }
    } catch (error) {
      toast({
        title: "Erro no check-in",
        variant: "destructive",
      })
    } finally {
      setScanning(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Check-in com QR Code</h2>
        <p className="text-muted-foreground">Sistema rápido de entrada com código QR</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scanner QR Code</CardTitle>
            <CardDescription>Escaneie o código do aluno para registrar entrada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
              {scanning ? (
                <div className="text-center space-y-4">
                  <Camera className="w-16 h-16 mx-auto text-blue-600 animate-pulse" />
                  <p className="text-sm text-muted-foreground">Escaneando...</p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <QrCode className="w-16 h-16 mx-auto text-slate-400" />
                  <p className="text-sm text-muted-foreground">Clique no botão para iniciar</p>
                </div>
              )}
            </div>
            <Button onClick={startScanning} disabled={scanning} className="w-full" size="lg">
              {scanning ? "Escaneando..." : "Iniciar Scanner"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Último Check-in</CardTitle>
            <CardDescription>Registro mais recente</CardDescription>
          </CardHeader>
          <CardContent>
            {lastCheckin ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-lg">{lastCheckin.user_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(lastCheckin.timestamp).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium text-green-600">Entrada registrada</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Plano:</span>
                    <span className="font-medium">{lastCheckin.plan_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frequência:</span>
                    <span className="font-medium">{lastCheckin.monthly_checkins || 0} vezes este mês</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <XCircle className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p>Nenhum check-in registrado ainda</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
