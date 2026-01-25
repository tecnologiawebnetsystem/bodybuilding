"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Dumbbell, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, KeyRound, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EntrarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  // Login por email/senha
  const [identifier, setIdentifier] = useState("") // email ou cpf
  const [password, setPassword] = useState("")
  
  // Login por PIN
  const [pin, setPin] = useState("")

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/unified-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Erro ao fazer login")
        return
      }

      // Salvar dados no localStorage
      localStorage.setItem("authUser", JSON.stringify(data.user))
      localStorage.setItem("authConnections", JSON.stringify(data.connections))

      // Redirecionar baseado no tipo
      router.push(data.redirectTo)
    } catch (err) {
      setError("Erro de conexao. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (pin.length !== 6) {
      setError("PIN deve ter 6 digitos")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/unified-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "PIN invalido")
        return
      }

      // Salvar dados no localStorage
      localStorage.setItem("authUser", JSON.stringify(data.user))
      localStorage.setItem("authConnections", JSON.stringify(data.connections))

      // Redirecionar
      router.push(data.redirectTo)
    } catch (err) {
      setError("Erro de conexao. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="flex items-center gap-3 w-fit">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">
            Fit<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Transform</span>
          </span>
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md p-8 bg-white/5 border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta</h1>
            <p className="text-gray-400">Entre na sua conta para continuar</p>
          </div>

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/10 mb-6">
              <TabsTrigger value="email" className="flex items-center gap-2 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
                <Mail className="w-4 h-4" /> Email/CPF
              </TabsTrigger>
              <TabsTrigger value="pin" className="flex items-center gap-2 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
                <KeyRound className="w-4 h-4" /> PIN
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Email ou CPF</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="seu@email.com ou 000.000.000-00"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha"
                      className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-orange-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Entrar <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Link href="/recuperar-senha" className="text-sm text-orange-400 hover:text-orange-300">
                    Esqueceu sua senha?
                  </Link>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="pin">
              <form onSubmit={handlePinLogin} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block text-center">
                    Digite seu PIN de 6 digitos
                  </label>
                  <p className="text-xs text-gray-500 mb-4 text-center">
                    O PIN e usado para acesso rapido de alunos em academias
                  </p>
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={pin[index] || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "")
                          if (value) {
                            const newPin = pin.split("")
                            newPin[index] = value
                            setPin(newPin.join(""))
                            // Auto-focus next input
                            const nextInput = e.target.nextElementSibling as HTMLInputElement
                            if (nextInput && value) nextInput.focus()
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !pin[index]) {
                            const prevInput = (e.target as HTMLElement).previousElementSibling as HTMLInputElement
                            if (prevInput) {
                              prevInput.focus()
                              const newPin = pin.split("")
                              newPin[index - 1] = ""
                              setPin(newPin.join(""))
                            }
                          }
                        }}
                        className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-xl text-white focus:border-orange-500 focus:outline-none"
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={loading || pin.length !== 6}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Acessar com PIN <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Nao tem PIN? Use email/senha ou solicite ao seu personal/academia
                </p>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-gray-400 text-sm">
              Nao tem conta?{" "}
              <Link href="/cadastro" className="text-orange-400 hover:text-orange-300 font-medium">
                Criar conta gratis
              </Link>
            </p>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-gray-500 text-sm">
          © 2025 FitTransform. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}
