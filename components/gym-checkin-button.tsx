"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GymCheckinButtonProps {
  userId: string
  gymId: string
  onSuccess?: () => void
}

export function GymCheckinButton({ userId, gymId, onSuccess }: GymCheckinButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleCheckin = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/gym/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, gymId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer check-in")
      }

      toast({
        title: "Check-in realizado!",
        description: `${data.message} 🔥 Sequência: ${data.streak} dias`,
      })

      onSuccess?.()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckin} disabled={loading} className="w-full" size="lg">
      {loading ? (
        <>Fazendo check-in...</>
      ) : (
        <>
          <Check className="w-5 h-5 mr-2" />
          Fazer Check-in
        </>
      )}
    </Button>
  )
}
