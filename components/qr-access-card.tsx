"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, RefreshCw, XCircle, Clock, Smartphone } from "lucide-react"

interface QRAccessCardProps {
  userId: string
  userName: string
}

export function QRAccessCard({ userId, userName }: QRAccessCardProps) {
  const [qrData, setQrData] = useState<{
    access_token: string
    expires_at: string
    payment_status: string
    qr_data: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    fetchQRCode()
  }, [userId])

  useEffect(() => {
    if (qrData?.expires_at) {
      try {
        const interval = setInterval(() => {
          try {
            const now = new Date()
            const expires = new Date(qrData.expires_at)
            const diff = expires.getTime() - now.getTime()

            if (diff <= 0 || isNaN(diff)) {
              setTimeLeft("Expirado")
              fetchQRCode() // Renovar automaticamente
            } else {
              const hours = Math.floor(diff / (1000 * 60 * 60))
              const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
              setTimeLeft(`${hours}h ${minutes}m`)
            }
          } catch {
            setTimeLeft("--")
          }
        }, 60000) // Atualiza a cada minuto

        // Calcular tempo inicial
        const now = new Date()
        const expires = new Date(qrData.expires_at)
        const diff = expires.getTime() - now.getTime()
        if (!isNaN(diff) && diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          setTimeLeft(`${hours}h ${minutes}m`)
        } else {
          setTimeLeft("--")
        }

        return () => clearInterval(interval)
      } catch {
        setTimeLeft("--")
      }
    }
  }, [qrData])

  const fetchQRCode = async () => {
    try {
      const res = await fetch(`/api/turnstile/qrcode?userId=${userId}`)
      const data = await res.json()
      if (data.success) {
        setQrData(data)
      }
    } catch {
      // Erro silencioso
    } finally {
      setLoading(false)
    }
  }

  const refreshQRCode = async () => {
    setRefreshing(true)
    try {
      const res = await fetch("/api/turnstile/qrcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      })
      const data = await res.json()
      if (data.success) {
        await fetchQRCode()
      }
    } catch {
      // Erro silencioso
    } finally {
      setRefreshing(false)
    }
  }

  const isPaymentOk = qrData?.payment_status === "em_dia"

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-orange-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Acesso Catraca</h3>
              <p className="text-sm text-white/80">Mostre na entrada</p>
            </div>
          </div>
          <Badge 
            variant={isPaymentOk ? "default" : "destructive"}
            className={isPaymentOk ? "bg-green-500" : ""}
          >
            {isPaymentOk ? "Liberado" : "Bloqueado"}
          </Badge>
        </div>
      </div>

      {/* QR Code */}
      <div className="p-6 flex flex-col items-center">
        {isPaymentOk ? (
          <>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              {/* QR Code usando API do Google Charts */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData?.qr_data || "")}`}
                alt="QR Code de Acesso"
                width={200}
                height={200}
                className="rounded"
              />
            </div>
            
            <p className="mt-4 text-center font-medium text-lg">{userName}</p>
            
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Expira em: {timeLeft}</span>
            </div>

            <Button 
              variant="outline" 
              className="mt-4 gap-2"
              onClick={refreshQRCode}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Renovar QR Code
            </Button>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h4 className="font-bold text-lg text-red-600">Acesso Bloqueado</h4>
            <p className="text-muted-foreground mt-2">
              Sua mensalidade esta pendente.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Regularize para liberar o acesso.
            </p>
          </div>
        )}
      </div>

      {/* Footer com instrucoes */}
      <div className="bg-muted/50 p-4 border-t">
        <div className="flex items-start gap-3">
          <Smartphone className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Como usar:</p>
            <p>1. Aproxime o celular do leitor da catraca</p>
            <p>2. Aguarde a liberacao</p>
            <p>3. Passe pela catraca</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
