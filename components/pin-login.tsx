"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dumbbell, Delete } from "lucide-react"

interface PinLoginProps {
  onLogin: (userId: string) => void
}

export function PinLogin({ onLogin }: PinLoginProps) {
  const [pin, setPin] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (pin.length === 6) {
      handleLogin()
    }
  }, [pin])

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num
      setPin(newPin)
      setError("")
    }
  }

  const handleDelete = () => {
    setPin(pin.slice(0, -1))
    setError("")
  }

  const handleClear = () => {
    setPin("")
    setError("")
  }

  const handleLogin = () => {
    if (pin === "080754") {
      onLogin("kleber")
    } else if (pin === "191018") {
      onLogin("pamela")
    } else if (pin === "862401") {
      onLogin("juliana")
    } else {
      setError("PIN incorreto! Tente novamente.")
      setPin("")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-purple-500 to-blue-600 p-4">
      <div className="absolute inset-0 bg-[url('/abstract-fitness-pattern.png')] opacity-10 bg-repeat" />

      <Card className="w-full max-w-md relative z-10 bg-background/95 backdrop-blur border-4 border-primary/30 shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center animate-pulse">
              <Dumbbell className="w-10 h-10 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              FitTransform
            </h1>
            <p className="text-muted-foreground mt-2">Sistema de Transformação Fitness</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground font-medium">Digite seu PIN</p>
            <div className="flex justify-center gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-14 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                    i < pin.length
                      ? "bg-primary/20 border-primary text-primary scale-110"
                      : "bg-muted border-muted-foreground/20"
                  }`}
                >
                  {i < pin.length ? "●" : ""}
                </div>
              ))}
            </div>
            {error && <p className="text-destructive text-sm font-medium animate-shake">{error}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button
                key={num}
                variant="outline"
                size="lg"
                onClick={() => handleNumberClick(num.toString())}
                className="h-16 text-2xl font-bold hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all border-2"
              >
                {num}
              </Button>
            ))}
            <Button
              variant="outline"
              size="lg"
              onClick={handleClear}
              className="h-16 text-lg font-bold hover:bg-destructive hover:text-destructive-foreground hover:scale-105 transition-all border-2 bg-transparent"
            >
              Limpar
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleNumberClick("0")}
              className="h-16 text-2xl font-bold hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all border-2"
            >
              0
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleDelete}
              className="h-16 hover:bg-destructive/20 hover:scale-105 transition-all border-2 bg-transparent"
            >
              <Delete className="w-6 h-6" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
