"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Shield, Building2, ArrowLeft, Sparkles, Users, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AdminLogin({ onLogin }: { onLogin: (userData: any) => void }) {
  const [step, setStep] = useState<"gym" | "credentials">("gym")
  const [selectedGym, setSelectedGym] = useState<any>(null)
  const [gyms, setGyms] = useState<any[]>([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadGyms = async () => {
      try {
        const response = await fetch("/api/gyms")
        if (response.ok) {
          const data = await response.json()
          setGyms(data.gyms || [])
        }
      } catch (error) {
        console.error("[v0] Erro ao carregar academias:", error)
      }
    }
    loadGyms()
  }, [])

  const handleGymSelection = (gymId: string) => {
    const gym = gyms.find((g) => g.id === Number.parseInt(gymId))
    setSelectedGym(gym)
    setStep("credentials")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          gymId: selectedGym?.id,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        onLogin(data)
      } else {
        setError(data.error || "Credenciais inválidas")
      }
    } catch (error) {
      setError("Erro de conexão")
    } finally {
      setLoading(false)
    }
  }

  if (step === "gym") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex">
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">FitTransform</h1>
                <p className="text-blue-100 text-sm">Sistema de Gestão SaaS</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-white mb-4">Gestão completa para sua academia</h2>
            <p className="text-blue-100 text-lg">
              Controle alunos, treinos, pagamentos e muito mais em uma única plataforma
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Users className="w-8 h-8 text-white mb-2" />
              <p className="text-white font-semibold">500+</p>
              <p className="text-blue-100 text-sm">Alunos Ativos</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Building2 className="w-8 h-8 text-white mb-2" />
              <p className="text-white font-semibold">50+</p>
              <p className="text-blue-100 text-sm">Academias</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <TrendingUp className="w-8 h-8 text-white mb-2" />
              <p className="text-white font-semibold">98%</p>
              <p className="text-blue-100 text-sm">Satisfação</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            <Card className="p-8 shadow-xl">
              <div className="mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Bem-vindo!</h2>
                <p className="text-slate-600">Selecione sua academia para continuar</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="mb-2">Academia</Label>
                  <Select onValueChange={handleGymSelection}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Escolha sua academia..." />
                    </SelectTrigger>
                    <SelectContent>
                      {gyms.map((gym) => (
                        <SelectItem key={gym.id} value={gym.id.toString()}>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            <div>
                              <p className="font-medium">{gym.gym_name}</p>
                              {gym.city && (
                                <p className="text-xs text-slate-500">
                                  {gym.city}, {gym.state}
                                </p>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-slate-500 text-center">
                    Não encontrou sua academia?{" "}
                    <a href="#" className="text-blue-600 hover:underline font-medium">
                      Entre em contato
                    </a>
                  </p>
                </div>
              </div>
            </Card>

            <p className="text-center text-sm text-slate-500 mt-6">Sistema SaaS de Gestão de Academias © 2026</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Button variant="ghost" className="mb-6" onClick={() => setStep("gym")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Trocar academia
        </Button>

        <Card className="p-8 shadow-xl">
          <div className="mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Login - {selectedGym?.gym_name}</h2>
            <p className="text-slate-600">Digite suas credenciais de acesso</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>Usuário</Label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label>Senha/PIN</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha ou PIN"
                required
                className="mt-1"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar no painel"}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-6">Acesso restrito a administradores autorizados</p>
      </div>
    </div>
  )
}
